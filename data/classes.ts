// === CHARACTER CLASSES (PHB 2024 Ch.3) ===
// Homebrew: Thêm class mới vào array bên dưới

import { DataOption } from '../types';

export const CLASSES_VN: DataOption[] = [
  {
    value: 'Barbarian',
    label: 'Barbarian (Chiến Binh Cuồng Nộ)',
    description: 'Chiến binh hùng mạnh, được tiếp sức bởi các lực lượng nguyên thủy.',
    savingThrows: ['str', 'con'],
    defaultSkills: ['Linh Hoạt', 'Hăm Doạ'],
    hitDie: 'd12'
  },
  {
    value: 'Bard',
    label: 'Bard (Thi Sĩ)',
    description: 'Bậc thầy truyền cảm hứng và phép thuật thông qua âm nhạc.',
    savingThrows: ['dex', 'cha'],
    defaultSkills: ['Diễn Xuất', 'Thuyết Phục'],
    hitDie: 'd8'
  },
  {
    value: 'Cleric',
    label: 'Cleric (Tu Sĩ)',
    description: 'Rút sức mạnh từ các vị thần để chữa lành và trừng phạt.',
    savingThrows: ['wis', 'cha'],
    defaultSkills: ['Tôn Giáo', 'Y Học'],
    hitDie: 'd8'
  },
  {
    value: 'Druid',
    label: 'Druid (Tu Sĩ Thiên Nhiên)',
    description: 'Khai thác ma thuật của thiên nhiên, biến hình thành động vật.',
    savingThrows: ['int', 'wis'],
    defaultSkills: ['An Hiểu Thiên Nhiên', 'Sinh Tồn'],
    hitDie: 'd8'
  },
  {
    value: 'Fighter',
    label: 'Fighter (Đấu Sĩ)',
    description: 'Bậc thầy sử dụng mọi loại vũ khí và giáp trụ.',
    savingThrows: ['str', 'con'],
    defaultSkills: ['Linh Hoạt', 'Sinh Tồn'],
    hitDie: 'd10'
  },
  {
    value: 'Monk',
    label: 'Monk (Võ Sư)',
    description: 'Sử dụng võ thuật và nội công để chiến đấu.',
    savingThrows: ['str', 'dex'],
    defaultSkills: ['Dẻo Dai', 'Lịch Sử'],
    hitDie: 'd8'
  },
  {
    value: 'Paladin',
    label: 'Paladin (Hiệp Sĩ Thánh)',
    description: 'Chiến binh thánh chiến gắn liền với lời thề thiêng liêng.',
    savingThrows: ['wis', 'cha'],
    defaultSkills: ['Linh Hoạt', 'Thuyết Phục'],
    hitDie: 'd10'
  },
  {
    value: 'Ranger',
    label: 'Ranger (Thợ Săn)',
    description: 'Chiến binh nơi hoang dã, chuyên săn lùng quái vật.',
    savingThrows: ['str', 'dex'],
    defaultSkills: ['An Hiểu Thiên Nhiên', 'Quan Sát'],
    hitDie: 'd10'
  },
  {
    value: 'Rogue',
    label: 'Rogue (Đạo Tặc)',
    description: 'Dựa vào sự lén lút và điểm yếu của kẻ thù.',
    savingThrows: ['dex', 'int'],
    defaultSkills: ['Ẩn Thân', 'Khéo Tay'],
    hitDie: 'd8'
  },
  {
    value: 'Sorcerer',
    label: 'Sorcerer (Phù Thủy)',
    description: 'Sử dụng ma thuật bẩm sinh từ dòng máu.',
    savingThrows: ['con', 'cha'],
    defaultSkills: ['An Hiểu Phép Thuật', 'Lừa Dối'],
    hitDie: 'd6'
  },
  {
    value: 'Warlock',
    label: 'Warlock (Chiến Binh Phép)',
    description: 'Có sức mạnh từ khế ước với thực thể siêu nhiên.',
    savingThrows: ['wis', 'cha'],
    defaultSkills: ['An Hiểu Phép Thuật', 'Hăm Doạ'],
    hitDie: 'd8'
  },
  {
    value: 'Wizard',
    label: 'Wizard (Pháp Sư)',
    description: 'Học giả nghiên cứu sâu về ma thuật.',
    savingThrows: ['int', 'wis'],
    defaultSkills: ['An Hiểu Phép Thuật', 'Lịch Sử'],
    hitDie: 'd6'
  },
];


// === HOMEBREW CLASSES ===
// Thêm class tự chế ở đây:
// CLASSES_VN.push({ value: "MyClass", label: "MyClass (Tên VN)", description: "...",
//   savingThrows: ["str", "con"], defaultSkills: ["Linh Hoạt"], hitDie: "d10" });
