
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Character, TabType, AbilityScore, DataOption } from '../types';
import { CLASSES_VN, SPECIES_VN, BACKGROUNDS_VN, ALIGNMENTS_VN, ABILITY_INFO, SKILL_INFO_MAP, WEAPONS_VN, SUBCLASSES_VN, ARMOR_VN } from '../constants';
import { Shield, Heart, Zap, Sword, Activity, User, Sparkles, Plus, Trash2, Info, ChevronDown } from 'lucide-react';

interface Props {
  character: Character;
  updateCharacter: (c: Character) => void;
}

// Helper Component for Tooltip using Portal
const InfoTooltip: React.FC<{ content: string; alignRight?: boolean }> = ({ content, alignRight }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 256; // w-64 = 256px

    // Tính toán vị trí cơ bản (mặc định ở dưới, căn trái)
    // Lưu ý: Sử dụng position fixed nên không cộng thêm window.scrollY/scrollX
    let top = rect.bottom + 8;
    let left = rect.left;
    let transform = 'none';

    // 1. Xử lý chiều dọc (Vertical): Nếu gần đáy màn hình (< 200px) thì lật lên trên
    if (rect.bottom > viewportHeight - 200) {
      top = rect.top - 8;
      transform = 'translateY(-100%)';
    }

    // 2. Xử lý chiều ngang (Horizontal)
    // Nếu props yêu cầu căn phải HOẶC nếu tooltip bị tràn lề phải
    if (alignRight || (left + tooltipWidth > viewportWidth - 16)) {
      left = rect.right - tooltipWidth;

      // Nếu lật sang phải mà vẫn bị tràn lề trái (màn hình điện thoại quá nhỏ)
      if (left < 16) {
        left = 16;
      }
    }

    setStyle({ top, left, transform });
    setIsVisible(true);
  };

  return (
    <>
      <button
        type="button"
        className="text-dragon-gold hover:text-white transition-colors cursor-help align-middle inline-flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }}
      >
        <Info size={12} />
      </button>
      {isVisible && createPortal(
        <div
          className="fixed z-[9999] w-64 bg-dragon-900 border border-dragon-gold/50 text-xs text-gray-200 p-2 rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          style={style}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

// Helper Component for Select with Tooltip
const SelectWithInfo: React.FC<{
  label: string;
  value: string;
  options: DataOption[];
  onChange: (val: string) => void;
  tooltipRight?: boolean;
}> = ({ label, value, options, onChange, tooltipRight }) => {
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="border-b border-dragon-700 pb-1 relative">
      <div className="flex items-center mb-1">
        <label className="text-[9px] uppercase font-bold text-gray-500 block mr-1">{label}</label>
        {selectedOption && <InfoTooltip content={selectedOption.description} alignRight={tooltipRight} />}
      </div>
      <div className="relative">
        <select
          className="bg-transparent text-sm font-medium text-gray-200 w-full appearance-none focus:outline-none focus:text-dragon-gold cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" className="bg-dragon-900">-- Chọn --</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-dragon-900 text-gray-200">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-0 top-1 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

const CharacterSheet: React.FC<Props> = ({ character, updateCharacter }) => {
  const [activeTab, setActiveTab] = React.useState<TabType>('combat');
  const [showWeaponMenu, setShowWeaponMenu] = useState(false);

  // Xác định Class hiện tại để lấy thông tin auto-lock
  const currentClassData = CLASSES_VN.find(c => c.value === character.className);
  const filteredSubclasses = SUBCLASSES_VN.filter(s => s.className === character.className);
  const currentArmor = ARMOR_VN.find(a => a.value === character.armorWorn);

  // Auto-calculate AC based on armor, shield, and class features
  const calculateAC = (): number => {
    const dexMod = character.stats.dex.modifier;
    const conMod = character.stats.con.modifier;
    const wisMod = character.stats.wis.modifier;
    const shieldBonus = character.shieldEquipped ? 2 : 0;

    // No armor equipped
    if (!character.armorWorn || !currentArmor) {
      // Barbarian Unarmored Defense: 10 + Dex + Con
      if (character.className === 'Barbarian') {
        return 10 + dexMod + conMod + shieldBonus;
      }
      // Monk Unarmored Defense: 10 + Dex + Wis
      if (character.className === 'Monk') {
        return 10 + dexMod + wisMod; // Monk can't use shield
      }
      // Default: 10 + Dex
      return 10 + dexMod + shieldBonus;
    }

    // Armor equipped
    let ac = currentArmor.acBase;
    if (currentArmor.maxDexBonus === null) {
      // Light armor: full Dex bonus
      ac += dexMod;
    } else if (currentArmor.maxDexBonus > 0) {
      // Medium armor: Dex bonus capped
      ac += Math.min(dexMod, currentArmor.maxDexBonus);
    }
    // Heavy armor: no Dex bonus (maxDexBonus === 0)

    // Shield is separate from armor
    if (currentArmor.category !== 'Shield') {
      ac += shieldBonus;
    }

    return ac;
  };

  // Sync AC when armor/shield/stats change
  useEffect(() => {
    const newAC = calculateAC();
    if (newAC !== character.ac) {
      handleUpdate('ac', newAC);
    }
  }, [character.armorWorn, character.shieldEquipped, character.stats.dex, character.stats.con, character.stats.wis, character.className]);

  const getModStr = (mod: number) => (mod >= 0 ? `+${mod}` : mod.toString());

  // Helper để cập nhật các field lồng nhau
  const handleUpdate = (path: string, value: any) => {
    const newChar = { ...character };
    const keys = path.split('.');
    let current: any = newChar;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    updateCharacter(newChar);
  };

  const updateStat = (statKey: keyof typeof character.stats, score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    handleUpdate(`stats.${String(statKey)}`, { score, modifier });
  };

  const handleClassChange = (newClass: string) => {
    const classData = CLASSES_VN.find(c => c.value === newClass);

    // Cập nhật tên Class + reset subclass
    const newChar = { ...character, className: newClass, subclass: '' };

    if (classData) {
      // 1. Cập nhật Saving Throws (Override hoàn toàn)
      if (classData.savingThrows) {
        newChar.savingThrows = [...classData.savingThrows];
      }

      // 2. Cập nhật Skills: Reset hết về false, sau đó bật true cho defaultSkills
      // LƯU Ý: Giữ lại các skill từ Background nếu có
      const bgData = BACKGROUNDS_VN.find(b => b.value === character.background);
      const bgSkills = bgData?.skillBonuses || [];

      if (classData.defaultSkills) {
        newChar.skills = newChar.skills.map(s => ({
          ...s,
          proficient: classData.defaultSkills?.includes(s.name) || bgSkills.includes(s.name) || false
        }));
      }

      // 3. Cập nhật Hit Dice & HP Max (Gợi ý)
      if (classData.hitDie) {
        const dieValue = parseInt(classData.hitDie.substring(1)); // Lấy số từ "d10" -> 10
        const conMod = character.stats.con.modifier;

        // Level 1: Max Die + Con Mod
        // Level > 1: Giả sử lấy trung bình (Die/2 + 1) + Con Mod cho mỗi level thêm
        // Nhưng để đơn giản và tránh ghi đè dữ liệu người chơi đã chỉnh, ta chỉ set lại nếu đang ở Level 1 hoặc HP = 0
        if (character.level === 1 || character.hp.max === 0) {
          const newMaxHP = dieValue + conMod;
          newChar.hp = { ...character.hp, max: newMaxHP, current: newMaxHP };
        }

        // Luôn cập nhật loại Hit Dice
        newChar.hitDice = `${character.level}${classData.hitDie}`;
      }
    }

    updateCharacter(newChar);
  };

  const handleRaceChange = (newRace: string) => {
    const raceData = SPECIES_VN.find(r => r.value === newRace);
    const newChar = { ...character, race: newRace };

    if (raceData) {
      // 1. Cập nhật Speed
      if (raceData.speed) {
        newChar.speed = raceData.speed;
      }

      // 2. Cập nhật Traits (Features)
      if (raceData.traits) {
        // Xóa các trait cũ của race khác (nếu có logic detect) - ở đây ta chỉ append đơn giản
        // Để tránh duplicate, ta có thể reset features hoặc chỉ thêm vào.
        // Cách tốt nhất: Ghi đè phần Racial Traits
        const traitText = `\n[${raceData.label} Traits]: ${raceData.traits.join(', ')}`;

        // Nếu features đang trống, set luôn. Nếu không, append.
        if (!newChar.features) {
          newChar.features = traitText.trim();
        } else {
          newChar.features += traitText;
        }
      }
    }
    updateCharacter(newChar);
  };

  const handleBackgroundChange = (newBg: string) => {
    const bgData = BACKGROUNDS_VN.find(b => b.value === newBg);
    const newChar = { ...character, background: newBg };

    // Reset skills based on Class + New Background
    const currentClass = CLASSES_VN.find(c => c.value === character.className);
    const classSkills = currentClass?.defaultSkills || [];
    const newBgSkills = bgData?.skillBonuses || [];

    newChar.skills = newChar.skills.map(s => ({
      ...s,
      proficient: classSkills.includes(s.name) || newBgSkills.includes(s.name) || false
    }));

    updateCharacter(newChar);
  };

  const toggleProficiency = (skillName: string) => {
    // Không cho phép thay đổi nếu skill này bị khóa bởi Class mặc định
    if (currentClassData?.defaultSkills?.includes(skillName)) return;

    const newSkills = character.skills.map(s =>
      s.name === skillName ? { ...s, proficient: !s.proficient } : s
    );
    handleUpdate('skills', newSkills);
  };

  const toggleSavingThrow = (saveName: string) => {
    // Không cho phép thay đổi nếu save này bị khóa bởi Class
    if (currentClassData?.savingThrows?.includes(saveName)) return;

    const newSaves = character.savingThrows.includes(saveName)
      ? character.savingThrows.filter(x => x !== saveName)
      : [...character.savingThrows, saveName];
    handleUpdate('savingThrows', newSaves);
  };

  const addAttack = (weaponName?: string) => {
    let newAttack = { name: "Vũ khí mới", bonus: 0, damage: "1d6", type: "Sát thương" };

    if (weaponName) {
      const weapon = WEAPONS_VN.find(w => w.value === weaponName);
      if (weapon) {
        // Simple logic to guess bonus/damage based on weapon properties (Finesse, etc.)
        // This is a simplification. Real D&D logic is complex (Str vs Dex).
        // We will default to Strength for melee, Dex for ranged/finesse if Dex > Str.

        const isFinesse = weapon.description.includes('Finesse');
        const isRanged = weapon.description.includes('Range') || weapon.description.includes('Ammunition') || weapon.description.includes('Thrown');

        let statMod = character.stats.str.modifier;
        if (isRanged || (isFinesse && character.stats.dex.modifier > character.stats.str.modifier)) {
          statMod = character.stats.dex.modifier;
        }

        const damageParts = weapon.description.split(' - ')[0].split(' '); // "1d8 Slashing" -> ["1d8", "Slashing"]
        const damageDice = damageParts[0];
        const damageType = damageParts[1] || "";

        newAttack = {
          name: weapon.label.split(' (')[0], // "Dagger (Dao găm)" -> "Dagger"
          bonus: statMod + character.proficiencyBonus, // Assume proficient
          damage: `${damageDice}${statMod >= 0 ? '+' + statMod : statMod}`,
          type: damageType
        };
      }
    }

    const newAttacks = [...character.attacks, newAttack];
    handleUpdate('attacks', newAttacks);
  };

  const addSpell = (level: number) => {
    // Sử dụng map để đảm bảo immutability cho mảng spellLevels và mảng spells con
    const newSpellLevels = character.spellLevels.map((lvl, idx) => {
      if (idx === level) {
        return { ...lvl, spells: [...lvl.spells, "Phép mới"] };
      }
      return lvl;
    });
    handleUpdate('spellLevels', newSpellLevels);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Header Info */}
      <div className="bg-dragon-900 border-2 border-dragon-gold/30 p-6 rounded-lg shadow-xl relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="md:col-span-1 border-r border-dragon-gold/20 pr-4 flex flex-col justify-center">
            <label className="text-[10px] uppercase font-bold text-dragon-gold tracking-tighter">Tên nhân vật</label>
            <input
              className="bg-transparent text-3xl font-fantasy text-white w-full border-b border-transparent focus:border-dragon-gold outline-none mt-1 placeholder-gray-700"
              value={character.name}
              onChange={(e) => handleUpdate('name', e.target.value)}
              placeholder="Nhập tên..."
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Class */}
            <div className="sm:col-span-1">
              <SelectWithInfo
                label="Lớp nhân vật (Class)"
                value={character.className}
                options={CLASSES_VN}
                onChange={handleClassChange}
              />
            </div>

            {/* Subclass */}
            <div className="sm:col-span-1">
              <div className="border-b border-dragon-700 pb-1 relative">
                <div className="flex items-center mb-1">
                  <label className="text-[9px] uppercase font-bold text-gray-500 block mr-1">Subclass</label>
                  {character.subclass && (() => {
                    const sc = filteredSubclasses.find(s => s.value === character.subclass);
                    return sc ? <InfoTooltip content={`${sc.description}\nFeatures: ${sc.features.join(', ')}`} /> : null;
                  })()}
                </div>
                <div className="relative">
                  <select
                    className="bg-transparent text-sm font-medium text-gray-200 w-full appearance-none focus:outline-none focus:text-dragon-gold cursor-pointer"
                    value={character.subclass}
                    onChange={(e) => handleUpdate('subclass', e.target.value)}
                    disabled={!character.className}
                  >
                    <option value="" className="bg-dragon-900">-- Chọn --</option>
                    {filteredSubclasses.map(sc => (
                      <option key={sc.value} value={sc.value} className="bg-dragon-900 text-gray-200">
                        {sc.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Level */}
            <div className="border-b border-dragon-700 pb-1">
              <label className="text-[9px] uppercase font-bold text-gray-500 block">Cấp độ (Level)</label>
              <input
                type="number"
                min="1" max="20"
                className="bg-transparent text-sm font-medium text-gray-200 w-full focus:outline-none focus:text-dragon-gold"
                value={character.level}
                onChange={(e) => handleUpdate('level', parseInt(e.target.value) || 1)}
              />
            </div>

            {/* XP */}
            <div className="border-b border-dragon-700 pb-1">
              <label className="text-[9px] uppercase font-bold text-gray-500 block">Kinh nghiệm (XP)</label>
              <input
                type="number"
                className="bg-transparent text-sm font-medium text-gray-200 w-full focus:outline-none"
                value={character.xp}
                onChange={(e) => handleUpdate('xp', parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Background */}
            <div className="sm:col-span-2">
              <SelectWithInfo
                label="Nguồn gốc (Background)"
                value={character.background}
                options={BACKGROUNDS_VN}
                onChange={handleBackgroundChange}
              />
            </div>

            {/* Race */}
            <div className="sm:col-span-1">
              <SelectWithInfo
                label="Chủng tộc (Species)"
                value={character.race}
                options={SPECIES_VN}
                onChange={handleRaceChange}
              />
            </div>

            {/* Alignment */}
            <div className="sm:col-span-1">
              <SelectWithInfo
                label="Phẩm chất (Alignment)"
                value={character.alignment}
                options={ALIGNMENTS_VN}
                onChange={(val) => handleUpdate('alignment', val)}
                tooltipRight={true}
              />
            </div>

            {/* Player Name */}
            <div className="border-b border-dragon-700 pb-1 sm:col-span-2">
              <label className="text-[9px] uppercase font-bold text-gray-500 block">Tên người chơi</label>
              <input
                type="text"
                className="bg-transparent text-sm font-medium text-gray-200 w-full focus:outline-none"
                value={character.playerName}
                onChange={(e) => handleUpdate('playerName', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-dragon-900 rounded-lg p-1 border border-dragon-800 shadow-lg">
        {(['combat', 'bio', 'spells'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-md flex items-center justify-center gap-2 transition-all ${activeTab === tab ? 'bg-dragon-gold text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            {tab === 'combat' ? <Sword size={18} /> : tab === 'bio' ? <User size={18} /> : <Sparkles size={18} />}
            <span className="hidden sm:inline">{tab === 'combat' ? 'Chiến đấu & Kĩ năng' : tab === 'bio' ? 'Tiểu sử & Ngoại hình' : 'Sử dụng phép thuật'}</span>
            <span className="sm:hidden">{tab === 'combat' ? 'T1' : tab === 'bio' ? 'T2' : 'T3'}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-dragon-800/50 backdrop-blur-sm border border-dragon-700 rounded-xl p-4 sm:p-8 min-h-[600px]">

        {/* --- TRANG 1: CHIẾN ĐẤU --- */}
        {activeTab === 'combat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            {/* Cột 1: Chỉ số chính */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {(Object.entries(character.stats) as [string, AbilityScore][]).map(([key, val]) => {
                const abilityInfo = ABILITY_INFO[key];
                return (
                  <div key={key} className="bg-dragon-900 border-2 border-dragon-600 rounded-2xl p-2 flex flex-col items-center shadow-inner group hover:border-dragon-gold transition-colors relative">
                    <div className="flex items-center justify-center w-full gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{abilityInfo.label}</span>
                      <div className="shrink-0"><InfoTooltip content={`${abilityInfo.eng}: ${abilityInfo.desc}`} /></div>
                    </div>
                    <span className="text-3xl font-fantasy font-bold text-white my-1">{getModStr(val.modifier)}</span>
                    <input
                      type="number"
                      className="bg-dragon-800 rounded-full w-12 text-center border border-dragon-700 text-xs font-bold text-dragon-gold focus:outline-none focus:border-dragon-gold"
                      value={val.score}
                      onChange={(e) => updateStat(key as any, parseInt(e.target.value) || 0)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Cột 2: Kĩ năng phòng thủ & Kĩ năng */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-dragon-900/50 p-4 rounded-lg border border-dragon-700">
                <h3 className="text-dragon-gold font-fantasy text-sm mb-4 border-b border-dragon-700 pb-1 uppercase tracking-wider">Kĩ năng phòng thủ</h3>
                <div className="space-y-2">
                  {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(s => {
                    const abilityInfo = ABILITY_INFO[s];
                    const isClassSave = currentClassData?.savingThrows?.includes(s);

                    return (
                      <div key={s} className="flex items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={character.savingThrows.includes(s)}
                          disabled={isClassSave} // Khóa nếu là của Class
                          onChange={() => toggleSavingThrow(s)}
                          className={`w-4 h-4 ${isClassSave ? 'accent-red-500 cursor-not-allowed opacity-80' : 'accent-dragon-gold'}`}
                        />
                        <div className="flex items-center flex-1 min-w-0">
                          <span className={`uppercase text-xs mr-1 ${isClassSave ? 'text-red-400 font-bold' : 'text-gray-300'}`}>{s}</span>
                          <div className="shrink-0"><InfoTooltip content={`${abilityInfo.eng} Saving Throw: Khả năng chống lại các hiệu ứng cần dùng ${abilityInfo.label} (${abilityInfo.desc}).`} /></div>
                        </div>
                        <span className="font-mono text-white">
                          {getModStr(character.stats[s as keyof typeof character.stats].modifier + (character.savingThrows.includes(s) ? character.proficiencyBonus : 0))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-dragon-900/50 p-4 rounded-lg border border-dragon-700">
                <h3 className="text-dragon-gold font-fantasy text-sm mb-4 border-b border-dragon-700 pb-1 uppercase tracking-wider">Kĩ năng (Skills)</h3>
                <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar text-[13px]">
                  {character.skills.map((skill, i) => {
                    const skillInfo = SKILL_INFO_MAP[skill.name];
                    const isClassSkill = currentClassData?.defaultSkills?.includes(skill.name);

                    return (
                      <div key={i} className={`flex items-center gap-3 py-0.5 rounded px-1 group ${isClassSkill ? 'bg-red-900/20' : 'hover:bg-dragon-700/30'}`}>
                        <input
                          type="checkbox"
                          checked={skill.proficient}
                          disabled={isClassSkill} // Khóa nếu là mặc định của Class
                          onChange={() => toggleProficiency(skill.name)}
                          className={`w-3 h-3 shrink-0 ${isClassSkill ? 'accent-red-500 cursor-not-allowed' : 'accent-dragon-gold'}`}
                        />
                        <div className="flex items-center flex-1 min-w-0">
                          <span className={`transition-colors truncate mr-1 ${isClassSkill ? 'text-red-400 font-bold' : 'text-gray-400 group-hover:text-white'}`}>{skill.name}</span>
                          {skillInfo && <div className="shrink-0"><InfoTooltip content={`${skillInfo.eng}: ${skillInfo.desc}`} /></div>}
                        </div>
                        <span className="text-dragon-gold font-bold shrink-0">
                          {getModStr(character.stats[skill.ability as keyof typeof character.stats].modifier + (skill.proficient ? character.proficiencyBonus : 0))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cột 3: Vitals & Attacks */}
            <div className="lg:col-span-6 space-y-6">
              {/* Armor & AC Section */}
              <div className="bg-dragon-900/50 p-4 rounded-lg border border-dragon-700 mb-4">
                <h3 className="text-dragon-gold font-fantasy text-sm mb-3 border-b border-dragon-700 pb-1 uppercase tracking-wider">Giáp & Phòng thủ</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Armor Selector */}
                  <div className="border-b border-dragon-700 pb-1">
                    <div className="flex items-center mb-1">
                      <label className="text-[9px] uppercase font-bold text-gray-500 block mr-1">Giáp (Armor)</label>
                      {currentArmor && <InfoTooltip content={`AC: ${currentArmor.acFormula}\nLoại: ${currentArmor.category}${currentArmor.stealthDisadvantage ? '\n⚠️ Stealth Disadvantage' : ''}${currentArmor.strRequirement ? `\n💪 Yêu cầu Str ${currentArmor.strRequirement}` : ''}\nNặng: ${currentArmor.weight} lb. | Giá: ${currentArmor.cost}`} />}
                    </div>
                    <div className="relative">
                      <select
                        className="bg-transparent text-sm font-medium text-gray-200 w-full appearance-none focus:outline-none focus:text-dragon-gold cursor-pointer"
                        value={character.armorWorn}
                        onChange={(e) => handleUpdate('armorWorn', e.target.value)}
                      >
                        <option value="" className="bg-dragon-900">Không mặc giáp</option>
                        <optgroup label="Light Armor" className="bg-dragon-900 text-gray-400">
                          {ARMOR_VN.filter(a => a.category === 'Light').map(a => (
                            <option key={a.value} value={a.value} className="bg-dragon-900 text-gray-200">{a.label} — AC {a.acFormula}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Medium Armor" className="bg-dragon-900 text-gray-400">
                          {ARMOR_VN.filter(a => a.category === 'Medium').map(a => (
                            <option key={a.value} value={a.value} className="bg-dragon-900 text-gray-200">{a.label} — AC {a.acFormula}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Heavy Armor" className="bg-dragon-900 text-gray-400">
                          {ARMOR_VN.filter(a => a.category === 'Heavy').map(a => (
                            <option key={a.value} value={a.value} className="bg-dragon-900 text-gray-200">{a.label} — AC {a.acFormula}</option>
                          ))}
                        </optgroup>
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Shield Toggle */}
                  <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={character.shieldEquipped}
                        onChange={(e) => handleUpdate('shieldEquipped', e.target.checked)}
                        className="w-4 h-4 accent-dragon-gold"
                      />
                      <span className="text-sm text-gray-300">🛡️ Khiên (+2 AC)</span>
                    </label>
                    {currentArmor?.stealthDisadvantage && (
                      <span className="text-[10px] text-yellow-500 mt-1">⚠️ Stealth Disadvantage</span>
                    )}
                    {currentArmor?.strRequirement && character.stats.str.score < currentArmor.strRequirement && (
                      <span className="text-[10px] text-red-400 mt-1">❌ Cần Str {currentArmor.strRequirement}+</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: 'Giáp (AC)',
                    path: 'ac',
                    icon: <Shield size={20} />,
                    tooltip: `Armor Class: ${character.armorWorn ? currentArmor?.acFormula || '' : character.className === 'Barbarian' ? '10 + Dex + Con' : character.className === 'Monk' ? '10 + Dex + Wis' : '10 + Dex'}${character.shieldEquipped ? ' + 2 (Shield)' : ''}`,
                    readOnly: true
                  },
                  {
                    label: 'Vị trí lượt',
                    path: 'initiative',
                    icon: <Zap size={20} />,
                    tooltip: 'Initiative: Thứ tự hành động trong chiến đấu.\nThường bằng Dex Modifier.',
                    readOnly: false
                  },
                  {
                    label: 'Di chuyển',
                    path: 'speed',
                    icon: <Activity size={20} />,
                    tooltip: 'Speed: Tốc độ di chuyển mỗi lượt (feet).',
                    readOnly: false
                  }
                ].map(stat => (
                  <div key={stat.path} className="bg-dragon-900 border border-dragon-600 rounded-xl p-3 text-center flex flex-col items-center relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <InfoTooltip content={stat.tooltip} />
                    </div>
                    <span className="text-gray-400 mb-1">{stat.icon}</span>
                    <input
                      type="number"
                      className={`bg-transparent text-2xl font-bold w-full text-center focus:outline-none ${stat.readOnly ? 'text-dragon-gold cursor-default' : 'text-white'}`}
                      value={(character as any)[stat.path]}
                      readOnly={stat.readOnly}
                      onChange={stat.readOnly ? undefined : (e) => handleUpdate(stat.path, parseInt(e.target.value) || 0)}
                    />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-dragon-900 border border-dragon-600 rounded-xl p-5 shadow-inner">
                <div className="flex justify-between items-center mb-3 text-[10px] font-bold text-gray-500 uppercase">
                  <div className="flex items-center gap-1">
                    <span>Số máu tối đa:</span>
                    <input
                      type="number"
                      className="bg-transparent w-10 text-white ml-1 border-b border-dragon-700 focus:outline-none focus:border-dragon-gold"
                      value={character.hp.max}
                      onChange={(e) => handleUpdate('hp.max', parseInt(e.target.value) || 0)}
                    />
                    <InfoTooltip content="Hit Points (HP): Sức chịu đựng sát thương. Level 1 = Max Hit Die + Con Mod." />
                  </div>
                  <span className="text-red-500 flex items-center gap-1 uppercase tracking-wider"><Heart size={14} /> Máu hiện tại</span>
                </div>
                <input
                  type="number"
                  className="w-full bg-dragon-800 border-2 border-dragon-700 text-center text-4xl font-fantasy font-bold py-2 rounded-lg text-white focus:border-red-500 outline-none"
                  value={character.hp.current}
                  onChange={(e) => handleUpdate('hp.current', parseInt(e.target.value) || 0)}
                />
                <div className="mt-4 flex gap-4 text-xs">
                  <div className="flex-1 bg-dragon-700/30 p-2 rounded border border-dragon-600 flex flex-col relative group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-500 font-bold uppercase text-[9px]">Xúc xắc máu (Hit Dice)</span>
                      <InfoTooltip content="Hit Dice: Dùng để hồi máu khi Nghỉ Ngắn (Short Rest). Số lượng bằng Level nhân vật." alignRight />
                    </div>
                    <input className="bg-transparent text-white font-bold w-full focus:outline-none" value={character.hitDice} onChange={(e) => handleUpdate('hitDice', e.target.value)} />
                  </div>
                  <div className="flex-1 bg-dragon-700/30 p-2 rounded border border-dragon-600">
                    <span className="block text-gray-500 font-bold uppercase text-[9px] mb-1">Phép bổ trợ (Temp HP)</span>
                    <input type="number" className="bg-transparent text-white font-bold w-full focus:outline-none" value={character.hp.temp} onChange={(e) => handleUpdate('hp.temp', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>

              <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4 border-b border-dragon-700 pb-1">
                  <h3 className="text-dragon-gold font-fantasy text-sm uppercase tracking-wider">Tấn công & Phép thuật</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowWeaponMenu(!showWeaponMenu)}
                      className="text-dragon-gold hover:text-white transition-colors flex items-center gap-1 text-xs font-bold uppercase"
                    >
                      <Plus size={14} /> Thêm vũ khí
                    </button>

                    {showWeaponMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowWeaponMenu(false)}></div>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-dragon-900 border border-dragon-700 rounded shadow-xl max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
                          {WEAPONS_VN.map(w => (
                            <button
                              key={w.value}
                              className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-dragon-800 hover:text-white border-b border-dragon-800/50 last:border-0"
                              onClick={() => {
                                addAttack(w.value);
                                setShowWeaponMenu(false);
                              }}
                            >
                              {w.label}
                            </button>
                          ))}
                          <button
                            className="w-full text-left px-3 py-2 text-xs text-dragon-gold hover:bg-dragon-800 border-t border-dragon-700 font-bold"
                            onClick={() => {
                              addAttack();
                              setShowWeaponMenu(false);
                            }}
                          >
                            Tùy chỉnh...
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Attack Headers */}
                <div className="grid grid-cols-12 gap-2 px-2 mb-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-4">Tên</div>
                  <div className="col-span-2 text-center flex items-center justify-center gap-1">
                    Bonus <InfoTooltip content="Attack Bonus: Số cộng vào d20 khi tấn công.\nCông thức: Proficiency Bonus + Str/Dex Mod." />
                  </div>
                  <div className="col-span-5 flex items-center gap-1">
                    Sát thương <InfoTooltip content="Damage: Sát thương gây ra khi trúng.\nCông thức: Xúc xắc vũ khí + Str/Dex Mod." />
                  </div>
                  <div className="col-span-1"></div>
                </div>

                <div className="space-y-3">
                  {character.attacks.map((atk, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center bg-dragon-800/50 p-2 rounded border border-dragon-700">
                      <input
                        className="col-span-4 bg-transparent text-white font-bold text-xs focus:outline-none focus:text-dragon-gold"
                        value={atk.name}
                        onChange={(e) => {
                          // FIXED: Use map to create a new array reference instead of mutating state directly
                          const newAtks = character.attacks.map((a, idx) =>
                            idx === i ? { ...a, name: e.target.value } : a
                          );
                          handleUpdate('attacks', newAtks);
                        }}
                      />
                      <input
                        type="number"
                        className="col-span-2 bg-transparent text-gray-400 text-xs text-center focus:outline-none focus:text-white"
                        value={atk.bonus}
                        onChange={(e) => {
                          const newAtks = character.attacks.map((a, idx) =>
                            idx === i ? { ...a, bonus: parseInt(e.target.value) || 0 } : a
                          );
                          handleUpdate('attacks', newAtks);
                        }}
                      />
                      <input
                        className="col-span-5 bg-transparent text-gray-400 text-xs focus:outline-none focus:text-white"
                        value={`${atk.damage} ${atk.type}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(' ');
                          const damage = parts[0] || '';
                          const type = parts.slice(1).join(' ') || '';

                          const newAtks = character.attacks.map((a, idx) =>
                            idx === i ? { ...a, damage, type } : a
                          );
                          handleUpdate('attacks', newAtks);
                        }}
                      />
                      <button onClick={() => handleUpdate('attacks', character.attacks.filter((_, idx) => idx !== i))} className="col-span-1 text-red-900 hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment & Money */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider">Trang bị (Equipment)</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {character.equipment.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <input
                          className="bg-transparent text-gray-300 w-8 text-center border-b border-dragon-800 focus:border-dragon-gold outline-none"
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const newEq = character.equipment.map((eq, idx) => idx === i ? { ...eq, amount: parseInt(e.target.value) || 0 } : eq);
                            handleUpdate('equipment', newEq);
                          }}
                        />
                        <input
                          className="flex-1 bg-transparent text-gray-300 border-b border-dragon-800 focus:border-dragon-gold outline-none"
                          value={item.name}
                          onChange={(e) => {
                            const newEq = character.equipment.map((eq, idx) => idx === i ? { ...eq, name: e.target.value } : eq);
                            handleUpdate('equipment', newEq);
                          }}
                        />
                        <button onClick={() => handleUpdate('equipment', character.equipment.filter((_, idx) => idx !== i))} className="text-red-900 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleUpdate('equipment', [...character.equipment, { name: "Vật phẩm mới", amount: 1 }])}
                      className="text-xs text-gray-500 hover:text-dragon-gold flex items-center gap-1 mt-2"
                    >
                      <Plus size={12} /> Thêm vật phẩm
                    </button>
                  </div>
                </div>

                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider">Tiền tệ (Money)</h3>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {['cp', 'sp', 'ep', 'gp', 'pp'].map((coin) => (
                      <div key={coin} className="bg-dragon-800/50 rounded p-1 border border-dragon-700">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">{coin}</label>
                        <input
                          type="number"
                          className="w-full bg-transparent text-center text-xs text-white font-bold focus:outline-none"
                          value={(character.money as any)[coin]}
                          onChange={(e) => handleUpdate(`money.${coin}`, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-dragon-700">
                    <h3 className="text-dragon-gold font-fantasy text-sm mb-2 uppercase tracking-wider">Ngôn ngữ & Công cụ</h3>
                    <textarea
                      className="w-full bg-transparent text-xs text-gray-300 min-h-[60px] focus:outline-none border border-dragon-800 rounded p-2 focus:border-dragon-gold/30"
                      value={character.otherProficiencies}
                      onChange={(e) => handleUpdate('otherProficiencies', e.target.value)}
                      placeholder="Ví dụ: Tiếng Elvish, Bộ dụng cụ thợ rèn..."
                    />
                  </div>
                </div>
              </div>

              {/* Features & Traits */}
              <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider">Đặc điểm & Kỹ năng đặc biệt (Features & Traits)</h3>
                <textarea
                  className="w-full bg-transparent text-xs text-gray-300 min-h-[120px] focus:outline-none border border-dragon-800 rounded p-2 focus:border-dragon-gold/30"
                  value={character.features}
                  onChange={(e) => handleUpdate('features', e.target.value)}
                  placeholder="Các đặc điểm từ Class, Race, Background hoặc Feats..."
                />
              </div>

              {/* Personality Traits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-2 uppercase tracking-wider">Tính cách (Personality)</h3>
                  <textarea
                    className="w-full bg-transparent text-xs text-gray-300 min-h-[60px] focus:outline-none border-b border-dragon-800 focus:border-dragon-gold/30"
                    value={character.personality}
                    onChange={(e) => handleUpdate('personality', e.target.value)}
                  />
                </div>
                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-2 uppercase tracking-wider">Lý tưởng (Ideals)</h3>
                  <textarea
                    className="w-full bg-transparent text-xs text-gray-300 min-h-[60px] focus:outline-none border-b border-dragon-800 focus:border-dragon-gold/30"
                    value={character.ideals}
                    onChange={(e) => handleUpdate('ideals', e.target.value)}
                  />
                </div>
                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-2 uppercase tracking-wider">Ràng buộc (Bonds)</h3>
                  <textarea
                    className="w-full bg-transparent text-xs text-gray-300 min-h-[60px] focus:outline-none border-b border-dragon-800 focus:border-dragon-gold/30"
                    value={character.bonds}
                    onChange={(e) => handleUpdate('bonds', e.target.value)}
                  />
                </div>
                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-2 uppercase tracking-wider">Điểm yếu (Flaws)</h3>
                  <textarea
                    className="w-full bg-transparent text-xs text-gray-300 min-h-[60px] focus:outline-none border-b border-dragon-800 focus:border-dragon-gold/30"
                    value={character.flaws}
                    onChange={(e) => handleUpdate('flaws', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TRANG 2: TIỂU SỬ --- */}
        {activeTab === 'bio' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in slide-in-from-right duration-300">
            <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-6 gap-4 bg-dragon-900 border border-dragon-700 rounded-xl p-4">
              {[
                { label: 'Tuổi', path: 'age' },
                { label: 'Chiều cao', path: 'height' },
                { label: 'Cân nặng', path: 'weight' },
                { label: 'Mắt', path: 'eyes' },
                { label: 'Màu da', path: 'skin' },
                { label: 'Tóc', path: 'hair' }
              ].map((d, i) => (
                <div key={i} className="border-b border-dragon-700">
                  <label className="text-[10px] font-bold text-dragon-gold uppercase">{d.label}</label>
                  <input className="bg-transparent text-sm text-gray-200 w-full py-1 focus:outline-none" value={(character as any)[d.path]} onChange={(e) => handleUpdate(d.path, e.target.value)} />
                </div>
              ))}
            </div>

            <div className="md:col-span-4 space-y-6 text-center">
              <div className="bg-dragon-900/50 border border-dragon-700 rounded-xl p-4">
                <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase flex items-center justify-center gap-2"><User size={14} /> Ngoại hình</h3>
                <textarea
                  className="w-full bg-dragon-900 border border-dragon-700 rounded p-2 text-xs text-gray-400 italic min-h-[150px] focus:outline-none focus:border-dragon-gold"
                  value={character.appearanceDesc}
                  onChange={(e) => handleUpdate('appearanceDesc', e.target.value)}
                  placeholder="Mô tả ngoại hình..."
                />
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              {[
                { label: 'Cốt truyện nhân vật', path: 'backstory' },
                { label: 'Tổ chức & Liên minh', path: 'allies' },
                { label: 'Kho báu', path: 'treasure' }
              ].map(field => (
                <div key={field.path} className="bg-dragon-900/50 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase">{field.label}</h3>
                  <textarea
                    className="w-full bg-transparent text-sm text-gray-300 min-h-[100px] focus:outline-none focus:border-dragon-gold/20"
                    value={(character as any)[field.path]}
                    onChange={(e) => handleUpdate(field.path, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TRANG 3: PHÉP THUẬT --- */}
        {activeTab === 'spells' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Khả năng dùng phép', path: 'spellcastingAbility' },
                { label: 'DC Tránh đòn phép', path: 'spellSaveDC', type: 'number' },
                { label: 'Hộ trợ tấn công phép', path: 'spellAttackBonus', type: 'number' }
              ].map(stat => (
                <div key={stat.path} className="bg-dragon-900 border-2 border-dragon-gold/20 rounded-xl p-4 text-center">
                  <label className="text-[10px] font-bold text-dragon-gold uppercase">{stat.label}</label>
                  <input
                    type={stat.type || 'text'}
                    className="bg-transparent text-2xl font-fantasy text-white w-full text-center focus:outline-none"
                    value={(character as any)[stat.path]}
                    onChange={(e) => handleUpdate(stat.path, stat.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                  />
                </div>
              ))}
              <div className="bg-dragon-900 border-2 border-dragon-gold/20 rounded-xl p-4 text-center flex items-center justify-center">
                <Sparkles className="text-dragon-gold animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {character.spellLevels.map((lvl, idx) => (
                <div key={idx} className="bg-dragon-900/40 border border-dragon-700 rounded-lg p-4 shadow-xl">
                  <div className="flex justify-between items-center mb-3 border-b border-dragon-700 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-dragon-gold text-black w-6 h-6 rounded flex items-center justify-center font-bold text-xs">{lvl.level}</div>
                      <span className="font-fantasy text-sm text-dragon-gold uppercase">
                        {lvl.level === 0 ? 'Cantrips' : `Cấp ${lvl.level}`}
                      </span>
                    </div>
                    <button onClick={() => addSpell(idx)} className="text-dragon-gold hover:text-white"><Plus size={14} /></button>
                  </div>

                  {lvl.level > 0 && (
                    <div className="flex items-center gap-2 mb-3 bg-dragon-800 p-1 rounded">
                      <span className="text-[9px] text-gray-500 uppercase font-bold px-1">Ô phép:</span>
                      <input
                        type="number"
                        className="bg-transparent w-8 text-xs text-white text-center focus:outline-none focus:text-dragon-gold"
                        value={lvl.slotsTotal}
                        onChange={(e) => {
                          // FIXED: Immutable update for slot totals
                          const newSpellLevels = character.spellLevels.map((l, i) =>
                            i === idx ? { ...l, slotsTotal: parseInt(e.target.value) || 0 } : l
                          );
                          handleUpdate('spellLevels', newSpellLevels);
                        }}
                      />
                      <span className="text-gray-600">/</span>
                      <input
                        type="number"
                        className="bg-transparent w-8 text-xs text-dragon-gold text-center focus:outline-none focus:text-white"
                        value={lvl.slotsUsed}
                        onChange={(e) => {
                          // FIXED: Immutable update for slots used
                          const newSpellLevels = character.spellLevels.map((l, i) =>
                            i === idx ? { ...l, slotsUsed: parseInt(e.target.value) || 0 } : l
                          );
                          handleUpdate('spellLevels', newSpellLevels);
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    {lvl.spells.map((s, spellIdx) => (
                      <div key={spellIdx} className="flex items-center gap-2 group">
                        <input
                          className="flex-1 bg-transparent text-xs text-gray-300 py-1 border-b border-dragon-800 focus:border-dragon-gold outline-none focus:text-white"
                          value={s}
                          onChange={(e) => {
                            // FIXED: Deep immutable update for spell names
                            const newSpellLevels = character.spellLevels.map((l, i) => {
                              if (i !== idx) return l;
                              const newSpells = [...l.spells];
                              newSpells[spellIdx] = e.target.value;
                              return { ...l, spells: newSpells };
                            });
                            handleUpdate('spellLevels', newSpellLevels);
                          }}
                        />
                        <button
                          onClick={() => {
                            // FIXED: Immutable deletion
                            const newSpellLevels = character.spellLevels.map((l, i) => {
                              if (i !== idx) return l;
                              return { ...l, spells: l.spells.filter((_, spI) => spI !== spellIdx) };
                            });
                            handleUpdate('spellLevels', newSpellLevels);
                          }}
                          className="text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CharacterSheet;