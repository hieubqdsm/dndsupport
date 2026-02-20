import React, { useState, useRef } from 'react';
import { DICE_TYPES } from '../constants';
import { DiceRoll } from '../types';
import { Dices, RotateCcw, X, History } from 'lucide-react';

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<DiceRoll[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = (sides: number) => {
    setIsRolling(true);
    setTimeout(() => {
      const value = Math.floor(Math.random() * sides) + 1;
      const newRoll: DiceRoll = {
        id: Math.random().toString(36).substr(2, 9),
        type: sides,
        value,
        timestamp: new Date()
      };
      setHistory(prev => [newRoll, ...prev]);
      setIsRolling(false);
    }, 400);
  };

  const clearHistory = () => setHistory([]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto animate-in fade-in" onClick={onClose} />
      
      <div className="bg-dragon-900 w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-4 border-dragon-gold pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-10">
        
        <div className="p-5 bg-dragon-900 border-b border-dragon-800 flex justify-between items-center">
          <h3 className="text-dragon-gold font-fantasy font-bold text-xl flex items-center gap-3">
            <Dices className="w-6 h-6" /> TRÌNH ĐỔ XÚC XẮC
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-4 gap-4 bg-dragon-800/30">
          {DICE_TYPES.map((sides) => (
            <button
              key={sides}
              onClick={() => rollDice(sides)}
              disabled={isRolling}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dragon-700
                bg-dragon-900 hover:bg-dragon-800 hover:border-dragon-gold transition-all group
                ${isRolling ? 'opacity-50 cursor-not-allowed' : 'active:scale-90 active:bg-dragon-gold active:text-black'}
              `}
            >
              <span className="text-[10px] text-gray-500 font-black group-hover:text-dragon-gold uppercase mb-1">d{sides}</span>
              <Dices className={`w-6 h-6 ${sides === 20 ? 'text-red-500' : 'text-white'}`} />
            </button>
          ))}
        </div>

        <div className="flex-1 bg-dragon-950 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b border-dragon-800 pb-2">
            <span className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
              <History size={14}/> Lịch sử tung xúc xắc
            </span>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-[10px] text-red-500 hover:underline uppercase font-bold flex items-center gap-1">
                <RotateCcw size={12} /> Xóa sạch
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center text-gray-700 py-12 text-sm italic font-serif opacity-50">
                "Số phận nằm trong tay bạn..."
              </div>
            ) : (
              history.map((roll) => (
                <div key={roll.id} className="flex items-center justify-between bg-dragon-900/50 p-4 rounded-lg border border-dragon-800 animate-in slide-in-from-top-2 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 font-black text-[10px] uppercase">Loại xúc xắc: d{roll.type}</span>
                    <span className="text-[9px] text-gray-700">{roll.timestamp.toLocaleTimeString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {roll.type === 20 && roll.value === 20 && (
                      <span className="text-[10px] text-dragon-gold font-black animate-pulse uppercase tracking-tighter">Bạo kích!</span>
                    )}
                    <span className={`text-4xl font-fantasy font-black ${
                      roll.value === roll.type ? 'text-dragon-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 
                      roll.value === 1 ? 'text-red-600' : 'text-white'
                    }`}>
                      {roll.value}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;