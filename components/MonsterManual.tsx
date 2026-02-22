
import React, { useState, useMemo } from 'react';
import { Monster } from '../types';
import { OFFLINE_MONSTERS } from '../data/monsterData';
import { Search, Skull, X, Shield, Heart, Activity, BookOpen, Filter, ChevronDown } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MONSTER_TYPES = [
  "Aberration", "Beast", "Celestial", "Construct", "Dragon", "Elemental",
  "Fey", "Fiend", "Giant", "Humanoid", "Monstrosity", "Ooze", "Plant", "Undead"
];

const MONSTER_SIZES = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];

const MONSTER_CR = [
  "0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18+"
];

function crToNumber(cr: string): number {
  const match = cr.match(/^([\d/]+)/);
  if (!match) return 0;
  const val = match[1];
  if (val.includes('/')) {
    const [a, b] = val.split('/').map(Number);
    return a / b;
  }
  return parseInt(val);
}

const MonsterManual: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterCR, setFilterCR] = useState('');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredMonsters = useMemo(() => {
    return OFFLINE_MONSTERS.filter(m => {
      const matchName = !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = !filterType || m.type.toLowerCase().includes(filterType.toLowerCase());
      const matchSize = !filterSize || m.size === filterSize;
      let matchCR = false;
      if (!filterCR) {
        matchCR = true;
      } else if (filterCR === '18+') {
        matchCR = crToNumber(m.challenge) >= 18;
      } else {
        matchCR = m.challenge.startsWith(filterCR + ' ') || m.challenge.startsWith(filterCR + '/') || m.challenge === filterCR;
      }
      return matchName && matchType && matchSize && matchCR;
    }).sort((a, b) => crToNumber(a.challenge) - crToNumber(b.challenge));
  }, [searchTerm, filterType, filterSize, filterCR]);

  const clearFilters = () => {
    setFilterType('');
    setFilterSize('');
    setFilterCR('');
    setSearchTerm('');
  };

  const getMod = (score: number) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getCRColor = (cr: string) => {
    const n = crToNumber(cr);
    if (n <= 1) return 'text-green-400';
    if (n <= 4) return 'text-yellow-400';
    if (n <= 10) return 'text-orange-400';
    if (n <= 17) return 'text-red-400';
    return 'text-purple-400';
  };

  if (!isOpen) return null;

  const monster = selectedMonster;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-[#1a1c23] w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-900/50 flex flex-col max-h-[90vh] pointer-events-auto relative overflow-hidden">

        {/* Header */}
        <div className="p-4 bg-red-950/50 border-b border-red-900 flex justify-between items-center">
          <h3 className="text-red-400 font-fantasy font-bold text-xl flex items-center gap-3">
            <Skull className="w-6 h-6" /> SỔ TAY QUÁI VẬT
            <span className="text-[10px] font-normal text-gray-500 bg-red-900/30 px-2 py-0.5 rounded">{OFFLINE_MONSTERS.length} quái vật</span>
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-3 bg-[#14161b] border-b border-gray-800 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-[#232730] text-white border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-red-500 placeholder-gray-500"
              placeholder="Tìm quái vật..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setSelectedMonster(null); }}
              autoFocus
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-md text-xs font-bold flex items-center gap-1 border transition-colors ${showFilters || filterType || filterSize || filterCR
                ? 'bg-red-900/50 border-red-700 text-red-300'
                : 'bg-[#232730] border-gray-700 text-gray-400 hover:text-white'
                }`}
            >
              <Filter size={14} />
              <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-3 gap-2">
              <select className="w-full bg-[#232730] text-gray-300 text-xs border border-gray-700 rounded px-2 py-1.5 appearance-none focus:border-red-500 outline-none" value={filterType} onChange={(e) => { setFilterType(e.target.value); setSelectedMonster(null); }}>
                <option value="">-- Loại --</option>
                {MONSTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select className="w-full bg-[#232730] text-gray-300 text-xs border border-gray-700 rounded px-2 py-1.5 appearance-none focus:border-red-500 outline-none" value={filterCR} onChange={(e) => { setFilterCR(e.target.value); setSelectedMonster(null); }}>
                <option value="">-- CR --</option>
                {MONSTER_CR.map(c => <option key={c} value={c}>CR {c}</option>)}
              </select>
              <select className="w-full bg-[#232730] text-gray-300 text-xs border border-gray-700 rounded px-2 py-1.5 appearance-none focus:border-red-500 outline-none" value={filterSize} onChange={(e) => { setFilterSize(e.target.value); setSelectedMonster(null); }}>
                <option value="">-- Size --</option>
                {MONSTER_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {(filterType || filterCR || filterSize) && (
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500">{filteredMonsters.length} kết quả</span>
              <button onClick={clearFilters} className="text-[10px] text-red-400 hover:text-red-300 underline">Xóa bộ lọc</button>
            </div>
          )}
        </div>

        {/* Content: List + Detail */}
        <div className="flex-1 overflow-hidden flex">
          {/* Monster List */}
          <div className={`overflow-y-auto custom-scrollbar border-r border-gray-800 bg-[#14161b] ${monster ? 'w-1/3 min-w-[160px]' : 'w-full'}`}>
            {filteredMonsters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4 opacity-50 min-h-[200px] p-4">
                <BookOpen size={48} />
                <p className="text-xs text-center">Không tìm thấy quái vật</p>
              </div>
            ) : (
              filteredMonsters.map((m, i) => (
                <button
                  key={m.name + i}
                  onClick={() => setSelectedMonster(m)}
                  className={`w-full text-left px-3 py-2 border-b border-gray-800/50 hover:bg-red-900/20 transition-colors ${selectedMonster?.name === m.name ? 'bg-red-900/30 border-l-2 border-l-red-500' : ''
                    }`}
                >
                  <div className="text-xs font-bold text-gray-200 truncate">{m.name}</div>
                  <div className="text-[10px] text-gray-500 flex gap-2">
                    <span className={getCRColor(m.challenge)}>CR {m.challenge.split(' ')[0]}</span>
                    <span>{m.size} {m.type}</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Monster Detail */}
          {monster && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar bg-[#1a1c23]">
              <div className="space-y-4">
                <div className="border-b-4 border-red-900 pb-3">
                  <h2 className="text-2xl font-fantasy font-bold text-red-500 tracking-wide">{monster.name}</h2>
                  <p className="text-xs italic text-gray-400 mt-1">{monster.size} {monster.type}, {monster.alignment}</p>
                </div>

                {monster.description && (
                  <p className="text-xs text-gray-400 italic bg-black/20 p-2 rounded border-l-2 border-red-900/50">{monster.description}</p>
                )}

                <div className="grid grid-cols-3 gap-3 text-xs text-gray-300">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold"><Shield size={14} /> AC: <span className="text-white font-mono">{monster.ac}</span></div>
                  <div className="flex items-center gap-1.5 text-green-500 font-bold"><Heart size={14} /> HP: <span className="text-white font-mono">{monster.hp}</span></div>
                  <div className="flex items-center gap-1.5 text-yellow-500 font-bold"><Activity size={14} /> <span className="text-white font-mono text-[10px]">{monster.speed}</span></div>
                </div>

                <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-3">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
                    {Object.entries(monster.stats).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[9px] font-bold text-red-400 uppercase">{key}</span>
                        <span className="text-sm font-bold text-white font-mono">{val as number} <span className="text-[10px] text-gray-500">({getMod(val as number)})</span></span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  {monster.saves && <div className="text-gray-300"><strong className="text-red-400">Saves:</strong> {monster.saves}</div>}
                  {monster.skills && <div className="text-gray-300"><strong className="text-red-400">Skills:</strong> {monster.skills}</div>}
                  <div className="text-gray-300"><strong className="text-red-400">Giác quan:</strong> {monster.senses}</div>
                  <div className="text-gray-300"><strong className="text-red-400">Ngôn ngữ:</strong> {monster.languages}</div>
                  <div className="text-gray-300"><strong className="text-red-400">Challenge:</strong> {monster.challenge}</div>
                </div>

                <div className="h-px bg-red-900/50 w-full" />

                {monster.traits && monster.traits.length > 0 && (
                  <div className="space-y-2">
                    {monster.traits.map((trait, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-bold text-white italic">{trait.name}.</span> <span className="text-gray-300">{trait.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {monster.actions && monster.actions.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-base font-fantasy font-bold text-red-500 border-b border-red-900 mb-2 pb-1">Hành động</h3>
                    <div className="space-y-2">
                      {monster.actions.map((action, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-bold text-white italic">{action.name}.</span> <span className="text-gray-300">{action.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {monster.legendaryActions && monster.legendaryActions.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-base font-fantasy font-bold text-red-500 border-b border-red-900 mb-2 pb-1">Hành động huyền thoại</h3>
                    <div className="space-y-2">
                      {monster.legendaryActions.map((action, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-bold text-white italic">{action.name}.</span> <span className="text-gray-300">{action.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonsterManual;
