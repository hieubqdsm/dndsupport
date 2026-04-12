import React, { useState, useMemo } from 'react';
import { Character, Monster } from '../types';
import { OFFLINE_MONSTERS } from '../data/monsterData';
import { Shield, Heart, Zap, Filter, ChevronDown, Swords, Search, Skull, RotateCcw, Activity } from 'lucide-react';

interface Props {
  character: Character;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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
const MONSTER_TYPES = ["Aberration","Beast","Celestial","Construct","Dragon","Elemental","Fey","Fiend","Giant","Humanoid","Monstrosity","Ooze","Plant","Undead"];
const MONSTER_CR = ["0","1/8","1/4","1/2","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18+"];
const MONSTER_SIZES = ["Tiny","Small","Medium","Large","Huge","Gargantuan"];

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

const HpControl: React.FC<{ label: string; current: number; max: number; onChange: (v: number) => void; onReset: () => void }> = ({ label, current, max, onChange, onReset }) => {
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
        <button
          onClick={() => onChange(Math.max(0, current - 1))}
          className="w-7 h-7 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/70 font-bold text-base flex items-center justify-center transition-colors"
        >−</button>
        {editing ? (
          <input
            className="flex-1 text-center bg-black/30 text-white text-sm font-mono rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-dragon-gold border border-dragon-700"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={() => commit(inputVal)}
            onKeyDown={e => { if (e.key === 'Enter') commit(inputVal); if (e.key === 'Escape') setEditing(false); }}
            autoFocus
          />
        ) : (
          <button
            onClick={() => { setInputVal(String(current)); setEditing(true); }}
            className={`flex-1 text-center text-lg font-bold font-mono ${textColor} hover:opacity-80 transition-opacity`}
          >
            {current} <span className="text-gray-500 text-xs font-normal">/ {max}</span>
          </button>
        )}
        <button
          onClick={() => onChange(Math.min(max, current + 1))}
          className="w-7 h-7 rounded-lg bg-green-900/40 text-green-400 hover:bg-green-900/70 font-bold text-base flex items-center justify-center transition-colors"
        >+</button>
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

// ── Player Panel ──────────────────────────────────────────────────────────────

const PlayerPanel: React.FC<{ character: Character }> = ({ character }) => {
  const maxHp = character.hp.max || 1;
  const [hp, setHp] = useState(character.hp.current);

  // sync khi đổi profile
  React.useEffect(() => { setHp(character.hp.current); }, [character.hp.current, character.name]);

  const stats: Record<string, number> = {
    str: character.stats.str.score,
    dex: character.stats.dex.score,
    con: character.stats.con.score,
    int: character.stats.int.score,
    wis: character.stats.wis.score,
    cha: character.stats.cha.score,
  };

  return (
    <div className="bg-dragon-900/60 border border-dragon-600 rounded-xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-dragon-gold font-fantasy text-xl leading-tight">{character.name || 'Nhân vật'}</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {character.className || '—'} · Lv {character.level} · {character.race || '—'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 uppercase">Proficiency</div>
          <div className="text-dragon-gold font-bold font-mono">+{character.proficiencyBonus}</div>
        </div>
      </div>

      {/* HP */}
      <HpControl
        label="Hit Points"
        current={hp}
        max={maxHp}
        onChange={setHp}
        onReset={() => setHp(maxHp)}
      />

      {/* Key stats row */}
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

      {/* Ability scores */}
      <StatBlock stats={stats} color="text-dragon-gold" />

      {/* Attacks */}
      {(character.weapons.length > 0 || character.attacks.length > 0) && (
        <div>
          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1.5 tracking-wider flex items-center gap-1">
            <Swords size={10} /> Tấn công
          </div>
          <div className="space-y-1">
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

      {/* Death saves indicator */}
      {hp === 0 && (
        <div className="bg-red-950/60 border border-red-800 rounded-lg p-2 text-center">
          <span className="text-red-400 text-xs font-bold animate-pulse">💀 HP = 0 — Death Saving Throws!</span>
        </div>
      )}
    </div>
  );
};

// ── Monster Panel ─────────────────────────────────────────────────────────────

const MonsterPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCR, setFilterCR] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Monster | null>(null);
  const [hp, setHp] = useState(0);
  const [maxHp, setMaxHp] = useState(0);

  const filtered = useMemo(() => {
    return OFFLINE_MONSTERS.filter(m => {
      const matchName = !search || m.name.toLowerCase().includes(search.toLowerCase());
      const matchType = !filterType || m.type.toLowerCase().includes(filterType.toLowerCase());
      const matchSize = !filterSize || m.size === filterSize;
      let matchCR = !filterCR;
      if (filterCR === '18+') matchCR = crToNumber(m.challenge) >= 18;
      else if (filterCR) matchCR = m.challenge.startsWith(filterCR + ' ') || m.challenge === filterCR;
      return matchName && matchType && matchSize && matchCR;
    }).sort((a, b) => crToNumber(a.challenge) - crToNumber(b.challenge));
  }, [search, filterType, filterCR, filterSize]);

  const selectMonster = (m: Monster) => {
    const mhp = parseMaxHp(m.hp);
    setSelected(m);
    setHp(mhp);
    setMaxHp(mhp);
  };

  const clearFilters = () => { setFilterType(''); setFilterCR(''); setFilterSize(''); };

  return (
    <div className="bg-[#1a1014]/80 border border-red-900/60 rounded-xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Skull size={16} className="text-red-500" />
        <h2 className="text-red-400 font-fantasy text-xl">Quái Vật</h2>
      </div>

      {/* Search + Filters */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm quái vật..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/30 border border-red-900/50 rounded-lg pl-7 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-700"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${showFilters || filterType || filterCR || filterSize ? 'bg-red-900/40 border-red-700 text-red-300' : 'bg-black/30 border-red-900/50 text-gray-500 hover:text-white'}`}
          >
            <Filter size={13} />
            <ChevronDown size={11} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: filterType, set: setFilterType, opts: MONSTER_TYPES, label: '-- Loại --' },
              { val: filterCR, set: setFilterCR, opts: MONSTER_CR.map(c => ({ v: c, l: `CR ${c}` })), label: '-- CR --' },
              { val: filterSize, set: setFilterSize, opts: MONSTER_SIZES, label: '-- Size --' },
            ].map((f, i) => (
              <select key={i} value={f.val} onChange={e => { (f.set as any)(e.target.value); }}
                className="w-full bg-black/30 border border-red-900/50 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-red-700 appearance-none">
                <option value="">{f.label}</option>
                {Array.isArray(f.opts) && f.opts.map((o: any) =>
                  typeof o === 'string'
                    ? <option key={o} value={o}>{o}</option>
                    : <option key={o.v} value={o.v}>{o.l}</option>
                )}
              </select>
            ))}
          </div>
        )}

        {(filterType || filterCR || filterSize) && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500">{filtered.length} kết quả</span>
            <button onClick={clearFilters} className="text-[10px] text-red-400 underline hover:text-red-300">Xóa bộ lọc</button>
          </div>
        )}

        {/* Monster dropdown list */}
        <div className="max-h-36 overflow-y-auto border border-red-900/40 rounded-lg bg-black/20 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-600 text-xs py-4">Không tìm thấy</div>
          ) : filtered.map((m, i) => (
            <button key={m.name + i} onClick={() => selectMonster(m)}
              className={`w-full text-left px-3 py-1.5 border-b border-gray-800/40 hover:bg-red-900/20 transition-colors text-xs ${selected?.name === m.name ? 'bg-red-900/30 border-l-2 border-l-red-500' : ''}`}
            >
              <span className="text-gray-200 font-semibold">{m.name}</span>
              <span className={`ml-2 ${getCRColor(m.challenge)}`}>CR {m.challenge.split(' ')[0]}</span>
              <span className="ml-2 text-gray-500">{m.size} {m.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Monster Stats */}
      {selected ? (
        <div className="space-y-3">
          <div className="border-b border-red-900/50 pb-2">
            <h3 className="text-red-400 font-fantasy text-lg">{selected.name}</h3>
            <p className="text-gray-500 text-xs italic">{selected.size} {selected.type}, {selected.alignment}</p>
          </div>

          {/* HP */}
          <HpControl
            label="Hit Points"
            current={hp}
            max={maxHp}
            onChange={setHp}
            onReset={() => setHp(maxHp)}
          />

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Shield size={9} /> AC</div>
              <div className="text-white font-bold text-lg font-mono">{selected.ac}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className={`text-[9px] uppercase flex items-center justify-center gap-1 mb-0.5 font-bold ${getCRColor(selected.challenge)}`}>CR</div>
              <div className={`font-bold text-lg font-mono ${getCRColor(selected.challenge)}`}>{selected.challenge.split(' ')[0]}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-2 text-center">
              <div className="text-[9px] text-gray-500 uppercase flex items-center justify-center gap-1 mb-0.5"><Activity size={9} /> Speed</div>
              <div className="text-white font-bold text-sm font-mono">{selected.speed.replace(' ft','')}</div>
            </div>
          </div>

          {/* Ability scores */}
          <StatBlock stats={selected.stats} color="text-red-400" />

          {/* Saves / Skills */}
          <div className="space-y-0.5 text-xs">
            {selected.saves && <div><span className="text-red-400 font-bold">Saves:</span> <span className="text-gray-300">{selected.saves}</span></div>}
            {selected.skills && <div><span className="text-red-400 font-bold">Skills:</span> <span className="text-gray-300">{selected.skills}</span></div>}
            <div><span className="text-red-400 font-bold">Senses:</span> <span className="text-gray-300">{selected.senses}</span></div>
          </div>

          {/* Traits */}
          {selected.traits.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Đặc điểm</div>
              {selected.traits.map((t, i) => (
                <div key={i} className="text-xs text-gray-300 bg-black/20 rounded px-2 py-1">
                  <span className="font-bold text-white italic">{t.name}.</span> {t.desc}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {selected.actions.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-red-400 uppercase font-bold tracking-wider border-t border-red-900/40 pt-2">Hành động</div>
              {selected.actions.map((a, i) => (
                <div key={i} className="text-xs text-gray-300 bg-black/20 rounded px-2 py-1">
                  <span className="font-bold text-white italic">{a.name}.</span> {a.desc}
                </div>
              ))}
            </div>
          )}

          {/* Legendary Actions */}
          {selected.legendaryActions && selected.legendaryActions.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-yellow-500 uppercase font-bold tracking-wider border-t border-yellow-900/40 pt-2">Hành động huyền thoại</div>
              {selected.legendaryActions.map((a, i) => (
                <div key={i} className="text-xs text-gray-300 bg-black/20 rounded px-2 py-1">
                  <span className="font-bold text-white italic">{a.name}.</span> {a.desc}
                </div>
              ))}
            </div>
          )}

          {hp === 0 && (
            <div className="bg-gray-900/80 border border-gray-700 rounded-lg p-2 text-center">
              <span className="text-gray-400 text-xs font-bold">💀 Quái vật đã bị hạ gục!</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-600 space-y-2">
          <Skull size={40} className="opacity-20" />
          <p className="text-xs">Chọn quái vật từ danh sách để bắt đầu</p>
        </div>
      )}
    </div>
  );
};

// ── Arena ─────────────────────────────────────────────────────────────────────

const Arena: React.FC<Props> = ({ character }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* VS Layout: stacked on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Player side */}
        <PlayerPanel character={character} key={character.name} />

        {/* VS divider (mobile: horizontal, lg: hidden — spacing handled by grid gap) */}
        <div className="lg:hidden flex items-center gap-3">
          <div className="flex-1 h-px bg-dragon-700" />
          <div className="flex items-center gap-1 text-dragon-gold font-fantasy text-lg">
            <Swords size={20} /> VS
          </div>
          <div className="flex-1 h-px bg-dragon-700" />
        </div>

        {/* Monster side */}
        <MonsterPanel />
      </div>

      {/* VS divider lg: show between the two cards */}
      <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* intentionally empty — grid gap handles spacing */}
      </div>
    </div>
  );
};

export default Arena;
