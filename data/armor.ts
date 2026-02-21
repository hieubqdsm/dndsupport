// === ARMOR DATABASE (PHB 2024 Ch.6) ===
// Homebrew: Thêm giáp mới vào array bên dưới

import { ArmorData } from '../types';

export const ARMOR_VN: ArmorData[] = [
  // Light Armor
  { value: 'Padded', label: 'Padded (Giáp bông)', category: 'Light', acFormula: '11 + Dex', acBase: 11, maxDexBonus: null, strRequirement: null, stealthDisadvantage: true, weight: 8, cost: '5 GP' },
  { value: 'Leather', label: 'Leather (Giáp da)', category: 'Light', acFormula: '11 + Dex', acBase: 11, maxDexBonus: null, strRequirement: null, stealthDisadvantage: false, weight: 10, cost: '10 GP' },
  { value: 'Studded Leather', label: 'Studded Leather (Giáp da tán đinh)', category: 'Light', acFormula: '12 + Dex', acBase: 12, maxDexBonus: null, strRequirement: null, stealthDisadvantage: false, weight: 13, cost: '45 GP' },
  // Medium Armor
  { value: 'Hide', label: 'Hide (Giáp da thú)', category: 'Medium', acFormula: '12 + Dex (max 2)', acBase: 12, maxDexBonus: 2, strRequirement: null, stealthDisadvantage: false, weight: 12, cost: '10 GP' },
  { value: 'Chain Shirt', label: 'Chain Shirt (Áo xích)', category: 'Medium', acFormula: '13 + Dex (max 2)', acBase: 13, maxDexBonus: 2, strRequirement: null, stealthDisadvantage: false, weight: 20, cost: '50 GP' },
  { value: 'Scale Mail', label: 'Scale Mail (Giáp vảy)', category: 'Medium', acFormula: '14 + Dex (max 2)', acBase: 14, maxDexBonus: 2, strRequirement: null, stealthDisadvantage: true, weight: 45, cost: '50 GP' },
  { value: 'Breastplate', label: 'Breastplate (Giáp ngực)', category: 'Medium', acFormula: '14 + Dex (max 2)', acBase: 14, maxDexBonus: 2, strRequirement: null, stealthDisadvantage: false, weight: 20, cost: '400 GP' },
  { value: 'Half Plate', label: 'Half Plate (Bán giáp)', category: 'Medium', acFormula: '15 + Dex (max 2)', acBase: 15, maxDexBonus: 2, strRequirement: null, stealthDisadvantage: true, weight: 40, cost: '750 GP' },
  // Heavy Armor
  { value: 'Ring Mail', label: 'Ring Mail (Giáp khoen)', category: 'Heavy', acFormula: '14', acBase: 14, maxDexBonus: 0, strRequirement: null, stealthDisadvantage: true, weight: 40, cost: '30 GP' },
  { value: 'Chain Mail', label: 'Chain Mail (Giáp xích)', category: 'Heavy', acFormula: '16', acBase: 16, maxDexBonus: 0, strRequirement: 13, stealthDisadvantage: true, weight: 55, cost: '75 GP' },
  { value: 'Splint', label: 'Splint (Giáp nẹp)', category: 'Heavy', acFormula: '17', acBase: 17, maxDexBonus: 0, strRequirement: 15, stealthDisadvantage: true, weight: 60, cost: '200 GP' },
  { value: 'Plate', label: 'Plate (Giáp bản)', category: 'Heavy', acFormula: '18', acBase: 18, maxDexBonus: 0, strRequirement: 15, stealthDisadvantage: true, weight: 65, cost: '1,500 GP' },
  // Shield
  { value: 'Shield', label: 'Shield (Khiên)', category: 'Shield', acFormula: '+2', acBase: 2, maxDexBonus: null, strRequirement: null, stealthDisadvantage: false, weight: 6, cost: '10 GP' },
];


// === HOMEBREW ARMOR ===
// Thêm giáp tự chế ở đây:
