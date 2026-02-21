// === SUBCLASSES (PHB 2024 Ch.3) ===
// Homebrew: Thêm subclass mới vào array bên dưới

import { Subclass } from '../types';

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


// === HOMEBREW SUBCLASSES ===
// Thêm subclass tự chế ở đây:
// SUBCLASSES_VN.push({ value: "MySub", label: "My Subclass", className: "Fighter",
//   description: "...", levelGained: 3, features: ["Feature1", "Feature2"] });
