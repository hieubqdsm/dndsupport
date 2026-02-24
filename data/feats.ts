import { Feat } from '../types';

export const FEAT_DATABASE: Feat[] = [
    {
        value: 'alert',
        label: 'Cảnh Giác (Alert)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Luôn đề cao cảnh giác với nguy hiểm.\n- Bạn được cộng +5 vào đổ Initiative (Sáng kiến).\n- Bạn không thể bị bất ngờ (Surprised) khi đang thức.\n- Kẻ địch gàn không được lợi thế Advantage khi tấn công bạn nếu bạn không nhìn thấy chúng.'
    },
    {
        value: 'crossbow_expert',
        label: 'Chuyên Gia Nỏ (Crossbow Expert)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Kỹ năng sử dụng Nỏ điêu luyện.\n- Bỏ qua thuộc tính Nạp đạn (Loading) của Nỏ mà bạn thông thạo.\n- Việc ở sát kẻ địch (trong 5 ft) không làm bạn bị Disadvantage khi thực hiện đòn đánh tâm xa.\n- Khi dùng Action tấn công bằng vũ khí 1 tay, bạn có thể dùng Bonus Action tấn công bằng Nỏ tay (Hand Crossbow) đang cầm.'
    },
    {
        value: 'dual_wielder',
        label: 'Song Kiếm (Dual Wielder)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Bậc thầy chiến đấu bằng hai vũ khí.\n- +1 AC khi đang cầm vũ khí cận chiến ở mỗi tay.\n- Bạn có thể chiến đấu hai tay (Two-Weapon Fighting) ngay cả khi vũ khí đó không có thuộc tính Nhẹ (Light).\n- Rút hoặc cất hai vũ khí cùng lúc thay vì một.'
    },
    {
        value: 'great_weapon_master',
        label: 'Bậc Thầy Trọng Khí (Great Weapon Master)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Học cách sử dụng đà của vũ khí hạng nặng để tăng sát thương.\n- Khi thực hiện cú đánh chí mạng (Crit) hoặc hạ gục mục tiêu về 0 HP bằng vũ khí cận chiến, dùng Bonus Action để đánh thêm 1 đòn cận chiến.\n- Trước khi đổ Xúc xắc đánh bằng vũ khí Nặng (Heavy) đã thông thạo, bạn có thể chọn chịu phạt -5 vào Attack roll. Nếu trúng, cộng +10 vào Damage.'
    },
    {
        value: 'healer',
        label: 'Người Chữa Trị (Healer)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Kỹ năng y tế xuất sắc.\n- Khi dùng bộ dụng cụ cứu thương (Healer\'s Kit) ổn định ai đó, họ được hồi 1 HP.\n- Dùng 1 Action và tiêu hao 1 lượt dùng của Healer\'s Kit để hồi cho sinh vật 1d6 + 4 HP, cộng thêm số HP bằng số Hit Die tối đa của họ. Một người không thể nhận lại lợi ích này cho đến khi kết thúc Short/Long Rest.'
    },
    {
        value: 'lucky',
        label: 'May Mắn (Lucky)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Bạn có vận may không thể lý giải.\n- Có 3 điểm Vận May (Luck Points). Mỗi khi đổ d20 cho Attack, Ability Check, hay Saving Throw, tiêu 1 điểm để đổ thêm 1 viên d20. Chọn viên nào bạn muốn dùng. Có thể quyết định sau khi đổ (nhưng trước hậu quả).\n- Có thể dùng điểm này thay thế xúc xắc Attack roll của kẻ địch đang nhắm vào bạn.\n- Phục hồi toàn bộ điểm Vận May sau Long Rest.'
    },
    {
        value: 'magic_initiate',
        label: 'Môn Đồ Ma Thuật (Magic Initiate)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Học một chút ma thuật cơ bản.\n- Chọn một Class (Bard, Cleric, Druid, Sorcerer, Warlock, Wizard). Bạn học 2 Cantrip từ bảng phép class đó.\n- Chọn thêm 1 phép Level 1 của class đó. Bạn có thể thi triển phép này 1 lần ở mức level gốc mà không tốn spell slot. Phục hồi sau Long Rest. Chỉ số dùng phép (Spellcasting Ability) tương ứng với Class đã chọn.'
    },
    {
        value: 'mobile',
        label: 'Cơ Động (Mobile)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Di chuyển nhanh nhẹn.\n- Speed tăng thêm 10 ft.\n- Khi dùng hành động Dash (Lướt), di chuyển qua địa hình khó (Difficult terrain) không làm bạn bị giảm tốc độ bước đó.\n- Khi bạn thực hiện Đòn Tấn Công cận chiến vào một sinh vật, trong lượt đó hành động chạy ra khỏi chúng sẽ không Kích hoạt đòn tấn công cơ hội (Opportunity Attack) từ mục tiêu.'
    },
    {
        value: 'observant',
        label: 'Quan Sát Sắc Bén (Observant)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Nhận thấy được những tiểu tiết nhỏ nhất.\n- Tăng Intelligence hoặc Wisdom thêm +1 (Tối đa 20).\n- Nếu bạn nhìn được miệng sinh vật đang nói một ngôn ngữ bạn biết, bạn có thể hiểu họ đang nói gì.\n- +5 điểm thưởng vào Passive Perception (Nhận Thức thụ động) và Passive Investigation (Điều Tra thụ động).'
    },
    {
        value: 'polearm_master',
        label: 'Bậc Thầy Binh Khí Cán Dài (Polearm Master)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Sử dụng Glaive, Halberd, Quarterstaff hoặc Spear cực đỉnh.\n- Khi dùng action Attack với vũ khí đó, bạn dùng Bonus action để dùng chuôi vũ khí đập thêm 1 đòn bồi. Sát thương của đòn bồi là 1d4 Bludgeoning.\n- Đối phương bị kích hoạt Opportunity Attack (đòn cơ hội của bạn) ngay khi chúng tiến vào tầm đánh của bạn khi bạn đang cầm các vũ khí này.'
    },
    {
        value: 'resilient',
        label: 'Kiên Cường (Resilient)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Rèn luyện khả năng chống chịu.\n- Chọn 1 Ability rating (Str, Dex, Con, Int, Wis, Cha). Chỉ số đó tăng thêm +1 (Tối đa 20).\n- Ngay lập tức đạt được Thông Thạo (Proficiency) trong các bài kiểm tra Saving Throw của Ability Score đó.'
    },
    {
        value: 'sentinel',
        label: 'Lính Gác Tinh Nhuệ (Sentinel)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Chuyên bảo vệ và chặn đường rút lui của địch.\n- Khi đánh chém cơ hội (Opportunity Attack) trúng 1 sinh vật, Speed của chúng trong lượt đó thành 0.\n- Sinh vật vẫn Kích hoạt đòn tấn công cơ hội của bạn kể cả khi chúng có dùng action Disengage (Luồn lách) bỏ chạy.\n- Khi sinh vật đứng sát bạn cất công tấn công mục tiêu không phải bạn (và người kia ko có Sentinel), bạn dùng Reaction tấn công cận chiến chúng.'
    },
    {
        value: 'sharpshooter',
        label: 'Xạ Thủ (Sharpshooter)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Bậc thầy bắn tĩa không thể trốn thoát.\n- Bắn mục tiêu ở mức xa nhất của vũ khí tầm xa mà không bị Disadvantage.\n- Đòn đánh xa bỏ qua lớp che phủ 1/2 (Half cover) và 3/4 (Three-quarters cover).\n- Trước khi bắn bằng vũ khí tầm xa, có thể chọn nhận -5 vào đổ Trúng để cộng +10 vào Sát thương.'
    },
    {
        value: 'shield_master',
        label: 'Bậc Thầy Dùng Khiên (Shield Master)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Dùng khiên không chỉ để phòng thủ mà lấn lướt công luôn.\n- Nếu thực hiện action Attack trong lượt, có thể dùng Bonus action lấy khiên húc (Shove) 1 sinh vật đứng gần.\n- Nếu ko bị Incapacitated, thêm cả AC của khiên vào bài đổ Dexterity Saving Throw chống lại phép thuật/hiệu ứng nhắm trúng chỉ 1 mình bạn.\n- Kể cả khi có hiệu ứng gây sát thương nửa (nếu thành công tiết kiệm Dex), bạn có thể dùng Reaction để không nhận tẹo damage nào nếu thành công đổ save.'
    },
    {
        value: 'tough',
        label: 'Trâu Bò (Tough)',
        category: 'General',
        prerequisite: 'Không có',
        description: 'Thân hình cứng rắn rèn qua năm tháng.\n- HP tối đa tăng thêm một lượng bằng: X2 x Level nhân vật hiện tại.\n- Bất cứ khi nào lên Level sau này, HP tối đa của bạn auto tăng thêm 2 điểm nữa.'
    },
    {
        value: 'war_caster',
        label: 'Pháp Sư Chiến Trận (War Caster)',
        category: 'General',
        prerequisite: 'Có khả năng dùng tối thiểu 1 phép',
        description: 'Tập luyện đi đôi với thực chiến để gieo rắt phép ngay giữa trận địa.\n- Lợi thế (Advantage) với các bài kiểm tra Concentration (Tập trung) Constitution.\n- Có thể thi triển phép với ký hiệu tay (S - Somatic) ngay cả khi đang bận cầm vũ khí / hoặc cầm khiên ở một tay.\n- Khi rình lúc sinh vật gỡ đòn Opportunity Attack từ bạn, bạn có thể quăng một phép vào mặt nó thay cho chém thường. Phép tốn 1 Action thực hiện và chỉ được target độc 1 mình nó.'
    }
];
