import React, { useState } from 'react';
import { Character, Combatant, Monster } from '../types';
import { Users, Plus, Trash2, Swords, Search, Dice5, Play, ArrowDownWideNarrow, Shield, Heart } from 'lucide-react';
import { OFFLINE_MONSTERS } from '../data/monsterData';
import { WEAPON_DATABASE } from '../constants';

interface SavedProfile {
    id: string;
    name: string;
    character: Character;
    updatedAt: string;
}

interface EncounterTrackerProps {
    profiles: SavedProfile[];
}

const EncounterTracker: React.FC<EncounterTrackerProps> = ({ profiles }) => {
    const [combatants, setCombatants] = useState<Combatant[]>([]);

    // Party state
    const [selectedProfileId, setSelectedProfileId] = useState<string>('');

    // Monster state
    const [monsterSearch, setMonsterSearch] = useState('');
    const [randomQuantity, setRandomQuantity] = useState<number>(1);
    const [randomCr, setRandomCr] = useState<string>('1/4');

    // Board State
    const [currentTurnId, setCurrentTurnId] = useState<string | null>(null);

    // Filter monsters
    const filteredMonsters = OFFLINE_MONSTERS.filter(m =>
        m.name.toLowerCase().includes(monsterSearch.toLowerCase())
    ).slice(0, 5);

    const handleAddPlayer = () => {
        if (!selectedProfileId) return;
        if (combatants.length >= 6) {
            alert("Đội hình tối đa 6 người!");
            return;
        }

        const profile = profiles.find(p => p.id === selectedProfileId);
        if (!profile) return;

        // Check if already in party
        if (combatants.some(c => c.sourceId === profile.id)) {
            alert("Nhân vật này đã có trong đội hình!");
            return;
        }

        // Calculate initiative bonus (Dex modifier)
        const dexScore = profile.character.stats?.dex?.score || 10;
        const dexMod = profile.character.stats?.dex?.modifier || Math.floor((dexScore - 10) / 2);

        const newCombatant: Combatant = {
            id: crypto.randomUUID(),
            type: 'player',
            sourceId: profile.id,
            name: profile.name || profile.character.name || 'Unknown',
            initiative: 0,
            initiativeBonus: dexMod,
            hp: {
                current: profile.character.hp.current,
                max: profile.character.hp.max,
                temp: profile.character.hp.temp || 0,
            },
            ac: profile.character.ac || 10,
        };

        setCombatants(prev => [...prev, newCombatant]);
        setSelectedProfileId(''); // reset
    };

    const handleAddMonster = (monster: Monster) => {
        const existingCount = combatants.filter(c => c.sourceId === monster.name).length;
        const displayName = existingCount > 0 ? `${monster.name} ${existingCount + 1}` : monster.name;

        let hpMax = 10;
        const hpMatch = monster.hp.match(/^(\d+)/);
        if (hpMatch) hpMax = parseInt(hpMatch[1], 10);

        let ac = 10;
        const acMatch = monster.ac.match(/^(\d+)/);
        if (acMatch) ac = parseInt(acMatch[1], 10);

        const dexMod = Math.floor((monster.stats.dex - 10) / 2);

        const newCombatant: Combatant = {
            id: crypto.randomUUID(),
            type: 'monster',
            sourceId: monster.name,
            name: displayName,
            initiative: 0,
            initiativeBonus: dexMod,
            hp: { current: hpMax, max: hpMax, temp: 0 },
            ac: ac,
        };

        setCombatants(prev => [...prev, newCombatant]);
        setMonsterSearch('');
    };

    const handleAddRandomMonsters = () => {
        const validMonsters = OFFLINE_MONSTERS.filter(m => m.challenge.split(' ')[0] === randomCr);
        if (validMonsters.length === 0) {
            alert(`Không tìm thấy quái vật nào có CR ${randomCr}`);
            return;
        }

        const newMonsters: Combatant[] = [];
        const combatantCountMap: Record<string, number> = {};

        combatants.forEach(c => {
            if (c.type === 'monster') {
                combatantCountMap[c.sourceId] = (combatantCountMap[c.sourceId] || 0) + 1;
            }
        });

        for (let i = 0; i < randomQuantity; i++) {
            const randomMonster = validMonsters[Math.floor(Math.random() * validMonsters.length)];

            const currentCount = (combatantCountMap[randomMonster.name] || 0);
            const displayName = currentCount > 0 ? `${randomMonster.name} ${currentCount + 1}` : randomMonster.name;
            combatantCountMap[randomMonster.name] = currentCount + 1;

            let hpMax = 10;
            const hpMatch = randomMonster.hp.match(/^(\d+)/);
            if (hpMatch) hpMax = parseInt(hpMatch[1], 10);

            let ac = 10;
            const acMatch = randomMonster.ac.match(/^(\d+)/);
            if (acMatch) ac = parseInt(acMatch[1], 10);

            const dexMod = Math.floor((randomMonster.stats.dex - 10) / 2);

            newMonsters.push({
                id: crypto.randomUUID(),
                type: 'monster',
                sourceId: randomMonster.name,
                name: displayName,
                initiative: 0,
                initiativeBonus: dexMod,
                hp: { current: hpMax, max: hpMax, temp: 0 },
                ac: ac,
            });
        }

        setCombatants(prev => [...prev, ...newMonsters]);
    };

    const handleRemoveCombatant = (id: string) => {
        setCombatants(prev => prev.filter(c => c.id !== id));
        if (currentTurnId === id) setCurrentTurnId(null);
    };

    // Board Actions
    const updateInitiative = (id: string, value: number) => {
        setCombatants(prev => prev.map(c =>
            c.id === id ? { ...c, initiative: value } : c
        ));
    };

    const rollInitiativeForMonsters = () => {
        setCombatants(prev => prev.map(c => {
            if (c.type === 'monster') {
                const roll = Math.floor(Math.random() * 20) + 1;
                return { ...c, initiative: roll + c.initiativeBonus };
            }
            return c;
        }));
    };

    const sortInitiative = () => {
        setCombatants(prev => {
            const sorted = [...prev].sort((a, b) => {
                if (b.initiative !== a.initiative) return b.initiative - a.initiative;
                // If tie, player goes first, or compare Dex bonus
                if (a.type !== b.type) return a.type === 'player' ? -1 : 1;
                return b.initiativeBonus - a.initiativeBonus;
            });
            // Reset turn to top if we sort
            if (sorted.length > 0) setCurrentTurnId(sorted[0].id);
            return sorted;
        });
    };

    const nextTurn = () => {
        if (combatants.length === 0) return;
        if (!currentTurnId) {
            setCurrentTurnId(combatants[0].id);
            return;
        }

        const currentIndex = combatants.findIndex(c => c.id === currentTurnId);
        if (currentIndex === -1 || currentIndex === combatants.length - 1) {
            setCurrentTurnId(combatants[0].id); // Loop back
        } else {
            setCurrentTurnId(combatants[currentIndex + 1].id);
        }
    };

    const updateHp = (id: string, amount: number, isHeal: boolean) => {
        setCombatants(prev => prev.map(c => {
            if (c.id !== id) return c;

            let newHp = c.hp.current;
            if (isHeal) {
                newHp = Math.min(c.hp.max, newHp + amount);
            } else {
                newHp = Math.max(0, newHp - amount);
            }

            return {
                ...c,
                hp: { ...c.hp, current: newHp }
            };
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
            {/* Left Column: Builder */}
            <div className="lg:col-span-4 bg-dragon-900 border border-dragon-700 rounded-xl shadow-2xl p-4 flex flex-col gap-6">
                <div>
                    <h2 className="text-xl font-fantasy text-dragon-gold mb-4 border-b border-dragon-800 pb-2 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Đội hình (Party)
                    </h2>

                    <div className="flex gap-2 mb-4">
                        <select
                            className="flex-1 bg-dragon-800 border border-dragon-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-dragon-gold"
                            value={selectedProfileId}
                            onChange={(e) => setSelectedProfileId(e.target.value)}
                        >
                            <option value="">-- Chọn nhân vật đã lưu --</option>
                            {profiles.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (Lv {p.character.level})</option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddPlayer}
                            disabled={!selectedProfileId || combatants.length >= 6}
                            className="bg-dragon-800 hover:bg-dragon-700 disabled:opacity-50 disabled:cursor-not-allowed border border-dragon-600 text-dragon-gold px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Thêm
                        </button>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">Đội hình hiện tại ({combatants.filter(c => c.type === 'player').length}/6)</div>
                    <div className="space-y-2">
                        {combatants.filter(c => c.type === 'player').length === 0 && (
                            <div className="text-center italic text-gray-600 py-4 text-xs bg-black/20 rounded-lg">Chưa có ai trong đội</div>
                        )}
                        {combatants.filter(c => c.type === 'player').map(c => (
                            <div key={c.id} className="bg-black/40 border border-dragon-800 rounded-lg p-2 flex items-center justify-between group hover:border-dragon-600 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-dragon-800 border-2 border-dragon-700 flex items-center justify-center font-fantasy text-dragon-gold text-sm shadow-inner group-hover:border-dragon-gold transition-colors">
                                        {c.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-200">{c.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">AC: {c.ac} | HP: {c.hp.max}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveCombatant(c.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                                    title="Loại khỏi đội"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-fantasy text-dragon-gold mb-4 border-b border-dragon-800 pb-2 flex items-center gap-2">
                        <Swords className="w-5 h-5" />
                        Quái vật (Monsters)
                    </h2>

                    {/* Manual Search */}
                    <div className="mb-6">
                        <div className="relative mb-2">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Tìm quái vật..."
                                value={monsterSearch}
                                onChange={(e) => setMonsterSearch(e.target.value)}
                                className="w-full bg-dragon-800 border border-dragon-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-dragon-gold"
                            />
                        </div>

                        {monsterSearch && filteredMonsters.length > 0 && (
                            <div className="bg-dragon-800 border border-dragon-700 rounded-lg overflow-hidden shadow-xl">
                                {filteredMonsters.map(m => (
                                    <button
                                        key={m.name}
                                        onClick={() => handleAddMonster(m)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-dragon-700 transition-colors flex justify-between items-center border-b border-dragon-700 last:border-0"
                                    >
                                        <span>{m.name}</span>
                                        <span className="text-[10px] text-gray-400 bg-black/40 px-1.5 py-0.5 rounded">CR {m.challenge.split(' ')[0]}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {monsterSearch && filteredMonsters.length === 0 && (
                            <div className="text-xs text-gray-500 italic px-2 py-1">Không tìm thấy quái vật.</div>
                        )}
                    </div>

                    {/* Random Spawner */}
                    <div className="bg-black/30 border border-dragon-800 rounded-lg p-3">
                        <div className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                            <Dice5 className="w-4 h-4 text-dragon-gold" /> Thêm Ngẫu Nhiên
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">Số lượng</label>
                                <input
                                    type="number"
                                    min="1" max="20"
                                    value={randomQuantity}
                                    onChange={(e) => setRandomQuantity(parseInt(e.target.value) || 1)}
                                    className="w-full bg-dragon-800 border border-dragon-700 rounded-lg px-2 py-1.5 text-sm text-center text-gray-200 focus:outline-none focus:border-dragon-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">CR (Độ khó)</label>
                                <select
                                    value={randomCr}
                                    onChange={(e) => setRandomCr(e.target.value)}
                                    className="w-full bg-dragon-800 border border-dragon-700 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-dragon-gold text-gray-200"
                                >
                                    <option value="0">CR 0</option>
                                    <option value="1/8">CR 1/8</option>
                                    <option value="1/4">CR 1/4</option>
                                    <option value="1/2">CR 1/2</option>
                                    <option value="1">CR 1</option>
                                    <option value="2">CR 2</option>
                                    <option value="3">CR 3</option>
                                    <option value="4">CR 4</option>
                                    <option value="5">CR 5</option>
                                    <option value="6">CR 6</option>
                                    <option value="7">CR 7</option>
                                    <option value="8">CR 8</option>
                                    <option value="10">CR 10</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleAddRandomMonsters}
                            className="w-full bg-dragon-800 hover:bg-dragon-700 border border-dragon-600 text-dragon-gold px-3 py-2 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
                        >
                            <Plus className="w-4 h-4" /> Thêm ngẫu nhiên
                        </button>
                    </div>

                    {/* List added monsters */}
                    <div className="mt-4 space-y-2">
                        {combatants.filter(c => c.type === 'monster').map(c => (
                            <div key={c.id} className="bg-black/40 border border-dragon-800 rounded-lg p-2 flex items-center justify-between group hover:border-red-900 transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded bg-red-900/40 border border-red-800 flex items-center justify-center font-fantasy text-red-500 text-sm shadow-inner group-hover:border-red-400 transition-colors uppercase">
                                        {c.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-red-200">{c.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">AC: {c.ac} | HP: {c.hp.max}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveCombatant(c.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                                    title="Xóa quái vật"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Initiative Board */}
            <div className="lg:col-span-8 bg-dragon-900 border border-dragon-700 rounded-xl shadow-2xl p-4 flex flex-col min-h-[500px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-dragon-800 pb-4">
                    <h2 className="text-xl font-fantasy text-dragon-gold uppercase tracking-widest flex items-center gap-2">
                        Bảng Lượt Đi
                    </h2>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <button
                            onClick={rollInitiativeForMonsters}
                            className="flex-1 sm:flex-none bg-dragon-800 hover:bg-dragon-700 border border-dragon-600 text-gray-200 px-3 py-2 rounded-lg text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5"
                            title="Tự động đổ 1d20 + Dex cho tất cả quái vật"
                        >
                            <Dice5 className="w-4 h-4 text-dragon-gold" /> Quái Roll Lượt
                        </button>
                        <button
                            onClick={sortInitiative}
                            className="flex-1 sm:flex-none bg-dragon-800 hover:bg-dragon-700 border border-dragon-600 text-gray-200 px-3 py-2 rounded-lg text-xs tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                            <ArrowDownWideNarrow className="w-4 h-4 text-dragon-gold" /> Sắp Xếp
                        </button>
                        <button
                            onClick={nextTurn}
                            className="flex-1 sm:flex-none bg-dragon-gold hover:bg-yellow-500 text-dragon-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] uppercase"
                        >
                            <Play className="w-4 h-4" /> Qua Lượt
                        </button>
                    </div>
                </div>

                {combatants.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center italic text-gray-600 text-sm bg-black/20 rounded-lg border border-dashed border-dragon-800">
                        Thêm nhân vật hoặc quái vật ở cột bên trái để bắt đầu
                    </div>
                ) : (
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {combatants.map((c, index) => {
                            const isMyTurn = currentTurnId === c.id;
                            const isPlayer = c.type === 'player';
                            const hpPercent = Math.max(0, Math.min(100, (c.hp.current / c.hp.max) * 100));

                            let hpColor = "bg-green-500";
                            if (hpPercent <= 50) hpColor = "bg-yellow-500";
                            if (hpPercent <= 20) hpColor = "bg-red-500";
                            if (c.hp.current === 0) hpColor = "bg-gray-600";

                            return (
                                <div
                                    key={c.id}
                                    className={`relative bg-dragon-800/50 rounded-lg border transition-all flex flex-col sm:flex-row items-stretch sm:items-center ${isMyTurn
                                        ? 'border-dragon-gold shadow-[0_0_15px_rgba(234,179,8,0.2)] bg-dragon-800/80'
                                        : 'border-dragon-700 hover:border-dragon-600'
                                        } ${c.hp.current === 0 ? 'opacity-60 grayscale' : ''}`}
                                >
                                    {/* Turn Marker */}
                                    {isMyTurn && (
                                        <div className="absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 w-2 h-10 sm:h-12 bg-dragon-gold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                                    )}

                                    {/* Initiative Input */}
                                    <div className="w-full sm:w-20 sm:border-r border-b sm:border-b-0 border-dragon-700 p-2 sm:p-3 flex sm:flex-col items-center justify-between sm:justify-center bg-black/20 rounded-t-lg sm:rounded-none sm:rounded-l-lg gap-2">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-widest sm:mb-1 flexitems-center gap-1">
                                            Lượt <span className="sm:hidden">- {index + 1}</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={c.initiative || ''}
                                            onChange={(e) => updateInitiative(c.id, parseInt(e.target.value) || 0)}
                                            className="w-16 sm:w-14 bg-dragon-900 border border-dragon-600 rounded text-center text-lg font-bold text-dragon-gold focus:outline-none focus:border-yellow-400 py-1"
                                        />
                                        {!isPlayer && (
                                            <span className="text-[9px] text-gray-500 mt-1 hidden sm:block">Dex {c.initiativeBonus >= 0 ? '+' + c.initiativeBonus : c.initiativeBonus}</span>
                                        )}
                                    </div>

                                    {/* Main Info */}
                                    <div className="flex-1 p-3 flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded shadow-inner flex items-center justify-center text-lg font-fantasy font-bold uppercase border-2 ${isPlayer
                                                    ? 'bg-dragon-900 text-dragon-gold border-dragon-700'
                                                    : 'bg-red-900/40 text-red-500 border-red-900'
                                                    }`}>
                                                    {c.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div className={`text-base font-bold ${isPlayer ? 'text-gray-200' : 'text-red-200'} ${c.hp.current === 0 ? 'line-through text-gray-500' : ''}`}>
                                                        {c.name} {c.hp.current === 0 ? '(GỤC NGÃ)' : ''}
                                                    </div>
                                                    <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                                                        <span className="flex items-center gap-1 font-mono">
                                                            <Shield className="w-3.5 h-3.5 text-gray-500" /> AC {c.ac}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* HP Controls */}
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-gray-300 font-mono">
                                                        <Heart className="w-3.5 h-3.5 inline text-gray-500 mr-1" />
                                                        {c.hp.current} / {c.hp.max}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        id={`hp_input_${c.id}`}
                                                        className="w-14 bg-dragon-900 border border-dragon-700 rounded text-center text-xs text-gray-200 focus:outline-none focus:border-dragon-gold py-1 h-7"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const inp = document.getElementById(`hp_input_${c.id}`) as HTMLInputElement;
                                                            if (inp && inp.value) {
                                                                updateHp(c.id, parseInt(inp.value), false);
                                                                inp.value = '';
                                                            }
                                                        }}
                                                        className="bg-red-900/50 hover:bg-red-800 border border-red-800 text-red-300 px-2 h-7 rounded text-xs font-bold transition-colors"
                                                        title="Trừ máu (Dmg)"
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const inp = document.getElementById(`hp_input_${c.id}`) as HTMLInputElement;
                                                            if (inp && inp.value) {
                                                                updateHp(c.id, parseInt(inp.value), true);
                                                                inp.value = '';
                                                            }
                                                        }}
                                                        className="bg-green-900/50 hover:bg-green-800 border border-green-800 text-green-300 px-2 h-7 rounded text-xs font-bold transition-colors"
                                                        title="Cộng máu (Heal)"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* HP Bar */}
                                        <div className="w-full bg-dragon-900 rounded-full h-1.5 overflow-hidden border border-black relative">
                                            <div
                                                className={`h-full ${hpColor} transition-all duration-500`}
                                                style={{ width: `${hpPercent}%` }}
                                            />
                                        </div>

                                        {/* Player Extra Info */}
                                        {isPlayer && (
                                            (() => {
                                                const profile = profiles.find(p => p.id === c.sourceId);
                                                if (!profile) return null;
                                                const char = profile.character;

                                                // Get proficient skills
                                                const profSkills = char.skills?.filter(s => s.proficient).map(s => `${s.name} ${s.bonus >= 0 ? '+' : ''}${s.bonus}`).join(', ') || '';

                                                return (
                                                    <div className="mt-2 text-xs text-gray-400 space-y-1 bg-black/30 p-2 rounded border border-dragon-800">
                                                        <div className="text-[10px] text-gray-500">
                                                            {profSkills && <span><b className="text-gray-400">Skills (Prof):</b> {profSkills} &nbsp; </span>}
                                                            <span><b className="text-gray-400">Passive Perception:</b> {char.passivePerception}</span>
                                                        </div>

                                                        {char.weapons && char.weapons.length > 0 && (
                                                            <div className="space-y-0.5 mt-1 border-t border-dragon-800/50 pt-1 flex flex-col gap-1">
                                                                <b className="text-dragon-gold/70 text-[10px] uppercase">Vũ Khí (Weapons):</b>
                                                                {char.weapons.map((cw, i) => {
                                                                    const wd = WEAPON_DATABASE.find(w => w.value === cw.weaponId);
                                                                    const name = cw.customName || wd?.label || 'Vũ khí';
                                                                    return (
                                                                        <div key={i} className="flex gap-2 text-[10px] sm:text-xs">
                                                                            <span className="text-dragon-gold font-bold shrink-0">{name}.</span>
                                                                            <span>
                                                                                <strong className="text-white">+{(cw.attackBonus && cw.attackBonus > 0) ? cw.attackBonus : cw.attackBonus || 0}</strong> to hit,
                                                                                chiêu thức: <strong className="text-white">{cw.damageFormula || '0'}</strong> {cw.damageType}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        )}

                                        {/* Monster Extra Info */}
                                        {!isPlayer && (
                                            (() => {
                                                const monsterData = OFFLINE_MONSTERS.find(m => m.name === c.sourceId);
                                                if (!monsterData) return null;
                                                return (
                                                    <div className="mt-2 text-xs text-gray-400 space-y-1 bg-black/30 p-2 rounded border border-dragon-800">
                                                        {(monsterData.skills || monsterData.senses) && (
                                                            <div className="text-[10px] text-gray-500">
                                                                {monsterData.skills && <span><b className="text-gray-400">Skills:</b> {monsterData.skills} &nbsp; </span>}
                                                                {monsterData.senses && <span><b className="text-gray-400">Senses:</b> {monsterData.senses}</span>}
                                                            </div>
                                                        )}
                                                        {monsterData.actions && monsterData.actions.length > 0 && (
                                                            <div className="space-y-0.5 mt-1 border-t border-dragon-800/50 pt-1 flex flex-col gap-1">
                                                                <b className="text-dragon-gold/70 text-[10px] uppercase">Hành động nổi bật:</b>
                                                                {monsterData.actions.map((act, i) => (
                                                                    <div key={i} className="flex gap-2">
                                                                        <span className="text-red-300 font-bold shrink-0">{act.name}.</span>
                                                                        <span>{act.desc}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {monsterData.traits && monsterData.traits.length > 0 && (
                                                            <div className="space-y-0.5 mt-1 border-t border-dragon-800/50 pt-1 flex flex-col gap-1">
                                                                {monsterData.traits.map((trait, i) => (
                                                                    <div key={i} className="flex gap-2">
                                                                        <span className="text-dragon-gold/80 font-bold shrink-0 italic">{trait.name}.</span>
                                                                        <span>{trait.desc}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EncounterTracker;
