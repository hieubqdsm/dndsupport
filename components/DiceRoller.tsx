import React, { useState, useRef } from 'react';
import { DICE_TYPES } from '../constants';
import { DiceRoll } from '../types';
import { Dices, RotateCcw, X, History } from 'lucide-react';

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
}

// D6 pip positions (x, y in 0-100 viewBox)
const D6_PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 27], [70, 27], [30, 50], [70, 50], [30, 73], [70, 73]],
};

const DiceOutline: React.FC<{ sides: number }> = ({ sides }) => {
  switch (sides) {
    case 4:  return <polygon points="50,6 94,88 6,88" />;
    case 6:  return <rect x="8" y="8" width="84" height="84" rx="10" />;
    case 8:  return <polygon points="50,4 96,50 50,96 4,50" />;
    case 10: return <polygon points="50,5 94,36 78,92 22,92 6,36" />;
    case 12: return <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" />;
    case 20: return <polygon points="50,4 91,30 91,70 50,96 9,70 9,30" />;
    case 100: return <circle cx="50" cy="50" r="44" />;
    default:  return <circle cx="50" cy="50" r="44" />;
  }
};

// For d4, text centroid is lower (triangle)
const getTextY = (sides: number): string => sides === 4 ? '64' : '50';

const getFontSize = (value: number): string => {
  if (value >= 100) return '22';
  if (value >= 10) return '30';
  return '36';
};

interface DiceVisualProps {
  sides: number;
  value: number;
  isRolling: boolean;
  rotation: number;
}

const DiceVisual: React.FC<DiceVisualProps> = ({ sides, value, isRolling, rotation }) => {
  const isMax = value === sides;
  const isMin = value === 1;

  const fill    = isMax ? '#92400e' : isMin ? '#7f1d1d' : '#1c1917';
  const stroke  = isMax ? '#fbbf24' : isMin ? '#ef4444' : '#a16207';
  const textCol = isMax ? '#fbbf24' : isMin ? '#fca5a5' : '#f5f5f5';

  const showPips = sides === 6 && !isRolling && value >= 1 && value <= 6;

  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: isRolling ? 'none' : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        filter: isMax
          ? 'drop-shadow(0 0 10px rgba(251,191,36,0.8))'
          : isMin
          ? 'drop-shadow(0 0 10px rgba(239,68,68,0.8))'
          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
      }}
      className="w-full h-full"
    >
      <g fill={fill} stroke={stroke} strokeWidth="3.5">
        <DiceOutline sides={sides} />
      </g>

      {showPips ? (
        D6_PIPS[value].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r="6.5" fill={textCol} />
        ))
      ) : (
        <text
          x="50"
          y={getTextY(sides)}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textCol}
          fontSize={getFontSize(value)}
          fontWeight="bold"
          fontFamily="Georgia, serif"
          style={{ userSelect: 'none' }}
        >
          {value}
        </text>
      )}
    </svg>
  );
};

const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<DiceRoll[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState<number>(1);
  const [activeSides, setActiveSides] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const rollingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const rollDice = (sides: number) => {
    if (isRolling) return;
    setIsRolling(true);
    setActiveSides(sides);
    setDisplayValue(Math.floor(Math.random() * sides) + 1);

    rollingInterval.current = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * sides) + 1);
      setRotation(prev => prev + 43);
    }, 55);

    setTimeout(() => {
      if (rollingInterval.current) clearInterval(rollingInterval.current);
      const value = Math.floor(Math.random() * sides) + 1;
      setDisplayValue(value);
      // Settle at a slight random tilt
      setRotation(Math.floor(Math.random() * 24) - 12);

      const newRoll: DiceRoll = {
        id: Math.random().toString(36).substr(2, 9),
        type: sides,
        value,
        timestamp: new Date()
      };
      setHistory(prev => [newRoll, ...prev]);
      setIsRolling(false);
    }, 750);
  };

  const clearHistory = () => setHistory([]);

  if (!isOpen) return null;

  const isMax = activeSides !== null && displayValue === activeSides;
  const isMin = displayValue === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto animate-in fade-in"
        onClick={onClose}
      />

      <div className="bg-dragon-900 w-full sm:w-[400px] rounded-t-2xl sm:rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-4 border-dragon-gold pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-10">

        {/* Header */}
        <div className="p-5 bg-dragon-900 border-b border-dragon-800 flex justify-between items-center">
          <h3 className="text-dragon-gold font-fantasy font-bold text-xl flex items-center gap-3">
            <Dices className="w-6 h-6" /> TRÌNH ĐỔ XÚC XẮC
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Dice type buttons */}
        <div className="p-6 grid grid-cols-4 gap-4 bg-dragon-800/30">
          {DICE_TYPES.map((sides) => (
            <button
              key={sides}
              onClick={() => rollDice(sides)}
              disabled={isRolling}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-xl border-2
                bg-dragon-900 hover:bg-dragon-800 transition-all group
                ${isRolling ? 'opacity-50 cursor-not-allowed' : 'active:scale-90'}
                ${activeSides === sides
                  ? 'border-dragon-gold'
                  : 'border-dragon-700 hover:border-dragon-gold'}
              `}
            >
              <span className="text-[10px] text-gray-500 font-black group-hover:text-dragon-gold uppercase mb-1">
                d{sides}
              </span>
              <Dices className={`w-6 h-6 ${sides === 20 ? 'text-red-500' : 'text-white'}`} />
            </button>
          ))}
        </div>

        {/* Visual dice simulation panel */}
        {activeSides !== null && (
          <div className="bg-dragon-950 px-6 py-5 border-b border-dragon-800 flex items-center gap-6">
            {/* Dice visual */}
            <div className={`w-24 h-24 flex-shrink-0 ${isRolling ? 'animate-bounce' : ''}`}>
              <DiceVisual
                sides={activeSides}
                value={displayValue}
                isRolling={isRolling}
                rotation={rotation}
              />
            </div>

            {/* Result text */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">
                d{activeSides}
              </span>

              {isRolling ? (
                <span className="text-dragon-gold text-sm font-black animate-pulse uppercase tracking-wide">
                  Đang lăn...
                </span>
              ) : (
                <>
                  <span className={`text-5xl font-fantasy font-black leading-none ${
                    isMax
                      ? 'text-dragon-gold drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                      : isMin
                      ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                      : 'text-white'
                  }`}>
                    {displayValue}
                  </span>
                  {isMax && activeSides === 20 && (
                    <span className="text-[11px] text-dragon-gold font-black uppercase animate-pulse tracking-widest">
                      ✦ Bạo Kích! ✦
                    </span>
                  )}
                  {isMax && activeSides !== 20 && (
                    <span className="text-[11px] text-dragon-gold font-black uppercase tracking-widest">
                      Điểm Tối Đa!
                    </span>
                  )}
                  {isMin && (
                    <span className="text-[11px] text-red-500 font-black uppercase tracking-widest">
                      Thất Bại Thảm Hại
                    </span>
                  )}
                  {!isMax && !isMin && (
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest">
                      kết quả
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* History */}
        <div className="flex-1 bg-dragon-950 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b border-dragon-800 pb-2">
            <span className="text-[10px] text-gray-500 uppercase font-black flex items-center gap-2">
              <History size={14} /> Lịch sử tung xúc xắc
            </span>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-red-500 hover:underline uppercase font-bold flex items-center gap-1"
              >
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
                <div
                  key={roll.id}
                  className="flex items-center justify-between bg-dragon-900/50 p-4 rounded-lg border border-dragon-800 animate-in slide-in-from-top-2 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {/* Mini dice icon in history */}
                    <div className="w-9 h-9 flex-shrink-0 opacity-80">
                      <DiceVisual
                        sides={roll.type}
                        value={roll.value}
                        isRolling={false}
                        rotation={0}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 font-black text-[10px] uppercase">
                        d{roll.type}
                      </span>
                      <span className="text-[9px] text-gray-700">
                        {roll.timestamp.toLocaleTimeString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {roll.type === 20 && roll.value === 20 && (
                      <span className="text-[10px] text-dragon-gold font-black animate-pulse uppercase tracking-tighter">
                        Bạo kích!
                      </span>
                    )}
                    {roll.value === 1 && (
                      <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter">
                        Fumble!
                      </span>
                    )}
                    <span className={`text-4xl font-fantasy font-black ${
                      roll.value === roll.type
                        ? 'text-dragon-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : roll.value === 1
                        ? 'text-red-600'
                        : 'text-white'
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
