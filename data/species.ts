// === SPECIES / RACES (PHB 2024 Ch.4) ===
// Homebrew: Thêm chủng tộc mới vào array bên dưới

import { DataOption } from '../types';

export const SPECIES_VN: DataOption[] = [
  {
    value: 'Aasimar',
    label: 'Aasimar',
    description: 'Phàm nhân mang trong linh hồn một tia sáng của Upper Planes, mang đến ánh sáng và sự chữa lành.',
    speed: 30,
    traits: ['Darkvision (60ft)', 'Celestial Resistance (Kháng Necrotic/Radiant)', 'Healing Hands (Hồi máu)', 'Light Bearer (Phép Light)']
  },
  {
    value: 'Dragonborn',
    label: 'Dragonborn',
    description: 'Hậu duệ nở ra từ trứng rồng, trông giống rồng hai chân không cánh, có khả năng phun hơi thở nguyên tố.',
    speed: 30,
    traits: ['Draconic Ancestry (Huyết thống rồng)', 'Breath Weapon (Hơi thở rồng)', 'Damage Resistance (Kháng sát thương)']
  },
  {
    value: 'Dwarf',
    label: 'Dwarf (Người Lùn)',
    description: 'Được tạo ra từ lòng đất, kiên cường như núi non, gắn bó với đá và kim loại.',
    speed: 30,
    traits: ['Darkvision (60ft)', 'Dwarven Resilience (Kháng độc)', 'Dwarven Toughness (+1 HP mỗi cấp)', 'Stonecunning']
  },
  {
    value: 'Elf',
    label: 'Elf (Tiên)',
    description: 'Sinh vật huyền bí có tai nhọn, sống lâu, không ngủ mà thiền định (trance), có kết nối với Feywild.',
    speed: 30,
    traits: ['Darkvision (60ft)', 'Fey Ancestry (Kháng phép mê hoặc)', 'Trance (Thiền định 4h)', 'Keen Senses (Giác quan nhạy bén)']
  },
  {
    value: 'Gnome',
    label: 'Gnome',
    description: 'Sinh vật nhỏ bé, lanh lợi, yêu thích phát minh và ảo ảnh, thường sống dưới lòng đất hoặc rừng rậm.',
    speed: 25,
    traits: ['Darkvision (60ft)', 'Gnome Cunning (Lợi thế Int/Wis/Cha save chống phép)', 'Artificer\'s Lore']
  },
  {
    value: 'Goliath',
    label: 'Goliath',
    description: 'Hậu duệ xa của các người khổng lồ (Giant), cao lớn vượt trội và mang sức mạnh thể chất phi thường.',
    speed: 35,
    traits: ['Little Giant (Mang vác khỏe)', 'Mountain Born (Kháng lạnh)', 'Stone\'s Endurance (Giảm sát thương)']
  },
  {
    value: 'Halfling',
    label: 'Halfling (Người Bán Thú)',
    description: 'Nhỏ bé như trẻ con, yêu thích sự yên bình, gia đình, nhưng cũng sở hữu lòng dũng cảm và vận may kỳ lạ.',
    speed: 25,
    traits: ['Lucky (May mắn)', 'Brave (Dũng cảm)', 'Halfling Nimbleness (Di chuyển qua người lớn hơn)']
  },
  {
    value: 'Human',
    label: 'Human (Con Người)',
    description: 'Đa dạng, tham vọng và tháo vát, nỗ lực đạt được nhiều nhất trong cuộc đời ngắn ngủi của mình.',
    speed: 30,
    traits: ['Resourceful (Inspiration mỗi ngày)', 'Skillful (Thêm 1 kĩ năng)', 'Versatile (Thêm 1 Feat)']
  },
  {
    value: 'Orc',
    label: 'Orc',
    description: 'Cao lớn, vạm vỡ với sức bền và ý chí kiên định, được ban tặng khả năng di chuyển không mệt mỏi.',
    speed: 30,
    traits: ['Darkvision (60ft)', 'Adrenaline Rush (Dash bonus action)', 'Relentless Endurance (Chịu đựng bất khuất)']
  },
  {
    value: 'Tiefling',
    label: 'Tiefling',
    description: 'Mang di sản của Lower Planes (địa ngục), thường có sừng và đuôi, liên kết với ma thuật hắc ám hoặc lửa.',
    speed: 30,
    traits: ['Darkvision (60ft)', 'Hellish Resistance (Kháng lửa)', 'Infernal Legacy (Phép thuật hắc ám)']
  },
];


// === HOMEBREW SPECIES ===
// Thêm chủng tộc tự chế ở đây:
