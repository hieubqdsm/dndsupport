
import React, { useState, useEffect, useRef } from 'react';
import { Character } from './types';
import { BLANK_CHARACTER_VN } from './constants';
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import { Dices, Sword, RotateCcw, Save, FolderOpen, Trash2, Plus, ChevronDown, X, Download, Upload } from 'lucide-react';

const STORAGE_KEY = 'dragonscroll_profiles';
const ACTIVE_KEY = 'dragonscroll_active';
const AUTOSAVE_KEY = 'dragonscroll_autosave';

interface SavedProfile {
  id: string;
  name: string;
  character: Character;
  updatedAt: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

function loadProfiles(): SavedProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveProfiles(profiles: SavedProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<SavedProfile[]>(() => loadProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY);
  });
  const [character, setCharacter] = useState<Character>(() => {
    // Load last active profile or autosave
    const activeId = localStorage.getItem(ACTIVE_KEY);
    if (activeId) {
      const profs = loadProfiles();
      const found = profs.find(p => p.id === activeId);
      if (found) return found.character;
    }
    // Try autosave
    try {
      const auto = localStorage.getItem(AUTOSAVE_KEY);
      if (auto) return JSON.parse(auto);
    } catch { }
    return BLANK_CHARACTER_VN;
  });

  const [showDice, setShowDice] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Autosave character on every change
  useEffect(() => {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(character));
    // Also update active profile if one is selected
    if (activeProfileId) {
      setProfiles(prev => {
        const updated = prev.map(p =>
          p.id === activeProfileId
            ? { ...p, character, updatedAt: new Date().toISOString() }
            : p
        );
        saveProfiles(updated);
        return updated;
      });
    }
  }, [character, activeProfileId]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const handleSaveAs = () => {
    const name = saveAsName.trim() || character.name || 'Nhân vật mới';
    const newProfile: SavedProfile = {
      id: generateId(),
      name,
      character,
      updatedAt: new Date().toISOString(),
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveProfiles(updated);
    setActiveProfileId(newProfile.id);
    localStorage.setItem(ACTIVE_KEY, newProfile.id);
    setShowSaveDialog(false);
    setSaveAsName('');
  };

  const handleLoadProfile = (profile: SavedProfile) => {
    setCharacter(profile.character);
    setActiveProfileId(profile.id);
    localStorage.setItem(ACTIVE_KEY, profile.id);
    setShowProfileMenu(false);
  };

  const handleDeleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prof = profiles.find(p => p.id === profileId);
    if (!prof) return;
    if (!window.confirm(`Xóa hồ sơ "${prof.name}"? Không thể hoàn tác.`)) return;
    const updated = profiles.filter(p => p.id !== profileId);
    setProfiles(updated);
    saveProfiles(updated);
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
      localStorage.removeItem(ACTIVE_KEY);
    }
  };

  const handleNewCharacter = () => {
    if (window.confirm("Tạo nhân vật mới? Dữ liệu hiện tại chưa lưu sẽ bị mất.")) {
      setCharacter(BLANK_CHARACTER_VN);
      setActiveProfileId(null);
      localStorage.removeItem(ACTIVE_KEY);
      setShowProfileMenu(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sạch hồ sơ này không? Mọi dữ liệu sẽ bị mất.")) {
      setCharacter(BLANK_CHARACTER_VN);
      if (activeProfileId) {
        // Also clear from saved profiles
        const updated = profiles.filter(p => p.id !== activeProfileId);
        setProfiles(updated);
        saveProfiles(updated);
        setActiveProfileId(null);
        localStorage.removeItem(ACTIVE_KEY);
      }
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(character, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name || 'character'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string) as Character;
          setCharacter(imported);
          setActiveProfileId(null);
          localStorage.removeItem(ACTIVE_KEY);
        } catch {
          alert('File không hợp lệ!');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
      + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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

            <div className="flex items-center gap-1 sm:gap-2">

              {/* Profile Manager */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-xs font-bold text-gray-300 hover:text-white hover:bg-dragon-800 transition-all border border-dragon-700"
                  title="Quản lý hồ sơ"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {activeProfile ? activeProfile.name : 'Hồ sơ'}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-dragon-900 border border-dragon-600 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-dragon-700 flex items-center justify-between">
                      <span className="text-xs font-bold text-dragon-gold uppercase tracking-wider">📂 Hồ sơ nhân vật</span>
                      <button onClick={() => setShowProfileMenu(false)} className="text-gray-500 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>

                    {/* Current status */}
                    {activeProfile && (
                      <div className="px-4 py-2 bg-dragon-800/50 border-b border-dragon-700">
                        <div className="text-[10px] text-gray-500">Đang chơi:</div>
                        <div className="text-sm font-bold text-green-400 truncate">{activeProfile.name}</div>
                      </div>
                    )}

                    {/* Profile List */}
                    <div className="max-h-60 overflow-y-auto">
                      {profiles.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gray-500 text-xs">Chưa có hồ sơ nào được lưu</div>
                      ) : (
                        profiles.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleLoadProfile(p)}
                            className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-dragon-800 transition-colors text-left ${p.id === activeProfileId ? 'bg-dragon-800/60 border-l-2 border-dragon-gold' : ''
                              }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-200 truncate">{p.name}</div>
                              <div className="text-[10px] text-gray-500">
                                {p.character.className || '???'} Lv{p.character.level} • {formatDate(p.updatedAt)}
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDeleteProfile(p.id, e)}
                              className="ml-2 p-1 text-gray-600 hover:text-red-500 hover:bg-red-900/30 rounded transition-colors flex-shrink-0"
                              title="Xóa hồ sơ"
                            >
                              <Trash2 size={14} />
                            </button>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-dragon-700 p-2 flex flex-col gap-1">
                      <button
                        onClick={() => { setShowSaveDialog(true); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                      >
                        <Save size={14} /> Lưu thành hồ sơ mới
                      </button>
                      <button
                        onClick={handleNewCharacter}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Plus size={14} /> Tạo nhân vật mới
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { handleExport(); setShowProfileMenu(false); }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-dragon-800 rounded transition-colors"
                        >
                          <Download size={12} /> Export JSON
                        </button>
                        <button
                          onClick={() => { handleImport(); setShowProfileMenu(false); }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-dragon-800 rounded transition-colors"
                        >
                          <Upload size={12} /> Import JSON
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSaveDialog(false)}>
          <div className="bg-dragon-900 border border-dragon-600 rounded-xl shadow-2xl w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-dragon-gold font-fantasy text-lg mb-4">💾 Lưu hồ sơ mới</h3>
            <input
              type="text"
              placeholder={character.name || 'Tên hồ sơ...'}
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveAs()}
              className="w-full bg-dragon-800 border border-dragon-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-dragon-gold mb-4"
              autoFocus
            />
            <div className="text-[10px] text-gray-500 mb-4">
              {character.className || '???'} Lv{character.level} • HP: {character.hp.current}/{character.hp.max}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 text-xs font-bold text-gray-400 border border-dragon-700 rounded-lg hover:bg-dragon-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveAs}
                className="flex-1 px-4 py-2 text-xs font-bold text-black bg-dragon-gold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                💾 Lưu
              </button>
            </div>
          </div>
        </div>
      )}

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