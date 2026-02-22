
export interface AbilityScore {
  score: number;
  modifier: number;
}

export interface Skill {
  name: string;
  ability: string;
  proficient: boolean;
  bonus: number;
}

export interface Attack {
  name: string;
  bonus: number;
  damage: string;
  type: string;
}

export type WeaponProperty = 'Finesse' | 'Light' | 'Heavy' | 'Versatile' | 'Thrown' | 'Ammunition' | 'Loading' | 'Two-Handed' | 'Reach';
export type MasteryProperty = 'Cleave' | 'Graze' | 'Nick' | 'Push' | 'Sap' | 'Slow' | 'Topple' | 'Vex';
export type DamageType = 'Bludgeoning' | 'Piercing' | 'Slashing';

export interface WeaponData {
  value: string;
  label: string;
  category: 'Simple' | 'Martial';
  type: 'Melee' | 'Ranged';
  damageDice: string;        // "1d8", "2d6", "1"
  damageType: DamageType;
  properties: WeaponProperty[];
  mastery: MasteryProperty;
  versatileDice?: string;    // "1d10" nếu Versatile
  rangeNormal?: number;      // Tầm thường (feet)
  rangeLong?: number;        // Tầm xa (feet)
  weight: number;
  cost: string;
}

export interface CharacterWeapon {
  weaponId: string;          // Reference tới WeaponData.value
  customName?: string;       // Tên custom (VD: "Kiếm lửa +1")
  magicBonus: number;        // 0, +1, +2, +3
  usesTwoHands: boolean;     // Đang cầm 2 tay? (cho Versatile)
  // Computed fields (tính tự động)
  attackBonus: number;
  damageFormula: string;     // "1d8+3", "2d6+5", etc.
  damageType: string;
}

export interface SpellLevel {
  level: number;
  slotsTotal: number;
  slotsUsed: number;
  spells: string[];
}

export interface Subclass {
  value: string;
  label: string;
  className: string;
  description: string;
  levelGained: number;
  features: string[];
}

export interface ArmorData {
  value: string;
  label: string;
  category: 'Light' | 'Medium' | 'Heavy' | 'Shield';
  acFormula: string;
  acBase: number;
  maxDexBonus: number | null; // null = unlimited, 0 = none
  strRequirement: number | null;
  stealthDisadvantage: boolean;
  weight: number;
  cost: string;
}

export interface Feat {
  value: string;
  label: string;
  category: 'Origin' | 'General' | 'Fighting Style' | 'Epic Boon';
  prerequisite: string;
  description: string;
}

export interface AsiChoice {
  type: 'asi' | 'feat';
  ability1?: string;  // e.g. 'str', 'dex'
  amount1?: number;   // +1 or +2
  ability2?: string;  // for +1/+1 split
  amount2?: number;
  featName?: string;
}

export interface Character {
  // Trang 1: Thông tin cơ bản & Chiến đấu
  name: string;
  className: string; // Thay cho classLevel
  subclass: string;  // Subclass đã chọn
  level: number;     // Tách level ra riêng
  background: string;
  race: string;
  alignment: string;
  xp: number;
  playerName: string;

  // Trang bị giáp
  armorWorn: string;       // Tên armor đang mặc (rỗng = không mặc)
  shieldEquipped: boolean; // Có cầm shield không (+2 AC)
  feats: string[];         // Danh sách feats đã chọn
  featureChoices: Record<string, string>; // Feature name → selected option (e.g. "Fighting Style" → "Archery")
  asiChoices: Record<string, AsiChoice>; // Level string → ASI choice at that level
  racialBonuses: Record<string, number>; // e.g. { str: 2, dex: 1 } for +2 STR / +1 DEX

  stats: {
    str: AbilityScore;
    dex: AbilityScore;
    con: AbilityScore;
    int: AbilityScore;
    wis: AbilityScore;
    cha: AbilityScore;
  };

  inspiration: boolean;
  proficiencyBonus: number;
  savingThrows: string[];
  skills: Skill[];
  passivePerception: number;

  ac: number;
  initiative: number;
  speed: number;
  hp: { current: number; max: number; temp: number };
  hitDice: string;
  deathSaves: { success: number; failure: number };

  attacks: Attack[];         // Giữ lại cho tùy chỉnh thủ công
  weapons: CharacterWeapon[]; // Vũ khí auto-calculated
  otherProficiencies: string; // Ngôn ngữ & Công cụ
  equipment: { name: string; amount: number }[];
  money: { cp: number; sp: number; ep: number; gp: number; pp: number };
  features: string; // Các đặc điểm nổi bật

  // Trang 1: Tính cách
  personality: string;
  ideals: string;
  bonds: string;
  flaws: string;

  // Trang 2: Tiểu sử
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  appearanceDesc: string;
  backstory: string;
  allies: string;
  treasure: string;

  // Trang 3: Phép thuật
  spellcastingAbility: string;
  spellSaveDC: number;
  spellAttackBonus: number;
  spellLevels: SpellLevel[];
}

export interface DiceRoll {
  id: string;
  type: number;
  value: number;
  timestamp: Date;
}

export type TabType = 'combat' | 'bio' | 'spells';

export interface DataOption {
  value: string;
  label: string;
  description: string;
  savingThrows?: string[];
  defaultSkills?: string[];
  speed?: number;
  traits?: string[];
  abilityBonuses?: { [key: string]: number };
  skillBonuses?: string[];
  hitDie?: string; // e.g. "d6", "d8", "d10", "d12"
}

export interface MonsterAction {
  name: string;
  desc: string;
}

export interface Monster {
  name: string;
  size: string;
  type: string;
  alignment: string;
  ac: string; // e.g. "18 (Plate)"
  hp: string; // e.g. "33 (6d8 + 6)"
  speed: string;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  saves?: string;
  skills?: string;
  senses: string;
  languages: string;
  challenge: string;
  traits: MonsterAction[]; // Passive abilities
  actions: MonsterAction[]; // Attacks
  legendaryActions?: MonsterAction[];
  description?: string; // Flavor text
}