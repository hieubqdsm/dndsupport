# Tạo Nhân Vật & 12 Classes

> Nguồn: PHB 2024, Chapter 2 & 3

---

## 5 Bước Tạo Nhân Vật

1. **Chọn Class** — quyết định vai trò của bạn
2. **Chọn Origin** — Background (nguồn gốc) + Species (chủng tộc)
3. **Xác định Ability Scores** — Point Buy / Standard Array / Roll (4d6 drop lowest)
4. **Chọn Alignment** — 9 alignment (Lawful Good → Chaotic Evil)
5. **Điền chi tiết** — Tên, ngoại hình, tính cách, backstory, equipment

### Standard Array
`15, 14, 13, 12, 10, 8` — phân vào 6 ability scores tùy ý

### Point Buy (27 điểm)
| Score | Cost | | Score | Cost |
|---|---|---|---|---|
| 8 | 0 | | 12 | 4 |
| 9 | 1 | | 13 | 5 |
| 10 | 2 | | 14 | 7 |
| 11 | 3 | | 15 | 9 |

### Roll (4d6 drop lowest)
- Tung 4d6, bỏ viên thấp nhất, cộng 3 viên còn lại
- Lặp lại 6 lần → phân vào 6 abilities

---

## 12 Character Classes

### Barbarian (Dã Chiến)
| | |
|---|---|
| **Hit Die** | d12 |
| **Primary Ability** | STR |
| **Saving Throws** | STR, CON |
| **Armor** | Light, Medium, Shield |
| **Weapons** | Simple, Martial |
| **Vai trò** | Tank, Melee DPS |

**Core Features:**
- **Rage**: Bonus damage melee (+2→+4), Resistance to B/P/S damage, Advantage STR checks
- **Unarmored Defense**: AC = 10 + DEX mod + CON mod (không mặc giáp)
- **Extra Attack** (Lv5): 2 attacks mỗi Action
- **Brutal Critical**: Thêm damage dice khi Critical Hit

**4 Subclasses:** Berserker, Wild Heart, World Tree, Zealot

---

### Bard (Thi Sĩ)
| | |
|---|---|
| **Hit Die** | d8 |
| **Primary Ability** | CHA |
| **Saving Throws** | DEX, CHA |
| **Spellcasting** | Full Caster (CHA) |
| **Vai trò** | Support, Face, Versatile |

**Core Features:**
- **Bardic Inspiration**: Bonus Action → cho đồng minh **1 die** (d6→d12) để cộng vào roll
- **Jack of All Trades**: +½ Proficiency Bonus vào **mọi** ability check chưa proficient
- **Expertise**: Gấp đôi Proficiency cho 2 skills
- **Spellcasting**: Full caster, Known Spells

**4 Subclasses:** Dance, Glamour, Lore, Valor

---

### Cleric (Tu Sĩ)
| | |
|---|---|
| **Hit Die** | d8 |
| **Primary Ability** | WIS |
| **Saving Throws** | WIS, CHA |
| **Spellcasting** | Full Caster (WIS) |
| **Vai trò** | Healer, Support, Tank (tùy subclass) |

**Core Features:**
- **Channel Divinity**: Năng lực đặc biệt (Turn Undead + subclass ability)
- **Prepared Spells**: Biết toàn bộ Cleric spell list, chọn chuẩn bị mỗi ngày
- **Divine Intervention** (Lv10): Cầu thần can thiệp

**4 Subclasses:** Life (healer), Light (damage), Trickery (utility), War (melee)

---

### Druid (Tu Sĩ Thiên Nhiên)
| | |
|---|---|
| **Hit Die** | d8 |
| **Primary Ability** | WIS |
| **Saving Throws** | INT, WIS |
| **Spellcasting** | Full Caster (WIS) |
| **Vai trò** | Caster, Healer, Shape-shifter |

**Core Features:**
- **Wild Shape**: Biến thành **động vật** (số lần = Proficiency Bonus/day)
- **Prepared Spells**: Biết toàn bộ Druid spell list
- **Primal Order**: Chọn Magician (cantrip thêm) hoặc Warden (armor proficiency)

**4 Subclasses:** Land (caster), Moon (Wild Shape combat), Sea (aquatic), Stars (cosmic)

---

### Fighter (Đấu Sĩ)
| | |
|---|---|
| **Hit Die** | d10 |
| **Primary Ability** | STR hoặc DEX |
| **Saving Throws** | STR, CON |
| **Armor** | All Armor, Shield |
| **Weapons** | Simple, Martial |
| **Vai trò** | DPS, Tank |

**Core Features:**
- **Fighting Style**: Chọn 1 style đặc biệt (Archery +2, Defense +1 AC, Dueling +2 damage...)
- **Second Wind**: Bonus Action → Heal `1d10 + Fighter level` (1 lần/Short Rest)
- **Action Surge** (Lv2): Thêm **1 Action** trong lượt (1 lần/Short Rest)
- **Extra Attack**: 2 attacks (Lv5) → 3 (Lv11) → 4 (Lv20)

**4 Subclasses:** Battle Master (maneuvers), Champion (critical), Eldritch Knight (magic), Psi Warrior (psionic)

---

### Monk (Võ Sư)
| | |
|---|---|
| **Hit Die** | d8 |
| **Primary Ability** | DEX + WIS |
| **Saving Throws** | STR, DEX |
| **Weapons** | Simple, Martial (có Finesse/Light) |
| **Vai trò** | Melee DPS, Mobile Striker |

**Core Features:**
- **Martial Arts**: Dùng DEX thay STR cho unarmed/monk weapons
- **Ki / Focus Points**: Resource đặc biệt (= Monk level) cho:
  - **Flurry of Blows**: 2 unarmed strikes thêm (Bonus Action)
  - **Patient Defense**: Dodge (Bonus Action)
  - **Step of the Wind**: Dash/Disengage (Bonus Action) + jump xa hơn
- **Unarmored Defense**: AC = 10 + DEX mod + WIS mod
- **Deflect Missiles** (Lv3): Giảm damage ranged attack

**4 Subclasses:** Mercy (heal/harm), Shadow (stealth), Elements (elemental), Open Hand (martial)

---

### Paladin (Hiệp Sĩ Thánh)
| | |
|---|---|
| **Hit Die** | d10 |
| **Primary Ability** | STR + CHA |
| **Saving Throws** | WIS, CHA |
| **Spellcasting** | Half Caster (CHA), từ Lv2 |
| **Vai trò** | Tank, Melee DPS, Support |

**Core Features:**
- **Divine Smite**: Khi hit melee → tiêu slot → thêm `2d8 + 1d8/slot level` Radiant damage
- **Lay on Hands**: Pool = **Paladin level × 5** HP → heal/cure disease
- **Aura of Protection** (Lv6): Bạn + đồng minh trong 10 ft → **+CHA mod** vào mọi Saving Throw
- **Fighting Style**: Giống Fighter

**4 Subclasses:** Devotion (holy), Glory (heroic), Ancients (nature), Vengeance (hunter)

---

### Ranger (Thợ Săn)
| | |
|---|---|
| **Hit Die** | d10 |
| **Primary Ability** | DEX + WIS |
| **Saving Throws** | STR, DEX |
| **Spellcasting** | Half Caster (WIS), từ Lv2 |
| **Vai trò** | Ranged DPS, Scout, Utility |

**Core Features:**
- **Favored Enemy**: Bonus khi theo dấu/chiến đấu với loại quái cụ thể
- **Fighting Style**: Archery (+2 ranged attack), Two-Weapon Fighting...
- **Extra Attack** (Lv5)
- **Nature's Veil** (Lv10): Invisible (Bonus Action)

**4 Subclasses:** Beast Master (pet), Fey Wanderer (fey magic), Gloom Stalker (darkness), Hunter (slayer)

---

### Rogue (Đạo Tặc)
| | |
|---|---|
| **Hit Die** | d8 |
| **Primary Ability** | DEX |
| **Saving Throws** | DEX, INT |
| **Weapons** | Simple, Martial (Finesse) |
| **Vai trò** | DPS (single target), Scout, Skill Monkey |

**Core Features:**
- **Sneak Attack**: +`Xd6` damage khi có Advantage hoặc đồng minh gần mục tiêu (1/turn)
  - 1d6 (Lv1) → 10d6 (Lv19)
- **Expertise**: Gấp đôi Proficiency cho 4 skills
- **Cunning Action**: Bonus Action → Dash/Disengage/Hide
- **Evasion** (Lv7): DEX save thành công = 0 damage (thay vì ½)
- **Uncanny Dodge** (Lv5): Reaction → ½ damage từ 1 attack

**4 Subclasses:** Arcane Trickster (magic), Assassin (ambush), Soulknife (psionic), Thief (versatile)

---

### Sorcerer (Phù Thủy)
| | |
|---|---|
| **Hit Die** | d6 |
| **Primary Ability** | CHA |
| **Saving Throws** | CON, CHA |
| **Spellcasting** | Full Caster (CHA) |
| **Vai trò** | Blaster, Utility Caster |

**Core Features:**
- **Sorcery Points**: Resource (= Sorcerer level) để:
  - **Metamagic**: Modify phép (Twin = cast lên 2 mục tiêu, Quickened = Bonus Action, Subtle = không V/S)
  - Tạo thêm Spell Slots (hoặc đổi slot thành points)
- **Known Spells**: Số phép cố định, đổi khi lên level

**4 Subclasses:** Aberrant (psionic), Clockwork (order), Draconic (dragon), Wild Magic (chaos)

---

### Warlock (Chiến Binh Phép)
| | |
|---|---|
| **Hit Die** | d8 |
| **Primary Ability** | CHA |
| **Saving Throws** | WIS, CHA |
| **Spellcasting** | Pact Magic (CHA) — **khác biệt** |
| **Vai trò** | Sustained DPS, Utility |

**Core Features:**
- **Pact Magic**: Ít slots (1→4) nhưng **luôn ở level cao nhất**, hồi sau **Short Rest**
- **Eldritch Invocations**: Customization abilities (chọn từ danh sách)
- **Eldritch Blast**: Cantrip signature — 1d10 Force, nhiều tia

**4 Subclasses:** Archfey (charm/illusion), Celestial (healing), Fiend (damage), Great Old One (psionic)

---

### Wizard (Pháp Sư)
| | |
|---|---|
| **Hit Die** | d6 |
| **Primary Ability** | INT |
| **Saving Throws** | INT, WIS |
| **Spellcasting** | Full Caster (INT), Spellbook |
| **Vai trò** | Versatile Caster, Control, Blaster |

**Core Features:**
- **Spellbook**: Chứa tất cả phép đã học, chép thêm được
- **Arcane Recovery** (Lv1): 1 lần/ngày sau Short Rest → hồi slots (tổng ≤ ½ Wizard level)
- **Spell List lớn nhất** trong game
- **Ritual Casting**: Cast ritual từ sách không tốn slot

**4 Subclasses:** Abjuration (protection), Divination (prediction), Evoker (blasting), Illusionist (illusion)

---

## Tổng Hợp So Sánh

| Class | HP | Armor | Spellcasting | Vai trò chính |
|---|---|---|---|---|
| Barbarian | **d12** | Medium | ❌ | Tank / Melee DPS |
| Bard | d8 | Light | Full (CHA) | Support / Face |
| Cleric | d8 | Medium/Heavy | Full (WIS) | Healer / Support |
| Druid | d8 | Medium | Full (WIS) | Caster / Shapeshifter |
| Fighter | **d10** | **All** | ❌ (trừ EK) | DPS / Tank |
| Monk | d8 | ❌ | ❌ | Mobile Striker |
| Paladin | d10 | All | Half (CHA) | Tank / Burst DPS |
| Ranger | d10 | Medium | Half (WIS) | Ranged DPS / Scout |
| Rogue | d8 | Light | ❌ (trừ AT) | Burst DPS / Skill Monkey |
| Sorcerer | **d6** | ❌ | Full (CHA) | Blaster |
| Warlock | d8 | Light | Pact (CHA) | Sustained DPS |
| Wizard | **d6** | ❌ | Full (INT) | Control / Versatile |
