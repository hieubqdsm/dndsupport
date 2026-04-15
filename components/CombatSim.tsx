import React, { useReducer, useEffect, useState, useRef, useMemo } from 'react';
import { Character, Monster } from '../types';
import { OFFLINE_MONSTERS } from '../data/monsterData';
import { WEAPON_DATABASE } from '../data/weapons';
import { Swords, Play, RotateCcw, Shuffle, Dices, Bot, Eye, X, Search, Zap, Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type CombatPhase =
  | 'idle'
  | 'initiative_player' | 'initiative_monster'
  | 'player_attack'     | 'player_damage'
  | 'player_surge_choice' | 'player_bonus_choice'
  | 'monster_attack'    | 'monster_damage'
  | 'finished';

interface CombatLogEntry {
  id: string; round: number;
  actor: 'player' | 'monster' | 'system';
  type: 'initiative' | 'attack_hit' | 'attack_miss' | 'damage' | 'info' | 'kill' | 'round';
  text: string;
}

interface DamageComponent { formula: string; damageType: string; }
interface ParsedAttack { name: string; bonus: number; damages: DamageComponent[]; }

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
  // Multi-attack tracking
  playerAttacksTotal: number;
  playerAttacksRemaining: number;
  monsterAttacksTotal: number;
  monsterAttacksRemaining: number;
  // Class features
  surgeAvailable: boolean;
  bonusAttackAvailable: boolean;
  bonusAttackUsed: boolean;
  isBonusAction: boolean;
  resourcesInitialized: boolean; // true after first START; keeps per-rest resources from being re-evaluated
}

interface PendingRollConfig {
  actor: 'player' | 'monster';
  title: string;
  context: string;
  isD20: boolean;
  modifier: number;
  formula: string;
  damages?: DamageComponent[];
  isCrit?: boolean;
}

interface PendingChoiceConfig {
  type: 'surge' | 'bonus';
  title: string;
  desc: string;
  yesLabel: string;
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

function rollAllDamages(damages: DamageComponent[], isCrit: boolean): { total: number; desc: string } {
  if (damages.length === 1) {
    const r = isCrit ? rollCrit(damages[0].formula) : rollFormula(damages[0].formula);
    const typeStr = damages[0].damageType ? ` ${damages[0].damageType}` : '';
    return { total: r.total, desc: `${r.desc}${typeStr}` };
  }
  const parts: string[] = [];
  let total = 0;
  for (const dmg of damages) {
    const r = isCrit ? rollCrit(dmg.formula) : rollFormula(dmg.formula);
    total += r.total;
    const typeStr = dmg.damageType ? ` ${dmg.damageType}` : '';
    parts.push(`${r.total}${typeStr}`);
  }
  return { total: Math.max(1, total), desc: parts.join(' + ') };
}

// ── Class feature helpers ──────────────────────────────────────────────────────

function getExtraAttacks(character: Character): number {
  const cls = (character.className || '').toLowerCase();
  const lvl = character.level;
  if (cls.includes('fighter')) {
    if (lvl >= 20) return 4;
    if (lvl >= 11) return 3;
    if (lvl >= 5) return 2;
  }
  if (cls.includes('bard')) {
    const sub = (character.subclass || '').toLowerCase();
    if ((sub.includes('valor') || sub.includes('swords')) && lvl >= 6) return 2;
  }
  const extraAt5 = ['ranger', 'paladin', 'barbarian', 'monk'];
  if (extraAt5.some(c => cls.includes(c)) && lvl >= 5) return 2;
  return 1;
}

function hasActionSurge(character: Character): boolean {
  return (character.className || '').toLowerCase().includes('fighter') && character.level >= 2;
}

function getMartialArtsDie(level: number): number {
  if (level >= 17) return 12;
  if (level >= 11) return 10;
  if (level >= 5) return 8;
  return 6;
}

function getBonusAttack(character: Character): ParsedAttack | null {
  const cls = (character.className || '').toLowerCase();
  const lvl = character.level;

  if (cls.includes('monk')) {
    const mod = Math.max(getMod(character.stats.dex.score), getMod(character.stats.str.score));
    const die = getMartialArtsDie(lvl);
    return {
      name: 'Martial Arts',
      bonus: mod + (character.proficiencyBonus || 2),
      damages: [{ formula: `1d${die}${mod >= 0 ? '+' : ''}${mod}`, damageType: 'bludgeoning' }],
    };
  }

  // Nick mastery weapon (first one found)
  for (const w of character.weapons) {
    const wd = WEAPON_DATABASE.find(d => d.value === w.weaponId);
    if (wd && wd.mastery === 'Nick' && wd.properties.includes('Light')) {
      return {
        name: `${w.customName || w.weaponId} (Nick)`,
        bonus: w.attackBonus,
        damages: [{ formula: w.damageFormula || '1d4', damageType: (w.damageType || '').toLowerCase() }],
      };
    }
  }

  // Two Light weapons → TWF off-hand
  const lightWeapons = character.weapons.filter(w => {
    const wd = WEAPON_DATABASE.find(d => d.value === w.weaponId);
    return wd && wd.properties.includes('Light');
  });
  if (lightWeapons.length >= 2) {
    const off = lightWeapons[1];
    return {
      name: `${off.customName || off.weaponId} (Off-hand)`,
      bonus: off.attackBonus,
      damages: [{ formula: off.damageFormula || '1d4', damageType: (off.damageType || '').toLowerCase() }],
    };
  }

  return null;
}

// ── Monster helpers ────────────────────────────────────────────────────────────

function getMonsterAttackCount(monster: Monster): number {
  // Explicit field wins
  if (monster.multiattack !== undefined) return monster.multiattack;

  const ma = monster.actions.find(a => a.name.toLowerCase() === 'multiattack');
  if (!ma) return 1;
  const desc = ma.desc.trim();

  // Word numbers: "two attacks" etc.
  const words: Record<string, number> = { one:1, two:2, three:3, four:4, five:5, six:6 };
  const wm = desc.match(/\b(one|two|three|four|five|six)\b/i);
  if (wm) return words[wm[1].toLowerCase()] ?? 2;

  // "N: ..." — leading total like "3: 1 Bite + 2 Claws"
  const colonMatch = desc.match(/^(\d+):/);
  if (colonMatch) return parseInt(colonMatch[1]);

  // "N attacks" / "N melee attacks" / "Frightful Presence + N attacks"
  const attacksMatch = desc.match(/\b(\d+)\s+(?:attacks?|melee|ranged)/i);
  if (attacksMatch) return parseInt(attacksMatch[1]);

  // "N Foo + M Bar [+ ...]" — each component is "count name", sum them
  if (desc.includes(' + ')) {
    const parts = desc.split(/\s*\+\s*/);
    if (parts.every(p => /^\d+\s/.test(p.trim()))) {
      return parts.reduce((sum, p) => sum + parseInt(p.trim()), 0);
    }
  }

  // Fallback: first number in desc
  const nm = desc.match(/(\d+)/);
  return nm ? parseInt(nm[1]) : 2;
}

function parseMonsterAttacks(monster: Monster): ParsedAttack[] {
  const results: ParsedAttack[] = [];
  for (const action of monster.actions) {
    if (action.name.toLowerCase() === 'multiattack') continue;
    const d = action.desc;

    // Attack bonus: "+5 to hit" or starts with "+5,"
    const hitMatch = d.match(/([+\-]\d+)\s+to\s+hit/i) || d.match(/^([+\-]\d+)[,\s]/);
    if (!hitMatch) continue;
    const bonus = parseInt(hitMatch[1]);

    // Damage components: "X (formula) Type [damage]"
    const damages: DamageComponent[] = [];
    const dmgRe = /\d+\s+\(([^)]+)\)\s+([A-Za-z]\w+)(?:\s+damage)?/gi;
    let m: RegExpExecArray | null;
    while ((m = dmgRe.exec(d)) !== null) {
      const formula = m[1].replace(/\s/g, '');
      const dtype = m[2];
      if (!['to', 'hit', 'reach', 'range'].includes(dtype.toLowerCase())) {
        damages.push({ formula, damageType: dtype.toLowerCase() });
      }
    }
    // Fallback A: "Hit: Xd6+Y type" standard format
    if (damages.length === 0) {
      const fb = d.match(/Hit:\s*(\d+d\d+(?:\s*[+\-]\s*\d+)?)(?:\s+(\w+))?/i);
      if (fb) damages.push({ formula: fb[1].replace(/\s/g,''), damageType: (fb[2] || '').toLowerCase() });
    }
    // Fallback B: compact flat "+X, N Type" — no formula in parens (e.g. "+0, 1 Slashing")
    if (damages.length === 0) {
      const fb = d.match(/,\s*(\d+)\s+([A-Za-z]\w+)(?:\s+damage)?/i);
      if (fb && !['to','hit','reach','range','ft'].includes(fb[2].toLowerCase())) {
        damages.push({ formula: fb[1], damageType: fb[2].toLowerCase() });
      }
    }

    if (damages.length > 0) results.push({ name: action.name, bonus, damages });
  }

  if (!results.length) {
    const sm = getMod(monster.stats.str);
    results.push({ name:'Tấn công', bonus:sm+2, damages:[{ formula:`1d6${sm>=0?'+':''}${sm}`, damageType:'' }] });
  }
  return results;
}

function getPrimaryAttack(character: Character): ParsedAttack {
  if (character.weapons.length > 0) {
    const best = character.weapons.reduce((b, w) => w.attackBonus > b.attackBonus ? w : b);
    return {
      name: best.customName || best.weaponId || 'Vũ khí',
      bonus: best.attackBonus,
      damages: [{ formula: best.damageFormula || '1d6', damageType: (best.damageType || '').toLowerCase() }],
    };
  }
  if (character.attacks?.length > 0) {
    const a = character.attacks[0];
    return { name: a.name, bonus: a.bonus, damages: [{ formula: a.damage || '1d4', damageType: '' }] };
  }
  const sm = getMod(character.stats.str.score);
  return { name:'Tay không', bonus:sm+(character.proficiencyBonus||2), damages:[{ formula:`1d4${sm>=0?'+':''}${sm}`, damageType:'bludgeoning' }] };
}

function getEffectiveConMod(character: Character): number {
  let score = character.stats.con.score;
  score += Number(character.racialBonuses?.con) || 0;
  if (character.asiChoices) {
    Object.values(character.asiChoices).forEach((choice: any) => {
      if (choice?.type === 'asi') {
        if (choice.ability1 === 'con') score += Number(choice.amount1) || 0;
        if (choice.ability2 === 'con') score += Number(choice.amount2) || 0;
      }
    });
  }
  (character.magicItems || []).forEach(item => {
    if (item.requiresAttunement && !item.attuned) return;
    score += Number(item.statBonuses?.con) || 0;
  });
  return Math.floor((score - 10) / 2);
}

function getHitDieFormula(character: Character): string {
  const cls = (character.className || '').toLowerCase();
  let die = 8;
  if (cls.includes('barbarian')) die = 12;
  else if (cls.includes('fighter') || cls.includes('paladin') || cls.includes('ranger')) die = 10;
  else if (cls.includes('wizard') || cls.includes('sorcerer')) die = 6;
  const conMod = getEffectiveConMod(character);
  const modStr = conMod >= 0 ? `+${conMod}` : String(conMod);
  return `1d${die}${modStr}`;
}

function mkLog(round:number, actor:CombatLogEntry['actor'], type:CombatLogEntry['type'], text:string): CombatLogEntry {
  return { id:Math.random().toString(36).substr(2,6), round, actor, type, text };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

const INIT: CombatRState = {
  phase:'idle', round:1, currentTurn:'player',
  initiatives:null, lastAttackRoll:null,
  log:[], winner:null, playerHp:0, monsterHp:0,
  playerAttacksTotal:1, playerAttacksRemaining:1,
  monsterAttacksTotal:1, monsterAttacksRemaining:1,
  surgeAvailable:false, bonusAttackAvailable:false,
  bonusAttackUsed:false, isBonusAction:false,
  resourcesInitialized:false,
};

type CombatAction =
  | { type:'START'; playerHp:number; monsterHp:number; surgeAvailable:boolean; bonusAttackAvailable:boolean; playerAttacksTotal:number; monsterAttacksTotal:number }
  | { type:'STEP'; character:Character; monster:Monster; d20Override?:number; damageOverride?:number }
  | { type:'CHOICE'; choice:'surge'|'bonus'; use:boolean; character:Character; monster:Monster }
  | { type:'RESET'; playerHp:number; monsterHp:number; surgeAvailable:boolean; bonusAttackAvailable:boolean; playerAttacksTotal:number; monsterAttacksTotal:number }
  | { type:'CONTINUE'; playerHp:number }
  | { type:'SHORT_REST'; character:Character; hpGain:number; maxHp:number }
  | { type:'LONG_REST'; maxHp:number };

function afterPlayerAttack(s: CombatRState, mon: Monster, log: CombatLogEntry[]): CombatRState {
  const ns = { ...s, log };
  if (s.isBonusAction) {
    return { ...ns, phase:'monster_attack', currentTurn:'monster', isBonusAction:false, bonusAttackUsed:true, monsterAttacksRemaining:s.monsterAttacksTotal };
  }
  const rem = s.playerAttacksRemaining - 1;
  if (rem > 0) return { ...ns, phase:'player_attack', playerAttacksRemaining:rem };
  // Action done — check surge
  if (s.surgeAvailable) return { ...ns, phase:'player_surge_choice' };
  // Check bonus
  if (s.bonusAttackAvailable && !s.bonusAttackUsed) return { ...ns, phase:'player_bonus_choice' };
  // Monster turn
  return { ...ns, phase:'monster_attack', currentTurn:'monster', monsterAttacksRemaining:s.monsterAttacksTotal };
}

function afterMonsterAttack(s: CombatRState, char: Character, log: CombatLogEntry[]): CombatRState {
  const ns = { ...s, log };
  const rem = s.monsterAttacksRemaining - 1;
  if (rem > 0) return { ...ns, phase:'monster_attack', monsterAttacksRemaining:rem };
  const nr = s.round + 1;
  return { ...ns, phase:'player_attack', currentTurn:'player', round:nr,
    playerAttacksRemaining:s.playerAttacksTotal, bonusAttackUsed:false,
    log:[...log, mkLog(nr,'system','round',`Round ${nr}`)] };
}

function combatStep(s: CombatRState, char: Character, mon: Monster, opts: { d20Override?:number; damageOverride?:number } = {}): CombatRState {
  const monAC = parseAC(mon.ac);

  // ─ Initiative ─
  if (s.phase === 'initiative_player') {
    const d = opts.d20Override ?? rollD20(), pt = d + char.initiative;
    return { ...s, phase:'initiative_monster', initiatives:{ player:pt, monster:0 },
      log:[...s.log, mkLog(0,'player','initiative',`⚡ ${char.name}: d20(${d})${fmtMod(char.initiative)} = ${pt}`)] };
  }

  if (s.phase === 'initiative_monster') {
    const d = opts.d20Override ?? rollD20(), mm = getMod(mon.stats.dex), mt = d + mm;
    const pt = s.initiatives?.player ?? 0;
    const first: 'player'|'monster' = pt >= mt ? 'player' : 'monster';
    const next: CombatPhase = first === 'player' ? 'player_attack' : 'monster_attack';
    return { ...s, phase:next, currentTurn:first,
      playerAttacksRemaining: first==='player' ? s.playerAttacksTotal : s.playerAttacksRemaining,
      monsterAttacksRemaining: first==='monster' ? s.monsterAttacksTotal : s.monsterAttacksRemaining,
      initiatives:{ player:pt, monster:mt },
      log:[...s.log,
        mkLog(0,'monster','initiative',`⚡ ${mon.name}: d20(${d})${fmtMod(mm)} = ${mt}`),
        mkLog(1,'system','info',`${first==='player'?char.name:mon.name} đi trước! — Round 1 bắt đầu.`)] };
  }

  // ─ Player Attack ─
  if (s.phase === 'player_attack') {
    const atk = s.isBonusAction ? (getBonusAttack(char) ?? getPrimaryAttack(char)) : getPrimaryAttack(char);
    const atkNum = s.isBonusAction ? 'Bonus' : s.playerAttacksTotal>1 ? `${s.playerAttacksTotal-s.playerAttacksRemaining+1}/${s.playerAttacksTotal}` : '';
    const suffix = atkNum ? ` (${atkNum})` : '';
    const d20 = opts.d20Override ?? rollD20(), total = d20 + atk.bonus;
    const hit = d20===20 || (d20!==1 && total>=monAC);
    const note = d20===20?' ✨ BẠO KÍCH!':d20===1?' 💀 Thất bại!':'';
    const entry = mkLog(s.round,'player',hit?'attack_hit':'attack_miss',
      `⚔️ ${char.name}${suffix} [${atk.name}]: d20(${d20})${fmtMod(atk.bonus)}=${total} vs AC ${monAC} — ${hit?'TRÚNG!':'Hụt!'}${note}`);
    if (hit) return { ...s, phase:'player_damage', lastAttackRoll:d20, log:[...s.log,entry] };
    return afterPlayerAttack(s, mon, [...s.log, entry]);
  }

  // ─ Player Damage ─
  if (s.phase === 'player_damage') {
    const atk = s.isBonusAction ? (getBonusAttack(char) ?? getPrimaryAttack(char)) : getPrimaryAttack(char);
    const isCrit = s.lastAttackRoll === 20;
    let dmg: number, desc: string;
    if (opts.damageOverride !== undefined) {
      dmg = Math.max(1, opts.damageOverride);
      desc = String(dmg) + (isCrit?' (Crit)':'');
    } else {
      const r = rollAllDamages(atk.damages, isCrit);
      dmg = r.total; desc = r.desc + (isCrit?' (Crit)':'');
    }
    const newHp = Math.max(0, s.monsterHp - dmg);
    const dmgEntry = mkLog(s.round,'player','damage',`💥 Sát thương: ${desc}${atk.damages.length===1 && atk.damages[0].damageType?' ('+atk.damages[0].damageType+')':''} = ${dmg}`);
    if (newHp <= 0) return { ...s, phase:'finished', winner:'player', monsterHp:0,
      log:[...s.log,dmgEntry,mkLog(s.round,'system','kill',`☠️ ${mon.name} bị hạ gục! ${char.name} chiến thắng!`)] };
    const hpEntry = mkLog(s.round,'monster','info',`💔 ${mon.name}: ${newHp} HP còn lại`);
    return afterPlayerAttack({ ...s, monsterHp:newHp }, mon, [...s.log, dmgEntry, hpEntry]);
  }

  // ─ Monster Attack ─
  if (s.phase === 'monster_attack') {
    const attacks = parseMonsterAttacks(mon);
    const atkIdx = (s.monsterAttacksTotal - s.monsterAttacksRemaining) % attacks.length;
    const atk = attacks[atkIdx];
    const atkNum = s.monsterAttacksTotal>1 ? ` (${s.monsterAttacksTotal-s.monsterAttacksRemaining+1}/${s.monsterAttacksTotal})` : '';
    const d20 = opts.d20Override ?? rollD20(), total = d20 + atk.bonus;
    const hit = d20===20 || (d20!==1 && total>=char.ac);
    const note = d20===20?' ✨ BẠO KÍCH!':d20===1?' 💀 Thất bại!':'';
    const entry = mkLog(s.round,'monster',hit?'attack_hit':'attack_miss',
      `🐉 ${mon.name}${atkNum} [${atk.name}]: d20(${d20})${fmtMod(atk.bonus)}=${total} vs AC ${char.ac} — ${hit?'TRÚNG!':'Hụt!'}${note}`);
    if (hit) return { ...s, phase:'monster_damage', lastAttackRoll:d20, log:[...s.log,entry] };
    return afterMonsterAttack(s, char, [...s.log, entry]);
  }

  // ─ Monster Damage ─
  if (s.phase === 'monster_damage') {
    const attacks = parseMonsterAttacks(mon);
    const atkIdx = (s.monsterAttacksTotal - s.monsterAttacksRemaining) % attacks.length;
    const atk = attacks[atkIdx];
    const isCrit = s.lastAttackRoll === 20;
    let dmg: number, desc: string;
    if (opts.damageOverride !== undefined) {
      dmg = Math.max(1, opts.damageOverride);
      desc = String(dmg) + (isCrit?' (Crit)':'');
    } else {
      const r = rollAllDamages(atk.damages, isCrit);
      dmg = r.total; desc = r.desc;
    }
    const newHp = Math.max(0, s.playerHp - dmg);
    const dmgEntry = mkLog(s.round,'monster','damage',`💥 Sát thương: ${desc}${atk.damages.length===1 && atk.damages[0].damageType?' ('+atk.damages[0].damageType+')':''} = ${dmg}`);
    if (newHp <= 0) return { ...s, phase:'finished', winner:'monster', playerHp:0,
      log:[...s.log,dmgEntry,mkLog(s.round,'system','kill',`☠️ ${char.name} bị hạ gục! ${mon.name} chiến thắng!`)] };
    const hpEntry = mkLog(s.round,'player','info',`💔 ${char.name}: ${newHp} HP còn lại`);
    return afterMonsterAttack({ ...s, playerHp:newHp }, char, [...s.log, dmgEntry, hpEntry]);
  }

  return s;
}

function combatReducer(s: CombatRState, a: CombatAction): CombatRState {
  switch (a.type) {
    case 'START':
      return { ...INIT, phase:'initiative_player', playerHp:a.playerHp, monsterHp:a.monsterHp,
        surgeAvailable:a.surgeAvailable, bonusAttackAvailable:a.bonusAttackAvailable,
        playerAttacksTotal:a.playerAttacksTotal, playerAttacksRemaining:a.playerAttacksTotal,
        monsterAttacksTotal:a.monsterAttacksTotal, monsterAttacksRemaining:a.monsterAttacksTotal,
        resourcesInitialized:true };

    case 'STEP':
      return combatStep(s, a.character, a.monster, { d20Override:a.d20Override, damageOverride:a.damageOverride });

    case 'CHOICE': {
      const monTotal = getMonsterAttackCount(a.monster);
      if (a.choice === 'surge') {
        if (a.use) {
          return { ...s, phase:'player_attack', surgeAvailable:false, playerAttacksRemaining:s.playerAttacksTotal,
            log:[...s.log, mkLog(s.round,'system','info',`⚡ ${a.character.name} dùng Action Surge!`)] };
        }
        // skip surge → check bonus
        if (s.bonusAttackAvailable && !s.bonusAttackUsed) return { ...s, surgeAvailable:false, phase:'player_bonus_choice' };
        return { ...s, surgeAvailable:false, phase:'monster_attack', currentTurn:'monster', monsterAttacksRemaining:monTotal };
      }
      if (a.choice === 'bonus') {
        if (a.use) {
          return { ...s, phase:'player_attack', isBonusAction:true,
            log:[...s.log, mkLog(s.round,'system','info',`🎯 ${a.character.name} dùng Bonus Action Attack!`)] };
        }
        return { ...s, phase:'monster_attack', currentTurn:'monster', monsterAttacksRemaining:monTotal };
      }
      return s;
    }

    case 'RESET':
      return { ...INIT, playerHp:a.playerHp, monsterHp:a.monsterHp,
        surgeAvailable:a.surgeAvailable, bonusAttackAvailable:a.bonusAttackAvailable,
        playerAttacksTotal:a.playerAttacksTotal, playerAttacksRemaining:a.playerAttacksTotal,
        monsterAttacksTotal:a.monsterAttacksTotal, monsterAttacksRemaining:a.monsterAttacksTotal };

    case 'CONTINUE':
      // Preserve per-rest resources (surge, bonus attack availability) — only rest resets these
      return { ...INIT, phase:'idle', playerHp:a.playerHp,
        surgeAvailable: s.surgeAvailable,
        bonusAttackAvailable: s.bonusAttackAvailable,
        playerAttacksTotal: s.playerAttacksTotal,
        resourcesInitialized: true };

    case 'SHORT_REST': {
      const newHp = Math.min(a.maxHp, s.playerHp + a.hpGain);
      return { ...s, playerHp: newHp,
        surgeAvailable: hasActionSurge(a.character),
        bonusAttackUsed: false };
    }

    case 'LONG_REST':
      return { ...INIT, playerHp: a.maxHp };

    default: return s;
  }
}

// ── Roll Prompt ───────────────────────────────────────────────────────────────

const RollPrompt: React.FC<{
  config: PendingRollConfig;
  onConfirm: (rawValue: number) => void;
}> = ({ config, onConfirm }) => {
  const [diceInput, setDiceInput] = useState<number | null>(null);
  const isPlayer  = config.actor === 'player';
  const hasValue  = diceInput !== null;
  const total     = hasValue ? (config.isD20 ? diceInput + config.modifier : diceInput) : null;
  const isNat20   = config.isD20 && diceInput === 20;
  const isNat1    = config.isD20 && diceInput === 1;

  const handleRandom = () => {
    if (config.isD20) { setDiceInput(rollD20()); return; }
    if (config.damages) { setDiceInput(rollAllDamages(config.damages, config.isCrit??false).total); return; }
    const r = config.isCrit ? rollCrit(config.formula) : rollFormula(config.formula);
    setDiceInput(r.total);
  };

  const handleAutoConfirm = () => {
    if (config.isD20) { onConfirm(rollD20()); return; }
    if (config.damages) { onConfirm(rollAllDamages(config.damages, config.isCrit??false).total); return; }
    const r = config.isCrit ? rollCrit(config.formula) : rollFormula(config.formula);
    onConfirm(r.total);
  };

  const handleInputChange = (raw: string) => {
    const v = parseInt(raw);
    if (isNaN(v) || raw === '') { setDiceInput(null); return; }
    setDiceInput(config.isD20 ? Math.max(1, Math.min(20, v)) : Math.max(1, v));
  };

  return (
    <div className={`rounded-xl border-2 p-4 animate-in slide-in-from-bottom-2 ${
      isPlayer ? 'border-cyan-600 bg-cyan-950/50' : 'border-red-600 bg-red-950/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-fantasy font-bold text-sm ${isPlayer ? 'text-cyan-300' : 'text-red-300'}`}>
          🎲 {config.title}
        </h3>
        <button onClick={handleAutoConfirm} title="Auto roll và xác nhận"
          className="text-gray-600 hover:text-gray-300 transition-colors text-[10px] flex items-center gap-1 border border-gray-700 hover:border-gray-500 rounded px-1.5 py-0.5">
          <X size={10} /> Auto
        </button>
      </div>
      <p className="text-gray-400 text-[11px] mb-3">{config.context}</p>
      {config.isCrit && (
        <div className="text-dragon-gold text-[11px] font-bold mb-2 animate-pulse">
          ✨ BẠO KÍCH!{!config.isD20 && config.formula ? ` Tung ${config.formula} × 2!` : ''}
        </div>
      )}

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

// ── Choice Prompt ─────────────────────────────────────────────────────────────

const ChoicePrompt: React.FC<{
  config: PendingChoiceConfig;
  onYes: () => void;
  onNo: () => void;
}> = ({ config, onYes, onNo }) => (
  <div className="rounded-xl border-2 border-yellow-600 bg-yellow-950/40 p-4 animate-in slide-in-from-bottom-2">
    <h3 className="font-fantasy font-bold text-sm text-yellow-300 flex items-center gap-1.5 mb-2">
      <Zap size={13} /> {config.title}
    </h3>
    <p className="text-gray-400 text-[11px] mb-4">{config.desc}</p>
    <div className="flex gap-2">
      <button onClick={onYes}
        className="flex-1 py-2 bg-yellow-700 hover:bg-yellow-600 text-black font-black text-xs uppercase rounded-lg transition-colors active:scale-95">
        {config.yesLabel}
      </button>
      <button onClick={onNo}
        className="flex-1 py-2 bg-black/30 border border-gray-700 text-gray-300 font-bold text-xs uppercase rounded-lg hover:border-gray-500 transition-colors active:scale-95">
        Bỏ qua
      </button>
    </div>
  </div>
);

// ── Build roll config ─────────────────────────────────────────────────────────

function buildRollConfig(phase: CombatPhase, s: CombatRState, char: Character, mon: Monster): PendingRollConfig | null {
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
      const atk = s.isBonusAction ? (getBonusAttack(char) ?? getPrimaryAttack(char)) : getPrimaryAttack(char);
      const atkNum = s.isBonusAction ? 'Bonus Action' : s.playerAttacksTotal>1 ? `${s.playerAttacksTotal-s.playerAttacksRemaining+1}/${s.playerAttacksTotal}` : '';
      const titleSuffix = atkNum ? ` (${atkNum})` : '';
      return { actor:'player', title:`${char.name} tấn công${titleSuffix}`, context:`[${atk.name}] ${fmtMod(atk.bonus)} to hit — vs AC ${monAC}`, isD20:true, modifier:atk.bonus, formula:'' };
    }
    case 'player_damage': {
      const atk = s.isBonusAction ? (getBonusAttack(char) ?? getPrimaryAttack(char)) : getPrimaryAttack(char);
      const isCrit = s.lastAttackRoll === 20;
      const formulaStr = atk.damages.map(d => `${d.formula}${d.damageType?' '+d.damageType:''}`).join(' + ');
      return { actor:'player', title:`${char.name} gây sát thương`, context:`Formula: ${formulaStr}`, isD20:false, modifier:0, formula:formulaStr, damages:atk.damages, isCrit };
    }
    case 'monster_attack': {
      const attacks = parseMonsterAttacks(mon);
      const atkIdx = (s.monsterAttacksTotal - s.monsterAttacksRemaining) % attacks.length;
      const atk = attacks[atkIdx];
      const atkNum = s.monsterAttacksTotal>1 ? ` (${s.monsterAttacksTotal-s.monsterAttacksRemaining+1}/${s.monsterAttacksTotal})` : '';
      return { actor:'monster', title:`${mon.name}${atkNum} tấn công`, context:`[${atk.name}] ${fmtMod(atk.bonus)} to hit — vs AC ${char.ac}`, isD20:true, modifier:atk.bonus, formula:'' };
    }
    case 'monster_damage': {
      const attacks = parseMonsterAttacks(mon);
      const atkIdx = (s.monsterAttacksTotal - s.monsterAttacksRemaining) % attacks.length;
      const atk = attacks[atkIdx];
      const isCrit = s.lastAttackRoll === 20;
      const formulaStr = atk.damages.map(d => `${d.formula}${d.damageType?' '+d.damageType:''}`).join(' + ');
      return { actor:'monster', title:`${mon.name} gây sát thương`, context:`Formula: ${formulaStr}`, isD20:false, modifier:0, formula:formulaStr, damages:atk.damages, isCrit };
    }
    default: return null;
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
  if (e.type==='info')         return e.actor==='player' ? 'text-cyan-700 text-[11px]' : e.actor==='monster' ? 'text-orange-800 text-[11px]' : 'text-yellow-600 text-[11px] font-bold';
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
  const [gmMode, setGmMode]             = useState(false);
  const [pendingRoll, setPendingRoll]   = useState<PendingRollConfig | null>(null);
  const [pendingChoice, setPendingChoice] = useState<PendingChoiceConfig | null>(null);
  const [pendingRestRoll, setPendingRestRoll] = useState<PendingRollConfig | null>(null);
  const [showRest, setShowRest]         = useState(false);
  const [randomCR, setRandomCR]         = useState('');
  const [randomType, setRandomType]     = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [showList, setShowList]         = useState(false);
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowList(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = state.phase !== 'idle' && state.phase !== 'finished';

  // Phase watcher
  useEffect(() => {
    if (!monster || !isActive) { setPendingRoll(null); setPendingChoice(null); return; }

    const playerRollPhases: CombatPhase[] = ['initiative_player','player_attack','player_damage'];
    const playerChoicePhases: CombatPhase[] = ['player_surge_choice','player_bonus_choice'];
    const monsterPhases: CombatPhase[] = ['initiative_monster','monster_attack','monster_damage'];

    if (playerRollPhases.includes(state.phase) || (gmMode && monsterPhases.includes(state.phase))) {
      setPendingChoice(null);
      const cfg = buildRollConfig(state.phase, state, character, monster);
      if (cfg) setPendingRoll(cfg);
      return;
    }

    if (playerChoicePhases.includes(state.phase)) {
      setPendingRoll(null);
      if (state.phase === 'player_surge_choice') {
        const extraAtks = state.playerAttacksTotal;
        setPendingChoice({
          type: 'surge',
          title: 'Action Surge!',
          desc: `Fighter dùng Action Surge — tấn công thêm ${extraAtks} lần! (1 lần/chiến đấu)`,
          yesLabel: '⚡ Dùng Surge!',
        });
      } else {
        const bonusAtk = getBonusAttack(character);
        setPendingChoice({
          type: 'bonus',
          title: 'Bonus Action Attack',
          desc: `Dùng Bonus Action tấn công với ${bonusAtk?.name ?? 'Bonus Attack'}?`,
          yesLabel: '🎯 Tấn công!',
        });
      }
      return;
    }

    if (!gmMode && monsterPhases.includes(state.phase)) {
      setPendingRoll(null);
      setPendingChoice(null);
      const t = setTimeout(() => dispatch({ type:'STEP', character, monster }), 750);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.playerAttacksRemaining, state.monsterAttacksRemaining, gmMode, monster?.name]);

  // Sync HP to parent
  useEffect(() => {
    if (state.phase !== 'idle') {
      onPlayerHpChange(state.playerHp);
      onMonsterHpChange(state.monsterHp);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.playerHp, state.monsterHp]);

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [state.log.length]);

  // Derived combat info
  const playerExtraAtks = getExtraAttacks(character);
  const playerBonusAtk  = getBonusAttack(character);
  const playerHasSurge  = hasActionSurge(character);

  const handleStart = () => {
    if (!monster) return;
    // If resources have been initialized before (post-Continue), preserve them.
    // On the very first fight (resourcesInitialized=false), evaluate fresh from character.
    const surgeAvail = state.resourcesInitialized
      ? state.surgeAvailable
      : hasActionSurge(character);
    dispatch({
      type: 'START', playerHp, monsterHp,
      surgeAvailable: surgeAvail,
      bonusAttackAvailable: getBonusAttack(character) !== null,
      playerAttacksTotal: getExtraAttacks(character),
      monsterAttacksTotal: getMonsterAttackCount(monster),
    });
  };

  const handleReset = () => {
    setPendingRoll(null); setPendingChoice(null);
    if (!monster) { dispatch({ type:'RESET', playerHp:playerMaxHp, monsterHp:0, surgeAvailable:false, bonusAttackAvailable:false, playerAttacksTotal:1, monsterAttacksTotal:1 }); return; }
    dispatch({
      type: 'RESET', playerHp:playerMaxHp, monsterHp:monsterMaxHp,
      surgeAvailable: hasActionSurge(character),
      bonusAttackAvailable: getBonusAttack(character) !== null,
      playerAttacksTotal: getExtraAttacks(character),
      monsterAttacksTotal: getMonsterAttackCount(monster),
    });
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

  const handleChoiceConfirm = (choice: 'surge'|'bonus', use: boolean) => {
    if (!monster) return;
    setPendingChoice(null);
    dispatch({ type:'CHOICE', choice, use, character, monster });
  };

  const handleRandom = () => {
    const pool = filteredMonsters.length > 0 ? filteredMonsters : [...OFFLINE_MONSTERS];
    if (!pool.length) return;
    onMonsterSelect(pool[Math.floor(Math.random() * pool.length)]);
    setShowList(false); setSearchQuery('');
  };

  const handleContinueSame = () => {
    if (!monster) return;
    setPendingRoll(null); setPendingChoice(null);
    dispatch({ type:'CONTINUE', playerHp });
    onMonsterSelect(monster);
  };

  const handleShortRest = () => {
    const formula = getHitDieFormula(character);
    setPendingRestRoll({
      actor: 'player',
      title: `Short Rest — Hồi máu (${formula})`,
      context: `Tung hit die để hồi HP. Con modifier: ${fmtMod(getEffectiveConMod(character))}`,
      isD20: false,
      modifier: 0,
      formula,
    });
  };

  const handleLongRest = () => {
    dispatch({ type: 'LONG_REST', maxHp: playerMaxHp });
    onPlayerHpChange(playerMaxHp);
    setShowRest(false);
  };

  const handleRestRollConfirm = (value: number) => {
    const hpGain = Math.max(1, value);
    dispatch({ type: 'SHORT_REST', character, hpGain, maxHp: playerMaxHp });
    onPlayerHpChange(Math.min(playerMaxHp, state.playerHp + hpGain));
    setPendingRestRoll(null);
    setShowRest(false);
  };

  const handleContinueRandom = () => {
    const pool = filteredMonsters.length > 0 ? filteredMonsters : [...OFFLINE_MONSTERS];
    if (!pool.length) return;
    const available = pool.filter(m => m.name !== monster?.name);
    const pick = available.length > 0 ? available : pool;
    setPendingRoll(null); setPendingChoice(null);
    dispatch({ type:'CONTINUE', playerHp });
    onMonsterSelect(pick[Math.floor(Math.random() * pick.length)]);
  };

  const pctP = playerMaxHp > 0 ? Math.max(0, Math.min(100, (state.playerHp / playerMaxHp) * 100)) : 0;
  const pctM = monsterMaxHp > 0 ? Math.max(0, Math.min(100, (state.monsterHp / monsterMaxHp) * 100)) : 0;
  const hpColor = (p: number) => p > 50 ? 'bg-green-500' : p > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-dragon-900/80 border-2 border-dragon-700 rounded-xl overflow-hidden">

      {/* Header */}
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

      {/* Player class features badge row */}
      {(playerExtraAtks > 1 || playerBonusAtk !== null || playerHasSurge) && (
        <div className="px-5 py-2 border-b border-dragon-800 flex flex-wrap gap-1.5">
          {playerExtraAtks > 1 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-900/40 border border-cyan-800 text-cyan-400 font-bold">
              ⚔️ Extra Attack ×{playerExtraAtks}
            </span>
          )}
          {playerHasSurge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/40 border border-yellow-800 text-yellow-400 font-bold">
              ⚡ Action Surge
            </span>
          )}
          {playerBonusAtk && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-800 text-purple-400 font-bold">
              🎯 {playerBonusAtk.name}
            </span>
          )}
        </div>
      )}

      {/* Monster selection */}
      <div className="px-5 py-3 border-b border-dragon-800 space-y-2">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase font-black">
          <Shuffle size={10} /> Chọn quái vật
        </div>

        {monster && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-1.5">
            <span className="text-red-400 font-bold text-xs truncate flex-1">{monster.name}</span>
            <span className="text-gray-500 text-[10px] shrink-0">CR {monster.challenge.split(' ')[0]}</span>
            <span className="text-gray-600 text-[10px] shrink-0">• {monster.type}</span>
            {getMonsterAttackCount(monster) > 1 && (
              <span className="text-orange-500 text-[10px] shrink-0 font-bold">• {getMonsterAttackCount(monster)} tấn công/lượt</span>
            )}
          </div>
        )}

        <div ref={searchRef} className="relative space-y-1">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[120px]">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <input type="text" placeholder="Tìm tên quái..." value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowList(true); }}
                onFocus={() => setShowList(true)}
                className="w-full pl-6 pr-2 py-1.5 bg-black/30 border border-dragon-800 text-gray-300 text-[11px] rounded focus:outline-none focus:border-dragon-gold placeholder:text-gray-600" />
            </div>
            <select value={randomCR} onChange={e => { setRandomCR(e.target.value); setShowList(showList || searchQuery !== ''); }}
              className="bg-black/30 border border-dragon-800 text-gray-300 text-[11px] rounded px-1.5 py-1.5 focus:outline-none focus:border-dragon-gold w-[72px] appearance-none">
              <option value="">CR all</option>
              {CR_OPTS.map(c => <option key={c} value={c}>CR {c}</option>)}
            </select>
            <select value={randomType} onChange={e => { setRandomType(e.target.value); setShowList(showList || searchQuery !== ''); }}
              className="bg-black/30 border border-dragon-800 text-gray-300 text-[11px] rounded px-1.5 py-1.5 focus:outline-none focus:border-dragon-gold w-[100px] appearance-none">
              <option value="">Loại all</option>
              {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={handleRandom}
              className="px-2.5 py-1.5 bg-dragon-800 hover:bg-dragon-700 border border-dragon-700 text-dragon-gold rounded text-[11px] font-bold flex items-center gap-1 transition-colors active:scale-95 shrink-0">
              <Shuffle size={11} /> Random
            </button>
          </div>

          {showList && (
            <div className="absolute z-20 left-0 right-0 top-full mt-0.5 max-h-44 overflow-y-auto bg-dragon-950 border border-dragon-700 rounded-lg shadow-xl custom-scrollbar">
              {filteredMonsters.length === 0 ? (
                <div className="text-gray-600 text-xs text-center py-3 italic">Không tìm thấy quái nào</div>
              ) : (
                <>
                  {filteredMonsters.slice(0, 60).map(m => (
                    <button key={m.name}
                      onMouseDown={() => { onMonsterSelect(m); setShowList(false); setSearchQuery(''); }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-dragon-800 transition-colors ${monster?.name === m.name ? 'text-dragon-gold bg-dragon-900' : 'text-gray-300'}`}>
                      <span className="truncate flex-1">{m.name}</span>
                      <span className="text-gray-600 text-[10px] shrink-0 ml-3">
                        CR {m.challenge.split(' ')[0]} • {m.type}
                        {getMonsterAttackCount(m) > 1 ? ` • ${getMonsterAttackCount(m)}atk` : ''}
                      </span>
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

      {/* HP bars + round info */}
      {(isActive || state.phase === 'finished') && (
        <div className="px-5 py-3 border-b border-dragon-800 space-y-2.5">
          {isActive && (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Round {state.round}</span>
              <div className="flex items-center gap-2">
                {/* Feature status badges during combat */}
                {state.surgeAvailable && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-900/50 border border-yellow-700 text-yellow-400 font-bold">⚡ Surge</span>
                )}
                {state.bonusAttackAvailable && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${state.bonusAttackUsed ? 'bg-gray-900/50 border-gray-700 text-gray-600' : 'bg-purple-900/50 border-purple-700 text-purple-400'}`}>
                    🎯 Bonus{state.bonusAttackUsed ? ' ✓' : ''}
                  </span>
                )}
                <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  state.currentTurn==='player'
                    ? 'bg-cyan-900/50 text-cyan-300 border-cyan-800'
                    : 'bg-red-900/50 text-red-300 border-red-800'}`}>
                  {state.currentTurn==='player' ? `⚔️ Lượt: ${character.name}` : `🐉 Lượt: ${monster?.name}`}
                </span>
              </div>
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
            <div className={`rounded-lg p-3 border animate-in fade-in ${state.winner==='player'?'bg-green-900/30 border-green-700':'bg-red-900/30 border-red-700'}`}>
              <p className={`font-fantasy text-xl font-bold text-center ${state.winner==='player'?'text-green-400':'text-red-400'}`}>
                {state.winner==='player' ? `🏆 ${character.name} chiến thắng!` : `💀 ${monster?.name} chiến thắng!`}
              </p>
              <p className="text-gray-500 text-xs text-center mt-0.5">Sau {state.round} round</p>

              {state.winner==='player' && (
                <div className="mt-3 space-y-1.5">
                  <div className="text-[10px] text-gray-500 uppercase font-bold text-center tracking-wider mb-2">
                    Tiếp tục với HP hiện tại ({playerHp}/{playerMaxHp})?
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleContinueSame} disabled={!monster}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-1.5 bg-dragon-800 border border-dragon-600 text-dragon-gold hover:bg-dragon-700 active:scale-95 transition-all">
                      <Swords size={11} /> Đánh lại con này
                    </button>
                    <button onClick={handleContinueRandom}
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

      {/* Roll / Choice Prompts */}
      {(pendingRoll || pendingChoice) && (
        <div className="px-5 py-3 border-b border-dragon-800">
          {pendingRoll && <RollPrompt config={pendingRoll} onConfirm={handleRollConfirm} />}
          {pendingChoice && (
            <ChoicePrompt
              config={pendingChoice}
              onYes={() => handleChoiceConfirm(pendingChoice.type, true)}
              onNo={() => handleChoiceConfirm(pendingChoice.type, false)}
            />
          )}
        </div>
      )}

      {/* Monster auto-roll indicator */}
      {isActive && !pendingRoll && !pendingChoice && !gmMode && (
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

      {/* Idle placeholder */}
      {state.phase==='idle' && (
        <div className="px-5 py-6 text-center">
          {monster
            ? <p className="text-gray-500 text-sm italic">Nhấn "Bắt đầu chiến đấu" để tung sáng kiến</p>
            : <p className="text-gray-600 text-sm italic">Chọn hoặc random quái vật phía trên để bắt đầu</p>}
        </div>
      )}

      {/* Rest section — only when idle or finished */}
      {(state.phase === 'idle' || state.phase === 'finished') && (
        <div className="px-5 pb-4 border-t border-dragon-800 pt-3">
          <button
            onClick={() => setShowRest(v => !v)}
            className="flex items-center gap-2 text-[11px] font-black uppercase text-gray-500 hover:text-gray-300 transition-colors w-full">
            {showRest ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            <Moon size={11} /> Nghỉ Ngơi
            <span className="ml-auto text-[10px] font-normal text-gray-600 normal-case">
              HP: {state.phase === 'idle' ? playerHp : state.playerHp}/{playerMaxHp}
            </span>
          </button>

          {showRest && (
            <div className="mt-3 space-y-3 animate-in slide-in-from-top-1">
              {/* Short Rest */}
              {pendingRestRoll ? (
                <RollPrompt config={pendingRestRoll} onConfirm={handleRestRollConfirm} />
              ) : (
                <div className="rounded-lg border border-blue-800/60 bg-blue-950/30 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Moon size={13} className="text-blue-400" />
                    <span className="text-blue-300 text-xs font-bold">Short Rest</span>
                    <span className="text-gray-600 text-[10px] ml-auto">Hit die: {getHitDieFormula(character)}</span>
                  </div>
                  <p className="text-gray-500 text-[10px]">
                    Tung hit die để hồi HP. Reset Action Surge &amp; Bonus Attack.
                  </p>
                  <button
                    onClick={handleShortRest}
                    disabled={(state.phase === 'idle' ? playerHp : state.playerHp) >= playerMaxHp}
                    className="w-full py-1.5 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-1.5 bg-blue-900/40 border border-blue-700 text-blue-300 hover:bg-blue-900/60 transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
                    <Dices size={11} /> Tung {getHitDieFormula(character)}
                  </button>
                </div>
              )}

              {/* Long Rest */}
              <div className="rounded-lg border border-amber-800/60 bg-amber-950/30 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Sun size={13} className="text-amber-400" />
                  <span className="text-amber-300 text-xs font-bold">Long Rest</span>
                </div>
                <p className="text-gray-500 text-[10px]">
                  Hồi đầy HP + reset Action Surge, Bonus Action, tất cả tài nguyên.
                </p>
                <button
                  onClick={handleLongRest}
                  className="w-full py-1.5 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-1.5 bg-amber-900/40 border border-amber-700 text-amber-300 hover:bg-amber-900/60 transition-colors active:scale-95">
                  <Sun size={11} /> Long Rest — Hồi đầy HP
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Combat log */}
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
