
import React, { useState, useEffect, useRef } from 'react';
import { Character, SavedProfile, UserSession } from './types';
import { BLANK_CHARACTER_VN } from './constants';
import CharacterSheet from './components/CharacterSheet';
import DiceRoller from './components/DiceRoller';
import MonsterManual from './components/MonsterManual';
import EncounterTracker from './components/EncounterTracker';
import { Dices, Sword, RotateCcw, Save, FolderOpen, Trash2, Plus, ChevronDown, X, Download, Upload, Skull, Users, Cloud, CloudOff, RefreshCw, LogOut, User, Wifi, WifiOff } from 'lucide-react';
import {
  isGoogleSheetEnabled,
  fetchProfilesFromSheet,
  syncProfilesToSheet,
  mergeProfiles,
} from './services/googleSheetService';

const STORAGE_KEY = 'dragonscroll_profiles';
const ACTIVE_KEY = 'dragonscroll_active';
const AUTOSAVE_KEY = 'dragonscroll_autosave';
const SESSION_KEY = 'dragonscroll_session';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

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

function loadSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(session: UserSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Migrate old saved characters to include new fields
function migrateCharacter(c: any): Character {
  return {
    ...BLANK_CHARACTER_VN,
    ...c,
    feats: c.feats ?? [],
    featureChoices: c.featureChoices ?? {},
    asiChoices: c.asiChoices ?? {},
    racialBonuses: c.racialBonuses ?? {},
    armorWorn: c.armorWorn ?? '',
    shieldEquipped: c.shieldEquipped ?? false,
    playerName: c.playerName ?? '',
    magicItems: c.magicItems ?? [],
  };
}

// ===================== Login Screen =====================
const LoginScreen: React.FC<{ onLogin: (session: UserSession) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleOnline = () => {
    const name = username.trim();
    if (!name) { setError('Nhập tên của bạn trước!'); return; }
    if (name.length < 2) { setError('Tên cần ít nhất 2 ký tự.'); return; }
    onLogin({ username: name, mode: 'online' });
  };

  const handleLocal = () => {
    onLogin({ username: 'local_' + generateId(), mode: 'local' });
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dragon-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-dragon-gold rounded-2xl shadow-2xl shadow-yellow-600/20 mb-4">
            <Sword className="w-9 h-9 text-black" />
          </div>
          <h1 className="text-4xl font-fantasy text-dragon-gold tracking-wider">DragonScroll</h1>
          <p className="text-gray-500 text-sm mt-1">D&D 5E · Hồ Sơ Nhân Vật</p>
        </div>

        {/* Card */}
        <div className="bg-dragon-900 border border-dragon-700 rounded-2xl p-6 shadow-2xl shadow-black/60">
          <h2 className="text-white font-bold text-lg mb-1">Xin chào, Phiêu lưu gia!</h2>
          <p className="text-gray-500 text-xs mb-5">
            Đăng nhập để đồng bộ nhân vật qua nhiều thiết bị, hoặc chơi local nếu không cần.
          </p>

          {/* Username input */}
          <div className="mb-4">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Tên đăng nhập
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Nhập nickname của bạn..."
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleOnline()}
                className="w-full bg-dragon-800 border border-dragon-700 rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-dragon-gold transition-colors"
                autoFocus
                maxLength={32}
              />
            </div>
            {error && <p className="text-red-400 text-[11px] mt-1">{error}</p>}
          </div>

          {/* Online login button */}
          <button
            onClick={handleOnline}
            disabled={!isGoogleSheetEnabled()}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all mb-3
              ${isGoogleSheetEnabled()
                ? 'bg-dragon-gold text-black hover:bg-yellow-400 active:scale-95 shadow-lg shadow-yellow-600/20'
                : 'bg-dragon-800 text-gray-600 cursor-not-allowed border border-dragon-700'
              }`}
          >
            <Cloud size={16} />
            {isGoogleSheetEnabled() ? 'Đăng nhập & Đồng bộ' : 'Đồng bộ chưa được cấu hình'}
          </button>

          {!isGoogleSheetEnabled() && (
            <p className="text-[10px] text-gray-600 text-center mb-3 -mt-1">
              Chưa cấu hình VITE_GAS_URL — chỉ có thể chơi local.
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-dragon-700" />
            <span className="text-[10px] text-gray-600 uppercase font-bold">hoặc</span>
            <div className="flex-1 h-px bg-dragon-700" />
          </div>

          {/* Local play button */}
          <button
            onClick={handleLocal}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm text-gray-400 border border-dragon-700 hover:border-dragon-600 hover:text-white hover:bg-dragon-800 transition-all"
          >
            <WifiOff size={16} />
            Chơi Local (không đồng bộ)
          </button>

          <p className="text-center text-[10px] text-gray-600 mt-4">
            Dữ liệu local được lưu trong trình duyệt của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

// ===================== Main App =====================
const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(() => loadSession());
  const [profiles, setProfiles] = useState<SavedProfile[]>(() => loadProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY);
  });
  const [character, setCharacter] = useState<Character>(() => {
    const activeId = localStorage.getItem(ACTIVE_KEY);
    if (activeId) {
      const profs = loadProfiles();
      const found = profs.find(p => p.id === activeId);
      if (found) return migrateCharacter(found.character);
    }
    try {
      const auto = localStorage.getItem(AUTOSAVE_KEY);
      if (auto) return migrateCharacter(JSON.parse(auto));
    } catch { }
    return BLANK_CHARACTER_VN;
  });

  const [showDice, setShowDice] = useState(false);
  const [showMonster, setShowMonster] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');
  const [currentView, setCurrentView] = useState<'character' | 'encounter'>('character');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isOnline = session?.mode === 'online' && isGoogleSheetEnabled();

  // Filter profiles cho user hiện tại
  const myProfiles = profiles.filter(p =>
    !session || session.mode === 'local'
      ? !p.userId  // local user thấy profiles không có userId
      : p.userId === session.username
  );

  // Đăng nhập → sync từ sheet
  const handleLogin = (newSession: UserSession) => {
    saveSession(newSession);
    setSession(newSession);

    if (newSession.mode === 'online' && isGoogleSheetEnabled()) {
      setSyncStatus('syncing');
      fetchProfilesFromSheet(newSession.username).then(remote => {
        if (remote.length === 0) { setSyncStatus('idle'); return; }
        setProfiles(prev => {
          const merged = mergeProfiles(prev, remote);
          saveProfiles(merged);
          const activeId = localStorage.getItem(ACTIVE_KEY);
          if (activeId) {
            const updated = merged.find(p => p.id === activeId);
            if (updated) setCharacter(migrateCharacter(updated.character));
          }
          return merged;
        });
        setSyncStatus('synced');
      }).catch(() => setSyncStatus('error'));
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    if (!window.confirm('Đăng xuất? Dữ liệu local vẫn được giữ lại.')) return;
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setSyncStatus('idle');
    setShowProfileMenu(false);
  };

  // On mount: nếu đã login online thì auto-fetch
  useEffect(() => {
    if (!session || session.mode !== 'online' || !isGoogleSheetEnabled()) return;
    setSyncStatus('syncing');
    fetchProfilesFromSheet(session.username).then(remote => {
      if (remote.length === 0) { setSyncStatus('idle'); return; }
      setProfiles(prev => {
        const merged = mergeProfiles(prev, remote);
        saveProfiles(merged);
        const activeId = localStorage.getItem(ACTIVE_KEY);
        if (activeId) {
          const updated = merged.find(p => p.id === activeId);
          if (updated) setCharacter(migrateCharacter(updated.character));
        }
        return merged;
      });
      setSyncStatus('synced');
    }).catch(() => setSyncStatus('error'));
  }, []);

  const handleSyncNow = () => {
    if (!isOnline || !session) return;
    setSyncStatus('syncing');
    fetchProfilesFromSheet(session.username).then(remote => {
      setProfiles(prev => {
        const merged = mergeProfiles(prev, remote);
        saveProfiles(merged);
        syncProfilesToSheet(merged.filter(p => p.userId === session.username), session.username);
        return merged;
      });
      setSyncStatus('synced');
    }).catch(() => setSyncStatus('error'));
  };

  // Autosave on every character change
  useEffect(() => {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(character));
    if (activeProfileId) {
      setProfiles(prev => {
        const updated = prev.map(p =>
          p.id === activeProfileId
            ? { ...p, character, updatedAt: new Date().toISOString() }
            : p
        );
        saveProfiles(updated);
        if (isOnline && session) {
          syncProfilesToSheet(updated.filter(p => p.userId === session.username), session.username);
        }
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

  const activeProfile = myProfiles.find(p => p.id === activeProfileId);

  const handleSaveAs = () => {
    const name = saveAsName.trim() || character.name || 'Nhân vật mới';
    const newProfile: SavedProfile = {
      id: generateId(),
      name,
      character,
      updatedAt: new Date().toISOString(),
      userId: session?.mode === 'online' ? session.username : undefined,
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveProfiles(updated);
    if (isOnline && session) {
      syncProfilesToSheet(updated.filter(p => p.userId === session.username), session.username);
    }
    setActiveProfileId(newProfile.id);
    localStorage.setItem(ACTIVE_KEY, newProfile.id);
    setShowSaveDialog(false);
    setSaveAsName('');
  };

  const handleLoadProfile = (profile: SavedProfile) => {
    setCharacter(migrateCharacter(profile.character));
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
    if (isOnline && session) {
      syncProfilesToSheet(updated.filter(p => p.userId === session.username), session.username);
    }
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
          setCharacter(migrateCharacter(imported));
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

  // Chưa đăng nhập → hiện màn hình login
  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

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
              <button
                onClick={() => setShowMonster(true)}
                title="Sổ Tay Quái Vật"
                className="p-2 rounded-md text-gray-500 hover:text-red-400 hover:bg-dragon-800 transition-all border border-transparent"
              >
                <Skull className="w-5 h-5" />
              </button>

              {/* View Toggle */}
              <div className="hidden sm:flex bg-dragon-800/80 rounded-lg p-1 border border-dragon-700">
                <button
                  onClick={() => setCurrentView('character')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${currentView === 'character'
                    ? 'bg-dragon-900 text-dragon-gold shadow-md border border-dragon-600'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Sword className="w-4 h-4" /> Sổ Nhân Vật
                </button>
                <button
                  onClick={() => setCurrentView('encounter')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${currentView === 'encounter'
                    ? 'bg-dragon-900 text-dragon-gold shadow-md border border-dragon-600'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Users className="w-4 h-4" /> Giả Lập Combat
                </button>
              </div>

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
                    {/* Header + User info */}
                    <div className="px-4 py-3 border-b border-dragon-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-dragon-gold uppercase tracking-wider">📂 Hồ sơ nhân vật</span>
                        <button onClick={() => setShowProfileMenu(false)} className="text-gray-500 hover:text-white">
                          <X size={14} />
                        </button>
                      </div>
                      {/* Session info */}
                      <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-bold ${
                        isOnline ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-dragon-800 text-gray-500 border border-dragon-700'
                      }`}>
                        {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                        <span className="flex-1">
                          {isOnline ? `${session.username} · Online` : 'Local (không đồng bộ)'}
                        </span>
                        <button
                          onClick={handleLogout}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                          title="Đăng xuất"
                        >
                          <LogOut size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Current active */}
                    {activeProfile && (
                      <div className="px-4 py-2 bg-dragon-800/50 border-b border-dragon-700">
                        <div className="text-[10px] text-gray-500">Đang chơi:</div>
                        <div className="text-sm font-bold text-green-400 truncate">{activeProfile.name}</div>
                      </div>
                    )}

                    {/* Profile List */}
                    <div className="max-h-60 overflow-y-auto">
                      {myProfiles.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gray-500 text-xs">Chưa có hồ sơ nào được lưu</div>
                      ) : (
                        myProfiles.map(p => (
                          <button
                            key={p.id}
                            onClick={() => handleLoadProfile(p)}
                            className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-dragon-800 transition-colors text-left ${p.id === activeProfileId ? 'bg-dragon-800/60 border-l-2 border-dragon-gold' : ''}`}
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
                      {/* Logout button at bottom */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors border-t border-dragon-800 mt-1 pt-2"
                      >
                        <LogOut size={14} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sync button — chỉ hiện khi online */}
              {isOnline && (
                <button
                  onClick={handleSyncNow}
                  title={
                    syncStatus === 'syncing' ? 'Đang đồng bộ...' :
                    syncStatus === 'synced' ? 'Đã đồng bộ' :
                    syncStatus === 'error' ? 'Lỗi đồng bộ - Nhấn để thử lại' :
                    'Đồng bộ ngay'
                  }
                  className={`p-2 rounded-md transition-all border border-transparent ${
                    syncStatus === 'syncing' ? 'text-yellow-400 animate-spin' :
                    syncStatus === 'synced' ? 'text-green-400 hover:bg-dragon-800' :
                    syncStatus === 'error' ? 'text-red-400 hover:bg-dragon-800' :
                    'text-gray-500 hover:text-blue-400 hover:bg-dragon-800'
                  }`}
                >
                  {syncStatus === 'error' ? <CloudOff className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
                </button>
              )}

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
            <div className="text-[10px] text-gray-500 mb-2">
              {character.className || '???'} Lv{character.level} • HP: {character.hp.current}/{character.hp.max}
            </div>
            {isOnline && (
              <div className="text-[10px] text-green-500 mb-4 flex items-center gap-1">
                <Cloud size={10} /> Sẽ đồng bộ lên sheet của <strong>{session.username}</strong>
              </div>
            )}
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
        <div style={{ display: currentView === 'character' ? 'block' : 'none' }}>
          <CharacterSheet character={character} updateCharacter={setCharacter} />
        </div>
        <div style={{ display: currentView === 'encounter' ? 'block' : 'none' }}>
          <EncounterTracker profiles={profiles} />
        </div>
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
      <MonsterManual isOpen={showMonster} onClose={() => setShowMonster(false)} />

    </div>
  );
};

export default App;
