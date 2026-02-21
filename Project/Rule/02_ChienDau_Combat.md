# Luật Chiến Đấu (Combat)

> Nguồn: PHB 2024, Chapter 1 — Playing the Game (phần Combat)

---

## 1. Trình Tự Chiến Đấu

### Bước 1: Xác Định Surprise
- DM quyết định ai bị bất ngờ (Surprised)
- Nhân vật bị Surprised → **Disadvantage** khi roll Initiative

### Bước 2: Roll Initiative
- **Công thức**: `d20 + DEX modifier` (là 1 Ability Check)
- DM sắp xếp thứ tự từ cao → thấp
- Ai roll cao hơn đi trước
- Hoà điểm: DM quyết định

### Bước 3: Mỗi Lượt (Turn)
Theo thứ tự Initiative, mỗi nhân vật được:

| Hành động | Giới hạn |
|---|---|
| **Di chuyển** (Movement) | = Speed (thường 30 ft) |
| **1 Action** | Attack, Cast Spell, Dash, Dodge, etc. |
| **1 Bonus Action** (nếu có) | Một số phép/tính năng cho |
| **1 Reaction** (nếu có) | Opportunity Attack, Shield spell, etc. |
| **Free Action** | Nói vài câu, rút/cất vũ khí, mở cửa未锁 |

### Bước 4: Lặp Lại
- Khi hết lượt tất cả → quay lại người đầu tiên (= 1 Round ≈ 6 giây)
- Tiếp tục cho đến khi combat kết thúc

---

## 2. Actions Trong Combat

### Attack
- Roll `d20 + Ability Mod + Proficiency Bonus` ≥ AC mục tiêu → trúng
- **Melee**: Dùng STR mod (hoặc DEX nếu Finesse)
- **Ranged**: Dùng DEX mod
- **Hai tay (Two-Weapon Fighting)**: Attack bằng tay chính (Action) → Attack tay phụ (Bonus Action, không cộng Ability Mod vào damage)

### Cast a Spell
- Thay Attack bằng cast phép
- Phép Bonus Action cast → vẫn có thể Attack bằng Action (tùy phép)
- **Concentration**: Nếu bị hit → Saving Throw CON (DC = 10 hoặc ½ damage, lấy cao hơn)

### Dash
- Tăng gấp đôi di chuyển cho lượt này
- VD: Speed 30 ft → di chuyển tổng 60 ft

### Disengage
- Di chuyển mà **không bị Opportunity Attack**

### Dodge
- Mọi attack roll nhắm vào bạn bị **Disadvantage**
- Saving throw DEX của bạn có **Advantage**
- Mất hiệu lực nếu bạn bị Incapacitated hoặc Speed = 0

### Help
- Cho 1 đồng minh **Advantage** vào 1 Ability Check hoặc Attack Roll tiếp theo

### Hide
- Roll Stealth check → DC = Passive Perception của kẻ thù
- Nếu thành công → Invisible (Advantage khi Attack, Disadvantage bị Attack)

### Ready
- Chuẩn bị 1 action sẽ xảy ra khi có trigger cụ thể
- VD: "Khi goblin bước ra khỏi cột, tôi sẽ bắn nó"
- Ready spell = phải giữ Concentration

### Search
- Roll Perception hoặc Investigation check để tìm kiếm

---

## 3. Di Chuyển Trong Combat

### Speed
- Nhân vật thường có Speed **30 ft** (= 6 ô vuông × 5ft)
- Small species (Halfling, Gnome): **25 ft**
- Dwarf: **25 ft** (không bị ảnh hưởng bởi Heavy Armor)

### Chia nhỏ di chuyển
- Có thể di chuyển **trước**, **giữa** và **sau** Action
- VD: Di 15 ft → Attack → Di 15 ft

### Địa hình khó (Difficult Terrain)
- Mỗi ft di chuyển **tốn 2 ft** movement
- Ví dụ: Đầm lầy, đống đổ nát, rừng rậm, cầu thang

### Đứng dậy từ Prone
- Tốn **½ Speed** để đứng dậy
- Nằm (Prone): Melee attack nhắm vào bạn có Advantage, Ranged attack có Disadvantage

---

## 4. Cover

| Cover | Bonus | Ví dụ |
|---|---|---|
| **Half Cover** | +2 AC, +2 DEX Save | Bức tường thấp, bàn lật |
| **Three-Quarters** | +5 AC, +5 DEX Save | Tường dày, cửa sổ hẹp |
| **Total Cover** | Không thể bị nhắm | Hoàn toàn ẩn sau tường |

---

## 5. Damage & Damage Types

### Các bước tính damage
1. **Roll damage dice** + Ability Modifier
2. Áp dụng **Resistance** (½ damage) hoặc **Vulnerability** (×2 damage)
3. Trừ vào HP

### 13 Damage Types
| Type | Ví dụ |
|---|---|
| **Acid** | Phép Acid Splash |
| **Bludgeoning** | Búa, rơi |
| **Cold** | Phép Ray of Frost |
| **Fire** | Phép Fireball, lửa |
| **Force** | Phép Magic Missile, Eldritch Blast |
| **Lightning** | Phép Lightning Bolt |
| **Necrotic** | Phép Blight, undead |
| **Piercing** | Mũi tên, giáo |
| **Poison** | Nọc rắn, khí độc |
| **Psychic** | Tấn công tâm linh |
| **Radiant** | Phép Guiding Bolt, thánh quang |
| **Slashing** | Kiếm, rìu |
| **Thunder** | Phép Thunderwave, sóng âm |

### Resistance & Vulnerability
- **Resistance**: Nhận **½ damage** (sau khi tính tất cả)
- **Vulnerability**: Nhận **×2 damage**
- **Immunity**: Nhận **0 damage**

---

## 6. Dropping to 0 HP

### Death Saving Throws
Mỗi đầu lượt khi ở 0 HP → roll d20 (không cộng gì):

| Roll | Kết quả |
|---|---|
| **10+** | 1 Thành Công |
| **1–9** | 1 Thất Bại |
| **Natural 1** | **2 Thất Bại** |
| **Natural 20** | Hồi **1 HP**, đứng dậy! |
| **3 Thành Công** | Stable (ổn định, bất tỉnh) |
| **3 Thất Bại** | **Chết** |

### Massive Damage
- Nếu damage dư ≥ HP tối đa → **chết ngay** (không cần Death Save)
- VD: HP max 20, đang 5 HP, nhận 25 damage → dư 20 ≥ 20 → chết

### Stabilizing
- Đồng minh dùng Action → Medicine check DC 10 → thành công = Stable
- Hoặc cast phép healing bất kỳ

---

## 7. Opportunity Attack

- **Trigger**: Kẻ thù **rời khỏi tầm với** (5 ft) của bạn bằng cách di chuyển
- Dùng **Reaction** → 1 melee attack
- **Tránh**: Dùng Action **Disengage** trước khi rời
- **Không trigger**: Bị đẩy (forced movement), teleport, hoặc rơi

---

## 8. Grappling & Shoving (Nắm & Đẩy)

### Grapple (nắm giữ)
- **Thay 1 Attack** → Unarmed Strike roll ≥ AC mục tiêu
- Thành công: Mục tiêu bị **Grappled** (Speed = 0)
- Thoát: Mục tiêu dùng Action → Athletics hoặc Acrobatics check ≥ Grapple DC

### Shove (đẩy)
- Thay 1 Attack → Unarmed Strike roll ≥ AC mục tiêu
- Thành công: Đẩy **5 ft** ra xa HOẶC làm ngã **Prone**
