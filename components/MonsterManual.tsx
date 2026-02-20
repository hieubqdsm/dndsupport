
import React, { useState } from 'react';
import { Monster } from '../types';
import { lookupMonsterVN } from '../services/geminiService';
import { Search, Skull, X, Shield, Heart, Activity, Footprints, BookOpen, Loader2, Filter } from 'lucide-react';

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
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "30"
];

const MonsterManual: React.FC<Props> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [filterCR, setFilterCR] = useState('');
  
  const [monster, setMonster] = useState<Monster | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    // Cho phép tìm kiếm nếu có từ khóa HOẶC có ít nhất một bộ lọc được chọn
    if (!searchTerm.trim() && !filterType && !filterSize && !filterCR) return;
    
    setLoading(true);
    setError('');
    setMonster(null);

    const data = await lookupMonsterVN(searchTerm, {
      type: filterType,
      size: filterSize,
      cr: filterCR
    });

    if (data) {
      setMonster(data);
    } else {
      setError('Không tìm thấy quái vật phù hợp hoặc hệ thống đang bận.');
    }
    setLoading(false);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="bg-[#1a1c23] w-full max-w-2xl rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.3)] border border-red-900/50 flex flex-col max-h-[90vh] pointer-events-auto transform transition-all duration-300 animate-in zoom-in-95 relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-red-950/50 border-b border-red-900 flex justify-between items-center">
          <h3 className="text-red-400 font-fantasy font-bold text-xl flex items-center gap-3">
            <Skull className="w-6 h-6" /> SỔ TAY QUÁI VẬT
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 bg-[#14161b] border-b border-gray-800 space-y-3">
           <div className="flex gap-2">
             <input 
               type="text" 
               className="flex-1 bg-[#232730] text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:border-red-500 placeholder-gray-500"
               placeholder="Tên quái vật (Để trống để AI tự gợi ý)..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
             />
             <button 
               onClick={handleSearch}
               disabled={loading}
               className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md font-bold disabled:opacity-50 flex items-center justify-center min-w-[50px] shadow-lg shadow-red-900/20"
             >
               {loading ? <Loader2 className="animate-spin" /> : <Search />}
             </button>
           </div>
           
           {/* Filter Controls */}
           <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <select 
                  className="w-full bg-[#232730] text-gray-300 text-xs border border-gray-700 rounded px-2 py-1.5 appearance-none focus:border-red-500 outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">-- Loại (Type) --</option>
                  {MONSTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <Filter size={10} className="absolute right-2 top-2 text-gray-500 pointer-events-none"/>
              </div>

              <div className="relative">
                <select 
                  className="w-full bg-[#232730] text-gray-300 text-xs border border-gray-700 rounded px-2 py-1.5 appearance-none focus:border-red-500 outline-none"
                  value={filterCR}
                  onChange={(e) => setFilterCR(e.target.value)}
                >
                  <option value="">-- Độ khó (CR) --</option>
                  {MONSTER_CR.map(c => <option key={c} value={c}>CR {c}</option>)}
                </select>
                <Filter size={10} className="absolute right-2 top-2 text-gray-500 pointer-events-none"/>
              </div>

              <div className="relative">
                <select 
                  className="w-full bg-[#232730] text-gray-300 text-xs border border-gray-700 rounded px-2 py-1.5 appearance-none focus:border-red-500 outline-none"
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                >
                  <option value="">-- Kích cỡ (Size) --</option>
                  {MONSTER_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Filter size={10} className="absolute right-2 top-2 text-gray-500 pointer-events-none"/>
              </div>
           </div>
           
           {(filterType || filterCR || filterSize) && (
             <div className="flex justify-end">
                <button onClick={clearFilters} className="text-[10px] text-red-400 hover:text-red-300 underline">Xóa bộ lọc</button>
             </div>
           )}

           {error && <p className="text-red-500 text-xs mt-1 italic">{error}</p>}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#1a1c23]">
          {!monster && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4 opacity-50 min-h-[300px]">
               <BookOpen size={64} />
               <p className="font-fantasy text-lg text-center px-8">"Nhập tên hoặc chọn bộ lọc để triệu hồi thông tin quái vật..."</p>
            </div>
          )}

          {loading && (
             <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                <Loader2 size={48} className="text-red-500 animate-spin mb-4" />
                <p className="text-red-400 animate-pulse font-fantasy">Đang triệu hồi thông tin...</p>
             </div>
          )}

          {monster && (
            <div className="space-y-6 animate-in slide-in-from-bottom-5">
               {/* Stat Block Header */}
               <div className="border-b-4 border-red-900 pb-4">
                  <h2 className="text-3xl font-fantasy font-bold text-red-500 tracking-wide">{monster.name}</h2>
                  <p className="text-sm italic text-gray-400 mt-1">{monster.size} {monster.type}, {monster.alignment}</p>
               </div>

               {/* Flavor Text */}
               {monster.description && (
                 <p className="text-sm text-gray-400 italic bg-black/20 p-3 rounded border-l-2 border-red-900/50">
                   {monster.description}
                 </p>
               )}

               {/* Core Stats */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2 text-red-400 font-bold"><Shield size={16}/> AC: <span className="text-white font-mono">{monster.ac}</span></div>
                  <div className="flex items-center gap-2 text-green-500 font-bold"><Heart size={16}/> HP: <span className="text-white font-mono">{monster.hp}</span></div>
                  <div className="flex items-center gap-2 text-yellow-500 font-bold"><Activity size={16}/> Tốc độ: <span className="text-white font-mono">{monster.speed}</span></div>
               </div>

               {/* Ability Scores */}
               <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                     {Object.entries(monster.stats).map(([key, val]) => (
                       <div key={key} className="flex flex-col">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{key}</span>
                          <span className="text-lg font-bold text-white font-mono">{val as number} <span className="text-xs text-gray-500">({getMod(val as number)})</span></span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Skills & Senses */}
               <div className="space-y-2 text-sm">
                  {monster.saves && <div className="text-gray-300"><strong className="text-red-400">Saving Throws:</strong> {monster.saves}</div>}
                  {monster.skills && <div className="text-gray-300"><strong className="text-red-400">Kỹ năng:</strong> {monster.skills}</div>}
                  <div className="text-gray-300"><strong className="text-red-400">Giác quan:</strong> {monster.senses}</div>
                  <div className="text-gray-300"><strong className="text-red-400">Ngôn ngữ:</strong> {monster.languages}</div>
                  <div className="text-gray-300"><strong className="text-red-400">Độ khó (Challenge):</strong> {monster.challenge}</div>
               </div>

               <div className="h-px bg-red-900/50 w-full my-4"></div>

               {/* Abilities (Traits) */}
               {monster.traits && monster.traits.length > 0 && (
                 <div className="space-y-3">
                    {monster.traits.map((trait, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-bold text-white italic">{trait.name}.</span> <span className="text-gray-300">{trait.desc}</span>
                      </div>
                    ))}
                 </div>
               )}

               {/* Actions */}
               {monster.actions && monster.actions.length > 0 && (
                 <div className="pt-4">
                    <h3 className="text-xl font-fantasy font-bold text-red-500 border-b border-red-900 mb-3 pb-1">Hành động</h3>
                    <div className="space-y-4">
                      {monster.actions.map((action, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-bold text-white italic">{action.name}.</span> <span className="text-gray-300">{action.desc}</span>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {/* Legendary Actions */}
               {monster.legendaryActions && monster.legendaryActions.length > 0 && (
                 <div className="pt-4">
                    <h3 className="text-xl font-fantasy font-bold text-red-500 border-b border-red-900 mb-3 pb-1">Hành động huyền thoại</h3>
                    <div className="space-y-4">
                      {monster.legendaryActions.map((action, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-bold text-white italic">{action.name}.</span> <span className="text-gray-300">{action.desc}</span>
                        </div>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonsterManual;
