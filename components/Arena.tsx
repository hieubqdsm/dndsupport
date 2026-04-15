import React, { useState, useEffect } from 'react';
import { Character, Monster } from '../types';
import { Shield, Heart, Zap, Swords, Skull, RotateCcw, Activity } from 'lucide-react';
import CombatSim from './CombatSim';

interface Props {
  character: Character;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseMaxHp(hpStr: string): number {
  const m = hpStr.match(/^(\d+)/);
  return m ? parseInt(m[1]) : 10;
}

function getMod(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function crToNumber(cr: string): number {
  const match = cr.match(/^([\d/]+)/);
  if (!match) return 0;
  const val = match[1];
  if (val.includes('/')) { const [a, b] = val.split('/').map(Number); return a / b; }
  return parseInt(val);
}

function getCRColor(cr: string) {
  const n = crToNumber(cr);
  if (n <= 1) return 'text-green-400';
  if (n <= 4) return 'text-yellow-400';
  if (n <= 10) return 'text-orange-400';
  return 'text-red-400';
}

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

// Replicate the same effective-stats logic as CharacterSheet so Arena displays accurate values
function computeEffectiveStats(character: Character): Record<string, number> {
  const res: Record<string, number> = {};
  ABILITY_KEYS.forEach(key => {
    let score = Number(character.stats[key as keyof typeof character.stats]?.score) || 10;
    // Racial bonuses
    score += Number(character.racialBonuses?.[key]) || 0;
    // ASI choices
    if (character.asiChoices) {
      Object.values(character.asiChoices).forEach((choice: any) => {
        if (choice?.type === 'asi') {
          if (choice.ability1 === key) score += Number(choice.amount1) || 0;
          if (choice.ability2 === key) score += Number(choice.amount2) || 0;
        }
      });
    }
    // Active magic item bonuses
    (character.magicItems || []).forEach(item => {
      if (item.requiresAttunement && !item.attuned) return;
      score += Number(item.statBonuses?.[key]) || 0;
    });
    res[key] = score;
  });
  return res;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const HpBar: React.FC<{ current: number; max: number }> = ({ current, max }) => {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  const color = pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-300 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
};

interface HpControlProps {
  label: string;
  current: number;
  max: number;
  onChange: (v: number) => void;
  onReset: () => void;
}

const HpControl: React.FC<HpControlProps> = ({ label, current, max, onChange, onReset }) => {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const pct = max > 0 ? Math.round((current / max) * 100) : 0;
  const textColor = pct > 50 ? 'text-green-400' : pct > 25 ? 'text-yellow-400' : 'text-red-400';

  const commit = (raw: string) => {
    const v = parseInt(raw);
    if (!isNaN(v)) onChange(Math.max(0, Math.min(max, v)));
    setEditing(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
        <span className="font-bold uppercase tracking-wider flex items-center gap-1"><Heart size={10} /> {label}</span>
        <button onClick={onReset} title="Reset HP" className="hover:text-dragon-gold transition-colors"><RotateCcw size={10} /></button>
      </div>
      <HpBar current={current} max={max} />
      <div className="flex items-center gap-2 mt-1">
        <button onClick={() => onChange(Math.max(0, current - 1))}
          className="w-7 h-7 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/70 font-bold text-base flex items-center justify-center transition-colors">−</button>
        {editing ? (
          <input className="flex-1 text-center bg-black/30 text-white text-sm font-mono rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-dragon-gold border border-dragon-700"
            value={inputVal} onChange={e => setInputVal(e.target.value)}
            onBlur={() => commit(inputVal)}
            onKeyDown={e => { if (e.key === 'Enter') commit(inputVal); if (e.key === 'Escape') setEditing(false); }}
            autoFocus />
        ) : (
          <button onClick={() => { setInputVal(String(current)); setEditing(true); }}
            className={`flex-1 text-center text-lg font-bold font-mono ${textColor} hover:opacity-80 transition-opacity`}>
            {current} <span className="text-gray-500 text-xs font-normal">/ {max}</span>
          </button>
        )}
        <button onClick={() => onChange(Math.min(max, current + 1))}
          className="w-7 h-7 rounded-lg bg-green-900/40 text-green-400 hover:bg-green-900/70 font-bold text-base flex items-center justify-center transition-colors">+</button>
      </div>
    </div>
  );
};

const StatBlock: React.FC<{ stats: Record<string, number>; color: string }> = ({ stats, color }) => (
  <div className="grid grid-cols-6 gap-1 text-center">
    {ABILITY_KEYS.map(key => (
      <div key={key} className="bg-black/20 rounded-lg py-1.5">
        <div className={`text-[9px] font-bold uppercase ${color}`}>{key}</div>
        <div className="text-white font-bold text-sm font-mono">{stats[key]}</div>
        <div className="text-gray-500 text-[10px] font-mono">{getMod(stats[key])}</div>
      </div>
    ))}
  </div>
);

// ── Shared panel layout skeleton ──────────────────────────────────────────────
// Both panels use the same section order so HP bars sit at the same y-position:
//   [header: name + badge]  ← min-h-[64px] ensures alignment
//   [HpControl]
//   [3-col combat stats]
//   [StatBlock 6-col]
//   [extra section — scrollable]

// ── Player Panel ──────────────────────────────────────────────────────────────

interface PlayerPanelProps {
  character: Character;
  hp: number;
  maxHp: number;
  onHpChange: (v: number) => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ character, hp, maxHp, onHpChange }) => {
  // Use effective stats (base + racial + ASI + magic items) same as CharacterSheet
  const stats = computeEffectiveStats(character);

  return (
    <div className="bg-dragon-900/60 border border-dragon-600 rounded-xl p-4 flex flex-col gap-3 h-full">

      {/* ① Header — fixed height to align with monster header */}
      <div className="flex items-start justify-between min-h-[56px]">
        <div className="min-w-0 mr-2">
          <h2 className="text-dragon-gold font-fantasy text-xl leading-tight truncate">{character.name || 'Nhân vật'}</h2>
          <p className="text-gray-400 text-xs mt-0.5 leading-snug">
            {character.className || '—'} · Lv {character.level}
            {character.race ? ` · ${character.race}` : ''}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Proficiency</div>
          <div className="text-dragon-gold font-bold font-mono text-lg leading-none mt-0.5">+{character.proficiencyBonus}</div>
        </div>
      </div>

      {/* ② HP — aligned with monster HP */}
      <HpControl label="Hit Points" current={hp} max={maxHp} onChange={onHpChange} onReset={() => onHpChange(maxHp)} />

      {/* ③ Combat stats — same 3-col grid as monster */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Shield size={9} /> AC</div>
          <div className="text-white font-bold text-lg font-mono">{character.ac}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Zap size={9} /> Init</div>
          <div className="text-white font-bold text-lg font-mono">{character.initiative >= 0 ? '+' : ''}{character.initiative}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Activity size={9} /> Speed</div>
          <div className="text-white font-bold text-lg font-mono">{character.speed}</div>
        </div>
      </div>

      {/* ④ Stats — same 6-col grid */}
      <StatBlock stats={stats} color="text-dragon-gold" />

      {/* ⑤ Extra: weapons / attacks */}
      {(character.weapons.length > 0 || character.attacks.length > 0) && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1.5 tracking-wider flex items-center gap-1 shrink-0">
            <Swords size={10} /> Tấn công
          </div>
          <div className="space-y-1 overflow-y-auto custom-scrollbar">
            {character.weapons.map((w, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-black/20 rounded px-2 py-1">
                <span className="text-gray-200 truncate mr-2">{w.customName || w.weaponId}</span>
                <span className="text-dragon-gold font-mono shrink-0">{w.attackBonus >= 0 ? '+' : ''}{w.attackBonus} · {w.damageFormula}</span>
              </div>
            ))}
            {character.attacks.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-black/20 rounded px-2 py-1">
                <span className="text-gray-200 truncate mr-2">{a.name}</span>
                <span className="text-dragon-gold font-mono shrink-0">+{a.bonus} · {a.damage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hp === 0 && (
        <div className="bg-red-950/60 border border-red-800 rounded-lg p-2 text-center shrink-0">
          <span className="text-red-400 text-xs font-bold animate-pulse">💀 HP = 0 — Death Saving Throws!</span>
        </div>
      )}
    </div>
  );
};

// ── Monster Panel ─────────────────────────────────────────────────────────────

interface MonsterPanelProps {
  selected: Monster | null;
  hp: number;
  maxHp: number;
  onHpChange: (v: number) => void;
}

const MonsterPanel: React.FC<MonsterPanelProps> = ({ selected, hp, maxHp, onHpChange }) => {
  return (
    <div className="bg-[#1a1014]/80 border border-red-900/60 rounded-xl p-4 flex flex-col gap-3 h-full">

      {selected ? (
        <>
          {/* ① Header — same min-h as player header */}
          <div className="flex items-start justify-between min-h-[56px]">
            <div className="min-w-0 mr-2">
              <h3 className="text-red-400 font-fantasy text-xl leading-tight truncate">{selected.name}</h3>
              <p className="text-gray-500 text-xs italic mt-0.5 leading-snug">{selected.size} {selected.type}, {selected.alignment}</p>
            </div>
            <div className="text-right shrink-0">
              <div className={`text-[10px] uppercase font-bold tracking-wider ${getCRColor(selected.challenge)}`}>CR</div>
              <div className={`font-bold font-mono text-lg leading-none mt-0.5 ${getCRColor(selected.challenge)}`}>
                {selected.challenge.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* ② HP — aligned with player HP */}
          <HpControl label="Hit Points" current={hp} max={maxHp} onChange={onHpChange} onReset={() => onHpChange(maxHp)} />

          {/* ③ Combat stats — same 3-col grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Shield size={9} /> AC</div>
              <div className="text-white font-bold text-lg font-mono">{selected.ac.match(/^(\d+)/)?.[1] ?? selected.ac}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Zap size={9} /> Init</div>
              <div className="text-white font-bold text-lg font-mono">
                {(() => { const m = Math.floor((selected.stats.dex - 10) / 2); return (m >= 0 ? '+' : '') + m; })()}
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Activity size={9} /> Speed</div>
              <div className="text-white font-bold text-sm font-mono leading-tight">{selected.speed.replace(' ft', '')}</div>
            </div>
          </div>

          {/* ④ Stats — same 6-col grid */}
          <StatBlock stats={selected.stats} color="text-red-400" />

          {/* ⑤ Extra: saves / senses / traits / actions — scrollable */}
          <div className="flex-1 flex flex-col min-h-0 space-y-2 overflow-y-auto custom-scrollbar">
            {(selected.saves || selected.skills) && (
              <div className="space-y-0.5 text-xs shrink-0">
                {selected.saves && <div><span className="text-red-400 font-bold">Saves:</span> <span className="text-gray-300">{selected.saves}</span></div>}
                {selected.skills && <div><span className="text-red-400 font-bold">Skills:</span> <span className="text-gray-300">{selected.skills}</span></div>}
              </div>
            )}
            <div className="text-xs shrink-0">
              <span className="text-red-400 font-bold">Senses:</span> <span className="text-gray-300">{selected.senses}</span>
            </div>

            {selected.traits.length > 0 && (
              <div className="space-y-1 shrink-0">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Đặc điểm</div>
                {selected.traits.map((t, i) => (
                  <div key={i} className="text-xs text-gray-300 bg-black/20 rounded px-2 py-1">
                    <span className="font-bold text-white italic">{t.name}.</span> {t.desc}
                  </div>
                ))}
              </div>
            )}

            {selected.actions.length > 0 && (
              <div className="space-y-1 shrink-0">
                <div className="text-[10px] text-red-400 uppercase font-bold tracking-wider border-t border-red-900/40 pt-2">Hành động</div>
                {selected.actions.map((a, i) => (
                  <div key={i} className="text-xs text-gray-300 bg-black/20 rounded px-2 py-1">
                    <span className="font-bold text-white italic">{a.name}.</span> {a.desc}
                  </div>
                ))}
              </div>
            )}

            {selected.legendaryActions && selected.legendaryActions.length > 0 && (
              <div className="space-y-1 shrink-0">
                <div className="text-[10px] text-yellow-500 uppercase font-bold tracking-wider border-t border-yellow-900/40 pt-2">Hành động huyền thoại</div>
                {selected.legendaryActions.map((a, i) => (
                  <div key={i} className="text-xs text-gray-300 bg-black/20 rounded px-2 py-1">
                    <span className="font-bold text-white italic">{a.name}.</span> {a.desc}
                  </div>
                ))}
              </div>
            )}
          </div>

          {hp === 0 && (
            <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-2 text-center shrink-0">
              <span className="text-gray-400 text-xs font-bold">💀 Quái vật đã bị hạ gục!</span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Placeholder — same header height so layout is consistent */}
          <div className="flex items-center gap-2 min-h-[56px]">
            <Skull size={18} className="text-red-800 shrink-0" />
            <div>
              <div className="text-red-800 font-fantasy text-xl leading-tight">Quái Vật</div>
              <div className="text-gray-700 text-xs mt-0.5">Chưa chọn</div>
            </div>
          </div>
          {/* Placeholder HP bar area */}
          <div className="space-y-1.5 opacity-20 pointer-events-none">
            <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1"><Heart size={10} /> Hit Points</span>
            </div>
            <div className="w-full h-2.5 bg-black/40 rounded-full" />
            <div className="flex items-center gap-2 mt-1">
              <div className="w-7 h-7 rounded-lg bg-red-900/20" />
              <div className="flex-1 text-center text-lg font-bold font-mono text-gray-700">— / —</div>
              <div className="w-7 h-7 rounded-lg bg-green-900/20" />
            </div>
          </div>
          {/* Placeholder combat stats */}
          <div className="grid grid-cols-3 gap-2 opacity-20">
            {['AC','Init','Speed'].map(label => (
              <div key={label} className="bg-black/30 rounded-lg p-2 text-center">
                <div className="text-[9px] text-gray-600 uppercase mb-0.5">{label}</div>
                <div className="text-gray-700 font-bold text-lg font-mono">—</div>
              </div>
            ))}
          </div>
          {/* Placeholder stats */}
          <div className="grid grid-cols-6 gap-1 opacity-20">
            {ABILITY_KEYS.map(k => (
              <div key={k} className="bg-black/20 rounded-lg py-1.5 text-center">
                <div className="text-[9px] text-gray-700 uppercase">{k}</div>
                <div className="text-gray-700 font-bold text-sm">—</div>
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-4 text-gray-600 gap-2">
            <Skull size={36} className="opacity-10" />
            <p className="text-xs">Chọn quái vật từ danh sách để bắt đầu</p>
          </div>
        </>
      )}
    </div>
  );
};

// ── Arena ─────────────────────────────────────────────────────────────────────

const Arena: React.FC<Props> = ({ character }) => {
  const playerMaxHp = character.hp.max || 1;
  const [playerHp, setPlayerHp] = useState(character.hp.current);

  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [monsterHp, setMonsterHp] = useState(0);
  const [monsterMaxHp, setMonsterMaxHp] = useState(0);

  useEffect(() => {
    setPlayerHp(character.hp.current);
  }, [character.name, character.hp.current]);

  const handleSelectMonster = (m: Monster) => {
    const mhp = parseMaxHp(m.hp);
    setSelectedMonster(m);
    setMonsterHp(mhp);
    setMonsterMaxHp(mhp);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* VS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:items-start">
        <PlayerPanel
          character={character}
          hp={playerHp}
          maxHp={playerMaxHp}
          onHpChange={setPlayerHp}
        />

        <div className="lg:hidden flex items-center gap-3">
          <div className="flex-1 h-px bg-dragon-700" />
          <div className="flex items-center gap-1 text-dragon-gold font-fantasy text-lg">
            <Swords size={20} /> VS
          </div>
          <div className="flex-1 h-px bg-dragon-700" />
        </div>

        <MonsterPanel
          selected={selectedMonster}
          hp={monsterHp}
          maxHp={monsterMaxHp}
          onHpChange={setMonsterHp}
        />
      </div>

      {/* Combat Simulator */}
      <CombatSim
        character={character}
        monster={selectedMonster}
        playerHp={playerHp}
        playerMaxHp={playerMaxHp}
        monsterHp={monsterHp}
        monsterMaxHp={monsterMaxHp}
        onPlayerHpChange={setPlayerHp}
        onMonsterHpChange={setMonsterHp}
        onMonsterSelect={handleSelectMonster}
      />
    </div>
  );
};

export default Arena;
