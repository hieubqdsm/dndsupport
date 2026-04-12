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


// === RACE TRAIT DETAILS ===
// Mô tả cơ chế chi tiết từng trait, hiển thị trong CharacterSheet
export const RACE_TRAIT_DETAILS: Record<string, { name: string; desc: string }[]> = {
  Aasimar: [
    { name: 'Darkvision', desc: 'Nhìn trong bóng tối 60ft như ánh sáng mờ, nhưng không phân biệt màu sắc.' },
    { name: 'Celestial Resistance', desc: 'Kháng (Resistance) sát thương loại Necrotic và Radiant.' },
    { name: 'Healing Hands', desc: 'Hành động: Chạm tay hồi máu cho 1 mục tiêu, lượng hồi = level của bạn. Hồi phục sau Long Rest.' },
    { name: 'Light Bearer', desc: 'Bạn biết sẵn cantrip Light (không tốn spell slot). CHA là spellcasting ability.' },
  ],
  Dragonborn: [
    { name: 'Draconic Ancestry', desc: 'Chọn 1 loại rồng tổ tiên → xác định nguyên tố Breath Weapon và Damage Resistance:\n• Black / Copper → Acid\n• Blue / Bronze → Lightning\n• Brass / Gold / Red → Fire\n• Green → Poison\n• Silver / White → Cold' },
    { name: 'Breath Weapon', desc: 'Bonus Action: Phun hơi thở nguyên tố, mục tiêu trong vùng phải Con Save (DC = 8 + PB + CON mod).\n• Line 5×30ft (Acid, Lightning) hoặc Cone 15ft (Fire, Poison, Cold)\nSát thương: 1d10 (Lv 1–5) → 2d10 (Lv 6–10) → 3d10 (Lv 11–15) → 4d10 (Lv 16+).\nHồi phục sau Short hoặc Long Rest.' },
    { name: 'Damage Resistance', desc: 'Kháng loại sát thương tương ứng với tổ tiên rồng đã chọn.' },
  ],
  Dwarf: [
    { name: 'Darkvision', desc: 'Nhìn trong bóng tối 60ft như ánh sáng mờ, nhưng không phân biệt màu sắc.' },
    { name: 'Dwarven Resilience', desc: 'Lợi thế (Advantage) trên Saving Throws chống Poison. Kháng (Resistance) sát thương Poison.' },
    { name: 'Dwarven Toughness', desc: 'HP tối đa tăng +1 khi lên level, tổng cộng +level HP so với người thường.' },
    { name: 'Stonecunning', desc: 'Bonus Action: Kích hoạt Tremorsense 60ft trong 10 phút — cảm nhận rung động qua nền đất/đá, biết vị trí sinh vật đang đứng trên đất trong phạm vi đó dù không nhìn thấy. Hồi phục sau Long Rest.' },
  ],
  Elf: [
    { name: 'Darkvision', desc: 'Nhìn trong bóng tối 60ft như ánh sáng mờ, nhưng không phân biệt màu sắc.' },
    { name: 'Fey Ancestry', desc: 'Lợi thế (Advantage) trên Saving Throws chống bị Charmed (mê hoặc). Không thể bị đưa vào giấc ngủ bằng phép thuật.' },
    { name: 'Trance', desc: 'Thay vì ngủ, bạn thiền định bán tỉnh 4 giờ để nhận lợi ích của Long Rest (8 giờ với các chủng tộc khác). Trong thời gian thiền định, bạn vẫn nhận thức được xung quanh.' },
    { name: 'Keen Senses', desc: 'Thành thạo (Proficiency) kĩ năng Quan Sát (Perception).' },
  ],
  Gnome: [
    { name: 'Darkvision', desc: 'Nhìn trong bóng tối 60ft như ánh sáng mờ, nhưng không phân biệt màu sắc.' },
    { name: 'Gnome Cunning', desc: 'Lợi thế (Advantage) trên tất cả Saving Throws dùng INT, WIS hoặc CHA chống lại phép thuật (magic).' },
    { name: "Artificer's Lore", desc: 'Khi thực hiện History check liên quan đến đồ vật ma thuật, thiết bị luyện kim hoặc công cụ cơ khí, bạn được tính thêm 2× Proficiency Bonus.' },
  ],
  Goliath: [
    { name: 'Little Giant', desc: 'Bạn được tính là cỡ Large khi xác định lượng vật nặng có thể mang/đẩy/kéo. Không bị Disadvantage khi dùng vũ khí hai tay do cỡ người.' },
    { name: 'Mountain Born', desc: 'Kháng (Resistance) sát thương loại Cold. Thích nghi với độ cao và khí hậu lạnh, không bị ảnh hưởng bởi môi trường cực lạnh tự nhiên.' },
    { name: "Stone's Endurance", desc: 'Phản ứng (Reaction): Khi nhận sát thương, giảm sát thương đó đi 1d12 + CON modifier. Hồi phục sau Short hoặc Long Rest.' },
  ],
  Halfling: [
    { name: 'Lucky', desc: 'Khi bạn roll 1 (natural 1) trên d20 khi tấn công, kiểm tra kĩ năng hoặc saving throw, bạn có thể roll lại và phải dùng kết quả mới.' },
    { name: 'Brave', desc: 'Lợi thế (Advantage) trên Saving Throws chống bị Frightened (sợ hãi).' },
    { name: 'Halfling Nimbleness', desc: 'Bạn có thể di chuyển qua ô của sinh vật cỡ lớn hơn (Medium trở lên) mà không tốn thêm movement.' },
  ],
  Human: [
    { name: 'Resourceful', desc: 'Khi hoàn thành Long Rest, bạn nhận được 1 Inspiration. Inspiration cho phép dùng Advantage trên 1 roll d20 bất kỳ (tấn công, kiểm tra, save).' },
    { name: 'Skillful', desc: 'Bạn thành thạo (Proficiency) thêm 1 kĩ năng bất kỳ.' },
    { name: 'Versatile', desc: 'Bạn nhận thêm 1 Origin Feat ở level 1.' },
  ],
  Orc: [
    { name: 'Darkvision', desc: 'Nhìn trong bóng tối 60ft như ánh sáng mờ, nhưng không phân biệt màu sắc.' },
    { name: 'Adrenaline Rush', desc: 'Bonus Action: Bạn sử dụng hành động Dash. Bạn nhận Temporary HP = PB sau khi dùng. Có thể dùng số lần = PB, hồi phục sau Long Rest.' },
    { name: 'Relentless Endurance', desc: 'Khi HP giảm xuống 0 nhưng chưa chết ngay, bạn có thể dùng phản ứng (Reaction) để đặt HP về 1 thay vì 0. Hồi phục sau Long Rest.' },
  ],
  Tiefling: [
    { name: 'Darkvision', desc: 'Nhìn trong bóng tối 60ft như ánh sáng mờ, nhưng không phân biệt màu sắc.' },
    { name: 'Hellish Resistance', desc: 'Kháng (Resistance) sát thương loại Fire.' },
    { name: 'Infernal Legacy', desc: 'Bạn biết các phép sau (CHA là spellcasting ability, không tốn slot):\n• Lv 1: Cantrip Thaumaturgy\n• Lv 3: Hellish Rebuke (1×/Long Rest, Lv 2 slot)\n• Lv 5: Darkness (1×/Long Rest)' },
  ],
};

// === HOMEBREW SPECIES ===
// Thêm chủng tộc tự chế ở đây:
