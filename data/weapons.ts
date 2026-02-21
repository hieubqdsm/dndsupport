// === WEAPON DATABASE (PHB 2024 Ch.6) ===
// Homebrew: Thêm vũ khí mới vào array bên dưới

import { WeaponData } from '../types';

export const WEAPON_DATABASE: WeaponData[] = [
    // === Simple Melee ===
    { value: 'Club', label: 'Club (Chùy gỗ)', category: 'Simple', type: 'Melee', damageDice: '1d4', damageType: 'Bludgeoning', properties: ['Light'], mastery: 'Slow', weight: 2, cost: '1 SP' },
    { value: 'Dagger', label: 'Dagger (Dao găm)', category: 'Simple', type: 'Melee', damageDice: '1d4', damageType: 'Piercing', properties: ['Finesse', 'Light', 'Thrown'], mastery: 'Nick', rangeNormal: 20, rangeLong: 60, weight: 1, cost: '2 GP' },
    { value: 'Greatclub', label: 'Greatclub (Gậy lớn)', category: 'Simple', type: 'Melee', damageDice: '1d8', damageType: 'Bludgeoning', properties: ['Two-Handed'], mastery: 'Push', weight: 10, cost: '2 SP' },
    { value: 'Handaxe', label: 'Handaxe (Rìu tay)', category: 'Simple', type: 'Melee', damageDice: '1d6', damageType: 'Slashing', properties: ['Light', 'Thrown'], mastery: 'Vex', rangeNormal: 20, rangeLong: 60, weight: 2, cost: '5 GP' },
    { value: 'Javelin', label: 'Javelin (Lao)', category: 'Simple', type: 'Melee', damageDice: '1d6', damageType: 'Piercing', properties: ['Thrown'], mastery: 'Slow', rangeNormal: 30, rangeLong: 120, weight: 2, cost: '5 SP' },
    { value: 'Light Hammer', label: 'Light Hammer (Búa nhẹ)', category: 'Simple', type: 'Melee', damageDice: '1d4', damageType: 'Bludgeoning', properties: ['Light', 'Thrown'], mastery: 'Nick', rangeNormal: 20, rangeLong: 60, weight: 2, cost: '2 GP' },
    { value: 'Mace', label: 'Mace (Chùy)', category: 'Simple', type: 'Melee', damageDice: '1d6', damageType: 'Bludgeoning', properties: [], mastery: 'Sap', weight: 4, cost: '5 GP' },
    { value: 'Quarterstaff', label: 'Quarterstaff (Gậy quý)', category: 'Simple', type: 'Melee', damageDice: '1d6', damageType: 'Bludgeoning', properties: ['Versatile'], mastery: 'Topple', versatileDice: '1d8', weight: 4, cost: '2 SP' },
    { value: 'Sickle', label: 'Sickle (Liềm)', category: 'Simple', type: 'Melee', damageDice: '1d4', damageType: 'Slashing', properties: ['Light'], mastery: 'Nick', weight: 2, cost: '1 GP' },
    { value: 'Spear', label: 'Spear (Giáo)', category: 'Simple', type: 'Melee', damageDice: '1d6', damageType: 'Piercing', properties: ['Thrown', 'Versatile'], mastery: 'Sap', versatileDice: '1d8', rangeNormal: 20, rangeLong: 60, weight: 3, cost: '1 GP' },
    // === Simple Ranged ===
    { value: 'Dart', label: 'Dart (Phi tiêu)', category: 'Simple', type: 'Ranged', damageDice: '1d4', damageType: 'Piercing', properties: ['Finesse', 'Thrown'], mastery: 'Vex', rangeNormal: 20, rangeLong: 60, weight: 0.25, cost: '5 CP' },
    { value: 'Light Crossbow', label: 'Light Crossbow (Nỏ nhẹ)', category: 'Simple', type: 'Ranged', damageDice: '1d8', damageType: 'Piercing', properties: ['Ammunition', 'Loading', 'Two-Handed'], mastery: 'Slow', rangeNormal: 80, rangeLong: 320, weight: 5, cost: '25 GP' },
    { value: 'Shortbow', label: 'Shortbow (Cung ngắn)', category: 'Simple', type: 'Ranged', damageDice: '1d6', damageType: 'Piercing', properties: ['Ammunition', 'Two-Handed'], mastery: 'Vex', rangeNormal: 80, rangeLong: 320, weight: 2, cost: '25 GP' },
    { value: 'Sling', label: 'Sling (Ná)', category: 'Simple', type: 'Ranged', damageDice: '1d4', damageType: 'Bludgeoning', properties: ['Ammunition'], mastery: 'Slow', rangeNormal: 30, rangeLong: 120, weight: 0, cost: '1 SP' },
    // === Martial Melee ===
    { value: 'Battleaxe', label: 'Battleaxe (Rìu chiến)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Slashing', properties: ['Versatile'], mastery: 'Topple', versatileDice: '1d10', weight: 4, cost: '10 GP' },
    { value: 'Flail', label: 'Flail (Chùy xích)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Bludgeoning', properties: [], mastery: 'Sap', weight: 2, cost: '10 GP' },
    { value: 'Glaive', label: 'Glaive (Đao dài)', category: 'Martial', type: 'Melee', damageDice: '1d10', damageType: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Graze', weight: 6, cost: '20 GP' },
    { value: 'Greataxe', label: 'Greataxe (Rìu lớn)', category: 'Martial', type: 'Melee', damageDice: '1d12', damageType: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Cleave', weight: 7, cost: '30 GP' },
    { value: 'Greatsword', label: 'Greatsword (Kiếm lớn)', category: 'Martial', type: 'Melee', damageDice: '2d6', damageType: 'Slashing', properties: ['Heavy', 'Two-Handed'], mastery: 'Graze', weight: 6, cost: '50 GP' },
    { value: 'Halberd', label: 'Halberd (Kích)', category: 'Martial', type: 'Melee', damageDice: '1d10', damageType: 'Slashing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Cleave', weight: 6, cost: '20 GP' },
    { value: 'Lance', label: 'Lance (Thương kỵ binh)', category: 'Martial', type: 'Melee', damageDice: '1d10', damageType: 'Piercing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Topple', weight: 6, cost: '10 GP' },
    { value: 'Longsword', label: 'Longsword (Kiếm dài)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Slashing', properties: ['Versatile'], mastery: 'Sap', versatileDice: '1d10', weight: 3, cost: '15 GP' },
    { value: 'Maul', label: 'Maul (Búa lớn)', category: 'Martial', type: 'Melee', damageDice: '2d6', damageType: 'Bludgeoning', properties: ['Heavy', 'Two-Handed'], mastery: 'Topple', weight: 10, cost: '10 GP' },
    { value: 'Morningstar', label: 'Morningstar (Chùy gai)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Piercing', properties: [], mastery: 'Sap', weight: 4, cost: '15 GP' },
    { value: 'Pike', label: 'Pike (Thương dài)', category: 'Martial', type: 'Melee', damageDice: '1d10', damageType: 'Piercing', properties: ['Heavy', 'Reach', 'Two-Handed'], mastery: 'Push', weight: 18, cost: '5 GP' },
    { value: 'Rapier', label: 'Rapier (Kiếm rapier)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Piercing', properties: ['Finesse'], mastery: 'Vex', weight: 2, cost: '25 GP' },
    { value: 'Scimitar', label: 'Scimitar (Đao cong)', category: 'Martial', type: 'Melee', damageDice: '1d6', damageType: 'Slashing', properties: ['Finesse', 'Light'], mastery: 'Nick', weight: 3, cost: '25 GP' },
    { value: 'Shortsword', label: 'Shortsword (Kiếm ngắn)', category: 'Martial', type: 'Melee', damageDice: '1d6', damageType: 'Piercing', properties: ['Finesse', 'Light'], mastery: 'Vex', weight: 2, cost: '10 GP' },
    { value: 'Trident', label: 'Trident (Đinh ba)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Piercing', properties: ['Thrown', 'Versatile'], mastery: 'Topple', versatileDice: '1d10', rangeNormal: 20, rangeLong: 60, weight: 4, cost: '5 GP' },
    { value: 'War Pick', label: 'War Pick (Cuốc chiến)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Piercing', properties: ['Versatile'], mastery: 'Sap', versatileDice: '1d10', weight: 2, cost: '5 GP' },
    { value: 'Warhammer', label: 'Warhammer (Búa chiến)', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Bludgeoning', properties: ['Versatile'], mastery: 'Push', versatileDice: '1d10', weight: 5, cost: '15 GP' },
    { value: 'Whip', label: 'Whip (Roi)', category: 'Martial', type: 'Melee', damageDice: '1d4', damageType: 'Slashing', properties: ['Finesse', 'Reach'], mastery: 'Slow', weight: 3, cost: '2 GP' },
    // === Martial Ranged ===
    { value: 'Blowgun', label: 'Blowgun (Ống thổi)', category: 'Martial', type: 'Ranged', damageDice: '1', damageType: 'Piercing', properties: ['Ammunition', 'Loading'], mastery: 'Vex', rangeNormal: 25, rangeLong: 100, weight: 1, cost: '10 GP' },
    { value: 'Hand Crossbow', label: 'Hand Crossbow (Nỏ tay)', category: 'Martial', type: 'Ranged', damageDice: '1d6', damageType: 'Piercing', properties: ['Ammunition', 'Light', 'Loading'], mastery: 'Vex', rangeNormal: 30, rangeLong: 120, weight: 3, cost: '75 GP' },
    { value: 'Heavy Crossbow', label: 'Heavy Crossbow (Nỏ nặng)', category: 'Martial', type: 'Ranged', damageDice: '1d10', damageType: 'Piercing', properties: ['Ammunition', 'Heavy', 'Loading', 'Two-Handed'], mastery: 'Push', rangeNormal: 100, rangeLong: 400, weight: 18, cost: '50 GP' },
    { value: 'Longbow', label: 'Longbow (Cung dài)', category: 'Martial', type: 'Ranged', damageDice: '1d8', damageType: 'Piercing', properties: ['Ammunition', 'Heavy', 'Two-Handed'], mastery: 'Slow', rangeNormal: 150, rangeLong: 600, weight: 2, cost: '50 GP' },
    { value: 'Musket', label: 'Musket (Súng hỏa mai)', category: 'Martial', type: 'Ranged', damageDice: '1d12', damageType: 'Piercing', properties: ['Ammunition', 'Loading', 'Two-Handed'], mastery: 'Slow', rangeNormal: 40, rangeLong: 120, weight: 10, cost: '500 GP' },
    { value: 'Pistol', label: 'Pistol (Súng lục)', category: 'Martial', type: 'Ranged', damageDice: '1d10', damageType: 'Piercing', properties: ['Ammunition', 'Loading'], mastery: 'Vex', rangeNormal: 30, rangeLong: 90, weight: 3, cost: '250 GP' },

    // === HOMEBREW WEAPONS ===
    // Thêm vũ khí tự chế ở đây:
    // { value: 'MyWeapon', label: 'Tên vũ khí', category: 'Martial', type: 'Melee', damageDice: '1d8', damageType: 'Slashing', properties: ['Versatile'], mastery: 'Sap', versatileDice: '1d10', weight: 3, cost: '20 GP' },
];
