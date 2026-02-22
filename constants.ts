// === CONSTANTS.TS — Re-export Hub ===
// Tất cả database được tách vào thư mục data/ để dễ quản lý và homebrew
// Import trực tiếp từ data/ hoặc dùng file này cho backward compatibility

import { Character, DataOption } from './types';

// --- Re-export tất cả databases ---
export { SKILL_LIST_VN, ABILITY_INFO, SKILL_INFO_MAP } from './data/skills';
export { CLASSES_VN } from './data/classes';
export { SPECIES_VN } from './data/species';
export { BACKGROUNDS_VN } from './data/backgrounds';
export { ALIGNMENTS_VN } from './data/alignments';
export { WEAPON_DATABASE } from './data/weapons';
export { SUBCLASSES_VN } from './data/subclasses';
export { ARMOR_VN } from './data/armor';
export { EQUIPMENT_DATABASE } from './data/equipment';
export type { EquipmentItem } from './data/equipment';

// --- Derived data ---
import { WEAPON_DATABASE } from './data/weapons';
import { SKILL_LIST_VN } from './data/skills';

export const WEAPONS_VN: DataOption[] = WEAPON_DATABASE.map(w => ({
  value: w.value,
  label: w.label,
  description: `${w.damageDice} ${w.damageType} - ${w.properties.join(', ')}${w.properties.length ? '' : 'Không'} | Mastery: ${w.mastery}`
}));

export const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

// ASI levels per class (D&D 5e PHB)
export const ASI_LEVELS: Record<string, number[]> = {
  Fighter: [4, 6, 8, 12, 14, 16, 19],
  Rogue: [4, 8, 10, 12, 16, 19],
  // All other classes
  Barbarian: [4, 8, 12, 16, 19],
  Bard: [4, 8, 12, 16, 19],
  Cleric: [4, 8, 12, 16, 19],
  Druid: [4, 8, 12, 16, 19],
  Monk: [4, 8, 12, 16, 19],
  Paladin: [4, 8, 12, 16, 19],
  Ranger: [4, 8, 12, 16, 19],
  Sorcerer: [4, 8, 12, 16, 19],
  Warlock: [4, 8, 12, 16, 19],
  Wizard: [4, 8, 12, 16, 19],
};

export const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
export const ABILITY_LABELS: Record<string, string> = {
  str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA'
};

// --- Character Templates ---
const emptySpellLevels = Array.from({ length: 10 }, (_, i) => ({
  level: i,
  slotsTotal: 0,
  slotsUsed: 0,
  spells: []
}));

export const BLANK_CHARACTER_VN: Character = {
  name: "",
  className: "",
  subclass: "",
  level: 1,
  background: "",
  race: "",
  alignment: "",
  xp: 0,
  playerName: "",
  armorWorn: "",
  shieldEquipped: false,
  feats: [],
  featureChoices: {},
  asiChoices: {},
  racialBonuses: {},
  stats: {
    str: { score: 10, modifier: 0 },
    dex: { score: 10, modifier: 0 },
    con: { score: 10, modifier: 0 },
    int: { score: 10, modifier: 0 },
    wis: { score: 10, modifier: 0 },
    cha: { score: 10, modifier: 0 },
  },
  inspiration: false,
  proficiencyBonus: 2,
  savingThrows: [],
  skills: SKILL_LIST_VN.map(s => ({
    ...s,
    proficient: false,
    bonus: 0
  })),
  passivePerception: 10,
  ac: 10,
  initiative: 0,
  speed: 30,
  hp: { current: 0, max: 0, temp: 0 },
  hitDice: "",
  deathSaves: { success: 0, failure: 0 },
  attacks: [],
  weapons: [],
  otherProficiencies: "",
  equipment: [],
  money: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
  features: "",
  personality: "",
  ideals: "",
  bonds: "",
  flaws: "",
  age: "",
  height: "",
  weight: "",
  eyes: "",
  skin: "",
  hair: "",
  appearanceDesc: "",
  backstory: "",
  allies: "",
  treasure: "",
  spellcastingAbility: "",
  spellSaveDC: 8,
  spellAttackBonus: 0,
  spellLevels: emptySpellLevels
};

export const DEFAULT_CHARACTER_VN: Character = {
  ...BLANK_CHARACTER_VN,
  name: "Chiến Binh Rồng",
  className: "Fighter",
  subclass: "Champion",
  level: 1,
  background: "Soldier",
  race: "Human",
  alignment: "Neutral Good",
  xp: 0,
  stats: {
    str: { score: 16, modifier: 3 },
    dex: { score: 14, modifier: 2 },
    con: { score: 15, modifier: 2 },
    int: { score: 10, modifier: 0 },
    wis: { score: 12, modifier: 1 },
    cha: { score: 8, modifier: -1 },
  },
  proficiencyBonus: 2,
  savingThrows: ["str", "con"],
  ac: 16,
  initiative: 2,
  speed: 30,
  hp: { current: 12, max: 12, temp: 0 },
  hitDice: "1d10",
  weapons: [],
  equipment: [],
  money: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
  features: "Fighting Style: Defense (+1 AC khi mặc giáp)\nSecond Wind: Bonus Action heal 1d10 + Fighter level (1/short rest)",
  personality: "Kỷ luật, trầm tĩnh nhưng quyết đoán",
  ideals: "Bảo vệ người yếu, giữ danh dự",
  bonds: "Gắn bó với đội quân cũ",
  flaws: "Cứng đầu, khó thay đổi suy nghĩ",
  armorWorn: "Chain Mail",
  shieldEquipped: true,
};