
import React, { useState } from 'react';
import { Character } from './types';
import { BLANK_CHARACTER_VN } from './constants';
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import { Dices, Sword, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  // Bắt đầu với hồ sơ trống
  const [character, setCharacter] = useState<Character>(BLANK_CHARACTER_VN);
  const [showDice, setShowDice] = useState(false);

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sạch hồ sơ này không? Mọi dữ liệu sẽ bị mất.")) {
      setCharacter(BLANK_CHARACTER_VN);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white font-sans selection:bg-dragon-gold selection:text-black pb-20">

      {/* Top Navigation Bar */}
      <nav className="border-b border-dragon-800 bg-dragon-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-dragon-gold p-1.5 rounded-lg shadow-lg shadow-yellow-900/20">
                <Sword className="text-black w-6 h-6" />
              </div>
              <div>
                <span className="text-xl text-dragon-gold font-fantasy tracking-wider block leading-none">DragonScroll</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">D&D 5E Hồ Sơ Nhân Vật</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleReset}
                title="Làm mới hồ sơ"
                className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-dragon-800 transition-all border border-transparent"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowDice(true)}
                className="flex items-center gap-2 bg-dragon-gold text-black px-4 py-2 rounded-md text-xs font-black hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-600/10 active:scale-95"
              >
                <Dices className="w-5 h-5" />
                <span className="hidden sm:inline uppercase">ĐỔ XÚC XẮC</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CharacterSheet character={character} updateCharacter={setCharacter} />
      </main>

      {/* Persistent Dice Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button
          onClick={() => setShowDice(true)}
          className="bg-dragon-gold text-black p-4 rounded-full shadow-2xl shadow-black hover:scale-110 transition-transform active:rotate-45"
        >
          <Dices className="w-8 h-8" />
        </button>
      </div>

      <DiceRoller isOpen={showDice} onClose={() => setShowDice(false)} />

    </div>
  );
};

export default App;