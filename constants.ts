
import { Character, DataOption, Subclass, ArmorData } from './types';

export const SKILL_LIST_VN: { name: string, ability: string }[] = [
  { name: 'Dẻo Dai', ability: 'dex' },
  { name: 'Thuần Phục Động Vật', ability: 'wis' },
  { name: 'An Hiểu Phép Thuật', ability: 'int' },
  { name: 'Linh Hoạt', ability: 'str' },
  { name: 'Lừa Dối', ability: 'cha' },
  { name: 'Lịch Sử', ability: 'int' },
  { name: 'Phán Xét', ability: 'wis' },
  { name: 'Hăm Doạ', ability: 'cha' },
  { name: 'Điều Tra', ability: 'int' },
  { name: 'Y Học', ability: 'wis' },
  { name: 'An Hiểu Thiên Nhiên', ability: 'int' },
  { name: 'Quan Sát', ability: 'wis' },
  { name: 'Diễn Xuất', ability: 'cha' },
  { name: 'Thuyết Phục', ability: 'cha' },
  { name: 'Tôn Giáo', ability: 'int' },
  { name: 'Khéo Tay', ability: 'dex' },
  { name: 'Ẩn Thân', ability: 'dex' },
  { name: 'Sinh Tồn', ability: 'wis' },
];

// --- DỮ LIỆU GIẢI THÍCH (TOOLTIPS) ---

export const ABILITY_INFO: Record<string, { label: string, eng: string, desc: string }> = {
  str: { label: 'Sức Mạnh', eng: 'Strength', desc: 'Đo lường thể lực cơ bắp, khả năng đánh cận chiến, nhảy, bơi và mang vác.' },
  dex: { label: 'Nhanh Nhẹn', eng: 'Dexterity', desc: 'Đo lường sự lanh lợi, phản xạ, giữ thăng bằng và khả năng tấn công tầm xa/vũ khí nhẹ.' },
  con: { label: 'Thể Lực', eng: 'Constitution', desc: 'Đo lường sức khỏe, sức bền, khả năng chịu đựng bệnh tật, độc tố và sự mệt mỏi.' },
  int: { label: 'Thông Minh', eng: 'Intelligence', desc: 'Đo lường sự minh mẫn, khả năng ghi nhớ, lý luận logic và kiến thức học thuật/phép thuật.' },
  wis: { label: 'Trí Khôn', eng: 'Wisdom', desc: 'Đo lường sự nhận thức, trực giác, sự sáng suốt, ý chí và khả năng cảm nhận thế giới xung quanh.' },
  cha: { label: 'Giao Tiếp', eng: 'Charisma', desc: 'Đo lường sức hút cá nhân, sự tự tin, khả năng thuyết phục, lừa dối hoặc lãnh đạo người khác.' }
};

export const SKILL_INFO_MAP: Record<string, { eng: string, desc: string }> = {
  'Dẻo Dai': { eng: 'Acrobatics', desc: 'Giữ thăng bằng trên dây, đi trên băng, nhào lộn hoặc thoát khỏi sự kìm kẹp.' },
  'Thuần Phục Động Vật': { eng: 'Animal Handling', desc: 'Trấn an vật nuôi, kiểm soát thú cưỡi, hoặc đoán ý định của động vật.' },
  'An Hiểu Phép Thuật': { eng: 'Arcana', desc: 'Kiến thức về phép thuật, vật phẩm ma thuật, biểu tượng cổ và các cõi giới (Planes).' },
  'Linh Hoạt': { eng: 'Athletics', desc: 'Leo trèo, nhảy xa, bơi lội, phá cửa, hoặc vật lộn (grapple) với kẻ địch.' }, // Trong 5e gốc là Athletics dùng STR
  'Lừa Dối': { eng: 'Deception', desc: 'Che giấu sự thật, cải trang, nói dối thuyết phục hoặc đánh lạc hướng.' },
  'Lịch Sử': { eng: 'History', desc: 'Kiến thức về các sự kiện lịch sử, vương quốc cổ đại, huyền thoại và văn minh.' },
  'Phán Xét': { eng: 'Insight', desc: 'Đọc vị người khác, phát hiện nói dối, hoặc đoán định động cơ thực sự.' },
  'Hăm Doạ': { eng: 'Intimidation', desc: 'Dùng lời nói hoặc hành động để khiến người khác sợ hãi và tuân theo ý mình.' },
  'Điều Tra': { eng: 'Investigation', desc: 'Tìm kiếm manh mối, suy luận từ thông tin có sẵn, hoặc tìm đồ vật bị giấu.' },
  'Y Học': { eng: 'Medicine', desc: 'Sơ cứu vết thương, chẩn đoán bệnh tật, hoặc xác định nguyên nhân cái chết.' },
  'An Hiểu Thiên Nhiên': { eng: 'Nature', desc: 'Kiến thức về địa hình, thực vật, động vật, thời tiết và chu kỳ tự nhiên.' },
  'Quan Sát': { eng: 'Perception', desc: 'Dùng giác quan để phát hiện sự hiện diện, nghe lén, hoặc tìm kiếm dấu vết.' },
  'Diễn Xuất': { eng: 'Performance', desc: 'Giải trí cho khán giả bằng âm nhạc, kể chuyện, nhảy múa hoặc diễn kịch.' },
  'Thuyết Phục': { eng: 'Persuasion', desc: 'Dùng sự khéo léo và chân thành để thuyết phục người khác đồng ý với mình.' },
  'Tôn Giáo': { eng: 'Religion', desc: 'Kiến thức về các vị thần, nghi lễ, biểu tượng tôn giáo và các tổ chức tín ngưỡng.' },
  'Khéo Tay': { eng: 'Sleight of Hand', desc: 'Móc túi, giấu đồ vật, thực hiện ảo thuật hoặc thao tác tay nhanh nhẹn.' },
  'Ẩn Thân': { eng: 'Stealth', desc: 'Di chuyển nhẹ nhàng, ẩn nấp trong bóng tối để tránh bị phát hiện.' },
  'Sinh Tồn': { eng: 'Survival', desc: 'Theo dấu, săn bắn, tìm nguồn nước, dựng trại và tránh các mối nguy tự nhiên.' },
};

// --- DỮ LIỆU TỪ SÁCH LUẬT 2024 ---

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

export const BACKGROUNDS_VN: DataOption[] = [
  {
    value: 'Acolyte',
    label: 'Acolyte (Tu Sinh)',
    description: 'Dâng hiến phục vụ trong đền thờ, thực hiện nghi lễ tôn vinh vị thần.',
    abilityBonuses: { wis: 2, int: 1 },
    skillBonuses: ['Phán Xét', 'Tôn Giáo']
  },
  {
    value: 'Artisan',
    label: 'Artisan (Thợ Thủ Công)',
    description: 'Bắt đầu từ việc học việc, tạo ra sản phẩm thủ công và biết cách dỗ dành khách hàng.',
    abilityBonuses: { str: 2, dex: 1 },
    skillBonuses: ['Điều Tra', 'Thuyết Phục']
  },
  {
    value: 'Charlatan',
    label: 'Charlatan (Kẻ Lừa Đảo)',
    description: 'Sống nhờ vào sự lừa lọc, bán thuốc giả hoặc làm giả giấy tờ.',
    abilityBonuses: { cha: 2, dex: 1 },
    skillBonuses: ['Lừa Dối', 'Khéo Tay']
  },
  {
    value: 'Criminal',
    label: 'Criminal (Tội Phạm)',
    description: 'Kiếm sống trong bóng tối, móc túi hoặc hoạt động phi pháp.',
    abilityBonuses: { dex: 2, int: 1 },
    skillBonuses: ['Lừa Dối', 'Ẩn Thân']
  },
  {
    value: 'Entertainer',
    label: 'Entertainer (Nghệ Sĩ)',
    description: 'Sống bằng nghề biểu diễn, nhào lộn, âm nhạc và những tràng pháo tay.',
    abilityBonuses: { cha: 2, dex: 1 },
    skillBonuses: ['Dẻo Dai', 'Diễn Xuất']
  },
  {
    value: 'Farmer',
    label: 'Farmer (Nông Dân)',
    description: 'Gắn bó với đất đai, rèn luyện sự kiên nhẫn và thể chất dẻo dai.',
    abilityBonuses: { con: 2, wis: 1 },
    skillBonuses: ['Thuần Phục Động Vật', 'An Hiểu Thiên Nhiên']
  },
  {
    value: 'Guard',
    label: 'Guard (Lính Gác)',
    description: 'Được huấn luyện để canh gác, quan sát và bảo vệ trật tự.',
    abilityBonuses: { str: 2, wis: 1 },
    skillBonuses: ['Linh Hoạt', 'Quan Sát']
  },
  {
    value: 'Guide',
    label: 'Guide (Người Dẫn Đường)',
    description: 'Trưởng thành giữa thiên nhiên hoang dã, dẫn đường cho người khác.',
    abilityBonuses: { wis: 2, dex: 1 },
    skillBonuses: ['Ẩn Thân', 'Sinh Tồn']
  },
  {
    value: 'Hermit',
    label: 'Hermit (Ẩn Sĩ)',
    description: 'Sống ẩn dật, dành thời gian suy ngẫm về những bí ẩn của sự sáng tạo.',
    abilityBonuses: { wis: 2, con: 1 },
    skillBonuses: ['Y Học', 'Tôn Giáo']
  },
  {
    value: 'Merchant',
    label: 'Merchant (Thương Nhân)',
    description: 'Mua bán hàng hóa, vận chuyển và giao thương khắp nơi.',
    abilityBonuses: { cha: 2, int: 1 },
    skillBonuses: ['Thuần Phục Động Vật', 'Thuyết Phục']
  },
  {
    value: 'Noble',
    label: 'Noble (Quý Tộc)',
    description: 'Sinh ra trong giàu có và quyền lực, được giáo dục tốt về lãnh đạo.',
    abilityBonuses: { cha: 2, int: 1 },
    skillBonuses: ['Lịch Sử', 'Thuyết Phục']
  },
  {
    value: 'Sage',
    label: 'Sage (Hiền Triết)',
    description: 'Dành thời gian nghiên cứu sách vở, khao khát tri thức về đa vũ trụ.',
    abilityBonuses: { int: 2, wis: 1 },
    skillBonuses: ['An Hiểu Phép Thuật', 'Lịch Sử']
  },
  {
    value: 'Sailor',
    label: 'Sailor (Thủy Thủ)',
    description: 'Sống cuộc đời trên boong tàu, đối mặt với bão tố và biển cả.',
    abilityBonuses: { dex: 2, str: 1 },
    skillBonuses: ['Linh Hoạt', 'Quan Sát']
  },
  {
    value: 'Scribe',
    label: 'Scribe (Học Giả/Thư Lại)',
    description: 'Chuyên sao chép văn bản, viết chữ đẹp và cẩn trọng chi tiết.',
    abilityBonuses: { int: 2, dex: 1 },
    skillBonuses: ['Điều Tra', 'Quan Sát']
  },
  {
    value: 'Soldier',
    label: 'Soldier (Binh Lính)',
    description: 'Được huấn luyện cho chiến tranh, chiến trận chảy trong máu.',
    abilityBonuses: { str: 2, con: 1 },
    skillBonuses: ['Linh Hoạt', 'Hăm Doạ']
  },
  {
    value: 'Wayfarer',
    label: 'Wayfarer (Kẻ Lang Thang)',
    description: 'Lớn lên trên đường phố, làm đủ nghề để kiếm sống, giàu lòng tự trọng.',
    abilityBonuses: { dex: 2, cha: 1 },
    skillBonuses: ['Phán Xét', 'Ẩn Thân']
  },
];

export const ALIGNMENTS_VN: DataOption[] = [
  { value: 'Lawful Good', label: 'Lawful Good (Luật Pháp Thiện)', description: 'Cố gắng làm điều đúng đắn theo những gì xã hội mong đợi, bảo vệ kẻ vô tội.' },
  { value: 'Neutral Good', label: 'Neutral Good (Trung Lập Thiện)', description: 'Làm điều tốt nhất có thể, không cảm thấy bị ràng buộc tuyệt đối bởi luật lệ.' },
  { value: 'Chaotic Good', label: 'Chaotic Good (Hỗn Loạn Thiện)', description: 'Hành động theo lương tâm, ít quan tâm đến kỳ vọng của người khác.' },
  { value: 'Lawful Neutral', label: 'Lawful Neutral (Luật Pháp Trung Lập)', description: 'Hành động theo luật pháp, truyền thống hoặc quy tắc cá nhân một cách kỷ luật.' },
  { value: 'Neutral', label: 'Neutral (Trung Lập)', description: 'Tránh các câu hỏi đạo đức, không đứng về phe nào, làm điều có vẻ tốt nhất lúc đó.' },
  { value: 'Chaotic Neutral', label: 'Chaotic Neutral (Hỗn Loạn Trung Lập)', description: 'Làm theo thôi thúc bản thân, coi trọng tự do cá nhân hơn tất cả.' },
  { value: 'Lawful Evil', label: 'Lawful Evil (Luật Pháp Ác)', description: 'Chiếm lấy thứ mình muốn một cách có hệ thống trong giới hạn của quy tắc hoặc truyền thống.' },
  { value: 'Neutral Evil', label: 'Neutral Evil (Trung Lập Ác)', description: 'Không bận tâm đến tổn hại gây ra khi theo đuổi ham muốn của mình.' },
  { value: 'Chaotic Evil', label: 'Chaotic Evil (Hỗn Loạn Ác)', description: 'Hành động bằng bạo lực tùy tiện, thúc đẩy bởi thù hận hoặc khát máu.' },
];

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
  armorWorn: "Chain Mail",
  shieldEquipped: true,
  feats: [],
  stats: {
    str: { score: 16, modifier: 3 },
    dex: { score: 14, modifier: 2 },
    con: { score: 15, modifier: 2 },
    int: { score: 10, modifier: 0 },
    wis: { score: 12, modifier: 1 },
    cha: { score: 8, modifier: -1 },
  },
  savingThrows: ['str', 'con'],
  skills: SKILL_LIST_VN.map(s => ({
    ...s,
    proficient: s.name === 'Linh Hoạt' || s.name === 'Hăm Doạ',
    bonus: 0
  })),
  ac: 16,
  initiative: 2,
  hp: { current: 12, max: 12, temp: 0 },
  hitDice: "1d10",
  attacks: [
    { name: "Kiếm dài", bonus: 5, damage: "1d8+3", type: "Slashing" }
  ],
};

export const WEAPONS_VN: DataOption[] = [
  { value: 'Club', label: 'Club (Gậy)', description: '1d4 Bludgeoning - Light' },
  { value: 'Dagger', label: 'Dagger (Dao găm)', description: '1d4 Piercing - Finesse, Light, Thrown (20/60)' },
  { value: 'Greatclub', label: 'Greatclub (Gậy lớn)', description: '1d8 Bludgeoning - Two-handed' },
  { value: 'Handaxe', label: 'Handaxe (Rìu tay)', description: '1d6 Slashing - Light, Thrown (20/60)' },
  { value: 'Javelin', label: 'Javelin (Lao)', description: '1d6 Piercing - Thrown (30/120)' },
  { value: 'Light Hammer', label: 'Light Hammer (Búa nhẹ)', description: '1d4 Bludgeoning - Light, Thrown (20/60)' },
  { value: 'Mace', label: 'Mace (Chùy)', description: '1d6 Bludgeoning' },
  { value: 'Quarterstaff', label: 'Quarterstaff (Gậy phép)', description: '1d6 Bludgeoning - Versatile (1d8)' },
  { value: 'Sickle', label: 'Sickle (Liềm)', description: '1d4 Slashing - Light' },
  { value: 'Spear', label: 'Spear (Giáo)', description: '1d6 Piercing - Thrown (20/60), Versatile (1d8)' },
  { value: 'Crossbow, light', label: 'Crossbow, light (Nỏ nhẹ)', description: '1d8 Piercing - Ammunition (80/320), Loading, Two-handed' },
  { value: 'Dart', label: 'Dart (Phi tiêu)', description: '1d4 Piercing - Finesse, Thrown (20/60)' },
  { value: 'Shortbow', label: 'Shortbow (Cung ngắn)', description: '1d6 Piercing - Ammunition (80/320), Two-handed' },
  { value: 'Sling', label: 'Sling (Ná)', description: '1d4 Bludgeoning - Ammunition (30/120)' },
  { value: 'Battleaxe', label: 'Battleaxe (Rìu chiến)', description: '1d8 Slashing - Versatile (1d10)' },
  { value: 'Flail', label: 'Flail (Chùy xích)', description: '1d8 Bludgeoning' },
  { value: 'Glaive', label: 'Glaive (Đao)', description: '1d10 Slashing - Heavy, Reach, Two-handed' },
  { value: 'Greataxe', label: 'Greataxe (Rìu lớn)', description: '1d12 Slashing - Heavy, Two-handed' },
  { value: 'Greatsword', label: 'Greatsword (Kiếm lớn)', description: '2d6 Slashing - Heavy, Two-handed' },
  { value: 'Halberd', label: 'Halberd (Thương kích)', description: '1d10 Slashing - Heavy, Reach, Two-handed' },
  { value: 'Lance', label: 'Lance (Thương kỵ binh)', description: '1d12 Piercing - Reach, Special' },
  { value: 'Longsword', label: 'Longsword (Kiếm dài)', description: '1d8 Slashing - Versatile (1d10)' },
  { value: 'Maul', label: 'Maul (Búa tạ)', description: '2d6 Bludgeoning - Heavy, Two-handed' },
  { value: 'Morningstar', label: 'Morningstar (Sao mai)', description: '1d8 Piercing' },
  { value: 'Pike', label: 'Pike (Thương dài)', description: '1d10 Piercing - Heavy, Reach, Two-handed' },
  { value: 'Rapier', label: 'Rapier (Kiếm liễu)', description: '1d8 Piercing - Finesse' },
  { value: 'Scimitar', label: 'Scimitar (Đao cong)', description: '1d6 Slashing - Finesse, Light' },
  { value: 'Shortsword', label: 'Shortsword (Kiếm ngắn)', description: '1d6 Piercing - Finesse, Light' },
  { value: 'Trident', label: 'Trident (Đinh ba)', description: '1d6 Piercing - Thrown (20/60), Versatile (1d8)' },
  { value: 'War Pick', label: 'War Pick (Búa chiến)', description: '1d8 Piercing' },
  { value: 'Warhammer', label: 'Warhammer (Búa chiến)', description: '1d8 Bludgeoning - Versatile (1d10)' },
  { value: 'Whip', label: 'Whip (Roi)', description: '1d4 Slashing - Finesse, Reach' },
  { value: 'Blowgun', label: 'Blowgun (Ống thổi)', description: '1 Piercing - Ammunition (25/100), Loading' },
  { value: 'Crossbow, hand', label: 'Crossbow, hand (Nỏ tay)', description: '1d6 Piercing - Ammunition (30/120), Light, Loading' },
  { value: 'Crossbow, heavy', label: 'Crossbow, heavy (Nỏ nặng)', description: '1d10 Piercing - Ammunition (100/400), Heavy, Loading, Two-handed' },
  { value: 'Longbow', label: 'Longbow (Cung dài)', description: '1d8 Piercing - Ammunition (150/600), Heavy, Two-handed' },
  { value: 'Net', label: 'Net (Lưới)', description: 'Special, Thrown (5/15)' },
];

// --- SUBCLASSES (PHB 2024) ---

export const SUBCLASSES_VN: Subclass[] = [
  // Barbarian (Lv 3)
  { value: 'Berserker', label: 'Path of the Berserker (Con Đường Cuồng Chiến)', className: 'Barbarian', description: 'Giải phóng bạo lực thuần túy khi Rage.', levelGained: 3, features: ['Frenzy', 'Mindless Rage', 'Retaliation'] },
  { value: 'Wild Heart', label: 'Path of the Wild Heart (Con Đường Dã Thú)', className: 'Barbarian', description: 'Thể hiện mối liên kết với động vật hoang dã.', levelGained: 3, features: ['Animal Speaker', 'Rage of the Wilds', 'Vitality'] },
  { value: 'World Tree', label: 'Path of the World Tree (Con Đường Cây Thế Giới)', className: 'Barbarian', description: 'Khai thác sinh lực vũ trụ từ cây thế giới.', levelGained: 3, features: ['Vitality of the Tree', 'Branches of the Tree', 'Battering Roots'] },
  { value: 'Zealot', label: 'Path of the Zealot (Con Đường Cuồng Tín)', className: 'Barbarian', description: 'Cuồng nộ trong sự hợp nhất với một vị thần.', levelGained: 3, features: ['Divine Fury', 'Warrior of the Gods', 'Rage Beyond Death'] },

  // Bard (Lv 3)
  { value: 'Dance', label: 'College of Dance (Trường Múa)', className: 'Bard', description: 'Khai thác sự nhanh nhẹn trong chiến đấu qua vũ điệu.', levelGained: 3, features: ['Dazzling Footwork', 'Tandem Footwork', 'Leading Evasion'] },
  { value: 'Glamour', label: 'College of Glamour (Trường Mê Hoặc)', className: 'Bard', description: 'Dệt nên ma thuật Feywild mê hoặc lòng người.', levelGained: 3, features: ['Beguiling Magic', 'Mantle of Inspiration', 'Unbreakable Majesty'] },
  { value: 'Lore', label: 'College of Lore (Trường Tri Thức)', className: 'Bard', description: 'Thu thập tri thức và bí mật ma thuật.', levelGained: 3, features: ['Cutting Words', 'Additional Magical Secrets', 'Peerless Skill'] },
  { value: 'Valor', label: 'College of Valor (Trường Dũng Mãnh)', className: 'Bard', description: 'Sử dụng vũ khí kết hợp với phép thuật trên chiến trường.', levelGained: 3, features: ['Combat Inspiration', 'Extra Attack', 'Battle Magic'] },

  // Cleric (Lv 3)
  { value: 'Life', label: 'Life Domain (Miền Sự Sống)', className: 'Cleric', description: 'Bậc thầy hồi phục và bảo hộ sinh mạng.', levelGained: 3, features: ['Disciple of Life', 'Preserve Life', 'Supreme Healing'] },
  { value: 'Light', label: 'Light Domain (Miền Ánh Sáng)', className: 'Cleric', description: 'Sử dụng ánh sáng thiêu đốt và bảo hộ đồng minh.', levelGained: 3, features: ['Radiance of the Dawn', 'Warding Flare', 'Corona of Light'] },
  { value: 'Trickery', label: 'Trickery Domain (Miền Xảo Thuật)', className: 'Cleric', description: 'Quấy nhiễu kẻ thù bằng ảo ảnh và trò tinh quái.', levelGained: 3, features: ['Blessing of the Trickster', 'Invoke Duplicity', 'Improved Duplicity'] },
  { value: 'War', label: 'War Domain (Miền Chiến Tranh)', className: 'Cleric', description: 'Khơi dậy dũng khí và trừng phạt kẻ thù.', levelGained: 3, features: ['War Priest', 'Guided Strike', 'Avatar of Battle'] },

  // Druid (Lv 3)
  { value: 'Land', label: 'Circle of the Land (Vòng Tròn Đất)', className: 'Druid', description: 'Rút sức mạnh từ ma thuật của môi trường xung quanh.', levelGained: 3, features: ['Land Spells', 'Natural Recovery', 'Nature\'s Ward'] },
  { value: 'Moon', label: 'Circle of the Moon (Vòng Tròn Trăng)', className: 'Druid', description: 'Tiếp nhận các dạng thú mạnh mẽ hơn khi Wild Shape.', levelGained: 3, features: ['Combat Wild Shape', 'Circle Forms', 'Elemental Wild Shape'] },
  { value: 'Sea', label: 'Circle of the Sea (Vòng Tròn Biển)', className: 'Druid', description: 'Điều khiển thủy triều và bão tố đại dương.', levelGained: 3, features: ['Wrath of the Sea', 'Aquatic Affinity', 'Oceanic Gift'] },
  { value: 'Stars', label: 'Circle of the Stars (Vòng Tròn Sao)', className: 'Druid', description: 'Đạt được năng lực trong hình dạng chòm sao.', levelGained: 3, features: ['Star Map', 'Starry Form', 'Full of Stars'] },

  // Fighter (Lv 3)
  { value: 'Battle Master', label: 'Battle Master (Bậc Thầy Chiến Trận)', className: 'Fighter', description: 'Sử dụng các thế võ chiến đấu đặc biệt (maneuvers).', levelGained: 3, features: ['Combat Superiority', 'Student of War', 'Relentless'] },
  { value: 'Champion', label: 'Champion (Quán Quân)', className: 'Fighter', description: 'Vươn tới đỉnh cao năng lực chiến đấu thuần túy.', levelGained: 3, features: ['Improved Critical', 'Remarkable Athlete', 'Superior Critical'] },
  { value: 'Eldritch Knight', label: 'Eldritch Knight (Hiệp Sĩ Huyền Bí)', className: 'Fighter', description: 'Học phép thuật arcane để hỗ trợ chiến đấu.', levelGained: 3, features: ['Spellcasting', 'War Magic', 'Eldritch Strike'] },
  { value: 'Psi Warrior', label: 'Psi Warrior (Chiến Binh Tâm Linh)', className: 'Fighter', description: 'Tăng cường đòn đánh bằng sức mạnh psionic.', levelGained: 3, features: ['Psionic Power', 'Telekinetic Adept', 'Telekinetic Master'] },

  // Monk (Lv 3)
  { value: 'Mercy', label: 'Warrior of Mercy (Chiến Binh Từ Bi)', className: 'Monk', description: 'Chữa lành hoặc gây hại bằng một cái chạm.', levelGained: 3, features: ['Hand of Healing', 'Hand of Harm', 'Physician\'s Touch'] },
  { value: 'Shadow', label: 'Warrior of Shadow (Chiến Binh Bóng Tối)', className: 'Monk', description: 'Sử dụng bóng tối cho mục đích ẩn thân và tấn công.', levelGained: 3, features: ['Shadow Arts', 'Shadow Step', 'Cloak of Shadows'] },
  { value: 'Elements', label: 'Warrior of the Elements (Chiến Binh Nguyên Tố)', className: 'Monk', description: 'Điều khiển sức mạnh nguyên tố trong cận chiến.', levelGained: 3, features: ['Elemental Attunement', 'Elemental Burst', 'Elemental Epitome'] },
  { value: 'Open Hand', label: 'Warrior of the Open Hand (Chiến Binh Tay Không)', className: 'Monk', description: 'Làm chủ kỹ năng cận chiến tay không ở mức cao nhất.', levelGained: 3, features: ['Open Hand Technique', 'Wholeness of Body', 'Quivering Palm'] },

  // Paladin (Lv 3)
  { value: 'Devotion', label: 'Oath of Devotion (Lời Thề Tận Tụy)', className: 'Paladin', description: 'Noi theo lý tưởng của thiên thần công lý.', levelGained: 3, features: ['Sacred Weapon', 'Holy Nimbus', 'Aura of Devotion'] },
  { value: 'Glory', label: 'Oath of Glory (Lời Thề Vinh Quang)', className: 'Paladin', description: 'Vươn tới đỉnh cao của chủ nghĩa anh hùng.', levelGained: 3, features: ['Peerless Athlete', 'Inspiring Smite', 'Living Legend'] },
  { value: 'Ancients', label: 'Oath of the Ancients (Lời Thề Cổ Xưa)', className: 'Paladin', description: 'Gìn giữ sự sống, niềm vui và thiên nhiên.', levelGained: 3, features: ['Nature\'s Wrath', 'Aura of Warding', 'Elder Champion'] },
  { value: 'Vengeance', label: 'Oath of Vengeance (Lời Thề Phục Hận)', className: 'Paladin', description: 'Săn lùng và tiêu diệt kẻ ác bằng mọi giá.', levelGained: 3, features: ['Abjure Enemy', 'Relentless Avenger', 'Soul of Vengeance'] },

  // Ranger (Lv 3)
  { value: 'Beast Master', label: 'Beast Master (Chúa Tể Dã Thú)', className: 'Ranger', description: 'Gắn kết với một dã thú nguyên thủy chiến đấu bên cạnh.', levelGained: 3, features: ['Primal Companion', 'Exceptional Training', 'Share Spells'] },
  { value: 'Fey Wanderer', label: 'Fey Wanderer (Lữ Khách Tiên)', className: 'Ranger', description: 'Thể hiện niềm vui và cơn thịnh nộ của cõi Fey.', levelGained: 3, features: ['Dreadful Strikes', 'Otherworldly Glamour', 'Misty Wanderer'] },
  { value: 'Gloom Stalker', label: 'Gloom Stalker (Thợ Săn Bóng Tối)', className: 'Ranger', description: 'Săn lùng kẻ thù ẩn nấp trong bóng tối.', levelGained: 3, features: ['Dread Ambusher', 'Umbral Sight', 'Shadowy Dodge'] },
  { value: 'Hunter', label: 'Hunter (Thợ Săn)', className: 'Ranger', description: 'Bảo vệ thiên nhiên bằng sự linh hoạt trong chiến đấu.', levelGained: 3, features: ['Hunter\'s Prey', 'Defensive Tactics', 'Superior Hunter\'s Defense'] },

  // Rogue (Lv 3)
  { value: 'Arcane Trickster', label: 'Arcane Trickster (Đạo Tặc Phép Thuật)', className: 'Rogue', description: 'Tăng cường khả năng ẩn mình bằng phép thuật arcane.', levelGained: 3, features: ['Spellcasting', 'Mage Hand Legerdemain', 'Spell Thief'] },
  { value: 'Assassin', label: 'Assassin (Sát Thủ)', className: 'Rogue', description: 'Ra tay từ trong phục kích và sử dụng độc dược.', levelGained: 3, features: ['Assassinate', 'Infiltration Expertise', 'Death Strike'] },
  { value: 'Soulknife', label: 'Soulknife (Lưỡi Dao Linh Hồn)', className: 'Rogue', description: 'Tấn công kẻ thù bằng lưỡi dao năng lượng psionic.', levelGained: 3, features: ['Psionic Power', 'Soul Blades', 'Rend Mind'] },
  { value: 'Thief', label: 'Thief (Kẻ Trộm)', className: 'Rogue', description: 'Làm chủ việc xâm nhập, trèo tường và săn kho báu.', levelGained: 3, features: ['Fast Hands', 'Second-Story Work', 'Thief\'s Reflexes'] },

  // Sorcerer (Lv 3)
  { value: 'Aberrant', label: 'Aberrant Sorcery (Phép Thuật Dị Thường)', className: 'Sorcerer', description: 'Sử dụng ma thuật psionic kỳ dị từ Far Realm.', levelGained: 3, features: ['Telepathic Speech', 'Psionic Sorcery', 'Revelation in Flesh'] },
  { value: 'Clockwork', label: 'Clockwork Sorcery (Phép Thuật Cơ Giới)', className: 'Sorcerer', description: 'Khai thác các lực lượng trật tự vũ trụ.', levelGained: 3, features: ['Clockwork Magic', 'Restore Balance', 'Trance of Order'] },
  { value: 'Draconic', label: 'Draconic Sorcery (Phép Thuật Rồng)', className: 'Sorcerer', description: 'Thở ra ma thuật của loài rồng từ dòng máu.', levelGained: 3, features: ['Draconic Resilience', 'Elemental Affinity', 'Dragon Wings'] },
  { value: 'Wild Magic', label: 'Wild Magic Sorcery (Phép Thuật Hoang Dã)', className: 'Sorcerer', description: 'Giải phóng ma thuật hỗn loạn không thể kiểm soát.', levelGained: 3, features: ['Wild Magic Surge', 'Tides of Chaos', 'Controlled Chaos'] },

  // Warlock (Lv 3)
  { value: 'Archfey', label: 'Archfey Patron (Đại Tiên)', className: 'Warlock', description: 'Dịch chuyển và sử dụng ma thuật Fey mê hoặc.', levelGained: 3, features: ['Fey Presence', 'Misty Escape', 'Dark Delirium'] },
  { value: 'Celestial', label: 'Celestial Patron (Thiên Giới)', className: 'Warlock', description: 'Chữa lành bằng ma thuật từ thực thể thiên giới.', levelGained: 3, features: ['Healing Light', 'Radiant Soul', 'Searing Vengeance'] },
  { value: 'Fiend', label: 'Fiend Patron (Ác Quỷ)', className: 'Warlock', description: 'Cầu viện sức mạnh hiểm ác từ quỷ giới.', levelGained: 3, features: ['Dark One\'s Blessing', 'Dark One\'s Own Luck', 'Hurl Through Hell'] },
  { value: 'Great Old One', label: 'Great Old One Patron (Cổ Thần)', className: 'Warlock', description: 'Đào sâu vào tri thức bị cấm từ thực thể vượt ngoài nhận thức.', levelGained: 3, features: ['Awakened Mind', 'Entropic Ward', 'Create Thrall'] },

  // Wizard (Lv 3)
  { value: 'Abjurer', label: 'Abjurer (Pháp Sư Hộ Thể)', className: 'Wizard', description: 'Che chắn đồng minh và trục xuất kẻ thù.', levelGained: 3, features: ['Arcane Ward', 'Projected Ward', 'Spell Resistance'] },
  { value: 'Diviner', label: 'Diviner (Pháp Sư Tiên Tri)', className: 'Wizard', description: 'Khám phá các bí mật của đa vũ trụ qua thần nhãn.', levelGained: 3, features: ['Portent', 'Expert Divination', 'The Third Eye'] },
  { value: 'Evoker', label: 'Evoker (Pháp Sư Hủy Diệt)', className: 'Wizard', description: 'Tạo ra những hiệu ứng bùng nổ với sức mạnh nguyên tố.', levelGained: 3, features: ['Sculpt Spells', 'Potent Cantrip', 'Overchannel'] },
  { value: 'Illusionist', label: 'Illusionist (Pháp Sư Ảo Ảnh)', className: 'Wizard', description: 'Dệt nên những phép thuật lừa dối giác quan tinh vi.', levelGained: 3, features: ['Improved Minor Illusion', 'Malleable Illusion', 'Illusory Reality'] },
];

// --- GIÁP (PHB 2024 Ch.6) ---

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

export const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];