// === SKILLS & ABILITIES (PHB 2024) ===

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
