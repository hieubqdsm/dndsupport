import React, { useReducer, useEffect, useState, useRef, useMemo } from 'react';
import { Character, Monster } from '../types';
import { OFFLINE_MONSTERS } from '../data/monsterData';
import { Swords, Play, RotateCcw, Shuffle, Dices, Bot, Eye, X, Search } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type CombatPhase =
  | 'idle'
  | 'initiative_player' | 'initiative_monster'
  | 'player_attack'     | 'player_damage'
  | 'monster_attack'    | 'monster_damage'
  | 'finished';

interface CombatLogEntry {
  id: string; round: number;
  actor: 'player' | 'monster' | 'system';
  type: 'initiative' | 'attack_hit' | 'attack_miss' | 'damage' | 'info' | 'kill' | 'round';
  text: string;
}

interface CombatRState {
  phase: CombatPhase;
  round: number;
  currentTurn: 'player' | 'monster';
  initiatives: { player: number; monster: number } | null;
  lastAttackRoll: number | null;
  log: CombatLogEntry[];
  winner: 'player' | 'monster' | null;
  playerHp: number;
  monsterHp: number;
}

interface ParsedAttack { name: string; bonus: number; formula: string; damageType: string; }

interface PendingRollConfig {
  actor: 'player' | 'monster';
  title: string;
  context: string;
  isD20: boolean;
  modifier: number;
  formula: string;
  isCrit?: boolean;
}

export interface CombatSimProps {
  character: Character;
  monster: Monster | null;
  playerHp: number; playerMaxHp: number;
  monsterHp: number; monsterMaxHp: number;
  onPlayerHpChange: (hp: number) => void;
  onMonsterHpChange: (hp: number) => void;
  onMonsterSelect: (monster: Monster) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseAC(s: string): number { const m = s.match(/^(\d+)/); return m ? parseInt(m[1]) : 10; }
function getMod(score: number): number { return Math.floor((score - 10) / 2); }
function fmtMod(n: number): string { return n >= 0 ? `+${n}` : String(n); }
function rollD20(): number { return Math.floor(Math.random() * 20) + 1; }
function crToNum(cr: string): number {
  const m = cr.match(/^([\d/]+)/); if (!m) return 0;
  const v = m[1]; if (v.includes('/')) { const [a,b] = v.split('/').map(Number); return a/b; }
  return parseInt(v);
}

function rollFormula(formula: string): { rolls: number[]; modifier: number; diceTotal: number; total: number; desc: string } {
  const c = formula.replace(/\s/g, '');
  const m = c.match(/^(\d+)d(\d+)([+\-]\d+)?$/i);
  if (!m) { const flat = Math.max(1, parseInt(c)||1); return { rolls:[], modifier:flat, diceTotal:flat, total:flat, desc:String(flat) }; }
  const count = parseInt(m[1]), sides = parseInt(m[2]), mod = m[3] ? parseInt(m[3]) : 0;
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
  const diceTotal = rolls.reduce((a,b) => a+b, 0);
  const total = Math.max(1, diceTotal + mod);
  const modStr = mod>0 ? `+${mod}` : mod<0 ? String(mod) : '';
  return { rolls, modifier:mod, diceTotal, total, desc:`[${rolls.join('+')}]${modStr}=${total}` };
}

function rollCrit(formula: string): { total: number; desc: string } {
  const r1 = rollFormula(formula), r2 = rollFormula(formula);
  const total = Math.max(1, r1.diceTotal + r2.diceTotal + r1.modifier);
  const modStr = r1.modifier !== 0 ? (r1.modifier>0 ? `+${r1.modifier}` : String(r1.modifier)) : '';
  return { total, desc:`[${r1.rolls.join('+')}]+[${r2.rolls.join('+')}]${modStr}=${total}` };
}

function parseMonsterAttacks(monster: Monster): ParsedAttack[] {
  const results: ParsedAttack[] = [];
  for (const action of monster.actions) {
    const d = action.desc;
    const hitMatch = d.match(/([+\-]\d+)\s+to hit/i);
    const dmgMatch = d.match(/Hit[:\s]+\d+\s+\(([^)]+)\)/i) || d.match(/Hit:\s*(\d+d\d+(?:\s*[+\-]\s*\d+)?)/i);
    if (hitMatch && dmgMatch) {
      const typeMatch = d.match(/\)\s+(\w+)\s+damage/i);
      results.push({ name:action.name, bonus:parseInt(hitMatch[1]), formula:dmgMatch[1].replace(/\s/g,''), damageType:typeMatch?typeMatch[1]:'' });
    }
  }
  if (!results.length) {
    const sm = getMod(monster.stats.str);
    results.push({ name:'Tấn công', bonus:sm+2, formula:`1d6${sm>=0?'+':''}${sm}`, damageType:'' });
  }
  return results;
}

function getPlayerAttack(character: Character): ParsedAttack {
  if (character.weapons.length > 0) {
    const best = character.weapons.reduce((b,w) => w.attackBonus > b.attackBonus ? w : b);
    return { name:best.customName||best.weaponId||'Vũ khí', bonus:best.attackBonus, formula:best.damageFormula||'1d6', damageType:best.damageType||'' };
  }
  if (character.attacks?.length > 0) {
    const a = character.attacks[0];
    return { name:a.name, bonus:a.bonus, formula:a.damage||'1d4', damageType:'' };
  }
  const sm = getMod(character.stats.str.score);
  return { name:'Tay không', bonus:sm+(character.proficiencyBonus||2), formula:`1d4${sm>=0?'+':''}${sm}`, damageType:'bludgeoning' };
}

function mkLog(round:number, actor:CombatLogEntry['actor'], type:CombatLogEntry['type'], text:string): CombatLogEntry {
  return { id:Math.random().toString(36).substr(2,6), round, actor, type, text };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

const INIT: CombatRState = {
  phase:'idle', round:1, currentTurn:'player',
  initiatives:null, lastAttackRoll:null,
  log:[], winner:null, playerHp:0, monsterHp:0,
};

type CombatAction =
  | { type:'START'; playerHp:number; monsterHp:number }
  | { type:'STEP'; character:Character; monster:Monster; d20Override?:number; damageOverride?:number }
  | { type:'RESET'; playerHp:number; monsterHp:number }
  | { type:'CONTINUE'; playerHp:number };

function combatStep(s: CombatRState, char: Character, mon: Monster, opts: { d20Override?:number; damageOverride?:number } = {}): CombatRState {
  const monAC = parseAC(mon.ac);

  if (s.phase === 'initiative_player') {
    const pd20 = opts.d20Override ?? rollD20();
    const pt = pd20 + char.initiative;
    return { ...s, phase:'initiative_monster', initiatives:{ player:pt, monster:0 },
      log:[...s.log, mkLog(0,'player','initiative',`⚡ ${char.name}: d20(${pd20})${fmtMod(char.initiative)} = ${pt}`)] };
  }

  if (s.phase === 'initiative_monster') {
    const md20 = opts.d20Override ?? rollD20();
    const mm = getMod(mon.stats.dex), mt = md20 + mm;
    const pt = s.initiatives?.player ?? 0;
    const first: 'player'|'monster' = pt >= mt ? 'player' : 'monster';
    const next: CombatPhase = first === 'player' ? 'player_attack' : 'monster_attack';
    return { ...s, phase:next, currentTurn:first, initiatives:{ player:pt, monster:mt },
      log:[...s.log,
        mkLog(0,'monster','initiative',`⚡ ${mon.name}: d20(${md20})${fmtMod(mm)} = ${mt}`),
        mkLog(1,'system','info',`${pt>=mt?char.name:mon.name} đi trước! — Round 1 bắt đầu.`)] };
  }

  if (s.phase === 'player_attack') {
    const atk = getPlayerAttack(char);
    const d20 = opts.d20Override ?? rollD20(), total = d20 + atk.bonus;
    const hit = d20===20 || (d20!==1 && total>=monAC);
    const note = d20===20?' ✨ BẠO KÍCH!':d20===1?' 💀 Thất bại!':'';
    const entry = mkLog(s.round,'player',hit?'attack_hit':'attack_miss',
      `⚔️ ${char.name} [${atk.name}]: d20(${d20})${fmtMod(atk.bonus)}=${total} vs AC ${monAC} — ${hit?'TRÚNG!':'Hụt!'}${note}`);
    if (hit) return { ...s, phase:'player_damage', lastAttackRoll:d20, log:[...s.log,entry] };
    return { ...s, phase:'monster_attack', currentTurn:'monster', lastAttackRoll:d20, log:[...s.log,entry] };
  }

  if (s.phase === 'player_damage') {
    const atk = getPlayerAttack(char);
    const isCrit = s.lastAttackRoll === 20;
    let dmg: number, desc: string;
    if (opts.damageOverride !== undefined) { dmg = Math.max(1,opts.damageOverride); desc = String(dmg)+(isCrit?' (Crit)':''); }
    else { const r = isCrit ? rollCrit(atk.formula) : rollFormula(atk.formula); dmg=r.total; desc=r.desc+(isCrit?' (Crit)':''); }
    const newHp = Math.max(0, s.monsterHp - dmg);
    const dmgEntry = mkLog(s.round,'player','damage',`💥 Sát thương: ${desc} = ${dmg}${atk.damageType?' '+atk.damageType:''}`);
    if (newHp <= 0) return { ...s, phase:'finished', winner:'player', monsterHp:0,
      log:[...s.log,dmgEntry,mkLog(s.round,'system','kill',`☠️ ${mon.name} bị hạ gục! ${char.name} chiến thắng!`)] };
    return { ...s, phase:'monster_attack', currentTurn:'monster', monsterHp:newHp,
      log:[...s.log,dmgEntry,mkLog(s.round,'monster','info',`💔 ${mon.name}: ${newHp} HP còn lại`)] };
  }

  if (s.phase === 'monster_attack') {
    const atk = parseMonsterAttacks(mon)[0];
    const d20 = opts.d20Override ?? rollD20(), total = d20 + atk.bonus;
    const hit = d20===20 || (d20!==1 && total>=char.ac);
    const note = d20===20?' ✨ BẠO KÍCH!':d20===1?' 💀 Thất bại!':'';
    const entry = mkLog(s.round,'monster',hit?'attack_hit':'attack_miss',
      `🐉 ${mon.name} [${atk.name}]: d20(${d20})${fmtMod(atk.bonus)}=${total} vs AC ${char.ac} — ${hit?'TRÚNG!':'Hụt!'}${note}`);
    if (hit) return { ...s, phase:'monster_damage', lastAttackRoll:d20, log:[...s.log,entry] };
    const nr = s.round+1;
    return { ...s, phase:'player_attack', currentTurn:'player', round:nr, lastAttackRoll:d20,
      log:[...s.log,entry,mkLog(nr,'system','round',`Round ${nr}`)] };
  }

  if (s.phase === 'monster_damage') {
    const atk = parseMonsterAttacks(mon)[0];
    const isCrit = s.lastAttackRoll === 20;
    let dmg: number, desc: string;
    if (opts.damageOverride !== undefined) { dmg = Math.max(1,opts.damageOverride); desc = String(dmg)+(isCrit?' (Crit)':''); }
    else { const r = isCrit ? rollCrit(atk.formula) : rollFormula(atk.formula); dmg=r.total; desc=r.desc+(isCrit?' (Crit)':''); }
    const newHp = Math.max(0, s.playerHp - dmg);
    const dmgEntry = mkLog(s.round,'monster','damage',`💥 Sát thương: ${desc} = ${dmg}${atk.damageType?' '+atk.damageType:''}`);
    if (newHp <= 0) return { ...s, phase:'finished', winner:'monster', playerHp:0,
      log:[...s.log,dmgEntry,mkLog(s.round,'system','kill',`☠️ ${char.name} bị hạ gục! ${mon.name} chiến thắng!`)] };
    const nr = s.round+1;
    return { ...s, phase:'player_attack', currentTurn:'player', round:nr, playerHp:newHp,
      log:[...s.log,dmgEntry,mkLog(nr,'player','info',`💔 ${char.name}: ${newHp} HP còn lại. Round ${nr}.`)] };
  }

  return s;
}

function combatReducer(s: CombatRState, a: CombatAction): CombatRState {
  switch (a.type) {
    case 'START':    return { ...INIT, phase:'initiative_player', playerHp:a.playerHp, monsterHp:a.monsterHp };
    case 'STEP':     return combatStep(s, a.character, a.monster, { d20Override:a.d20Override, damageOverride:a.damageOverride });
    case 'RESET':    return { ...INIT, playerHp:a.playerHp, monsterHp:a.monsterHp };
    case 'CONTINUE': return { ...INIT, phase:'idle', playerHp:a.playerHp, monsterHp:0 };
    default:         return s;
  }
}

// ── Roll Prompt Component ─────────────────────────────────────────────────────

const RollPrompt: React.FC<{
  config: PendingRollConfig;
  onConfirm: (rawValue: number) => void;
}> = ({ config, onConfirm }) => {
  // Start EMPTY — user must roll (physical or click) before confirming
  const [diceInput, setDiceInput] = useState<number | null>(null);

  const isPlayer  = config.actor === 'player';
  const hasValue  = diceInput !== null;
  const total     = hasValue ? (config.isD20 ? diceInput + config.modifier : diceInput) : null;
  const isNat20   = config.isD20 && diceInput === 20;
  const isNat1    = config.isD20 && diceInput === 1;

  const handleRandom = () => {
    if (config.isD20) setDiceInput(rollD20());
    else { const r = config.isCrit ? rollCrit(config.formula) : rollFormula(config.formula); setDiceInput(r.total); }
  };

  const handleAutoConfirm = () => {
    if (config.isD20) onConfirm(rollD20());
    else { const r = config.isCrit ? rollCrit(config.formula) : rollFormula(config.formula); onConfirm(r.total); }
  };

  const handleInputChange = (raw: string) => {
    const v = parseInt(raw);
    if (isNaN(v) || raw === '') { setDiceInput(null); return; }
    setDiceInput(config.isD20 ? Math.max(1, Math.min(20, v)) : Math.max(1, v));
  };

  return (
    <div className={`rounded-xl border-2 p-4 animate-in slide-in-from-bottom-2 ${
      isPlayer ? 'border-cyan-600 bg-cyan-950/50' : 'border-red-600 bg-red-950/50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-fantasy font-bold text-sm ${isPlayer ? 'text-cyan-300' : 'text-red-300'}`}>
          🎲 {config.title}
        </h3>
        <button onClick={handleAutoConfirm} title="Auto roll và xác nhận luôn"
          className="text-gray-600 hover:text-gray-300 transition-colors text-[10px] flex items-center gap-1 border border-gray-700 hover:border-gray-500 rounded px-1.5 py-0.5">
          <X size={10} /> Auto
        </button>
      </div>

      <p className="text-gray-400 text-[11px] mb-3">{config.context}</p>

      {config.isCrit && (
        <div className="text-dragon-gold text-[11px] font-bold mb-2 animate-pulse">
          ✨ BẠO KÍCH! {!config.isD20 && `Tung ${config.formula} × 2 lần!`}
        </div>
      )}

      {/* Input area */}
      {config.isD20 ? (
        <div className="flex items-end gap-3 flex-wrap">
          <div className="text-center">
            <div className="text-[9px] text-gray-500 uppercase mb-1">d20</div>
            <input type="number" value={diceInput ?? ''} min={1} max={20} placeholder="—"
              onChange={e => handleInputChange(e.target.value)}
              className={`w-16 text-center bg-black/40 text-3xl font-bold font-mono rounded-lg py-1.5 border focus:outline-none focus:ring-1 placeholder:text-gray-700 ${
                !hasValue       ? 'border-gray-700 text-gray-700 focus:ring-gray-600' :
                isNat20         ? 'text-dragon-gold border-dragon-gold focus:ring-dragon-gold' :
                isNat1          ? 'text-red-400 border-red-600 focus:ring-red-500' :
                                  'text-white border-gray-600 focus:ring-cyan-600'}`} />
          </div>
          {config.modifier !== 0 && (
            <>
              <div className="text-gray-500 text-xl font-bold pb-2">{config.modifier >= 0 ? `+${config.modifier}` : config.modifier}</div>
              <div className="text-gray-500 text-xl font-bold pb-2">=</div>
              <div className="text-center">
                <div className="text-[9px] text-gray-500 uppercase mb-1">Tổng</div>
                <div className={`text-3xl font-bold font-mono px-3 py-1.5 rounded-lg bg-black/20 min-w-[3rem] ${
                  !hasValue ? 'text-gray-700' : isNat20 ? 'text-dragon-gold' : isNat1 ? 'text-red-400' : 'text-white'}`}>
                  {total ?? '—'}
                </div>
              </div>
            </>
          )}
          {isNat20 && <div className="text-dragon-gold text-xs font-black animate-pulse pb-2">Bạo kích!</div>}
          {isNat1  && <div className="text-red-400 text-xs font-black pb-2">Thất bại!</div>}
        </div>
      ) : (
        <div>
          <div className="text-[9px] text-gray-500 uppercase mb-1">
            Kết quả — {config.formula}{config.isCrit ? ' ×2' : ''}
          </div>
          <input type="number" value={diceInput ?? ''} min={1} placeholder="Nhập kết quả..."
            onChange={e => handleInputChange(e.target.value)}
            className="w-28 text-center bg-black/40 text-white text-3xl font-bold font-mono rounded-lg py-1.5 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-600 placeholder:text-gray-700 placeholder:text-base" />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button onClick={handleRandom}
          className="flex-1 py-2 bg-black/30 border border-gray-700 text-gray-200 rounded-lg text-xs font-bold hover:border-gray-500 hover:bg-black/50 transition-colors flex items-center justify-center gap-1.5 active:scale-95">
          <Dices size={13} /> Tung ngẫu nhiên
        </button>
        <button
          onClick={() => { if (hasValue && total !== null) onConfirm(config.isD20 ? diceInput! : total); }}
          disabled={!hasValue}
          className={`flex-1 py-2 rounded-lg text-sm font-black uppercase flex items-center justify-center gap-1 transition-all ${
            hasValue
              ? `active:scale-95 ${isPlayer ? 'bg-cyan-700 hover:bg-cyan-600 text-white' : 'bg-red-700 hover:bg-red-600 text-white'}`
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>
          OK →
        </button>
      </div>
    </div>
  );
};

// ── Build roll config from phase ──────────────────────────────────────────────

function buildRollConfig(phase: CombatPhase, s: CombatRState, char: Character, mon: Monster): PendingRollConfig {
  const monAC = parseAC(mon.ac);
  switch (phase) {
    case 'initiative_player': {
      const mod = char.initiative;
      return { actor:'player', title:`${char.name} — Sáng Kiến`, context:`Initiative modifier: ${fmtMod(mod)}`, isD20:true, modifier:mod, formula:'' };
    }
    case 'initiative_monster': {
      const mm = getMod(mon.stats.dex);
      return { actor:'monster', title:`${mon.name} — Sáng Kiến`, context:`DEX modifier: ${fmtMod(mm)}`, isD20:true, modifier:mm, formula:'' };
    }
    case 'player_attack': {
      const atk = getPlayerAttack(char);
      return { actor:'player', title:`${char.name} tấn công`, context:`[${atk.name}] ${fmtMod(atk.bonus)} to hit — vs AC ${monAC}`, isD20:true, modifier:atk.bonus, formula:'' };
    }
    case 'player_damage': {
      const atk = getPlayerAttack(char);
      const isCrit = s.lastAttackRoll === 20;
      return { actor:'player', title:`${char.name} gây sát thương`, context:`Formula: ${atk.formula}${atk.damageType?' ('+atk.damageType+')':''}`, isD20:false, modifier:0, formula:atk.formula, isCrit };
    }
    case 'monster_attack': {
      const atk = parseMonsterAttacks(mon)[0];
      return { actor:'monster', title:`${mon.name} tấn công`, context:`[${atk.name}] ${fmtMod(atk.bonus)} to hit — vs AC ${char.ac}`, isD20:true, modifier:atk.bonus, formula:'' };
    }
    case 'monster_damage': {
      const atk = parseMonsterAttacks(mon)[0];
      const isCrit = s.lastAttackRoll === 20;
      return { actor:'monster', title:`${mon.name} gây sát thương`, context:`Formula: ${atk.formula}${atk.damageType?' ('+atk.damageType+')':''}`, isD20:false, modifier:0, formula:atk.formula, isCrit };
    }
    default:
      return { actor:'player', title:'Roll', context:'', isD20:true, modifier:0, formula:'' };
  }
}

// ── Log styling ───────────────────────────────────────────────────────────────

function logStyle(e: CombatLogEntry): string {
  if (e.type==='kill')         return 'text-dragon-gold font-bold border-l-2 border-dragon-gold pl-2 py-0.5';
  if (e.type==='round')        return 'hidden';
  if (e.type==='initiative')   return e.actor==='player' ? 'text-cyan-400' : 'text-orange-400';
  if (e.type==='attack_hit')   return e.actor==='player' ? 'text-green-400' : 'text-red-400';
  if (e.type==='attack_miss')  return 'text-gray-500';
  if (e.type==='damage')       return e.actor==='player' ? 'text-cyan-300' : 'text-orange-300';
  if (e.type==='info')         return e.actor==='player' ? 'text-cyan-700 text-[11px]' : e.actor==='monster' ? 'text-orange-800 text-[11px]' : 'text-gray-500 text-[11px]';
  return 'text-gray-400';
}

const CR_OPTS = ["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18+"];
const TYPE_OPTS = ["Aberration","Beast","Celestial","Construct","Dragon","Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze","Plant","Undead"];

// ── Component ─────────────────────────────────────────────────────────────────

const CombatSim: React.FC<CombatSimProps> = ({
  character, monster, playerHp, playerMaxHp, monsterHp, monsterMaxHp,
  onPlayerHpChange, onMonsterHpChange, onMonsterSelect,
}) => {
  const [state, dispatch] = useReducer(combatReducer, INIT);
  const [gmMode, setGmMode]           = useState(false);
  const [pendingRoll, setPendingRoll] = useState<PendingRollConfig | null>(null);
  const [randomCR, setRandomCR]       = useState('');
  const [randomType, setRandomType]   = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList]       = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredMonsters = useMemo(() => {
    let pool = [...OFFLINE_MONSTERS];
    if (randomCR === '18+') pool = pool.filter(m => crToNum(m.challenge) >= 18);
    else if (randomCR) pool = pool.filter(m => m.challenge === randomCR || m.challenge.startsWith(randomCR + ' '));
    if (randomType) pool = pool.filter(m => m.type.toLowerCase().includes(randomType.toLowerCase()));
    if (searchQuery.trim()) pool = pool.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return pool.sort((a, b) => a.name.localeCompare(b.name));
  }, [randomCR, randomType, searchQuery]);

  // Close search list on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowList(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = state.phase !== 'idle' && state.phase !== 'finished';

  // Phase watcher: decide whether to show roll prompt or auto-dispatch
  useEffect(() => {
    if (!monster || !isActive) { setPendingRoll(null); return; }

    const playerPhases: CombatPhase[] = ['initiative_player','player_attack','player_damage'];
    const monsterPhases: CombatPhase[] = ['initiative_monster','monster_attack','monster_damage'];
    const isPlayerPhase   = playerPhases.includes(state.phase);
    const isMonsterPhase  = monsterPhases.includes(state.phase);

    if (isPlayerPhase || (gmMode && isMonsterPhase)) {
      setPendingRoll(buildRollConfig(state.phase, state, character, monster));
      return;
    }

    if (!gmMode && isMonsterPhase) {
      setPendingRoll(null);
      const t = setTimeout(() => dispatch({ type:'STEP', character, monster }), 750);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, gmMode, monster?.name]);

  // Sync HP to parent panels
  useEffect(() => {
    if (state.phase !== 'idle') {
      onPlayerHpChange(state.playerHp);
      onMonsterHpChange(state.monsterHp);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.playerHp, state.monsterHp]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [state.log.length]);

  const handleStart = () => {
    if (!monster) return;
    dispatch({ type:'START', playerHp, monsterHp });
  };

  const handleReset = () => {
    setPendingRoll(null);
    dispatch({ type:'RESET', playerHp:playerMaxHp, monsterHp:monsterMaxHp });
    onPlayerHpChange(playerMaxHp);
    onMonsterHpChange(monsterMaxHp);
  };

  const handleRollConfirm = (rawValue: number) => {
    if (!monster) return;
    setPendingRoll(null);
    const isDamage = state.phase === 'player_damage' || state.phase === 'monster_damage';
    if (isDamage) dispatch({ type:'STEP', character, monster, damageOverride:rawValue });
    else          dispatch({ type:'STEP', character, monster, d20Override:rawValue });
  };

  const handleRandom = () => {
    // Use filteredMonsters (includes search query filter) but if no results fall back to full CR/Type pool
    let pool = filteredMonsters.length > 0 ? filteredMonsters : [...OFFLINE_MONSTERS];
    if (!pool.length) return;
    onMonsterSelect(pool[Math.floor(Math.random() * pool.length)]);
    setShowList(false);
    setSearchQuery('');
  };

  // Continue fighting after monster defeated — keep player HP as-is
  const handleContinueSame = () => {
    if (!monster) return;
    setPendingRoll(null);
    dispatch({ type:'CONTINUE', playerHp });
    onMonsterSelect(monster); // reset monster HP to max in parent
  };

  const handleContinueRandom = () => {
    const pool = filteredMonsters.length > 0 ? filteredMonsters : [...OFFLINE_MONSTERS];
    if (!pool.length) return;
    const available = pool.filter(m => m.name !== monster?.name);
    const pick = available.length > 0 ? available : pool;
    setPendingRoll(null);
    dispatch({ type:'CONTINUE', playerHp });
    onMonsterSelect(pick[Math.floor(Math.random() * pick.length)]);
  };

  const pctP = playerMaxHp > 0 ? Math.max(0, Math.min(100, (state.playerHp / playerMaxHp) * 100)) : 0;
  const pctM = monsterMaxHp > 0 ? Math.max(0, Math.min(100, (state.monsterHp / monsterMaxHp) * 100)) : 0;
  const hpColor = (p: number) => p > 50 ? 'bg-green-500' : p > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-dragon-900/80 border-2 border-dragon-700 rounded-xl overflow-hidden">

      {/* ── Header + Mode toggle ── */}
      <div className="bg-gradient-to-r from-dragon-900 to-dragon-800 px-5 py-3 border-b border-dragon-700 flex items-center justify-between">
        <h2 className="text-dragon-gold font-fantasy text-lg flex items-center gap-2">
          <Swords className="w-5 h-5" /> GIẢI LẬP CHIẾN ĐẤU
        </h2>
        <div className="flex items-center bg-black/40 rounded-lg p-0.5 gap-0.5">
          <button onClick={() => setGmMode(false)}
            className={`px-3 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 transition-all ${!gmMode ? 'bg-dragon-gold text-black' : 'text-gray-500 hover:text-white'}`}>
            <Bot size={11} /> Tự Động
          </button>
          <button onClick={() => setGmMode(true)}
            className={`px-3 py-1 rounded text-[10px] font-black uppercase flex items-center gap-1 transition-all ${gmMode ? 'bg-dragon-gold text-black' : 'text-gray-500 hover:text-white'}`}>
            <Eye size={11} /> GM Mode
          </button>
        </div>
      </div>

      {/* ── Monster selection / search / random ── */}
      <div className="px-5 py-3 border-b border-dragon-800 space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase font-black">
          <Shuffle size={10} /> Chọn quái vật
        </div>

        {/* Current selection badge */}
        {monster && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-1.5">
            <span className="text-red-400 font-bold text-xs truncate flex-1">{monster.name}</span>
            <span className="text-gray-500 text-[10px] shrink-0">CR {monster.challenge.split(' ')[0]}</span>
            <span className="text-gray-600 text-[10px] shrink-0">• {monster.type}</span>
          </div>
        )}

        {/* Search + filters row */}
        <div ref={searchRef} className="relative space-y-1">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search input */}
            <div className="relative flex-1 min-w-[120px]">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm tên quái..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowList(true); }}
                onFocus={() => setShowList(true)}
                className="w-full pl-6 pr-2 py-1.5 bg-black/30 border border-dragon-800 text-gray-300 text-[11px] rounded focus:outline-none focus:border-dragon-gold placeholder:text-gray-600"
              />
            </div>
            {/* CR filter */}
            <select value={randomCR} onChange={e => { setRandomCR(e.target.value); setShowList(showList || searchQuery !== ''); }}
              className="bg-black/30 border border-dragon-800 text-gray-300 text-[11px] rounded px-1.5 py-1.5 focus:outline-none focus:border-dragon-gold w-[72px] appearance-none">
              <option value="">CR all</option>
              {CR_OPTS.map(c => <option key={c} value={c}>CR {c}</option>)}
            </select>
            {/* Type filter */}
            <select value={randomType} onChange={e => { setRandomType(e.target.value); setShowList(showList || searchQuery !== ''); }}
              className="bg-black/30 border border-dragon-800 text-gray-300 text-[11px] rounded px-1.5 py-1.5 focus:outline-none focus:border-dragon-gold w-[100px] appearance-none">
              <option value="">Loại all</option>
              {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {/* Random button */}
            <button onClick={handleRandom}
              className="px-2.5 py-1.5 bg-dragon-800 hover:bg-dragon-700 border border-dragon-700 text-dragon-gold rounded text-[11px] font-bold flex items-center gap-1 transition-colors active:scale-95 shrink-0">
              <Shuffle size={11} /> Random
            </button>
          </div>

          {/* Dropdown list */}
          {showList && (
            <div className="absolute z-20 left-0 right-0 top-full mt-0.5 max-h-44 overflow-y-auto bg-dragon-950 border border-dragon-700 rounded-lg shadow-xl custom-scrollbar">
              {filteredMonsters.length === 0 ? (
                <div className="text-gray-600 text-xs text-center py-3 italic">Không tìm thấy quái nào</div>
              ) : (
                <>
                  {filteredMonsters.slice(0, 60).map(m => (
                    <button
                      key={m.name}
                      onMouseDown={() => { onMonsterSelect(m); setShowList(false); setSearchQuery(''); }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-dragon-800 transition-colors ${
                        monster?.name === m.name ? 'text-dragon-gold bg-dragon-900' : 'text-gray-300'}`}>
                      <span className="truncate flex-1">{m.name}</span>
                      <span className="text-gray-600 text-[10px] shrink-0 ml-3">CR {m.challenge.split(' ')[0]} • {m.type}</span>
                    </button>
                  ))}
                  {filteredMonsters.length > 60 && (
                    <div className="text-gray-600 text-[10px] text-center py-1.5 border-t border-dragon-800">
                      +{filteredMonsters.length - 60} — nhập thêm để lọc
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Start / Reset */}
        <div className="flex gap-2">
          {state.phase === 'idle' && (
            <button onClick={handleStart} disabled={!monster}
              className={`px-5 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all ${
                monster ? 'bg-dragon-gold text-black hover:bg-yellow-400 active:scale-95' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>
              <Play size={12} /> Bắt đầu chiến đấu
            </button>
          )}
          {state.phase !== 'idle' && (
            <button onClick={handleReset}
              className="px-4 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 bg-red-900/40 border border-red-800 text-red-400 hover:bg-red-900/60 transition-colors active:scale-95">
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── HP bars + round info (during combat) ── */}
      {(isActive || state.phase === 'finished') && (
        <div className="px-5 py-3 border-b border-dragon-800 space-y-2.5">
          {isActive && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Round {state.round}</span>
              <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                state.currentTurn==='player'
                  ? 'bg-cyan-900/50 text-cyan-300 border-cyan-800'
                  : 'bg-red-900/50 text-red-300 border-red-800'}`}>
                {state.currentTurn==='player' ? `⚔️ Lượt: ${character.name}` : `🐉 Lượt: ${monster?.name}`}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {([
              { name:character.name, hp:state.playerHp, max:playerMaxHp, pct:pctP, side:'player' },
              { name:monster?.name??'—', hp:state.monsterHp, max:monsterMaxHp, pct:pctM, side:'monster' },
            ] as const).map(({ name, hp, max, pct, side }) => (
              <div key={side}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={`font-bold truncate ${side==='player'?'text-cyan-400':'text-red-400'}`}>{name}</span>
                  <span className={`font-mono font-bold ${hp===0?'text-red-500':'text-white'}`}>{hp}/{max}</span>
                </div>
                <div className="h-2.5 bg-black/40 rounded-full overflow-hidden">
                  <div className={`h-full ${hpColor(pct)} transition-all duration-500 rounded-full`} style={{ width:`${pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {state.phase==='finished' && state.winner && (
            <div className={`rounded-lg p-3 border animate-in fade-in ${
              state.winner==='player'?'bg-green-900/30 border-green-700':'bg-red-900/30 border-red-700'}`}>
              <p className={`font-fantasy text-xl font-bold text-center ${state.winner==='player'?'text-green-400':'text-red-400'}`}>
                {state.winner==='player' ? `🏆 ${character.name} chiến thắng!` : `💀 ${monster?.name} chiến thắng!`}
              </p>
              <p className="text-gray-500 text-xs text-center mt-0.5">Sau {state.round} round</p>

              {/* Continue options — only shown when player wins */}
              {state.winner==='player' && (
                <div className="mt-3 space-y-1.5">
                  <div className="text-[10px] text-gray-500 uppercase font-bold text-center tracking-wider mb-2">
                    Tiếp tục với HP hiện tại ({playerHp}/{playerMaxHp})?
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleContinueSame}
                      disabled={!monster}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-1.5 bg-dragon-800 border border-dragon-600 text-dragon-gold hover:bg-dragon-700 active:scale-95 transition-all">
                      <Swords size={11} /> Đánh lại con này
                    </button>
                    <button
                      onClick={handleContinueRandom}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-1.5 bg-red-900/40 border border-red-800 text-red-300 hover:bg-red-900/60 active:scale-95 transition-all">
                      <Shuffle size={11} /> Random quái mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Roll Prompt ── */}
      {pendingRoll && (
        <div className="px-5 py-3 border-b border-dragon-800">
          <RollPrompt config={pendingRoll} onConfirm={handleRollConfirm} />
        </div>
      )}

      {/* ── Monster auto-rolling indicator ── */}
      {isActive && !pendingRoll && !gmMode && (
        <div className="px-5 py-2.5 border-b border-dragon-800 flex items-center justify-center gap-2">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />
            ))}
          </div>
          <span className="text-[11px] text-red-400/70 uppercase font-bold tracking-wider">
            {monster?.name} đang tấn công...
          </span>
        </div>
      )}

      {/* ── Idle placeholder ── */}
      {state.phase==='idle' && (
        <div className="px-5 py-6 text-center">
          {monster
            ? <p className="text-gray-500 text-sm italic">Nhấn "Bắt đầu chiến đấu" để tung sáng kiến</p>
            : <p className="text-gray-600 text-sm italic">Chọn hoặc random quái vật phía trên để bắt đầu</p>}
        </div>
      )}

      {/* ── Combat log ── */}
      {state.log.length > 0 && (
        <div className="px-5 py-3">
          <div className="text-[10px] text-gray-600 uppercase font-black mb-2 flex items-center gap-1">
            <Swords size={10} /> Combat Log
          </div>
          <div className="max-h-52 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
            {state.log.map((entry) =>
              entry.type==='round' ? (
                <div key={entry.id} className="border-t border-dragon-800/60 my-1.5 text-center text-gray-600 text-[10px] uppercase tracking-widest py-0.5">
                  — {entry.text} —
                </div>
              ) : (
                <div key={entry.id} className={`text-xs font-mono leading-relaxed ${logStyle(entry)}`}>
                  {entry.text}
                </div>
              )
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatSim;
