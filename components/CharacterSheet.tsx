
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Character, TabType, AbilityScore, DataOption, CharacterWeapon, AsiChoice } from '../types';
import { CLASSES_VN, SPECIES_VN, BACKGROUNDS_VN, ALIGNMENTS_VN, ABILITY_INFO, SKILL_INFO_MAP, WEAPONS_VN, WEAPON_DATABASE, SUBCLASSES_VN, ARMOR_VN, EQUIPMENT_DATABASE, ASI_LEVELS, ABILITY_KEYS, ABILITY_LABELS } from '../constants';
import { SPELL_DATABASE } from '../data/spells';
import { FEAT_DATABASE } from '../data/feats';
import { getActiveFeatures, ClassFeature } from '../data/classFeatures';
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

// Badge with Tooltip — hiển thị tooltip khi hover lên badge
const BadgeTooltip: React.FC<{ tooltip: string; className: string; children: React.ReactNode }> = ({ tooltip, className, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipWidth = 280;

    let top = rect.bottom + 6;
    let left = rect.left;

    if (rect.bottom > viewportHeight - 150) {
      top = rect.top - 6;
      setStyle({ top, left: Math.max(8, Math.min(left, viewportWidth - tooltipWidth - 8)), transform: 'translateY(-100%)' });
    } else {
      setStyle({ top, left: Math.max(8, Math.min(left, viewportWidth - tooltipWidth - 8)) });
    }
    setIsVisible(true);
  };

  return (
    <>
      <span
        className={`${className} cursor-help`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => { e.stopPropagation(); setIsVisible(!isVisible); }}
      >
        {children}
      </span>
      {isVisible && createPortal(
        <div
          className="fixed z-[9999] bg-dragon-900 border border-dragon-gold/50 text-xs text-gray-200 p-2.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-150 pointer-events-none"
          style={{ ...style, width: 280 }}
        >
          {tooltip}
        </div>,
        document.body
      )}
    </>
  );
};

// Tooltip descriptions cho Mastery Properties (PHB 2024)
const MASTERY_INFO: Record<string, string> = {
  'Cleave': 'Bổ chẻ: Khi trúng 1 kẻ, có thể tấn công thêm 1 kẻ khác trong 5ft (không cộng modifier vào damage).',
  'Graze': 'Sượt qua: Nếu trượt đòn, vẫn gây damage = ability modifier.',
  'Nick': 'Chém nhanh: Đòn tấn công thêm từ Light thành phần của Attack action (thay vì Bonus Action).',
  'Push': 'Đẩy lùi: Khi trúng, đẩy mục tiêu lùi 10ft (Large hoặc nhỏ hơn).',
  'Sap': 'Làm suy nhược: Khi trúng, mục tiêu chịu Disadvantage ở attack roll kế tiếp.',
  'Slow': 'Làm chậm: Khi trúng + gây damage, giảm Speed mục tiêu 10ft (không cộng dồn).',
  'Topple': 'Đánh ngã: Khi trúng, mục tiêu save CON (DC 8 + atk mod + prof) hoặc bị Prone.',
  'Vex': 'Gây rối: Khi trúng + gây damage, bạn có Advantage cho attack kế tiếp vào mục tiêu đó.',
};

// Tooltip descriptions cho Weapon Properties (PHB 2024)
const PROPERTY_INFO: Record<string, string> = {
  'Finesse': 'Tinh tế: Dùng STR hoặc DEX cho attack + damage (chọn cái cao hơn).',
  'Light': 'Nhẹ: Cho phép Two-Weapon Fighting — tấn công thêm bằng Bonus Action với vũ khí Light khác.',
  'Heavy': 'Nặng: Disadvantage nếu STR < 13 (melee) hoặc DEX < 13 (ranged).',
  'Versatile': 'Linh hoạt: Dùng 1 tay hoặc 2 tay. 2 tay = dice damage lớn hơn.',
  'Thrown': 'Ném: Có thể ném để tấn công tầm xa. Vẫn dùng STR (trừ Finesse).',
  'Ammunition': 'Đạn dược: Cần đạn để bắn. Tiêu hao 1/hit, thu hồi 50% sau trận.',
  'Loading': 'Nạp đạn: Chỉ bắn được 1 đạn mỗi action/bonus action/reaction.',
  'Two-Handed': 'Hai tay: Bắt buộc dùng 2 tay. Không thể cầm shield cùng lúc.',
  'Reach': 'Tầm với: Tăng tầm với thêm 5ft (tổng 10ft). Ảnh hưởng Opportunity Attack.',
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
  const [editingASI, setEditingASI] = useState<string | null>(null);
  const [showWeaponMenu, setShowWeaponMenu] = useState(false);
  const [showEquipMenu, setShowEquipMenu] = useState(false);
  const [openSpellLevel, setOpenSpellLevel] = useState<number | null>(null);
  const [spellSearch, setSpellSearch] = useState('');

  // Xác định Class hiện tại để lấy thông tin auto-lock
  const currentClassData = CLASSES_VN.find(c => c.value === character.className);

  // Provide effective stats including racial bonuses and ASI
  const effectiveStats = (() => {
    const res = {} as Record<string, AbilityScore>;
    ABILITY_KEYS.forEach(key => {
      let score = Number(character.stats[key as keyof typeof character.stats]?.score) || 10;

      score += Number(character.racialBonuses?.[key]) || 0;

      if (character.asiChoices) {
        Object.values(character.asiChoices).forEach((choice: any) => {
          if (choice.type === 'asi') {
            if (choice.ability1 === key) score += Number(choice.amount1) || 0;
            if (choice.ability2 === key) score += Number(choice.amount2) || 0;
          }
        });
      }

      const modifier = Math.floor((score - 10) / 2);
      res[key] = { score, modifier };
    });
    return res;
  })();
  const filteredSubclasses = SUBCLASSES_VN.filter(s => s.className === character.className);
  const currentArmor = ARMOR_VN.find(a => a.value === character.armorWorn);

  // Auto-calculate AC based on armor, shield, and class features
  const calculateAC = (): number => {
    const dexMod = effectiveStats.dex.modifier;
    const conMod = effectiveStats.con.modifier;
    const wisMod = effectiveStats.wis.modifier;
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
  }, [character.armorWorn, character.shieldEquipped, effectiveStats, character.className]);

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
        const conMod = effectiveStats.con.modifier;

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

  const addAttack = () => {
    const newAttack = { name: "Tùy chỉnh", bonus: 0, damage: "1d6", type: "Sát thương" };
    handleUpdate('attacks', [...character.attacks, newAttack]);
  };

  // === Hệ thống vũ khí tự động ===

  const getWeaponAbilityMod = (weaponData: typeof WEAPON_DATABASE[0]): number => {
    const strMod = effectiveStats.str.modifier;
    const dexMod = effectiveStats.dex.modifier;
    const isFinesse = weaponData.properties.includes('Finesse');
    const isRanged = weaponData.type === 'Ranged';

    if (isFinesse) return Math.max(strMod, dexMod); // Chọn cái cao hơn
    if (isRanged) return dexMod;
    return strMod; // Melee mặc định dùng Str
  };

  const isWeaponProficient = (weaponData: typeof WEAPON_DATABASE[0]): boolean => {
    // Mọi class đều thông thạo Simple weapons 
    if (weaponData.category === 'Simple') return true;
    // Martial: Fighter, Paladin, Ranger, Barbarian
    const martialClasses = ['Fighter', 'Paladin', 'Ranger', 'Barbarian'];
    if (martialClasses.includes(character.className)) return true;
    return false;
  };

  const calculateWeapon = (cw: CharacterWeapon): CharacterWeapon => {
    const weaponData = WEAPON_DATABASE.find(w => w.value === cw.weaponId);
    if (!weaponData) return cw;

    const abilityMod = getWeaponAbilityMod(weaponData);
    const profBonus = isWeaponProficient(weaponData) ? character.proficiencyBonus : 0;
    const attackBonus = abilityMod + profBonus + cw.magicBonus;

    // Damage: dice + ability mod + magic bonus
    const dice = (cw.usesTwoHands && weaponData.versatileDice) ? weaponData.versatileDice : weaponData.damageDice;
    const totalDmgMod = abilityMod + cw.magicBonus;
    const damageFormula = `${dice}${totalDmgMod >= 0 ? '+' + totalDmgMod : totalDmgMod}`;

    return { ...cw, attackBonus, damageFormula, damageType: weaponData.damageType };
  };

  const addWeapon = (weaponId: string) => {
    const weaponData = WEAPON_DATABASE.find(w => w.value === weaponId);
    if (!weaponData) return;

    const isTwoHanded = weaponData.properties.includes('Two-Handed');

    const newWeapon: CharacterWeapon = {
      weaponId,
      magicBonus: 0,
      usesTwoHands: isTwoHanded,
      attackBonus: 0,
      damageFormula: '',
      damageType: weaponData.damageType,
    };

    const calculated = calculateWeapon(newWeapon);
    handleUpdate('weapons', [...character.weapons, calculated]);
  };

  // Recalculate all weapons khi stats thay đổi
  useEffect(() => {
    if (character.weapons.length === 0) return;
    const updated = character.weapons.map(w => calculateWeapon(w));
    // Chỉ update nếu có thay đổi thực sự
    const changed = updated.some((w, i) =>
      w.attackBonus !== character.weapons[i].attackBonus ||
      w.damageFormula !== character.weapons[i].damageFormula
    );
    if (changed) handleUpdate('weapons', updated);
  }, [effectiveStats, character.weapons.length, character.proficiencyBonus, character.className]);

  const addSpell = (levelIdx: number, spellName: string) => {
    const newSpellLevels = character.spellLevels.map((lvl, idx) => {
      if (idx === levelIdx) {
        return { ...lvl, spells: [...lvl.spells, spellName] };
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
              <div className="flex items-center gap-1">
                <label className="text-[9px] uppercase font-bold text-gray-500">Kinh nghiệm (XP)</label>
                <BadgeTooltip tooltip={`XP cần để lên level:\n\nLv 2: 300\nLv 3: 900\nLv 4: 2,700\nLv 5: 6,500\nLv 6: 14,000\nLv 7: 23,000\nLv 8: 34,000\nLv 9: 48,000\nLv 10: 64,000\nLv 11: 85,000\nLv 12: 100,000\nLv 13: 120,000\nLv 14: 140,000\nLv 15: 165,000\nLv 16: 195,000\nLv 17: 225,000\nLv 18: 265,000\nLv 19: 305,000\nLv 20: 355,000`} className="text-gray-600 hover:text-dragon-gold cursor-help">
                  <Info size={9} />
                </BadgeTooltip>
              </div>
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
                const racialBonus = character.racialBonuses?.[key] || 0;
                return (
                  <div key={key} className="bg-dragon-900 border-2 border-dragon-600 rounded-2xl p-2 flex flex-col items-center shadow-inner group hover:border-dragon-gold transition-colors relative">
                    <div className="flex items-center justify-center w-full gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{abilityInfo.label}</span>
                      <div className="shrink-0"><InfoTooltip content={`${abilityInfo.eng}: ${abilityInfo.desc}`} /></div>
                    </div>
                    <span className="text-3xl font-fantasy font-bold text-white my-1">{getModStr(effectiveStats[key].modifier)}</span>
                    <input
                      type="number"
                      className="bg-dragon-800 rounded-full w-12 text-center border border-dragon-700 text-xs font-bold text-dragon-gold focus:outline-none focus:border-dragon-gold"
                      value={val.score}
                      onChange={(e) => updateStat(key as any, parseInt(e.target.value) || 0)}
                    />
                    {/* Racial Bonus Badge */}
                    {racialBonus > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-600 text-black text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                        +{racialBonus}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Racial Bonus Picker */}
              <div className="bg-dragon-900/40 border border-dragon-700 rounded-lg px-2 py-1.5">
                <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center mb-1">
                  Racial Bonus
                </div>
                <div className="grid grid-cols-6 gap-0.5">
                  {ABILITY_KEYS.map(key => {
                    const bonus = character.racialBonuses?.[key] || 0;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          const next = bonus >= 2 ? 0 : bonus + 1;
                          const newBonuses = { ...(character.racialBonuses || {}) };
                          if (next === 0) {
                            delete newBonuses[key];
                          } else {
                            newBonuses[key] = next;
                          }
                          handleUpdate('racialBonuses', newBonuses);
                        }}
                        className={`flex flex-col items-center py-0.5 rounded transition-all ${bonus > 0
                          ? 'bg-yellow-600/20 border border-yellow-500/40 text-yellow-400'
                          : 'border border-transparent text-gray-500 hover:text-gray-300'
                          }`}
                      >
                        <span className="text-[7px] uppercase font-bold">{ABILITY_LABELS[key]}</span>
                        <span className="text-[10px] font-black">{bonus > 0 ? `+${bonus}` : '·'}</span>
                      </button>
                    );
                  })}
                </div>
                {(() => {
                  const total = (Object.values(character.racialBonuses || {}) as number[]).reduce((s: number, v: number) => s + v, 0);
                  return (
                    <div className={`text-[8px] text-center mt-0.5 ${total > 3 ? 'text-red-400' : total === 3 ? 'text-green-400' : 'text-gray-500'}`}>
                      {total}/3 điểm {total > 3 && '⚠ vượt!'}
                    </div>
                  );
                })()}
              </div>

              {/* Point Buy Hint */}
              {(() => {
                const POINT_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
                const scores = (Object.values(character.stats) as AbilityScore[]).map(s => s.score);
                let totalCost = 0;
                let hasInvalid = false;
                scores.forEach(s => {
                  if (s >= 8 && s <= 15) {
                    totalCost += POINT_COST[s] || 0;
                  } else if (s < 8) {
                    hasInvalid = true;
                  } else {
                    // >15: tính cost của 15 + extra (hint only)
                    totalCost += 9;
                    hasInvalid = true;
                  }
                });
                const remaining = 27 - totalCost;
                const isOver = remaining < 0;

                return (
                  <div className="bg-dragon-900/40 border border-dragon-700 rounded-lg px-2 py-1.5">
                    <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center mb-1">
                      Point Buy
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-gray-400">Còn lại:</span>
                      <span className={`text-sm font-bold font-fantasy ${isOver ? 'text-red-400' : remaining === 0 ? 'text-green-400' : 'text-dragon-gold'}`}>
                        {remaining}
                      </span>
                      <span className="text-[9px] text-gray-500">/27</span>
                    </div>
                    {/* Per-stat cost breakdown */}
                    <div className="grid grid-cols-6 gap-0.5 mt-1">
                      {(Object.entries(character.stats) as [string, AbilityScore][]).map(([key, val]) => {
                        const cost = POINT_COST[val.score];
                        const invalid = val.score < 8;
                        return (
                          <div key={key} className="text-center">
                            <div className="text-[7px] text-gray-500 uppercase">{key}</div>
                            <div className={`text-[9px] font-bold ${invalid ? 'text-red-400' : cost !== undefined ? 'text-gray-300' : 'text-yellow-500'}`}>
                              {invalid ? '!' : cost !== undefined ? cost : '9+'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {hasInvalid && (
                      <div className="text-[8px] text-yellow-500/70 text-center mt-0.5">
                        ⚠ Ngoài 8–15
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ASI Tracker */}
              {(() => {
                const asiLevels = ASI_LEVELS[character.className] || ASI_LEVELS['Barbarian'] || [4, 8, 12, 16, 19];
                const availableASIs = asiLevels.filter(l => l <= character.level);
                if (availableASIs.length === 0 || !character.className) return null;

                return (
                  <div className="bg-dragon-900/60 border border-dragon-700 rounded-xl p-2 mt-1">
                    <div className="text-[9px] font-bold text-dragon-gold uppercase tracking-widest text-center mb-1.5">
                      ASI / Feat
                    </div>
                    <div className="space-y-1.5">
                      {availableASIs.map(lvl => {
                        const key = String(lvl);
                        const choice = character.asiChoices?.[key];

                        // Completed choice — compact badge
                        if (choice && editingASI !== key) {
                          let label = '';
                          if (choice.type === 'asi') {
                            if (choice.ability2) {
                              label = `+1 ${ABILITY_LABELS[choice.ability1 || ''] || '?'} / +1 ${ABILITY_LABELS[choice.ability2] || '?'}`;
                            } else {
                              label = `+${choice.amount1 || 2} ${ABILITY_LABELS[choice.ability1 || ''] || '?'}`;
                            }
                          } else {
                            label = choice.featName || 'Feat';
                          }

                          return (
                            <button
                              key={lvl}
                              onClick={() => setEditingASI(key)}
                              className="w-full flex items-center justify-between gap-1 px-2 py-1 rounded-md bg-dragon-gold/10 border border-dragon-gold/30 hover:border-dragon-gold/60 transition-all text-left"
                            >
                              <span className="text-[9px] font-bold text-gray-400">Lv{lvl}</span>
                              <span className="text-[10px] font-bold text-dragon-gold truncate flex-1 text-right">{label}</span>
                            </button>
                          );
                        }

                        // Editing or empty — show editor
                        return (
                          <div key={lvl} className="rounded-md border border-dragon-600 bg-dragon-800/80 p-1.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-bold text-gray-400">Lv{lvl}</span>
                              {editingASI === key && (
                                <button
                                  onClick={() => setEditingASI(null)}
                                  className="text-[8px] text-gray-500 hover:text-white"
                                >✕</button>
                              )}
                            </div>

                            {/* Mode selector */}
                            <div className="flex gap-1 mb-1">
                              <button
                                onClick={() => {
                                  handleUpdate('asiChoices', {
                                    ...(character.asiChoices || {}),
                                    [key]: { type: 'asi', ability1: 'str', amount1: 2 }
                                  });
                                }}
                                className="flex-1 text-[9px] py-0.5 rounded bg-blue-900/40 border border-blue-700/50 text-blue-300 hover:bg-blue-800/60 transition-colors font-bold"
                              >+2</button>
                              <button
                                onClick={() => {
                                  handleUpdate('asiChoices', {
                                    ...(character.asiChoices || {}),
                                    [key]: { type: 'asi', ability1: 'str', amount1: 1, ability2: 'con', amount2: 1 }
                                  });
                                }}
                                className="flex-1 text-[9px] py-0.5 rounded bg-green-900/40 border border-green-700/50 text-green-300 hover:bg-green-800/60 transition-colors font-bold"
                              >+1/+1</button>
                              <button
                                onClick={() => {
                                  handleUpdate('asiChoices', {
                                    ...(character.asiChoices || {}),
                                    [key]: { type: 'feat', featName: '' }
                                  });
                                }}
                                className="flex-1 text-[9px] py-0.5 rounded bg-purple-900/40 border border-purple-700/50 text-purple-300 hover:bg-purple-800/60 transition-colors font-bold"
                              >Feat</button>
                            </div>

                            {/* Detail editor based on type */}
                            {choice?.type === 'asi' && !choice.ability2 && (
                              <select
                                value={choice.ability1 || 'str'}
                                onChange={(e) => {
                                  handleUpdate('asiChoices', {
                                    ...(character.asiChoices || {}),
                                    [key]: { ...choice, ability1: e.target.value, amount1: 2 }
                                  });
                                }}
                                className="w-full bg-dragon-900 border border-dragon-700 rounded text-[10px] text-white px-1 py-0.5"
                              >
                                {ABILITY_KEYS.map(a => (
                                  <option key={a} value={a}>{ABILITY_LABELS[a]}</option>
                                ))}
                              </select>
                            )}

                            {choice?.type === 'asi' && choice.ability2 && (
                              <div className="flex gap-1">
                                <select
                                  value={choice.ability1 || 'str'}
                                  onChange={(e) => {
                                    handleUpdate('asiChoices', {
                                      ...(character.asiChoices || {}),
                                      [key]: { ...choice, ability1: e.target.value }
                                    });
                                  }}
                                  className="flex-1 bg-dragon-900 border border-dragon-700 rounded text-[10px] text-white px-1 py-0.5"
                                >
                                  {ABILITY_KEYS.map(a => (
                                    <option key={a} value={a}>{ABILITY_LABELS[a]}</option>
                                  ))}
                                </select>
                                <select
                                  value={choice.ability2 || 'con'}
                                  onChange={(e) => {
                                    handleUpdate('asiChoices', {
                                      ...(character.asiChoices || {}),
                                      [key]: { ...choice, ability2: e.target.value }
                                    });
                                  }}
                                  className="flex-1 bg-dragon-900 border border-dragon-700 rounded text-[10px] text-white px-1 py-0.5"
                                >
                                  {ABILITY_KEYS.map(a => (
                                    <option key={a} value={a}>{ABILITY_LABELS[a]}</option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {choice?.type === 'feat' && (
                              <select
                                value={choice.featName || ''}
                                onChange={(e) => {
                                  handleUpdate('asiChoices', {
                                    ...(character.asiChoices || {}),
                                    [key]: { ...choice, featName: e.target.value }
                                  });
                                }}
                                className="w-full bg-dragon-900 border border-dragon-700 rounded text-[10px] text-white px-1 py-0.5"
                              >
                                <option value="">-- Chọn Feat --</option>
                                {FEAT_DATABASE.map(f => (
                                  <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                              </select>
                            )}

                            {/* Clear button */}
                            {choice && (
                              <button
                                onClick={() => {
                                  const newChoices = { ...(character.asiChoices || {}) };
                                  delete newChoices[key];
                                  handleUpdate('asiChoices', newChoices);
                                  setEditingASI(null);
                                }}
                                className="w-full text-[8px] text-gray-500 hover:text-red-400 mt-0.5 transition-colors"
                              >Xóa</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
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
                          {getModStr(effectiveStats[s].modifier + (character.savingThrows.includes(s) ? character.proficiencyBonus : 0))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inspiration + Passive Perception */}
              <div className="grid grid-cols-2 gap-3">
                {/* Inspiration */}
                <div className="bg-dragon-900/50 p-3 rounded-lg border border-dragon-700 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={character.inspiration}
                    onChange={(e) => handleUpdate('inspiration', e.target.checked)}
                    className="w-5 h-5 accent-dragon-gold cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Inspiration</span>
                    <InfoTooltip content="Inspiration: DM thưởng khi roleplay tốt. Dùng để có Advantage cho 1 roll bất kỳ (attack, save, ability check). Chỉ có hoặc không, không cộng dồn." />
                  </div>
                </div>
                {/* Passive Perception */}
                <div className="bg-dragon-900/50 p-3 rounded-lg border border-dragon-700 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase">Nhận thức thụ động</span>
                    <InfoTooltip content={`Passive Perception = 10 + WIS modifier${character.skills.find(s => s.name === 'Quan Sát')?.proficient ? ' + Proficiency' : ''}. DM dùng để kiểm tra xem nhân vật có nhận ra mối nguy hiểm, bẫy, hoặc kẻ thù lén lút mà không cần roll.`} />
                  </div>
                  <span className="text-xl font-bold text-dragon-gold font-mono">
                    {10 + effectiveStats.wis.modifier + (character.skills.find(s => s.name === 'Quan Sát')?.proficient ? character.proficiencyBonus : 0)}
                  </span>
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
                          {getModStr(effectiveStats[skill.ability].modifier + (skill.proficient ? character.proficiencyBonus : 0))}
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
                            <option key={a.value} value={a.value} className="bg-dragon-900 text-gray-200">{a.label} — AC {a.acFormula} · {a.cost}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Medium Armor" className="bg-dragon-900 text-gray-400">
                          {ARMOR_VN.filter(a => a.category === 'Medium').map(a => (
                            <option key={a.value} value={a.value} className="bg-dragon-900 text-gray-200">{a.label} — AC {a.acFormula} · {a.cost}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Heavy Armor" className="bg-dragon-900 text-gray-400">
                          {ARMOR_VN.filter(a => a.category === 'Heavy').map(a => (
                            <option key={a.value} value={a.value} className="bg-dragon-900 text-gray-200">{a.label} — AC {a.acFormula} · {a.cost}</option>
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
                    {currentArmor?.strRequirement && effectiveStats.str.score < currentArmor.strRequirement && (
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
                    <InfoTooltip content="Hit Points (HP): Sức chịu đựng sát thương. Level 1 = Max Hit Die + Con Mod. Level 2+: Roll Hit Die + CON mod (hoặc lấy trung bình)." />
                  </div>
                  <span className="text-red-500 flex items-center gap-1 uppercase tracking-wider"><Heart size={14} /> Máu hiện tại</span>
                </div>

                {/* HP Level Up Info */}
                {(() => {
                  const classData = CLASSES_VN.find(c => c.value === character.className);
                  const hitDie = classData?.hitDie;
                  if (!hitDie) return null;
                  const dieValue = parseInt(hitDie.substring(1));
                  const conMod = effectiveStats.con.modifier;
                  const avgRoll = Math.floor(dieValue / 2) + 1;
                  const avgGain = Math.max(1, avgRoll + conMod);

                  return (
                    <div className="mb-3 bg-dragon-800/60 border border-dragon-700 rounded-lg p-2 px-3">
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>
                          <span className="text-dragon-gold font-bold">🎲 Level Up:</span>
                          {' '}Roll {hitDie} {conMod >= 0 ? '+' : ''} {conMod} (CON)
                        </span>
                        <span className="text-gray-500">
                          TB: <span className="text-green-400 font-bold">+{avgGain}</span>
                          {' | '}Lv1: <span className="text-blue-400 font-bold">{dieValue + conMod}</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}
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

                {/* Death Saves */}
                <div className="mt-3 bg-dragon-700/30 p-3 rounded border border-dragon-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 font-bold uppercase text-[9px]">Cứu tử (Death Saves)</span>
                    <InfoTooltip content="Death Saves: Khi HP = 0, mỗi lượt roll d20. ≥10 = Success, <10 = Failure. 3 Success = ổn định (1 HP). 3 Failure = chết. Nat 20 = lập tức hồi 1 HP. Nat 1 = 2 Failure." alignRight />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-green-400 font-bold uppercase">✓</span>
                      {[1, 2, 3].map(n => (
                        <button
                          key={`s${n}`}
                          onClick={() => handleUpdate('deathSaves.success', character.deathSaves.success >= n ? n - 1 : n)}
                          className={`w-4 h-4 rounded-full border-2 transition-colors ${character.deathSaves.success >= n
                            ? 'bg-green-500 border-green-400'
                            : 'bg-transparent border-gray-600 hover:border-green-400'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-red-400 font-bold uppercase">✗</span>
                      {[1, 2, 3].map(n => (
                        <button
                          key={`f${n}`}
                          onClick={() => handleUpdate('deathSaves.failure', character.deathSaves.failure >= n ? n - 1 : n)}
                          className={`w-4 h-4 rounded-full border-2 transition-colors ${character.deathSaves.failure >= n
                            ? 'bg-red-500 border-red-400'
                            : 'bg-transparent border-gray-600 hover:border-red-400'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4 border-b border-dragon-700 pb-1">
                  <h3 className="text-dragon-gold font-fantasy text-sm uppercase tracking-wider">Vũ khí (Auto)</h3>
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
                        <div className="absolute right-0 top-full mt-1 w-64 bg-dragon-900 border border-dragon-700 rounded shadow-xl max-h-80 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
                          {/* Simple Melee */}
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase bg-dragon-800 sticky top-0">Simple Melee</div>
                          {WEAPON_DATABASE.filter(w => w.category === 'Simple' && w.type === 'Melee').map(w => (
                            <button key={w.value} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-dragon-800 hover:text-white border-b border-dragon-800/50" onClick={() => { addWeapon(w.value); setShowWeaponMenu(false); }}>
                              <span className="font-medium">{w.label}</span>
                              <span className="text-gray-500 ml-1">{w.damageDice} {w.damageType}</span>
                              <span className="text-gray-600 ml-1">{w.cost}</span>
                            </button>
                          ))}
                          {/* Simple Ranged */}
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase bg-dragon-800 sticky top-0">Simple Ranged</div>
                          {WEAPON_DATABASE.filter(w => w.category === 'Simple' && w.type === 'Ranged').map(w => (
                            <button key={w.value} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-dragon-800 hover:text-white border-b border-dragon-800/50" onClick={() => { addWeapon(w.value); setShowWeaponMenu(false); }}>
                              <span className="font-medium">{w.label}</span>
                              <span className="text-gray-500 ml-1">{w.damageDice} {w.damageType}</span>
                              <span className="text-gray-600 ml-1">{w.cost}</span>
                            </button>
                          ))}
                          {/* Martial Melee */}
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase bg-dragon-800 sticky top-0">Martial Melee</div>
                          {WEAPON_DATABASE.filter(w => w.category === 'Martial' && w.type === 'Melee').map(w => (
                            <button key={w.value} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-dragon-800 hover:text-white border-b border-dragon-800/50" onClick={() => { addWeapon(w.value); setShowWeaponMenu(false); }}>
                              <span className="font-medium">{w.label}</span>
                              <span className="text-gray-500 ml-1">{w.damageDice} {w.damageType}</span>
                              <span className="text-gray-600 ml-1">{w.cost}</span>
                            </button>
                          ))}
                          {/* Martial Ranged */}
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase bg-dragon-800 sticky top-0">Martial Ranged</div>
                          {WEAPON_DATABASE.filter(w => w.category === 'Martial' && w.type === 'Ranged').map(w => (
                            <button key={w.value} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-dragon-800 hover:text-white border-b border-dragon-800/50" onClick={() => { addWeapon(w.value); setShowWeaponMenu(false); }}>
                              <span className="font-medium">{w.label}</span>
                              <span className="text-gray-500 ml-1">{w.damageDice} {w.damageType}</span>
                              <span className="text-gray-600 ml-1">{w.cost}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Weapon items */}
                <div className="space-y-3">
                  {character.weapons.map((cw, i) => {
                    const wd = WEAPON_DATABASE.find(w => w.value === cw.weaponId);
                    if (!wd) return null;
                    const isProficient = isWeaponProficient(wd);
                    return (
                      <div key={i} className="bg-dragon-800/50 p-3 rounded border border-dragon-700 space-y-2">
                        {/* Row 1: Name + Attack + Damage */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-white truncate">
                              {cw.customName || wd.label}
                              {cw.magicBonus > 0 && <span className="text-purple-400 ml-1">+{cw.magicBonus}</span>}
                            </div>
                          </div>
                          <div className="text-center px-2">
                            <div className="text-dragon-gold font-bold text-lg font-mono whitespace-nowrap">
                              1d20{cw.attackBonus >= 0 ? '+' : ''}{cw.attackBonus}
                            </div>
                            <div className="text-[8px] text-gray-500 uppercase">Roll Atk</div>
                          </div>
                          <div className="text-center px-2">
                            <div className="text-white font-bold text-sm font-mono">{cw.damageFormula}</div>
                            <div className="text-[8px] text-gray-500">{cw.damageType}</div>
                          </div>
                          <button onClick={() => handleUpdate('weapons', character.weapons.filter((_, idx) => idx !== i))} className="text-red-900 hover:text-red-500 shrink-0">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Row 2: Properties, mastery, controls */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Proficiency badge */}
                          <BadgeTooltip
                            tooltip={isProficient
                              ? `✅ Thông thạo: Cộng Proficiency Bonus (+${character.proficiencyBonus}) vào Attack Roll. ${wd.category === 'Simple' ? 'Mọi class đều thông thạo Simple.' : 'Martial: Fighter, Paladin, Ranger, Barbarian.'}`
                              : `❌ Không thông thạo: Không cộng Proficiency Bonus vào Attack Roll. ${wd.category} weapon cần class phù hợp.`
                            }
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isProficient ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}
                          >
                            {isProficient ? '✓ Prof' : '✗ No Prof'}
                          </BadgeTooltip>
                          {/* Category & type */}
                          <BadgeTooltip
                            tooltip={`${wd.category === 'Simple' ? 'Đơn giản: Vũ khí cơ bản, hầu hết class đều thông thạo.' : 'Chiến trận: Vũ khí chuyên dụng, cần huấn luyện.'} ${wd.type === 'Melee' ? 'Cận chiến: Tấn công trong 5ft.' : 'Tầm xa: Tấn công từ khoảng cách xa, dùng DEX.'}`}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-dragon-700/50 text-gray-400"
                          >
                            {wd.category} {wd.type}
                          </BadgeTooltip>
                          {/* Mastery badge */}
                          <BadgeTooltip
                            tooltip={MASTERY_INFO[wd.mastery] || wd.mastery}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300 font-bold"
                          >
                            ⚔ {wd.mastery}
                          </BadgeTooltip>
                          {/* Properties */}
                          {wd.properties.map(p => (
                            <BadgeTooltip
                              key={p}
                              tooltip={PROPERTY_INFO[p] || p}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-dragon-700/30 text-gray-500"
                            >
                              {p}
                            </BadgeTooltip>
                          ))}
                          {/* Range */}
                          {wd.rangeNormal && (
                            <BadgeTooltip
                              tooltip={`Tầm bắn: ${wd.rangeNormal}ft (thường) / ${wd.rangeLong}ft (xa). Vượt tầm thường = Disadvantage. Vượt tầm xa = không thể tấn công.`}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/30 text-blue-400"
                            >
                              🎯 {wd.rangeNormal}/{wd.rangeLong} ft.
                            </BadgeTooltip>
                          )}
                        </div>

                        {/* Row 3: Controls */}
                        <div className="flex items-center gap-3 text-[10px]">
                          {/* Versatile toggle */}
                          {wd.properties.includes('Versatile') && (
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={cw.usesTwoHands}
                                onChange={(e) => {
                                  const updated = character.weapons.map((w, idx) =>
                                    idx === i ? calculateWeapon({ ...w, usesTwoHands: e.target.checked }) : w
                                  );
                                  handleUpdate('weapons', updated);
                                }}
                                className="w-3 h-3 accent-dragon-gold"
                              />
                              <span className="text-gray-400">Hai tay ({wd.versatileDice})</span>
                            </label>
                          )}
                          {/* Magic bonus */}
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Magic:</span>
                            <select
                              className="bg-transparent text-purple-400 font-bold appearance-none focus:outline-none cursor-pointer"
                              value={cw.magicBonus}
                              onChange={(e) => {
                                const updated = character.weapons.map((w, idx) =>
                                  idx === i ? calculateWeapon({ ...w, magicBonus: parseInt(e.target.value) }) : w
                                );
                                handleUpdate('weapons', updated);
                              }}
                            >
                              <option value="0" className="bg-dragon-900">+0</option>
                              <option value="1" className="bg-dragon-900">+1</option>
                              <option value="2" className="bg-dragon-900">+2</option>
                              <option value="3" className="bg-dragon-900">+3</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual Attacks (legacy) */}
              {character.attacks.length > 0 && (
                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4 border-b border-dragon-700 pb-1">
                    <h3 className="text-dragon-gold font-fantasy text-sm uppercase tracking-wider">Tùy chỉnh thủ công</h3>
                    <button
                      onClick={addAttack}
                      className="text-dragon-gold hover:text-white transition-colors flex items-center gap-1 text-xs font-bold uppercase"
                    >
                      <Plus size={14} /> Thêm
                    </button>
                  </div>

                  {/* Attack Headers */}
                  <div className="grid grid-cols-12 gap-2 px-2 mb-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Tên</div>
                    <div className="col-span-2 text-center">Bonus</div>
                    <div className="col-span-5">Sát thương</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="space-y-3">
                    {character.attacks.map((atk, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 items-center bg-dragon-800/50 p-2 rounded border border-dragon-700">
                        <input
                          className="col-span-4 bg-transparent text-white font-bold text-xs focus:outline-none focus:text-dragon-gold"
                          value={atk.name}
                          onChange={(e) => {
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
              )}

              {/* Equipment & Money */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider">Trang bị (Equipment)</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {character.equipment.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <input
                          className="bg-transparent text-gray-300 w-8 text-center border-b border-dragon-800 focus:border-dragon-gold outline-none shrink-0"
                          type="number"
                          value={item.amount}
                          onChange={(e) => {
                            const newEq = character.equipment.map((eq, idx) => idx === i ? { ...eq, amount: parseInt(e.target.value) || 0 } : eq);
                            handleUpdate('equipment', newEq);
                          }}
                        />
                        <input
                          className="min-w-0 flex-1 bg-transparent text-gray-300 border-b border-dragon-800 focus:border-dragon-gold outline-none"
                          value={item.name}
                          onChange={(e) => {
                            const newEq = character.equipment.map((eq, idx) => idx === i ? { ...eq, name: e.target.value } : eq);
                            handleUpdate('equipment', newEq);
                          }}
                        />
                        <button onClick={() => handleUpdate('equipment', character.equipment.filter((_, idx) => idx !== i))} className="text-red-800 hover:text-red-400 transition-colors shrink-0 ml-1"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-2">
                    <button
                      onClick={() => setShowEquipMenu(!showEquipMenu)}
                      className="text-xs text-gray-500 hover:text-dragon-gold flex items-center gap-1"
                    >
                      <Plus size={12} /> Thêm vật phẩm
                    </button>
                    {showEquipMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowEquipMenu(false)}></div>
                        <div className="absolute left-0 bottom-full mb-1 w-64 bg-dragon-900 border border-dragon-700 rounded shadow-xl max-h-72 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
                          {(['Potion', 'Gear', 'Tool', 'Ammo', 'Container', 'Camp'] as const).map(cat => {
                            const items = EQUIPMENT_DATABASE.filter(e => e.category === cat);
                            const catLabels: Record<string, string> = { Potion: '🧴 Thuốc & Bình', Gear: '⚙️ Dụng cụ phiêu lưu', Tool: '🛠 Bộ công cụ', Ammo: '🎯 Đạn dược', Container: '🎒 Túi & Hộp', Camp: '⛺ Cắm trại' };
                            return (
                              <div key={cat}>
                                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase bg-dragon-800 sticky top-0">{catLabels[cat]}</div>
                                {items.map(eq => (
                                  <button
                                    key={eq.name}
                                    className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-dragon-800 hover:text-white border-b border-dragon-800/50"
                                    onClick={() => {
                                      handleUpdate('equipment', [...character.equipment, { name: eq.label, amount: 1 }]);
                                      setShowEquipMenu(false);
                                    }}
                                  >
                                    <span className="font-medium">{eq.label}</span>
                                    <span className="text-gray-600 ml-1.5">{eq.cost}</span>
                                  </button>
                                ))}
                              </div>
                            );
                          })}
                          <button
                            className="w-full text-left px-3 py-2 text-xs text-dragon-gold hover:bg-dragon-800 border-t border-dragon-700 font-bold"
                            onClick={() => {
                              handleUpdate('equipment', [...character.equipment, { name: 'Vật phẩm mới', amount: 1 }]);
                              setShowEquipMenu(false);
                            }}
                          >
                            Tùy chỉnh...
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                  <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider">Tiền tệ (Money)</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: 'cp', vn: 'Đồng', color: 'text-amber-700' },
                      { key: 'sp', vn: 'Bạc', color: 'text-gray-400' },
                      { key: 'ep', vn: 'Vàng Kim', color: 'text-blue-300' },
                      { key: 'gp', vn: 'Vàng', color: 'text-yellow-400' },
                      { key: 'pp', vn: 'Bạch Kim', color: 'text-gray-200' },
                    ].map((coin) => (
                      <div key={coin.key} className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase w-14 shrink-0 ${coin.color}`}>{coin.vn}</span>
                        <input
                          type="number"
                          className="w-14 bg-dragon-800/50 rounded px-1.5 py-0.5 text-xs text-white font-bold text-center focus:outline-none border border-dragon-700 focus:border-dragon-gold"
                          value={(character.money as any)[coin.key]}
                          onChange={(e) => handleUpdate(`money.${coin.key}`, parseInt(e.target.value) || 0)}
                        />
                        <span className="text-[9px] text-gray-600 uppercase w-5">{coin.key}</span>
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

              {/* Active Feats (from ASI choices) */}
              {(() => {
                const activeFeatsId = Object.values(character.asiChoices || {})
                  .filter((c: any) => c.type === 'feat' && c.featName)
                  .map((c: any) => c.featName as string);

                if (activeFeatsId.length === 0) return null;

                const featsToRender = activeFeatsId.map(id => FEAT_DATABASE.find(f => f.value === id)).filter(Boolean);

                return (
                  <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4 mb-4 mt-6">
                    <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Kỹ Năng Bổ Trợ (Feats)
                    </h3>
                    <div className="space-y-2">
                      {featsToRender.map((f, idx) => (
                        <div key={idx} className="bg-dragon-950/50 border border-dragon-800 rounded-lg p-3 hover:border-dragon-gold/30 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-white text-dragon-gold">{f?.label}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded border bg-purple-900/50 text-purple-300 border-purple-700">{f?.category}</span>
                          </div>
                          {f?.prerequisite && f.prerequisite !== 'Không có' && (
                            <div className="text-[10px] text-red-400 italic mb-1.5">
                              Yêu cầu: {f.prerequisite}
                            </div>
                          )}
                          <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-line mt-1">{f?.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Class & Subclass Features (Auto from Database) */}
              {(() => {
                const activeFeats = getActiveFeatures(character.className, character.subclass, character.level);
                const classFeats = activeFeats.filter(f => f.source === 'class');
                const subFeats = activeFeats.filter(f => f.source === 'subclass');
                const actionColors: Record<string, string> = {
                  'Action': 'bg-blue-900/50 text-blue-300 border-blue-700',
                  'Bonus Action': 'bg-orange-900/50 text-orange-300 border-orange-700',
                  'Reaction': 'bg-purple-900/50 text-purple-300 border-purple-700',
                  'Passive': 'bg-green-900/50 text-green-300 border-green-700',
                  'Special': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
                };
                const renderFeature = (f: ClassFeature) => {
                  // Detect if description has choices (bullet points with •)
                  const lines = f.description.split('\n');
                  const hasChoices = lines.some(l => l.trim().startsWith('•'));
                  const introLines = lines.filter(l => !l.trim().startsWith('•'));
                  const choiceLines = lines.filter(l => l.trim().startsWith('•'));
                  const selectedChoice = character.featureChoices?.[f.name] || '';

                  return (
                    <div key={f.name + f.subclass} className="bg-dragon-950/50 border border-dragon-800 rounded-lg p-3 hover:border-dragon-gold/30 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{f.name}</span>
                          <span className="text-[10px] text-gray-500">({f.label})</span>
                          <span className="text-[9px] text-dragon-gold/60">Lv{f.level}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {f.actionType && <span className={`text-[9px] px-1.5 py-0.5 rounded border ${actionColors[f.actionType] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>{f.actionType}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {f.dice && <span className="text-[10px] bg-red-900/40 text-red-300 border border-red-800 px-1.5 py-0.5 rounded">🎲 {f.dice}</span>}
                        {f.usesPerRest && <span className="text-[10px] bg-cyan-900/40 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded">⟳ {f.usesPerRest}</span>}
                      </div>
                      {/* Intro text (non-bullet lines) */}
                      {introLines.length > 0 && (
                        <p className="text-[11px] text-gray-400 leading-relaxed mb-1">{introLines.join('\n')}</p>
                      )}
                      {/* Choice bullets as clickable checkboxes */}
                      {hasChoices && (
                        <div className="space-y-0.5 mt-1">
                          {choiceLines.map((line) => {
                            const cleanLine = line.trim().replace(/^•\s*/, '');
                            const optionName = cleanLine.split(':')[0].trim();
                            const isSelected = selectedChoice === optionName;
                            return (
                              <button
                                key={optionName}
                                onClick={() => {
                                  const newChoices = { ...(character.featureChoices || {}), [f.name]: isSelected ? '' : optionName };
                                  handleUpdate('featureChoices', newChoices);
                                }}
                                className={`w-full flex items-start gap-2 text-left px-2 py-1 rounded transition-all text-[11px] ${isSelected
                                  ? 'bg-dragon-gold/10 border border-dragon-gold/40 text-dragon-gold'
                                  : 'hover:bg-dragon-800/50 text-gray-400 border border-transparent'
                                  }`}
                              >
                                <span className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-dragon-gold bg-dragon-gold/20' : 'border-gray-600'
                                  }`}>
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-dragon-gold" />}
                                </span>
                                <span className={isSelected ? 'font-semibold' : ''}>{cleanLine}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {/* Non-choice features: plain text */}
                      {!hasChoices && introLines.length === 0 && (
                        <p className="text-[11px] text-gray-400 leading-relaxed whitespace-pre-line">{f.description}</p>
                      )}
                    </div>
                  );
                };
                return activeFeats.length > 0 ? (
                  <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                    <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider">Class & Subclass Features — Lv{character.level}</h3>
                    {classFeats.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Class: {character.className}</h4>
                        <div className="space-y-2">
                          {classFeats.map(renderFeature)}
                        </div>
                      </div>
                    )}
                    {subFeats.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Subclass: {character.subclass}</h4>
                        <div className="space-y-2">
                          {subFeats.map(renderFeature)}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Features & Traits (Manual) */}
              <div className="bg-dragon-900/40 border border-dragon-700 rounded-xl p-4">
                <h3 className="text-dragon-gold font-fantasy text-sm mb-3 uppercase tracking-wider">Đặc điểm bổ sung (Ghi chú thêm)</h3>
                <textarea
                  className="w-full bg-transparent text-xs text-gray-300 min-h-[80px] focus:outline-none border border-dragon-800 rounded p-2 focus:border-dragon-gold/30"
                  value={character.features}
                  onChange={(e) => handleUpdate('features', e.target.value)}
                  placeholder="Ghi chú thêm: feats, racial traits, homebrew features..."
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
            {(() => {
              // Class → Spellcasting Ability mapping
              const CLASS_SPELL_ABILITY: Record<string, string> = {
                'Wizard': 'int', 'Artificer': 'int',
                'Cleric': 'wis', 'Druid': 'wis', 'Ranger': 'wis', 'Monk': 'wis',
                'Bard': 'cha', 'Sorcerer': 'cha', 'Warlock': 'cha', 'Paladin': 'cha',
              };
              const ABILITY_LABELS: Record<string, string> = {
                'str': 'STR', 'dex': 'DEX', 'con': 'CON', 'int': 'INT', 'wis': 'WIS', 'cha': 'CHA'
              };
              const spellAbilityKey = CLASS_SPELL_ABILITY[character.className] || '';
              const spellAbilityLabel = ABILITY_LABELS[spellAbilityKey] || '—';
              const statObj = spellAbilityKey ? (effectiveStats as any)[spellAbilityKey] : null;
              const abilityScore = statObj ? (typeof statObj === 'object' ? statObj.score : statObj) || 10 : 10;
              const abilityMod = Math.floor((abilityScore - 10) / 2);
              const spellSaveDC = spellAbilityKey ? 8 + character.proficiencyBonus + abilityMod : 0;
              const spellAttackBonus = spellAbilityKey ? character.proficiencyBonus + abilityMod : 0;

              return (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Khả năng dùng phép */}
                  <div className="bg-dragon-900 border-2 border-dragon-gold/20 rounded-xl p-4 text-center relative">
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-[10px] font-bold text-dragon-gold uppercase">Khả năng dùng phép</label>
                      <BadgeTooltip tooltip={`Chỉ số năng lực dùng để cast phép, phụ thuộc vào class:\n\nWizard → INT (Trí tuệ)\nCleric / Druid / Ranger → WIS (Minh triết)\nBard / Sorcerer / Warlock / Paladin → CHA (Sức hút)\n\nChỉ số này ảnh hưởng đến Spell DC và Spell Attack.`} className="text-dragon-gold/50 hover:text-dragon-gold cursor-help">
                        <Info size={10} />
                      </BadgeTooltip>
                    </div>
                    <div className="text-lg font-fantasy text-white mt-1">{spellAbilityLabel}</div>
                    {spellAbilityKey && <div className="text-xs text-gray-400 mt-1">{abilityScore} ({abilityMod >= 0 ? '+' : ''}{abilityMod})</div>}
                    {!spellAbilityKey && <div className="text-xs text-gray-500 mt-1">Chọn class trước</div>}
                  </div>

                  {/* DC Tránh đòn phép */}
                  <div className="bg-dragon-900 border-2 border-dragon-gold/20 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-[10px] font-bold text-dragon-gold uppercase">DC Tránh đòn phép</label>
                      <BadgeTooltip tooltip={`Khi bạn cast phép buộc mục tiêu save (VD: Fireball → DEX save), mục tiêu cần roll đạt >= DC này.\n\nCông thức: 8 + Proficiency (${character.proficiencyBonus}) + ${spellAbilityLabel} mod (${abilityMod >= 0 ? '+' : ''}${abilityMod})\n= ${spellSaveDC}\n\nDC càng cao → phép càng khó tránh.`} className="text-dragon-gold/50 hover:text-dragon-gold cursor-help">
                        <Info size={10} />
                      </BadgeTooltip>
                    </div>
                    <div className="text-2xl font-fantasy text-white mt-1">{spellAbilityKey ? spellSaveDC : '—'}</div>
                    {spellAbilityKey && <div className="text-xs text-gray-400 mt-1">8 + {character.proficiencyBonus} + ({abilityMod})</div>}
                  </div>

                  {/* Hỗ trợ tấn công phép */}
                  <div className="bg-dragon-900 border-2 border-dragon-gold/20 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <label className="text-[10px] font-bold text-dragon-gold uppercase">Hỗ trợ tấn công phép</label>
                      <BadgeTooltip tooltip={`Khi cast phép cần roll to hit (VD: Fire Bolt, Guiding Bolt), cộng bonus này vào d20.\n\nCông thức: Proficiency (${character.proficiencyBonus}) + ${spellAbilityLabel} mod (${abilityMod >= 0 ? '+' : ''}${abilityMod})\n= +${spellAttackBonus}\n\nSo sánh với AC kẻ thù để xem trúng hay không.`} className="text-dragon-gold/50 hover:text-dragon-gold cursor-help">
                        <Info size={10} />
                      </BadgeTooltip>
                    </div>
                    <div className="text-2xl font-fantasy text-white mt-1">{spellAbilityKey ? `+${spellAttackBonus}` : '—'}</div>
                    {spellAbilityKey && <div className="text-xs text-gray-400 mt-1">{character.proficiencyBonus} + ({abilityMod})</div>}
                  </div>

                  <div className="bg-dragon-900 border-2 border-dragon-gold/20 rounded-xl p-4 text-center flex items-center justify-center">
                    <Sparkles className="text-dragon-gold animate-pulse" />
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {character.spellLevels.map((lvl, idx) => (
                <div key={idx} className="bg-dragon-900/40 border border-dragon-700 rounded-lg p-4 shadow-xl">
                  <div className="flex justify-between items-center mb-3 border-b border-dragon-700 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-dragon-gold text-black w-6 h-6 rounded flex items-center justify-center font-bold text-xs">{lvl.level}</div>
                      <BadgeTooltip
                        tooltip={lvl.level === 0 ? 'Phép cơ bản — dùng không giới hạn, không tốn ô phép (Spell Slot)' : `Phép cấp ${lvl.level} — cần ${lvl.level >= 6 ? 'ô phép cấp cao' : 'ô phép'} để sử dụng`}
                        className="font-fantasy text-sm text-dragon-gold uppercase cursor-help"
                      >
                        {lvl.level === 0 ? 'Phép cơ bản' : `Cấp ${lvl.level}`}
                      </BadgeTooltip>
                    </div>
                    <div className="relative">
                      <button onClick={() => setOpenSpellLevel(openSpellLevel === idx ? null : idx)} className="text-dragon-gold hover:text-white"><Plus size={14} /></button>
                      {openSpellLevel === idx && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => { setOpenSpellLevel(null); setSpellSearch(''); }} />
                          <div className="absolute right-0 top-full mt-1 w-72 bg-dragon-900 border border-dragon-700 rounded shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                            <input
                              autoFocus
                              className="w-full px-3 py-2 bg-dragon-800 text-xs text-white placeholder-gray-500 focus:outline-none border-b border-dragon-700"
                              placeholder="Tìm phép..."
                              value={spellSearch}
                              onChange={(e) => setSpellSearch(e.target.value)}
                            />
                            <div className="max-h-60 overflow-y-auto">
                              {SPELL_DATABASE
                                .filter(sp => sp.level === lvl.level)
                                .filter(sp => !spellSearch || sp.name.toLowerCase().includes(spellSearch.toLowerCase()) || sp.label.toLowerCase().includes(spellSearch.toLowerCase()))
                                .map(sp => {
                                  const isClassMatch = !character.className || sp.classes.includes(character.className);
                                  return (
                                    <button
                                      key={sp.name}
                                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-dragon-800 hover:text-white border-b border-dragon-800/50 ${isClassMatch ? 'text-gray-300' : 'text-gray-500'}`}
                                      onClick={() => { addSpell(idx, sp.name); setOpenSpellLevel(null); setSpellSearch(''); }}
                                    >
                                      <span className="font-medium">{sp.name}</span>
                                      <span className="text-gray-600 ml-1">({sp.label})</span>
                                      {!isClassMatch && <span className="text-orange-400 ml-1 text-[10px]">không thuộc class</span>}
                                      <div className="text-[10px] text-gray-500 mt-0.5">{sp.school} · {sp.castingTime} · {sp.range}{sp.concentration ? ' · Concentration' : ''}</div>
                                    </button>
                                  );
                                })}
                              <button
                                className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:bg-dragon-800 hover:text-white border-t border-dragon-600"
                                onClick={() => { addSpell(idx, 'Tùy chỉnh...'); setOpenSpellLevel(null); setSpellSearch(''); }}
                              >
                                ✏️ Nhập tay...
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
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
                    {lvl.spells.map((s, spellIdx) => {
                      const spellData = SPELL_DATABASE.find(sp => sp.name === s);
                      const isClassMatch = !spellData || !character.className || spellData.classes.includes(character.className);
                      return (
                        <div key={spellIdx} className="flex items-center gap-2 group">
                          {spellData ? (
                            <BadgeTooltip
                              tooltip={`${spellData.name} (${spellData.label})\n${spellData.school} · Level ${spellData.level}\nThời gian: ${spellData.castingTime} · Tầm: ${spellData.range}\nThời lượng: ${spellData.duration}${spellData.concentration ? ' (Concentration)' : ''}\nThành phần: ${spellData.components}\nClass: ${spellData.classes.join(', ')}${!isClassMatch ? '\n\n⚠ Phép này không thuộc class của bạn!' : ''}\n\n${spellData.description}`}
                              className={`flex-1 text-xs py-1 border-b border-dragon-800 hover:text-dragon-gold transition-colors ${isClassMatch ? 'text-gray-300' : 'text-orange-400/70'}`}
                            >
                              {s} <span className="text-gray-600">({spellData.label})</span>
                              {!isClassMatch && <span className="text-orange-400 text-[9px] ml-1">không thuộc class</span>}
                            </BadgeTooltip>
                          ) : (
                            <input
                              className="flex-1 bg-transparent text-xs text-gray-300 py-1 border-b border-dragon-800 focus:border-dragon-gold outline-none focus:text-white"
                              value={s}
                              onChange={(e) => {
                                const newSpellLevels = character.spellLevels.map((l, i) => {
                                  if (i !== idx) return l;
                                  const newSpells = [...l.spells];
                                  newSpells[spellIdx] = e.target.value;
                                  return { ...l, spells: newSpells };
                                });
                                handleUpdate('spellLevels', newSpellLevels);
                              }}
                            />
                          )}
                          <button
                            onClick={() => {
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
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div >
  );
};

export default CharacterSheet;