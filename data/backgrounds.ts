// === CHARACTER BACKGROUNDS (PHB 2024 Ch.4) ===
// Homebrew: Thêm background mới vào array bên dưới

import { DataOption } from '../types';

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


// === HOMEBREW BACKGROUNDS ===
// Thêm background tự chế ở đây:
