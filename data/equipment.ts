// === EQUIPMENT DATABASE (PHB 2024 Ch.6) ===
// Homebrew: Thêm trang bị mới vào array bên dưới

// === EQUIPMENT DATABASE (PHB 2024) ===
export interface EquipmentItem {
  name: string;
  label: string;        // Tên VN
  category: 'Potion' | 'Gear' | 'Tool' | 'Ammo' | 'Container' | 'Camp';
  cost: string;
  weight: number;
}

export const EQUIPMENT_DATABASE: EquipmentItem[] = [
  // === Potions & Consumables ===
  { name: 'Potion of Healing', label: 'Bình máu (2d4+2)', category: 'Potion', cost: '50 GP', weight: 0.5 },
  { name: 'Potion of Greater Healing', label: 'Bình máu lớn (4d4+4)', category: 'Potion', cost: '100 GP', weight: 0.5 },
  { name: 'Potion of Superior Healing', label: 'Bình máu cao (8d4+8)', category: 'Potion', cost: '500 GP', weight: 0.5 },
  { name: 'Potion of Supreme Healing', label: 'Bình máu tối thượng (10d4+20)', category: 'Potion', cost: '5000 GP', weight: 0.5 },
  { name: 'Antitoxin', label: 'Thuốc giải độc', category: 'Potion', cost: '50 GP', weight: 0 },
  { name: 'Holy Water', label: 'Nước thánh (2d6 radiant)', category: 'Potion', cost: '25 GP', weight: 1 },

  // === Adventuring Gear ===
  { name: 'Rope (50ft)', label: 'Dây thừng (15m)', category: 'Gear', cost: '1 GP', weight: 10 },
  { name: 'Torch', label: 'Đuốc', category: 'Gear', cost: '1 CP', weight: 1 },
  { name: 'Lantern (Hooded)', label: 'Đèn lồng', category: 'Gear', cost: '5 GP', weight: 2 },
  { name: 'Oil Flask', label: 'Bình dầu', category: 'Gear', cost: '1 SP', weight: 1 },
  { name: 'Tinderbox', label: 'Hộp mồi lửa', category: 'Gear', cost: '5 SP', weight: 1 },
  { name: 'Grappling Hook', label: 'Móc leo', category: 'Gear', cost: '2 GP', weight: 4 },
  { name: 'Crowbar', label: 'Xà beng', category: 'Gear', cost: '2 GP', weight: 5 },
  { name: 'Chain (10ft)', label: 'Xích sắt (3m)', category: 'Gear', cost: '5 GP', weight: 10 },
  { name: 'Piton (10)', label: 'Đinh leo (10 cái)', category: 'Gear', cost: '5 CP', weight: 2.5 },
  { name: 'Manacles', label: 'Còng tay', category: 'Gear', cost: '2 GP', weight: 6 },
  { name: 'Mirror (Steel)', label: 'Gương thép', category: 'Gear', cost: '5 GP', weight: 0.5 },
  { name: 'Spyglass', label: 'Ống nhòm', category: 'Gear', cost: '1000 GP', weight: 1 },
  { name: 'Caltrops (20)', label: 'Đinh bẫy (20 cái)', category: 'Gear', cost: '1 GP', weight: 2 },
  { name: 'Ball Bearings (1000)', label: 'Bi sắt (1000 viên)', category: 'Gear', cost: '1 GP', weight: 2 },
  { name: 'Healer\'s Kit', label: 'Bộ sơ cứu (10 lần)', category: 'Gear', cost: '5 GP', weight: 3 },
  { name: 'Component Pouch', label: 'Túi thành phần phép', category: 'Gear', cost: '25 GP', weight: 2 },
  { name: 'Spellcasting Focus', label: 'Vật tập trung phép', category: 'Gear', cost: '10 GP', weight: 1 },

  // === Tools & Kits ===
  { name: 'Thieves\' Tools', label: 'Dụng cụ trộm', category: 'Tool', cost: '25 GP', weight: 1 },
  { name: 'Herbalism Kit', label: 'Bộ thảo dược', category: 'Tool', cost: '5 GP', weight: 3 },
  { name: 'Alchemist\'s Supplies', label: 'Dụng cụ giả kim', category: 'Tool', cost: '50 GP', weight: 8 },
  { name: 'Smith\'s Tools', label: 'Dụng cụ rèn', category: 'Tool', cost: '20 GP', weight: 8 },
  { name: 'Disguise Kit', label: 'Bộ cải trang', category: 'Tool', cost: '25 GP', weight: 3 },
  { name: 'Forgery Kit', label: 'Bộ làm giả', category: 'Tool', cost: '15 GP', weight: 5 },
  { name: 'Poisoner\'s Kit', label: 'Bộ chế độc', category: 'Tool', cost: '50 GP', weight: 2 },
  { name: 'Navigator\'s Tools', label: 'Dụng cụ hoa tiêu', category: 'Tool', cost: '25 GP', weight: 2 },

  // === Ammunition ===
  { name: 'Arrows (20)', label: 'Mũi tên (20)', category: 'Ammo', cost: '1 GP', weight: 1 },
  { name: 'Bolts (20)', label: 'Mũi nỏ (20)', category: 'Ammo', cost: '1 GP', weight: 1.5 },
  { name: 'Sling Bullets (20)', label: 'Đạn ná (20)', category: 'Ammo', cost: '4 CP', weight: 1.5 },
  { name: 'Blowgun Needles (50)', label: 'Kim phóng (50)', category: 'Ammo', cost: '1 GP', weight: 1 },

  // === Containers ===
  { name: 'Backpack', label: 'Ba lô', category: 'Container', cost: '2 GP', weight: 5 },
  { name: 'Bag of Holding', label: 'Túi không đáy (Magic)', category: 'Container', cost: 'Rare', weight: 15 },
  { name: 'Pouch', label: 'Túi nhỏ', category: 'Container', cost: '5 SP', weight: 1 },
  { name: 'Quiver', label: 'Ống tên', category: 'Container', cost: '1 GP', weight: 1 },
  { name: 'Waterskin', label: 'Bình nước', category: 'Container', cost: '2 SP', weight: 5 },

  // === Camping & Travel ===
  { name: 'Bedroll', label: 'Chăn ngủ', category: 'Camp', cost: '1 GP', weight: 7 },
  { name: 'Tent (2-person)', label: 'Lều (2 người)', category: 'Camp', cost: '2 GP', weight: 20 },
  { name: 'Rations (1 day)', label: 'Khẩu phần (1 ngày)', category: 'Camp', cost: '5 SP', weight: 2 },
  { name: 'Mess Kit', label: 'Bộ ăn uống', category: 'Camp', cost: '2 SP', weight: 1 },
];

// === HOMEBREW EQUIPMENT ===
// Thêm trang bị tự chế ở đây:
