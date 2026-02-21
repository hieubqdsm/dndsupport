// === CLASS & SUBCLASS FEATURES DATABASE (PHB 2024) ===
// Homebrew: Thêm features mới vào các arrays tương ứng
// Features được nhóm theo class → level → feature details

export interface ClassFeature {
    name: string;
    label: string;         // Tên VN
    level: number;         // Level nhận được
    source: 'class' | 'subclass';
    subclass?: string;     // Nếu source = 'subclass', ghi tên subclass
    description: string;   // Mô tả chi tiết VN
    actionType?: 'Action' | 'Bonus Action' | 'Reaction' | 'Passive' | 'Special';
    usesPerRest?: string;  // VD: "2/Long Rest", "PB/Long Rest"
    dice?: string;         // VD: "1d8", "2d6+STR"
}

// ==========================================
// BARBARIAN
// ==========================================
export const BARBARIAN_FEATURES: ClassFeature[] = [
    // Class Features
    {
        name: 'Rage', label: 'Cuồng Nộ', level: 1, source: 'class', actionType: 'Bonus Action', usesPerRest: 'PB/Long Rest',
        description: 'Bonus Action kích hoạt. Kéo dài 10 turns (1 phút). Khi Rage:\n• Advantage mọi STR check & STR saving throw\n• +2 bonus melee damage (tăng theo level: +3 lv9, +4 lv16)\n• Resistance to B/P/S damage\nKết thúc nếu: bất tỉnh, hết turn mà chưa tấn công/bị hit, hoặc tự chọn.'
    },
    {
        name: 'Unarmored Defense', label: 'Phòng Thủ Không Giáp', level: 1, source: 'class', actionType: 'Passive',
        description: 'Khi không mặc giáp: AC = 10 + DEX mod + CON mod. Có thể dùng Shield.'
    },
    {
        name: 'Danger Sense', label: 'Giác Quan Nguy Hiểm', level: 2, source: 'class', actionType: 'Passive',
        description: 'Advantage DEX saving throws chống hiệu ứng bạn có thể thấy (bẫy, phép thuật...). Không hoạt động khi Blinded/Deafened/Incapacitated.'
    },
    {
        name: 'Reckless Attack', label: 'Tấn Công Liều Lĩnh', level: 2, source: 'class', actionType: 'Special',
        description: 'Khi tấn công melee lần đầu trong turn, chọn Reckless: Advantage mọi STR melee attack roll trong turn này. Đổi lại, attack roll nhắm vào bạn cũng có Advantage cho đến turn kế.'
    },
    {
        name: 'Primal Knowledge', label: 'Kiến Thức Nguyên Thủy', level: 3, source: 'class', actionType: 'Passive',
        description: 'Thêm proficiency 1 skill từ: Animal Handling, Athletics, Intimidation, Nature, Perception, Survival.'
    },
    {
        name: 'Extra Attack', label: 'Tấn Công Thêm', level: 5, source: 'class', actionType: 'Passive',
        description: 'Khi dùng Attack action, bạn attack 2 lần thay vì 1.'
    },
    {
        name: 'Fast Movement', label: 'Di Chuyển Nhanh', level: 5, source: 'class', actionType: 'Passive',
        description: 'Speed +10 ft khi không mặc Heavy Armor.'
    },
    {
        name: 'Feral Instinct', label: 'Bản Năng Hoang Dã', level: 7, source: 'class', actionType: 'Passive',
        description: 'Advantage Initiative rolls. Nếu bị Surprised, bạn vẫn hành động bình thường nếu Rage ngay (Bonus Action).'
    },
    {
        name: 'Brutal Strike', label: 'Đòn Tàn Bạo', level: 9, source: 'class', actionType: 'Special', dice: '1d10',
        description: 'Khi Reckless Attack hit: bỏ Advantage → thêm 1d10 damage + đẩy mục tiêu 15 ft hoặc Prone.'
    },
    {
        name: 'Relentless Rage', label: 'Cuồng Nộ Bất Khuất', level: 11, source: 'class', actionType: 'Passive',
        description: 'Khi Rage, nếu rơi 0 HP → CON save DC 10 (tăng 5 mỗi lần) → thành công = 1 HP thay vì bất tỉnh.'
    },
    {
        name: 'Persistent Rage', label: 'Cuồng Nộ Bền Bỉ', level: 15, source: 'class', actionType: 'Passive',
        description: 'Rage không kết thúc sớm trừ khi bạn bất tỉnh hoặc tự chọn kết thúc.'
    },
    {
        name: 'Indomitable Might', label: 'Sức Mạnh Bất Khuất', level: 18, source: 'class', actionType: 'Passive',
        description: 'Nếu STR check roll < STR score, dùng STR score thay result.'
    },
    {
        name: 'Primal Champion', label: 'Chiến Binh Nguyên Thủy', level: 20, source: 'class', actionType: 'Passive',
        description: 'STR +4, CON +4 (max 24). Rage không giới hạn số lần.'
    },

    // Berserker Subclass
    {
        name: 'Frenzy', label: 'Điên Cuồng', level: 3, source: 'subclass', subclass: 'Berserker', actionType: 'Special',
        description: 'Khi Rage, có thể dùng Bonus Action để 1 melee attack thêm mỗi turn. Mỗi turn bạn dùng Frenzy, nhận 1d6 Psychic damage khi Rage kết thúc.'
    },
    {
        name: 'Mindless Rage', label: 'Cuồng Nộ Mất Trí', level: 6, source: 'subclass', subclass: 'Berserker', actionType: 'Passive',
        description: 'Khi Rage: miễn nhiễm Charmed và Frightened. Nếu đang bị thì tạm hủy khi Rage.'
    },
    {
        name: 'Retaliation', label: 'Trả Đũa', level: 10, source: 'subclass', subclass: 'Berserker', actionType: 'Reaction',
        description: 'Khi bị hit bởi creature trong 5 ft: dùng Reaction → 1 melee attack trả đũa.'
    },
    {
        name: 'Intimidating Presence', label: 'Uy Phong Khiếp Sợ', level: 14, source: 'subclass', subclass: 'Berserker', actionType: 'Bonus Action', usesPerRest: 'PB/Long Rest',
        description: 'Bonus Action: chọn 1 creature trong 30 ft → WIS save (DC = 8 + Prof + STR mod). Thất bại = Frightened cho đến end of next turn.'
    },

    // Wild Heart Subclass
    {
        name: 'Animal Speaker', label: 'Kẻ Nói Chuyện Thú', level: 3, source: 'subclass', subclass: 'Wild Heart', actionType: 'Passive',
        description: 'Cast Speak with Animals và Beast Sense dạng ritual (không tốn slot).'
    },
    {
        name: 'Rage of the Wilds', label: 'Cuồng Nộ Hoang Dã', level: 3, source: 'subclass', subclass: 'Wild Heart', actionType: 'Special',
        description: 'Khi Rage, chọn 1 hiệu ứng thú:\n• Bear: Resistance ALL damage trừ Psychic\n• Eagle: Fly speed, Opportunity Attack không áp dụng\n• Wolf: Đồng minh cận chiến có Advantage attack creatures within 5ft of you'
    },
    {
        name: 'Aspect of the Wilds', label: 'Hình Ảnh Hoang Dã', level: 6, source: 'subclass', subclass: 'Wild Heart', actionType: 'Passive',
        description: 'Chọn benefit khi Rage:\n• Owl: Darkvision 60ft, Advantage Perception\n• Panther: Climb speed = Walk speed\n• Salmon: Swim speed = Walk speed'
    },
    {
        name: 'Power of the Wilds', label: 'Sức Mạnh Hoang Dã', level: 10, source: 'subclass', subclass: 'Wild Heart', actionType: 'Special',
        description: 'Khi Rage chọn hiệu ứng mạnh hơn:\n• Lion: Kẻ thù trong 5ft khi bạn Menacing Roar → Frightened\n• Ram: Charge 20ft thẳng → bonus 2d6 damage + Prone\n• Elephant: AoE 10ft Cone → STR save hoặc bị đẩy 15ft'
    },

    // Zealot Subclass
    {
        name: 'Divine Fury', label: 'Cơn Thịnh Nộ Thần Thánh', level: 3, source: 'subclass', subclass: 'Zealot', actionType: 'Special', dice: '1d6+level/2',
        description: 'Mỗi turn khi Rage, lần hit melee đầu tiên: +1d6 + ½ Barbarian level (làm tròn xuống) Necrotic hoặc Radiant damage (chọn khi Rage).'
    },
    {
        name: 'Warrior of the Gods', label: 'Chiến Binh Của Thần', level: 3, source: 'subclass', subclass: 'Zealot', actionType: 'Passive',
        description: 'Revive bạn (Raise Dead...) không tốn material components.'
    },
    {
        name: 'Fanatical Focus', label: 'Tập Trung Cuồng Tín', level: 6, source: 'subclass', subclass: 'Zealot', actionType: 'Special', usesPerRest: '1/Rage',
        description: 'Khi Rage, fail saving throw → reroll 1 lần (bắt buộc dùng roll mới).'
    },
    {
        name: 'Rage Beyond Death', label: 'Cuồng Nộ Vượt Tử', level: 14, source: 'subclass', subclass: 'Zealot', actionType: 'Passive',
        description: 'Khi Rage ở 0 HP: không bất tỉnh, vẫn Death Save. Nếu có 3 failures, chỉ chết khi Rage kết thúc.'
    },

    // World Tree Subclass
    {
        name: 'Vitality of the Tree', label: 'Sinh Lực Cây Đời', level: 3, source: 'subclass', subclass: 'World Tree', actionType: 'Special', usesPerRest: 'PB/Long Rest',
        description: 'Khi Rage: nhận Temp HP = Barbarian level + CON mod. Khi Rage, dùng Bonus Action cho 1 đồng minh trong 10ft nhận Temp HP = 1d6 + CON mod.'
    },
    {
        name: 'Branches of the Tree', label: 'Cành Cây Đời', level: 6, source: 'subclass', subclass: 'World Tree', actionType: 'Reaction',
        description: 'Khi Rage, Reaction: teleport đồng minh hoặc kẻ thù đang kề bạn → điểm trống trong 30ft. Kẻ thù phải fail STR save.'
    },
    {
        name: 'Battering Roots', label: 'Rễ Đập Tan', level: 10, source: 'subclass', subclass: 'World Tree', actionType: 'Passive',
        description: 'Khi Rage: melee attack reach +10ft. Hit → có thể đẩy 5ft hoặc Prone (STR save).'
    },
];

// ==========================================
// FIGHTER
// ==========================================
export const FIGHTER_FEATURES: ClassFeature[] = [
    {
        name: 'Fighting Style', label: 'Phong Cách Chiến Đấu', level: 1, source: 'class', actionType: 'Passive',
        description: 'Chọn 1 fighting style:\n• Archery: +2 ranged attack roll\n• Defense: +1 AC khi mặc giáp\n• Dueling: +2 melee damage khi cầm 1 tay\n• Great Weapon Fighting: Reroll 1-2 damage dice (2H)\n• Protection: Reaction → Disadvantage attack vào đồng minh trong 5ft\n• Two-Weapon Fighting: +Ability mod vào damage tay phụ'
    },
    {
        name: 'Second Wind', label: 'Hồi Sức', level: 1, source: 'class', actionType: 'Bonus Action', usesPerRest: 'PB/Short Rest', dice: '1d10+Fighter level',
        description: 'Bonus Action: Heal 1d10 + Fighter level HP.'
    },
    {
        name: 'Action Surge', label: 'Bùng Nổ Hành Động', level: 2, source: 'class', actionType: 'Special', usesPerRest: '1/Short Rest',
        description: 'Nhận thêm 1 Action trong turn này (ngoài Action/Bonus Action thường). Có thể dùng để Attack, Cast Spell, Dash...'
    },
    {
        name: 'Extra Attack', label: 'Tấn Công Thêm', level: 5, source: 'class', actionType: 'Passive',
        description: 'Attack action = 2 attacks. Tăng lên 3 attacks (Lv11) → 4 attacks (Lv20).'
    },
    {
        name: 'Indomitable', label: 'Bất Khuất', level: 9, source: 'class', actionType: 'Special', usesPerRest: '1/Long Rest',
        description: 'Khi fail saving throw → reroll và dùng roll mới.'
    },

    // Champion
    {
        name: 'Improved Critical', label: 'Đòn Chí Tử Cải Tiến', level: 3, source: 'subclass', subclass: 'Champion', actionType: 'Passive',
        description: 'Critical Hit trên roll 19–20 (thay vì chỉ 20).'
    },
    {
        name: 'Remarkable Athlete', label: 'Vận Động Viên Xuất Sắc', level: 7, source: 'subclass', subclass: 'Champion', actionType: 'Passive',
        description: 'Advantage Initiative. +Proficiency bonus cho STR/DEX/CON checks chưa proficient.'
    },
    {
        name: 'Superior Critical', label: 'Đòn Chí Tử Vượt Trội', level: 15, source: 'subclass', subclass: 'Champion', actionType: 'Passive',
        description: 'Critical Hit trên roll 18–20.'
    },

    // Battle Master
    {
        name: 'Combat Superiority', label: 'Ưu Thế Chiến Đấu', level: 3, source: 'subclass', subclass: 'Battle Master', actionType: 'Special', dice: '4d8 → 5d8(Lv7) → 6d10(Lv15)', usesPerRest: 'Short Rest',
        description: 'Có Superiority Dice (d8, lên d10 Lv10). Short Rest hồi lại. Dùng cho Maneuvers:\n• Trip Attack: +die damage, mục tiêu STR save hoặc Prone\n• Riposte: Reaction khi miss → attack + die damage\n• Precision: Thêm die vào attack roll\n• Menacing: +die damage, WIS save hoặc Frightened\n• Rally: Bonus Action → đồng minh +die Temp HP\n• Disarming: +die damage, STR save hoặc rơi vũ khí\n• Goading: +die damage, Disadvantage attack ai khác\n• Pushing: +die damage, đẩy 15ft'
    },
    {
        name: 'Student of War', label: 'Học Trò Chiến Tranh', level: 3, source: 'subclass', subclass: 'Battle Master', actionType: 'Passive',
        description: 'Thêm proficiency 1 tool hoặc 1 skill: History, Insight, Performance, Persuasion.'
    },
    {
        name: 'Relentless', label: 'Không Ngừng Nghỉ', level: 15, source: 'subclass', subclass: 'Battle Master', actionType: 'Passive',
        description: 'Khi Initiative roll mà hết Superiority Dice → nhận lại 1 die.'
    },

    // Eldritch Knight
    {
        name: 'Spellcasting (EK)', label: 'Thi Triển Phép (EK)', level: 3, source: 'subclass', subclass: 'Eldritch Knight', actionType: 'Special',
        description: 'Học phép Wizard (Abjuration/Evocation). Spellcasting ability = INT.\nCantrips: 2 (Lv3) → 3 (Lv10)\nSpell Slots: như ⅓ caster table.\nĐặc biệt: Sau Attack action, có thể cast Cantrip (Bonus Action, Lv7).'
    },
    {
        name: 'War Magic', label: 'Phép Chiến', level: 7, source: 'subclass', subclass: 'Eldritch Knight', actionType: 'Passive',
        description: 'Khi cast Cantrip (Action) → 1 weapon attack (Bonus Action).'
    },
    {
        name: 'Eldritch Strike', label: 'Đòn Huyền Bí', level: 10, source: 'subclass', subclass: 'Eldritch Knight', actionType: 'Passive',
        description: 'Khi hit creature bằng weapon → creature đó Disadvantage saving throw chống phép của bạn cho đến end of next turn.'
    },

    // Psi Warrior
    {
        name: 'Psionic Power', label: 'Năng Lượng Tâm Linh', level: 3, source: 'subclass', subclass: 'Psi Warrior', actionType: 'Special', dice: '2d6 → 2d8(Lv5) → 2d10(Lv11) → 2d12(Lv17)', usesPerRest: 'PB dice/Long Rest',
        description: 'Có Psionic Energy Dice (số = PB × 2). Dùng cho:\n• Protective Field: Reaction → giảm damage đồng minh = 1 die + INT mod\n• Psionic Strike: +1 die Force damage khi hit\n• Telekinetic Movement: di chuyển 1 vật/creature lên đến 30ft (Action)'
    },
    {
        name: 'Telekinetic Adept', label: 'Bậc Thầy Dịch Chuyển', level: 7, source: 'subclass', subclass: 'Psi Warrior', actionType: 'Special',
        description: 'Psi-Powered Leap: Bonus Action → fly speed = 2x walk speed cho turn này.\nTelekinetic Thrust: Khi Psionic Strike hit → STR save hoặc bị đẩy 10ft + Prone.'
    },
];

// ==========================================
// ROGUE
// ==========================================
export const ROGUE_FEATURES: ClassFeature[] = [
    {
        name: 'Expertise', label: 'Chuyên Gia', level: 1, source: 'class', actionType: 'Passive',
        description: 'Chọn 2 skills proficient → gấp đôi Proficiency Bonus. Thêm 2 skills Expertise ở Lv6.'
    },
    {
        name: 'Sneak Attack', label: 'Tấn Công Lén', level: 1, source: 'class', actionType: 'Special', dice: '1d6 (+1d6 mỗi 2 level)',
        description: '1 lần/turn: Khi hit với Finesse/Ranged weapon VÀ có Advantage HOẶC đồng minh trong 5ft mục tiêu → thêm Xd6 damage.\nLv1: 1d6, Lv3: 2d6, Lv5: 3d6 ... Lv19: 10d6.'
    },
    {
        name: 'Thieves\' Cant', label: 'Tiếng Lóng Đạo Tặc', level: 1, source: 'class', actionType: 'Passive',
        description: 'Ngôn ngữ bí mật của đạo tặc. Hiểu ký hiệu và mật ngữ.'
    },
    {
        name: 'Cunning Action', label: 'Hành Động Tinh Ranh', level: 2, source: 'class', actionType: 'Bonus Action',
        description: 'Bonus Action: Dash, Disengage, hoặc Hide.'
    },
    {
        name: 'Uncanny Dodge', label: 'Né Tránh Phi Thường', level: 5, source: 'class', actionType: 'Reaction',
        description: 'Reaction khi bị hit bởi attack bạn thấy → giảm ½ damage.'
    },
    {
        name: 'Evasion', label: 'Né Tránh', level: 7, source: 'class', actionType: 'Passive',
        description: 'DEX save thành công = 0 damage (thay vì ½). Thất bại = ½ damage (thay vì full).'
    },
    {
        name: 'Reliable Talent', label: 'Tài Năng Đáng Tin', level: 11, source: 'class', actionType: 'Passive',
        description: 'Mọi ability check có proficiency: roll < 10 → coi như 10.'
    },
    {
        name: 'Blindsense', label: 'Giác Quan Mù', level: 14, source: 'class', actionType: 'Passive',
        description: 'Phát hiện creature Invisible/Hidden trong 10ft (nếu nghe được).'
    },
    {
        name: 'Slippery Mind', label: 'Tâm Trí Trơn Trượt', level: 15, source: 'class', actionType: 'Passive',
        description: 'Proficiency WIS saving throws.'
    },
    {
        name: 'Stroke of Luck', label: 'May Mắn Tuyệt Đỉnh', level: 20, source: 'class', actionType: 'Special', usesPerRest: '1/Short Rest',
        description: 'Miss attack → biến thành hit. Hoặc fail ability check → coi như roll 20.'
    },

    // Thief
    {
        name: 'Fast Hands', label: 'Tay Nhanh', level: 3, source: 'subclass', subclass: 'Thief', actionType: 'Bonus Action',
        description: 'Cunning Action thêm: Use Object, Thieves\' Tools, Sleight of Hand bằng Bonus Action.'
    },
    {
        name: 'Second-Story Work', label: 'Chuyên Gia Leo Trèo', level: 3, source: 'subclass', subclass: 'Thief', actionType: 'Passive',
        description: 'Climb speed = Walk speed. Running jump xa hơn = DEX mod feet.'
    },
    {
        name: 'Thief\'s Reflexes', label: 'Phản Xạ Đạo Tặc', level: 17, source: 'subclass', subclass: 'Thief', actionType: 'Passive',
        description: '2 turns trong round đầu tiên của combat (1 ở Initiative, 1 ở Initiative - 10).'
    },

    // Assassin
    {
        name: 'Assassinate', label: 'Ám Sát', level: 3, source: 'subclass', subclass: 'Assassin', actionType: 'Passive',
        description: 'Advantage attack creatures chưa hành động. Hit creature Surprised = Critical Hit.'
    },
    {
        name: 'Infiltration Expertise', label: 'Chuyên Gia Xâm Nhập', level: 9, source: 'subclass', subclass: 'Assassin', actionType: 'Special',
        description: 'Tạo false identity (7 ngày + 25 GP). Tạo Disguise Kit.'
    },
    {
        name: 'Death Strike', label: 'Đòn Chí Tử', level: 17, source: 'subclass', subclass: 'Assassin', actionType: 'Special',
        description: 'Hit creature Surprised → CON save (DC = 8 + DEX mod + Prof). Fail = double damage.'
    },
];

// ==========================================
// WIZARD
// ==========================================
export const WIZARD_FEATURES: ClassFeature[] = [
    {
        name: 'Arcane Recovery', label: 'Hồi Phục Phép', level: 1, source: 'class', actionType: 'Special', usesPerRest: '1/Long Rest',
        description: 'Sau Short Rest: hồi spell slots tổng cấp ≤ ½ Wizard level (làm tròn lên). Không hồi slot cấp 6+.'
    },
    {
        name: 'Spellbook', label: 'Sách Phép', level: 1, source: 'class', actionType: 'Passive',
        description: 'Sách chứa phép đã học. Lên level → +2 phép miễn phí. Chép thêm từ scroll/sách khác (2 giờ + 50 GP/cấp phép).'
    },
    {
        name: 'Spell Mastery', label: 'Bậc Thầy Phép', level: 18, source: 'class', actionType: 'Passive',
        description: 'Chọn 1 phép cấp 1 + 1 phép cấp 2: cast miễn phí (không tốn slot) khi cast ở cấp thấp nhất.'
    },
    {
        name: 'Signature Spells', label: 'Phép Đặc Trưng', level: 20, source: 'class', actionType: 'Passive', usesPerRest: '1/Short Rest each',
        description: 'Chọn 2 phép cấp 3: luôn chuẩn bị + cast miễn phí 1 lần/Short Rest mỗi phép.'
    },

    // Evoker
    {
        name: 'Sculpt Spells', label: 'Điêu Khắc Phép', level: 2, source: 'subclass', subclass: 'Evoker', actionType: 'Special',
        description: 'Khi cast Evocation spell ảnh hưởng area: chọn lên đến 1 + spell level creatures → auto save thành công + nhận 0 damage.'
    },
    {
        name: 'Potent Cantrip', label: 'Cantrip Mạnh Mẽ', level: 6, source: 'subclass', subclass: 'Evoker', actionType: 'Passive',
        description: 'Khi creature save thành công chống cantrip damage của bạn → ½ damage thay vì 0.'
    },
    {
        name: 'Overchannel', label: 'Quá Tải', level: 14, source: 'subclass', subclass: 'Evoker', actionType: 'Special',
        description: 'Cast phép damage cấp 1-5: deal max damage thay vì roll. Dùng lần 2+ trước Long Rest → nhận 2d12 Necrotic damage/spell level.'
    },

    // Abjurer
    {
        name: 'Arcane Ward', label: 'Khiên Phép', level: 2, source: 'subclass', subclass: 'Abjurer', actionType: 'Passive',
        description: 'Cast Abjuration spell (slot cấp 1+) → tạo Ward với HP = 2 × Wizard level + INT mod. Ward nhận damage thay bạn.'
    },
    {
        name: 'Projected Ward', label: 'Khiên Bảo Hộ', level: 6, source: 'subclass', subclass: 'Abjurer', actionType: 'Reaction',
        description: 'Reaction: Ward nhận damage thay đồng minh trong 30ft.'
    },
    {
        name: 'Spell Resistance', label: 'Kháng Phép', level: 14, source: 'subclass', subclass: 'Abjurer', actionType: 'Passive',
        description: 'Advantage saving throws chống phép thuật. Resistance damage từ phép thuật.'
    },

    // Diviner
    {
        name: 'Portent', label: 'Tiên Tri', level: 2, source: 'subclass', subclass: 'Diviner', actionType: 'Special', dice: '2d20 (3d20 at Lv14)', usesPerRest: 'Long Rest',
        description: 'Sau Long Rest: roll 2d20 và ghi kết quả. Bất cứ lúc nào, thay thế 1 attack roll, save, hoặc ability check (của BẤT KỲ creature) bằng 1 portent roll.'
    },
    {
        name: 'Expert Divination', label: 'Bói Toán Chuyên Nghiệp', level: 6, source: 'subclass', subclass: 'Diviner', actionType: 'Passive',
        description: 'Cast Divination spell cấp 2+ → hồi 1 slot thấp hơn (cấp 1-5).'
    },
    {
        name: 'The Third Eye', label: 'Con Mắt Thứ Ba', level: 10, source: 'subclass', subclass: 'Diviner', actionType: 'Action', usesPerRest: '1/Short Rest',
        description: 'Action: chọn 1 → Darkvision 120ft, See Ethereal 60ft, See Invisibility 10ft, hoặc Read any language.'
    },

    // Illusionist
    {
        name: 'Improved Minor Illusion', label: 'Ảo Ảnh Nhỏ Cải Tiến', level: 2, source: 'subclass', subclass: 'Illusionist', actionType: 'Passive',
        description: 'Minor Illusion: tạo cả âm thanh VÀ hình ảnh cùng lúc.'
    },
    {
        name: 'Malleable Illusion', label: 'Ảo Ảnh Linh Hoạt', level: 6, source: 'subclass', subclass: 'Illusionist', actionType: 'Action',
        description: 'Action: thay đổi nội dung illusion spell đang Concentration (không cần cast lại).'
    },
    {
        name: 'Illusory Reality', label: 'Ảo Thành Thực', level: 14, source: 'subclass', subclass: 'Illusionist', actionType: 'Bonus Action',
        description: 'Bonus Action: 1 vật thể không sống trong illusion trở thành THẬT trong 1 phút. Không gây damage trực tiếp.'
    },
];

// ==========================================
// CLERIC
// ==========================================
export const CLERIC_FEATURES: ClassFeature[] = [
    {
        name: 'Channel Divinity', label: 'Kênh Thiêng', level: 2, source: 'class', actionType: 'Action', usesPerRest: 'PB/Long Rest',
        description: 'Dùng cho Turn Undead (class) + 1 ability từ subclass. Short Rest hồi 1 lần dùng.'
    },
    {
        name: 'Turn Undead', label: 'Xua Đuổi Undead', level: 2, source: 'class', actionType: 'Action',
        description: 'Channel Divinity: Mỗi Undead trong 30ft → WIS save. Fail = Turned (chạy trốn, không lại gần) 1 phút. Lv5+: destroy undead CR thấp.'
    },
    {
        name: 'Divine Intervention', label: 'Can Thiệp Thần Thánh', level: 10, source: 'class', actionType: 'Action', usesPerRest: '1/Long Rest',
        description: 'Cầu nguyện → cast bất kỳ Cleric spell hoặc 1 hiệu ứng do DM quyết định.'
    },

    // Life Domain
    {
        name: 'Disciple of Life', label: 'Đệ Tử Sự Sống', level: 3, source: 'subclass', subclass: 'Life', actionType: 'Passive',
        description: 'Healing spells: +2 + spell level HP thêm.'
    },
    {
        name: 'Preserve Life', label: 'Bảo Tồn Sự Sống', level: 3, source: 'subclass', subclass: 'Life', actionType: 'Action',
        description: 'Channel Divinity: Heal tổng = Cleric level × 5 HP, chia cho các đồng minh trong 30ft (mỗi người tối đa ½ max HP).'
    },
    {
        name: 'Supreme Healing', label: 'Chữa Lành Tối Thượng', level: 17, source: 'subclass', subclass: 'Life', actionType: 'Passive',
        description: 'Healing spells: thay vì roll → max damage dice.'
    },

    // War Domain
    {
        name: 'War Priest', label: 'Tu Sĩ Chiến Tranh', level: 3, source: 'subclass', subclass: 'War', actionType: 'Bonus Action', usesPerRest: 'WIS mod/Long Rest',
        description: 'Khi Attack → Bonus Action: 1 weapon attack thêm.'
    },
    {
        name: 'Guided Strike', label: 'Đòn Dẫn Dắt', level: 3, source: 'subclass', subclass: 'War', actionType: 'Special',
        description: 'Channel Divinity: +10 vào 1 attack roll (sau khi roll, trước khi biết hit/miss).'
    },
    {
        name: 'Avatar of Battle', label: 'Hiện Thân Chiến Tranh', level: 17, source: 'subclass', subclass: 'War', actionType: 'Passive',
        description: 'Resistance B/P/S damage từ weapon attacks nonmagical.'
    },
];

// ==========================================
// PALADIN  
// ==========================================
export const PALADIN_FEATURES: ClassFeature[] = [
    {
        name: 'Divine Smite', label: 'Đòn Thánh', level: 2, source: 'class', actionType: 'Special', dice: '2d8 + 1d8/slot level',
        description: 'Khi hit melee → tiêu 1 spell slot → thêm 2d8 Radiant damage + 1d8 mỗi slot level trên 1st (max 5d8). +1d8 nếu mục tiêu là Undead/Fiend.'
    },
    {
        name: 'Lay on Hands', label: 'Đặt Tay Chữa Lành', level: 1, source: 'class', actionType: 'Bonus Action', usesPerRest: 'Long Rest',
        description: 'Pool HP = Paladin level × 5. Chạm → heal tùy ý số HP từ pool. Hoặc tiêu 5 HP từ pool để cure 1 disease/neutralize 1 poison.'
    },
    {
        name: 'Divine Sense', label: 'Giác Quan Thánh', level: 1, source: 'class', actionType: 'Bonus Action', usesPerRest: 'PB/Long Rest',
        description: 'Phát hiện Celestial, Fiend, Undead trong 60ft. Biết loại nhưng không biết danh tính.'
    },
    {
        name: 'Aura of Protection', label: 'Hào Quang Bảo Hộ', level: 6, source: 'class', actionType: 'Passive',
        description: 'Bạn + đồng minh trong 10ft (30ft Lv18): +CHA mod vào mọi Saving Throws.'
    },
    {
        name: 'Aura of Courage', label: 'Hào Quang Dũng Cảm', level: 10, source: 'class', actionType: 'Passive',
        description: 'Bạn + đồng minh trong 10ft (30ft Lv18): miễn nhiễm Frightened.'
    },

    // Devotion
    {
        name: 'Sacred Weapon', label: 'Vũ Khí Thánh', level: 3, source: 'subclass', subclass: 'Devotion', actionType: 'Bonus Action', usesPerRest: 'Channel Divinity',
        description: 'Channel Divinity: vũ khí +CHA mod attack roll, tỏa sáng 20ft, kéo dài 10 phút.'
    },
    {
        name: 'Aura of Devotion', label: 'Hào Quang Tận Tụy', level: 7, source: 'subclass', subclass: 'Devotion', actionType: 'Passive',
        description: 'Bạn + đồng minh trong 10ft: miễn nhiễm Charmed.'
    },
    {
        name: 'Holy Nimbus', label: 'Hào Quang Thánh', level: 15, source: 'subclass', subclass: 'Devotion', actionType: 'Action', usesPerRest: '1/Long Rest',
        description: 'Tỏa sáng 30ft, 1 phút. Kẻ thù bắt đầu turn trong 10ft → 10 Radiant damage.'
    },

    // Vengeance
    {
        name: 'Abjure Enemy', label: 'Trục Xuất Kẻ Thù', level: 3, source: 'subclass', subclass: 'Vengeance', actionType: 'Action', usesPerRest: 'Channel Divinity',
        description: 'Channel Divinity: 1 creature trong 60ft → WIS save. Fail = Frightened + Speed 0 cho 1 phút.'
    },
    {
        name: 'Relentless Avenger', label: 'Kẻ Phục Thù Không Ngừng', level: 7, source: 'subclass', subclass: 'Vengeance', actionType: 'Passive',
        description: 'Opportunity Attack hit → di chuyển thêm ½ speed (không trigger Opportunity Attack).'
    },
    {
        name: 'Soul of Vengeance', label: 'Linh Hồn Phục Thù', level: 15, source: 'subclass', subclass: 'Vengeance', actionType: 'Reaction',
        description: 'Creature bị Abjure Enemy attack → Reaction: 1 melee attack trả đũa.'
    },
];

// ==========================================
// BARD
// ==========================================
export const BARD_FEATURES: ClassFeature[] = [
    {
        name: 'Bardic Inspiration', label: 'Cảm Hứng Thi Sĩ', level: 1, source: 'class', actionType: 'Bonus Action', usesPerRest: 'CHA mod/Long Rest (PB ở Lv5)', dice: '1d6 → d8(5) → d10(10) → d12(15)',
        description: 'Bonus Action: cho 1 creature trong 60ft 1 Inspiration die. Trong 10 phút, creature cộng die vào 1 ability check, attack roll, hoặc saving throw.'
    },
    {
        name: 'Jack of All Trades', label: 'Vạn Nghệ', level: 2, source: 'class', actionType: 'Passive',
        description: '+½ Proficiency Bonus (làm tròn xuống) vào mọi ability check chưa proficient.'
    },
    {
        name: 'Expertise', label: 'Chuyên Gia', level: 2, source: 'class', actionType: 'Passive',
        description: 'Chọn 2 skills proficient → gấp đôi Proficiency Bonus. Thêm 2 skills Expertise ở Lv9.'
    },
    {
        name: 'Countercharm', label: 'Phản Mê Hoặc', level: 7, source: 'class', actionType: 'Action',
        description: 'Action: bạn + đồng minh trong 30ft có Advantage saving throws chống Frightened/Charmed cho đến end of next turn.'
    },

    // Lore
    {
        name: 'Cutting Words', label: 'Lời Chê Bai', level: 3, source: 'subclass', subclass: 'Lore', actionType: 'Reaction', dice: 'Bardic die',
        description: 'Reaction khi creature trong 60ft roll attack, ability check, hoặc damage: trừ 1 Bardic Inspiration die từ roll đó.'
    },
    {
        name: 'Additional Magical Secrets', label: 'Bí Mật Ma Thuật Thêm', level: 6, source: 'subclass', subclass: 'Lore', actionType: 'Passive',
        description: 'Học 2 phép từ BẤT KỲ spell list (Wizard, Cleric...).'
    },
    {
        name: 'Peerless Skill', label: 'Kỹ Năng Vô Song', level: 14, source: 'subclass', subclass: 'Lore', actionType: 'Special',
        description: 'Khi fail ability check → dùng 1 Bardic Inspiration die cộng vào roll (không tốn use).'
    },

    // Valor
    {
        name: 'Combat Inspiration', label: 'Cảm Hứng Chiến Đấu', level: 3, source: 'subclass', subclass: 'Valor', actionType: 'Passive',
        description: 'Bardic Inspiration die có thể cộng vào weapon damage roll hoặc AC (Reaction) chống 1 attack.'
    },
    {
        name: 'Extra Attack (Valor)', label: 'Tấn Công Thêm', level: 6, source: 'subclass', subclass: 'Valor', actionType: 'Passive',
        description: 'Attack action = 2 attacks.'
    },
    {
        name: 'Battle Magic', label: 'Phép Chiến Trường', level: 14, source: 'subclass', subclass: 'Valor', actionType: 'Bonus Action',
        description: 'Khi cast spell (Action) → 1 weapon attack (Bonus Action).'
    },
];

// ==========================================
// DRUID
// ==========================================
export const DRUID_FEATURES: ClassFeature[] = [
    {
        name: 'Druidic', label: 'Ngôn Ngữ Druid', level: 1, source: 'class', actionType: 'Passive',
        description: 'Biết ngôn ngữ bí mật Druidic. Để lại tin nhắn ẩn trên tự nhiên.'
    },
    {
        name: 'Wild Shape', label: 'Biến Hình Hoang Dã', level: 2, source: 'class', actionType: 'Bonus Action', usesPerRest: 'PB/Long Rest',
        description: 'Bonus Action: biến thành động vật đã thấy.\n• Thời gian: ½ Druid level giờ\n• HP = HP con vật (hết → về dạng gốc)\n• Giữ mental stats (INT, WIS, CHA)\n• Không cast phép khi Wild Shape (trừ Lv18)\nCR tối đa: Lv2 = CR ¼, Lv4 = CR ½, Lv8 = CR 1.'
    },
    {
        name: 'Wild Companion', label: 'Bạn Đồng Hành Hoang Dã', level: 2, source: 'class', actionType: 'Action',
        description: 'Tiêu 1 Wild Shape use → cast Find Familiar không tốn slot.'
    },
    {
        name: 'Beast Spells', label: 'Phép Khi Biến Hình', level: 18, source: 'class', actionType: 'Passive',
        description: 'Cast phép khi Wild Shape (V, S components). Phép Concentration tiếp tục.'
    },
    {
        name: 'Archdruid', label: 'Đại Tu Sĩ', level: 20, source: 'class', actionType: 'Passive',
        description: 'Wild Shape không giới hạn số lần. Ignore V, S, M (không có giá) khi cast Druid spells.'
    },

    // Circle of the Moon
    {
        name: 'Combat Wild Shape', label: 'Biến Hình Chiến Đấu', level: 3, source: 'subclass', subclass: 'Moon', actionType: 'Bonus Action',
        description: 'Biến hình thành beast CR cao hơn (CR = Druid level / 3). Khi Wild Shape, tiêu spell slot → heal 1d8/slot level.'
    },
    {
        name: 'Circle Forms', label: 'Dạng Vòng Tròn', level: 6, source: 'subclass', subclass: 'Moon', actionType: 'Passive',
        description: 'Wild Shape attack được coi là magical. Biến thành CR = Druid level / 3 (làm tròn xuống).'
    },
    {
        name: 'Elemental Wild Shape', label: 'Biến Hình Nguyên Tố', level: 10, source: 'subclass', subclass: 'Moon', actionType: 'Special',
        description: 'Tiêu 2 Wild Shape uses → biến thành Air/Earth/Fire/Water Elemental.'
    },

    // Circle of the Land
    {
        name: 'Land Spells', label: 'Phép Vùng Đất', level: 3, source: 'subclass', subclass: 'Land', actionType: 'Passive',
        description: 'Chọn 1 biome (Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, Underdark) → nhận phép bonus luôn prepared.'
    },
    {
        name: 'Natural Recovery', label: 'Hồi Phục Tự Nhiên', level: 3, source: 'subclass', subclass: 'Land', actionType: 'Special', usesPerRest: '1/Long Rest',
        description: 'Sau Short Rest: hồi spell slots tổng cấp ≤ ½ Druid level (làm tròn lên). Không hồi slot cấp 6+.'
    },
    {
        name: 'Nature\'s Ward', label: 'Bảo Vệ Thiên Nhiên', level: 10, source: 'subclass', subclass: 'Land', actionType: 'Passive',
        description: 'Miễn nhiễm Poisoned, Disease. Resistance damage từ Elementals.'
    },

    // Circle of the Stars
    {
        name: 'Star Map', label: 'Bản Đồ Sao', level: 3, source: 'subclass', subclass: 'Stars', actionType: 'Passive',
        description: 'Nhận star map (spellcasting focus). Học Guidance cantrip + Guiding Bolt (luôn prepared, cast miễn phí PB lần/Long Rest).'
    },
    {
        name: 'Starry Form', label: 'Hình Dạng Sao', level: 3, source: 'subclass', subclass: 'Stars', actionType: 'Bonus Action', usesPerRest: 'PB/Long Rest',
        description: 'Bonus Action (hoặc khi Wild Shape): chọn 1 chòm sao:\n• Archer: Bonus Action → ranged spell attack 1d8+WIS Radiant (60ft)\n• Chalice: Khi heal → thêm 1d8+WIS cho creature khác trong 30ft\n• Dragon: Minimum 10 trên Concentration checks + INT/WIS checks'
    },
    {
        name: 'Full of Stars', label: 'Đầy Sao', level: 14, source: 'subclass', subclass: 'Stars', actionType: 'Passive',
        description: 'Khi Starry Form: Resistance B/P/S damage.'
    },

    // Circle of the Sea
    {
        name: 'Wrath of the Sea', label: 'Cơn Thịnh Nộ Biển', level: 3, source: 'subclass', subclass: 'Sea', actionType: 'Bonus Action', dice: '1d4 Cold', usesPerRest: 'PB/Long Rest',
        description: 'Bonus Action: mỗi creature bạn chọn trong 10ft → CON save, fail = 1d4 Cold damage + đẩy 5ft. Die tăng theo level.'
    },
    {
        name: 'Aquatic Affinity', label: 'Ái Lực Thủy Sinh', level: 6, source: 'subclass', subclass: 'Sea', actionType: 'Passive',
        description: 'Swim speed = Walk speed. Thở dưới nước. Wild Shape thành aquatic beasts.'
    },
    {
        name: 'Oceanic Gift', label: 'Quà Tặng Đại Dương', level: 10, source: 'subclass', subclass: 'Sea', actionType: 'Passive',
        description: 'Resistance Cold và Lightning damage.'
    },
];

// ==========================================
// RANGER
// ==========================================
export const RANGER_FEATURES: ClassFeature[] = [
    {
        name: 'Favored Enemy', label: 'Kẻ Thù Quen Thuộc', level: 1, source: 'class', actionType: 'Passive',
        description: 'Chọn loại kẻ thù (Aberrations, Beasts, Celestials, Constructs, Dragons, Elementals, Fey, Fiends, Giants, Monstrosities, Oozes, Plants, Undead).\nAdvantage Survival để theo dấu + Intelligence checks để nhận diện.'
    },
    {
        name: 'Deft Explorer', label: 'Nhà Thám Hiểm Khéo Léo', level: 1, source: 'class', actionType: 'Passive',
        description: 'Lv1: Expertise 1 skill proficient. Lv6: +5ft speed + climb/swim speed. Lv10: +1d8 Temp HP khi Short Rest (nếu dưới ½ HP).'
    },
    {
        name: 'Fighting Style', label: 'Phong Cách Chiến Đấu', level: 2, source: 'class', actionType: 'Passive',
        description: 'Chọn 1: Archery (+2 ranged attack), Defense (+1 AC), Dueling (+2 melee 1H damage), Two-Weapon Fighting (+mod damage tay phụ).'
    },
    {
        name: 'Extra Attack', label: 'Tấn Công Thêm', level: 5, source: 'class', actionType: 'Passive',
        description: 'Attack action = 2 attacks.'
    },
    {
        name: 'Nature\'s Veil', label: 'Màn Thiên Nhiên', level: 10, source: 'class', actionType: 'Bonus Action', usesPerRest: 'PB/Long Rest',
        description: 'Bonus Action: Invisible cho đến đầu turn kế (hoặc khi attack/cast phép).'
    },
    {
        name: 'Feral Senses', label: 'Giác Quan Hoang Dã', level: 18, source: 'class', actionType: 'Passive',
        description: 'Khi không Blinded/Deafened: 30ft Blindsight. Không Disadvantage attack invisible creatures.'
    },
    {
        name: 'Foe Slayer', label: 'Kẻ Giết Thù', level: 20, source: 'class', actionType: 'Passive',
        description: '1/turn: +WIS mod vào attack roll hoặc damage roll chống Favored Enemy.'
    },

    // Hunter
    {
        name: 'Hunter\'s Prey', label: 'Con Mồi Thợ Săn', level: 3, source: 'subclass', subclass: 'Hunter', actionType: 'Passive',
        description: 'Chọn 1:\n• Colossus Slayer: +1d8/turn khi hit creature dưới max HP\n• Giant Killer: Reaction attack khi Large+ creature trong 5ft miss bạn\n• Horde Breaker: 1 attack thêm mỗi turn vào creature khác trong 5ft mục tiêu gốc'
    },
    {
        name: 'Defensive Tactics', label: 'Chiến Thuật Phòng Thủ', level: 7, source: 'subclass', subclass: 'Hunter', actionType: 'Passive',
        description: 'Chọn 1:\n• Escape the Horde: Opportunity Attacks bạn có Disadvantage\n• Multiattack Defense: +4 AC sau bị hit bởi cùng creature\n• Steel Will: Advantage chống Frightened'
    },
    {
        name: 'Superior Hunter\'s Defense', label: 'Phòng Thủ Thợ Săn Vượt Trội', level: 15, source: 'subclass', subclass: 'Hunter', actionType: 'Passive',
        description: 'Chọn 1:\n• Evasion: DEX save success = 0 damage\n• Stand Against the Tide: Reaction → redirect miss attack vào creature khác\n• Uncanny Dodge: Reaction → ½ damage từ 1 attack'
    },

    // Gloom Stalker
    {
        name: 'Dread Ambusher', label: 'Kẻ Phục Kích Đáng Sợ', level: 3, source: 'subclass', subclass: 'Gloom Stalker', actionType: 'Special', dice: '+1d8',
        description: 'Turn đầu combat: +10ft speed, 1 attack thêm, +1d8 damage cho attack thêm đó. Darkvision +60ft.'
    },
    {
        name: 'Umbral Sight', label: 'Tầm Nhìn Bóng Tối', level: 3, source: 'subclass', subclass: 'Gloom Stalker', actionType: 'Passive',
        description: 'Invisible đối với creature dựa vào Darkvision để thấy bạn trong bóng tối.'
    },
    {
        name: 'Shadowy Dodge', label: 'Né Bóng', level: 7, source: 'subclass', subclass: 'Gloom Stalker', actionType: 'Reaction',
        description: 'Reaction khi bị attack (không Advantage): Disadvantage attack roll đó.'
    },

    // Beast Master
    {
        name: 'Primal Companion', label: 'Đồng Hành Nguyên Thủy', level: 3, source: 'subclass', subclass: 'Beast Master', actionType: 'Bonus Action',
        description: 'Triệu hồi Beast of the Land/Sea/Sky. Beast hành động theo lệnh bạn (Bonus Action). HP = 5 + 5 × Ranger level. Attack = Prof + WIS mod.'
    },
    {
        name: 'Exceptional Training', label: 'Huấn Luyện Đặc Biệt', level: 7, source: 'subclass', subclass: 'Beast Master', actionType: 'Passive',
        description: 'Beast attack = magical. Khi bạn Dodge → beast Dash/Disengage/Help bằng Bonus Action.'
    },
    {
        name: 'Share Spells', label: 'Chia Sẻ Phép', level: 15, source: 'subclass', subclass: 'Beast Master', actionType: 'Passive',
        description: 'Phép target self → cũng áp dụng cho beast (nếu trong 30ft).'
    },

    // Fey Wanderer
    {
        name: 'Dreadful Strikes', label: 'Đòn Đáng Sợ', level: 3, source: 'subclass', subclass: 'Fey Wanderer', actionType: 'Passive', dice: '+1d4 Psychic',
        description: '+1d4 Psychic damage khi hit creature bằng weapon (1/turn/creature).'
    },
    {
        name: 'Otherworldly Glamour', label: 'Sức Hút Thần Tiên', level: 3, source: 'subclass', subclass: 'Fey Wanderer', actionType: 'Passive',
        description: '+WIS mod vào CHA checks. Proficiency 1 skill: Deception, Performance, hoặc Persuasion.'
    },
    {
        name: 'Misty Wanderer', label: 'Lữ Khách Sương Mù', level: 7, source: 'subclass', subclass: 'Fey Wanderer', actionType: 'Passive',
        description: 'Misty Step luôn prepared + cast miễn phí PB/Long Rest. Khi cast, mang theo 1 willing creature trong 5ft.'
    },
];

// ==========================================
// MONK
// ==========================================
export const MONK_FEATURES: ClassFeature[] = [
    {
        name: 'Martial Arts', label: 'Võ Thuật', level: 1, source: 'class', actionType: 'Passive', dice: '1d6 → d8(5) → d10(11) → d12(17)',
        description: 'Khi dùng Unarmed Strike hoặc Monk weapon:\n• Dùng DEX thay STR cho attack/damage\n• Martial Arts die thay damage thường\n• Bonus Action: 1 Unarmed Strike thêm'
    },
    {
        name: 'Unarmored Defense', label: 'Phòng Thủ Không Giáp', level: 1, source: 'class', actionType: 'Passive',
        description: 'Khi không mặc giáp/khiên: AC = 10 + DEX mod + WIS mod.'
    },
    {
        name: 'Ki / Focus Points', label: 'Ki / Điểm Tập Trung', level: 2, source: 'class', actionType: 'Special', usesPerRest: 'Monk level/Short Rest',
        description: 'Điểm Ki = Monk level (hồi Short Rest). Dùng cho:\n• Flurry of Blows: Bonus Action, 2 Unarmed Strikes (1 Ki)\n• Patient Defense: Bonus Action, Dodge (1 Ki)\n• Step of the Wind: Bonus Action, Dash + Disengage + jump ×2 (1 Ki)'
    },
    {
        name: 'Unarmored Movement', label: 'Di Chuyển Không Giáp', level: 2, source: 'class', actionType: 'Passive',
        description: 'Speed +10ft (không giáp). Tăng: +15(6), +20(10), +25(14), +30(18). Lv9: chạy trên tường/nước (khi di chuyển).'
    },
    {
        name: 'Deflect Missiles', label: 'Đỡ Tên', level: 3, source: 'class', actionType: 'Reaction', dice: '1d10 + DEX + level',
        description: 'Reaction khi bị hit bởi ranged weapon: giảm damage 1d10 + DEX mod + Monk level. Nếu giảm về 0 → tiêu 1 Ki, ném lại vũ khí (ranged attack, Monk weapon, 20/60ft).'
    },
    {
        name: 'Extra Attack', label: 'Tấn Công Thêm', level: 5, source: 'class', actionType: 'Passive',
        description: 'Attack action = 2 attacks.'
    },
    {
        name: 'Stunning Strike', label: 'Đòn Choáng', level: 5, source: 'class', actionType: 'Special', usesPerRest: '1 Ki/use',
        description: 'Khi hit melee → tiêu 1 Ki → mục tiêu CON save. Fail = Stunned cho đến end of your next turn.'
    },
    {
        name: 'Evasion', label: 'Né Tránh', level: 7, source: 'class', actionType: 'Passive',
        description: 'DEX save success = 0 damage (thay vì ½). Fail = ½ damage (thay vì full).'
    },
    {
        name: 'Stillness of Mind', label: 'Tĩnh Tâm', level: 7, source: 'class', actionType: 'Action',
        description: 'Action: kết thúc Charmed hoặc Frightened trên bản thân.'
    },
    {
        name: 'Diamond Soul', label: 'Kim Cương Linh Hồn', level: 14, source: 'class', actionType: 'Passive',
        description: 'Proficiency mọi saving throws. Tiêu 1 Ki → reroll failed save.'
    },
    {
        name: 'Empty Body', label: 'Thân Rỗng', level: 18, source: 'class', actionType: 'Action', usesPerRest: '4 Ki',
        description: 'Action: tiêu 4 Ki → Invisible 1 phút + Resistance ALL damage trừ Force.'
    },
    {
        name: 'Perfect Self', label: 'Hoàn Thiện', level: 20, source: 'class', actionType: 'Passive',
        description: 'Khi Initiative mà hết Ki → nhận lại 4 Ki.'
    },

    // Way of the Open Hand
    {
        name: 'Open Hand Technique', label: 'Kỹ Thuật Tay Không', level: 3, source: 'subclass', subclass: 'Open Hand', actionType: 'Special',
        description: 'Khi Flurry of Blows hit: chọn 1:\n• Mục tiêu DEX save hoặc Prone\n• Mục tiêu STR save hoặc bị đẩy 15ft\n• Mục tiêu không dùng Reaction cho đến end of your next turn'
    },
    {
        name: 'Wholeness of Body', label: 'Toàn Thân', level: 6, source: 'subclass', subclass: 'Open Hand', actionType: 'Action', usesPerRest: '1/Long Rest',
        description: 'Action: heal 3 × Monk level HP.'
    },
    {
        name: 'Quivering Palm', label: 'Chưởng Rung', level: 17, source: 'subclass', subclass: 'Open Hand', actionType: 'Special', usesPerRest: '4 Ki',
        description: 'Sau Unarmed Strike hit (tiêu 4 Ki): bất cứ lúc nào trong vòng Monk level ngày → Action: mục tiêu CON save DC = Ki save DC. Fail = rơi 0 HP. Success = 10d10 Necrotic.'
    },

    // Way of Shadow
    {
        name: 'Shadow Arts', label: 'Nghệ Thuật Bóng Tối', level: 3, source: 'subclass', subclass: 'Shadow', actionType: 'Action', usesPerRest: '2 Ki/spell',
        description: 'Cast (2 Ki): Darkness, Darkvision, Pass without Trace, Silence. Minor Illusion cantrip miễn phí.'
    },
    {
        name: 'Shadow Step', label: 'Bước Bóng', level: 6, source: 'subclass', subclass: 'Shadow', actionType: 'Bonus Action',
        description: 'Bonus Action: teleport 60ft từ dim light/darkness → dim light/darkness khác. Advantage melee attack đầu tiên sau teleport.'
    },
    {
        name: 'Cloak of Shadows', label: 'Áo Choàng Bóng Tối', level: 11, source: 'subclass', subclass: 'Shadow', actionType: 'Action',
        description: 'Action: Invisible trong dim light/darkness (Concentration, cho đến attack/cast phép).'
    },

    // Way of Mercy
    {
        name: 'Hand of Healing', label: 'Bàn Tay Chữa Lành', level: 3, source: 'subclass', subclass: 'Mercy', actionType: 'Action', dice: '1 Martial Arts die + WIS', usesPerRest: '1 Ki/use',
        description: 'Tiêu 1 Ki: chạm creature → heal 1 Martial Arts die + WIS mod. Hoặc thay 1 Flurry of Blows attack bằng heal.'
    },
    {
        name: 'Hand of Harm', label: 'Bàn Tay Gây Hại', level: 3, source: 'subclass', subclass: 'Mercy', actionType: 'Special', dice: '1 Martial Arts die + WIS Necrotic', usesPerRest: '1 Ki/use',
        description: 'Khi hit Unarmed Strike: tiêu 1 Ki → +1 Martial Arts die + WIS mod Necrotic damage. Mục tiêu Poisoned cho đến end of your next turn.'
    },
    {
        name: 'Physician\'s Touch', label: 'Tay Thầy Thuốc', level: 6, source: 'subclass', subclass: 'Mercy', actionType: 'Passive',
        description: 'Hand of Healing: cũng kết thúc Blinded, Deafened, Paralyzed, Poisoned, Stunned. Hand of Harm: mục tiêu có thể bị trúng độc thêm.'
    },

    // Way of the Elements
    {
        name: 'Elemental Attunement', label: 'Hòa Hợp Nguyên Tố', level: 3, source: 'subclass', subclass: 'Elements', actionType: 'Bonus Action', usesPerRest: '2 Ki',
        description: 'Tiêu 2 Ki: chọn hiệu ứng nguyên tố (lửa, nước, đất, gió) cho đòn đánh. Thêm dice damage theo nguyên tố.'
    },
    {
        name: 'Elemental Burst', label: 'Nổ Nguyên Tố', level: 6, source: 'subclass', subclass: 'Elements', actionType: 'Action', dice: '3d6 elemental', usesPerRest: '3 Ki',
        description: 'Tiêu 3 Ki: AoE 20ft sphere → DEX save, 3d6 elemental damage. Tăng 1d6/Ki thêm.'
    },
    {
        name: 'Elemental Epitome', label: 'Tinh Hoa Nguyên Tố', level: 17, source: 'subclass', subclass: 'Elements', actionType: 'Special',
        description: 'Elemental Attunement: thêm Fly speed, Resistance elemental damage type, bonus damage tăng gấp đôi.'
    },
];

// ==========================================
// SORCERER
// ==========================================
export const SORCERER_FEATURES: ClassFeature[] = [
    {
        name: 'Sorcery Points', label: 'Điểm Phép Thuật', level: 2, source: 'class', actionType: 'Special', usesPerRest: 'Sorcerer level/Long Rest',
        description: 'Điểm = Sorcerer level. Dùng cho:\n• Metamagic (tùy loại)\n• Tạo spell slot: 2 pts = Lv1, 3 = Lv2, 5 = Lv3, 6 = Lv4, 7 = Lv5\n• Đổi slot → points: Slot level = points nhận'
    },
    {
        name: 'Metamagic', label: 'Biến Đổi Phép', level: 3, source: 'class', actionType: 'Special',
        description: 'Chọn 2 Metamagic (thêm ở Lv10, Lv17):\n• Twinned (pts = spell level): cast lên 2 mục tiêu\n• Quickened (2 pts): cast bằng Bonus Action\n• Subtle (1 pt): bỏ V, S components\n• Empowered (1 pt): reroll damage dice (CHA mod dice)\n• Extended (1 pt): duration ×2\n• Heightened (3 pts): 1 mục tiêu Disadvantage save\n• Careful (1 pt): chọn CHA mod creatures auto save success\n• Distant (1 pt): range ×2 (touch → 30ft)'
    },
    {
        name: 'Sorcerous Restoration', label: 'Phục Hồi Phép Thuật', level: 5, source: 'class', actionType: 'Passive',
        description: 'Khi Short Rest: hồi Sorcery Points = ½ Sorcerer level (làm tròn lên), 1 lần/Long Rest.'
    },

    // Draconic Bloodline
    {
        name: 'Draconic Resilience', label: 'Khả Năng Chống Chịu Rồng', level: 1, source: 'subclass', subclass: 'Draconic', actionType: 'Passive',
        description: 'HP +1/Sorcerer level. Khi không giáp: AC = 13 + DEX mod. Chọn 1 dragon type → liên kết damage type.'
    },
    {
        name: 'Elemental Affinity', label: 'Ái Lực Nguyên Tố', level: 6, source: 'subclass', subclass: 'Draconic', actionType: 'Special', usesPerRest: '1 pt',
        description: 'Cast phép damage trùng dragon type: +CHA mod damage. Tiêu 1 pt → Resistance dragon damage type 1 giờ.'
    },
    {
        name: 'Dragon Wings', label: 'Đôi Cánh Rồng', level: 14, source: 'subclass', subclass: 'Draconic', actionType: 'Bonus Action',
        description: 'Bonus Action: mọc cánh → Fly speed = Walk speed. Kéo dài cho đến khi dismiss.'
    },

    // Wild Magic
    {
        name: 'Wild Magic Surge', label: 'Bùng Nổ Ma Thuật Hoang', level: 1, source: 'subclass', subclass: 'Wild Magic', actionType: 'Special',
        description: 'Sau cast Sorcerer spell cấp 1+: DM có thể yêu cầu roll d20. Roll 1 = Wild Magic Surge → roll d100 trên bảng hiệu ứng ngẫu nhiên.'
    },
    {
        name: 'Tides of Chaos', label: 'Sóng Hỗn Loạn', level: 1, source: 'subclass', subclass: 'Wild Magic', actionType: 'Special', usesPerRest: '1/Long Rest (hoặc reset khi Surge)',
        description: 'Tự cho mình Advantage 1 attack roll, ability check, hoặc saving throw. DM có thể trigger Wild Magic Surge để reset.'
    },
    {
        name: 'Controlled Chaos', label: 'Hỗn Loạn Có Kiểm Soát', level: 14, source: 'subclass', subclass: 'Wild Magic', actionType: 'Passive',
        description: 'Khi Wild Magic Surge: roll 2 lần trên bảng → chọn 1 kết quả.'
    },

    // Aberrant Mind
    {
        name: 'Telepathic Speech', label: 'Nói Chuyện Thần Giao', level: 1, source: 'subclass', subclass: 'Aberrant', actionType: 'Bonus Action',
        description: 'Bonus Action: telepathy 2 chiều với 1 creature trong 30ft × CHA mod. Kéo dài Sorcerer level phút.'
    },
    {
        name: 'Psionic Sorcery', label: 'Phép Thuật Tâm Linh', level: 6, source: 'subclass', subclass: 'Aberrant', actionType: 'Special',
        description: 'Cast psionic spells (từ Aberrant list) bằng Sorcery Points thay slot → không V, S components.'
    },
    {
        name: 'Revelation in Flesh', label: 'Biến Đổi Thể Xác', level: 14, source: 'subclass', subclass: 'Aberrant', actionType: 'Bonus Action', usesPerRest: '1+ Sorcery pts',
        description: 'Tiêu Sorcery Points: mỗi 1 pt chọn 1 benefit 10 phút:\n• See Invisibility 60ft\n• Fly speed = Walk speed (hover)\n• Swim speed ×2 + breathe underwater\n• Squeeze through 1-inch spaces'
    },

    // Clockwork Soul
    {
        name: 'Clockwork Magic', label: 'Ma Thuật Cơ Giới', level: 1, source: 'subclass', subclass: 'Clockwork', actionType: 'Passive',
        description: 'Học thêm phép Clockwork bonus (luôn prepared). Khi lên level có thể swap 1 phép bonus → phép Abjuration/Transmutation từ bất kỳ list.'
    },
    {
        name: 'Restore Balance', label: 'Phục Hồi Cân Bằng', level: 1, source: 'subclass', subclass: 'Clockwork', actionType: 'Reaction', usesPerRest: 'PB/Long Rest',
        description: 'Reaction khi creature trong 60ft roll Advantage/Disadvantage → hủy bỏ (roll bình thường).'
    },
    {
        name: 'Trance of Order', label: 'Trạng Thái Trật Tự', level: 14, source: 'subclass', subclass: 'Clockwork', actionType: 'Bonus Action', usesPerRest: '7 Sorcery pts',
        description: 'Bonus Action, 1 phút: Mọi attack roll, ability check, saving throw của bạn: treat roll < 10 → = 10.'
    },
];

// ==========================================
// WARLOCK
// ==========================================
export const WARLOCK_FEATURES: ClassFeature[] = [
    {
        name: 'Pact Magic', label: 'Phép Khế Ước', level: 1, source: 'class', actionType: 'Passive',
        description: 'Ít spell slots (1→4) nhưng LUÔN ở level cao nhất có thể:\n• Lv1-2: 1 slot, Lv1 spell\n• Lv3-4: 2 slots, Lv2 spell\n• Lv5-6: 2 slots, Lv3 spell\n• Lv7-8: 2 slots, Lv4 spell\n• Lv9+: 2 slots, Lv5 spell\n• Lv11+: 3 slots\n• Lv17+: 4 slots\nHỒI SAU SHORT REST (không cần Long Rest)!'
    },
    {
        name: 'Eldritch Invocations', label: 'Lời Khẩn Cầu', level: 2, source: 'class', actionType: 'Passive',
        description: 'Chọn từ danh sách Invocations (2 ở Lv2, thêm theo level). Phổ biến:\n• Agonizing Blast: +CHA mod damage cho Eldritch Blast\n• Repelling Blast: Eldritch Blast đẩy mục tiêu 10ft\n• Mask of Many Faces: Disguise Self không giới hạn\n• Devil\'s Sight: Darkvision 120ft (kể cả magical darkness)\n• Misty Visions: Silent Image không giới hạn'
    },
    {
        name: 'Pact Boon', label: 'Quà Tặng Khế Ước', level: 3, source: 'class', actionType: 'Passive',
        description: 'Chọn loại boon (hoặc 1 Invocation thêm):\n• Pact of the Blade: Triệu hồi magic weapon, dùng CHA attack\n• Pact of the Chain: Find Familiar cải tiến (Imp, Pseudodragon...)\n• Pact of the Tome: 3 cantrips từ bất kỳ list + Book of Shadows'
    },
    {
        name: 'Mystic Arcanum', label: 'Bí Thuật Thần Bí', level: 11, source: 'class', actionType: 'Special', usesPerRest: '1/Long Rest each',
        description: 'Chọn phép cấp cao hơn 5: Lv6 (Lv11), Lv7 (Lv13), Lv8 (Lv15), Lv9 (Lv17). Cast miễn phí 1 lần/Long Rest mỗi phép.'
    },
    {
        name: 'Eldritch Master', label: 'Bậc Thầy Khế Ước', level: 20, source: 'class', actionType: 'Special', usesPerRest: '1/Long Rest',
        description: '1 phút cầu nguyện → hồi tất cả Pact Magic slots (1/Long Rest).'
    },

    // Fiend Patron
    {
        name: 'Dark One\'s Blessing', label: 'Phúc Lành Quỷ Dữ', level: 1, source: 'subclass', subclass: 'Fiend', actionType: 'Passive',
        description: 'Khi giảm hostile creature về 0 HP → nhận Temp HP = CHA mod + Warlock level.'
    },
    {
        name: 'Dark One\'s Own Luck', label: 'Vận May Quỷ Dữ', level: 6, source: 'subclass', subclass: 'Fiend', actionType: 'Special', dice: '+1d10', usesPerRest: '1/Short Rest',
        description: 'Khi ability check hoặc saving throw → +1d10 vào roll (sau roll, trước biết kết quả).'
    },
    {
        name: 'Hurl Through Hell', label: 'Ném Xuống Địa Ngục', level: 14, source: 'subclass', subclass: 'Fiend', actionType: 'Special', dice: '10d10 Psychic', usesPerRest: '1/Long Rest',
        description: 'Khi hit creature → bị teleport qua Lower Planes. Cuối next turn về lại → 10d10 Psychic damage.'
    },

    // Archfey Patron
    {
        name: 'Fey Presence', label: 'Hiện Diện Tiên', level: 1, source: 'subclass', subclass: 'Archfey', actionType: 'Action', usesPerRest: '1/Short Rest',
        description: 'Action: mỗi creature trong 10ft cube → WIS save. Fail = Charmed hoặc Frightened (chọn) cho đến end of next turn.'
    },
    {
        name: 'Misty Escape', label: 'Thoát Sương', level: 6, source: 'subclass', subclass: 'Archfey', actionType: 'Reaction', usesPerRest: '1/Short Rest',
        description: 'Reaction khi bị hit: Invisible + teleport 60ft (end of next turn hết Invisible).'
    },
    {
        name: 'Dark Delirium', label: 'Mê Sảng Tối', level: 14, source: 'subclass', subclass: 'Archfey', actionType: 'Action', usesPerRest: '1/Short Rest',
        description: 'Action: 1 creature → WIS save. Fail = Charmed/Frightened 1 phút, trapped trong illusory realm. Concentration.'
    },

    // Great Old One Patron
    {
        name: 'Awakened Mind', label: 'Tâm Trí Thức Tỉnh', level: 1, source: 'subclass', subclass: 'Great Old One', actionType: 'Passive',
        description: 'Telepathy 30ft với bất kỳ creature (biết ít nhất 1 ngôn ngữ). 1 chiều (bạn gửi, creature gửi lại nếu muốn).'
    },
    {
        name: 'Entropic Ward', label: 'Khiên Entropy', level: 6, source: 'subclass', subclass: 'Great Old One', actionType: 'Reaction', usesPerRest: '1/Short Rest',
        description: 'Reaction khi bị attack: Disadvantage attack roll đó. Nếu miss → Advantage attack roll tiếp theo của bạn nhắm creature đó.'
    },
    {
        name: 'Create Thrall', label: 'Tạo Nô Lệ Tâm Linh', level: 14, source: 'subclass', subclass: 'Great Old One', actionType: 'Special',
        description: 'Chạm Incapacitated humanoid → Charmed vĩnh viễn. Telepathy không giới hạn khoảng cách (cùng plane).'
    },

    // Celestial Patron
    {
        name: 'Healing Light', label: 'Ánh Sáng Chữa Lành', level: 1, source: 'subclass', subclass: 'Celestial', actionType: 'Bonus Action', dice: '1d6 per die', usesPerRest: '1+CHA mod d6 / Long Rest',
        description: 'Bonus Action: heal 1 creature trong 60ft. Roll 1-5 d6 (pool = 1 + CHA mod dice). Hồi pool sau Long Rest.'
    },
    {
        name: 'Radiant Soul', label: 'Linh Hồn Tỏa Sáng', level: 6, source: 'subclass', subclass: 'Celestial', actionType: 'Passive',
        description: 'Resistance Radiant damage. Khi cast spell gây Fire/Radiant → +CHA mod damage cho 1 roll.'
    },
    {
        name: 'Searing Vengeance', label: 'Phục Thù Nóng Bỏng', level: 14, source: 'subclass', subclass: 'Celestial', actionType: 'Special', dice: '2d8+CHA Radiant', usesPerRest: '1/Long Rest',
        description: 'Khi roll Death Save: thay vì roll → đứng dậy với ½ max HP + mỗi creature bạn chọn trong 30ft nhận 2d8 + CHA mod Radiant + Blinded end of turn.'
    },
];

// ==========================================
// MAP: className → features array
// ==========================================
export const CLASS_FEATURES_MAP: Record<string, ClassFeature[]> = {
    'Barbarian': BARBARIAN_FEATURES,
    'Fighter': FIGHTER_FEATURES,
    'Rogue': ROGUE_FEATURES,
    'Wizard': WIZARD_FEATURES,
    'Cleric': CLERIC_FEATURES,
    'Paladin': PALADIN_FEATURES,
    'Bard': BARD_FEATURES,
    'Druid': DRUID_FEATURES,
    'Ranger': RANGER_FEATURES,
    'Monk': MONK_FEATURES,
    'Sorcerer': SORCERER_FEATURES,
    'Warlock': WARLOCK_FEATURES,
};

// Helper: lấy features theo class, subclass, và level hiện tại
export function getActiveFeatures(className: string, subclass: string, level: number): ClassFeature[] {
    const allFeatures = CLASS_FEATURES_MAP[className] || [];
    return allFeatures.filter(f => {
        if (f.level > level) return false;
        if (f.source === 'subclass' && f.subclass !== subclass) return false;
        return true;
    }).sort((a, b) => a.level - b.level);
}
