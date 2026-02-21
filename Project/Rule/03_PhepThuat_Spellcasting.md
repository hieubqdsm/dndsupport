# Hệ Thống Phép Thuật (Spellcasting)

> Nguồn: PHB 2024, Chapter 1 & Chapter 7

---

## 1. Tổng Quan

Phép thuật trong D&D 5E hoạt động theo hệ thống **Spell Slots**:
- Mỗi ngày (Long Rest) bạn có một số **ô phép (Spell Slots)** theo level
- Cast phép cấp 1+ → **tốn 1 slot** cùng cấp hoặc cao hơn
- Hết slot → không cast được phép đó nữa
- **Cantrips** (phép cấp 0) → dùng **miễn phí, không giới hạn**

---

## 2. Khả Năng Dùng Phép (Spellcasting Ability)

| Class | Ability | Lý do |
|---|---|---|
| **Wizard** | INT | Học phép từ sách nghiên cứu |
| **Cleric** | WIS | Sức mạnh từ đức tin |
| **Druid** | WIS | Kết nối thiên nhiên |
| **Ranger** | WIS | Trực giác hoang dã |
| **Bard** | CHA | Phép qua âm nhạc, lời ca |
| **Sorcerer** | CHA | Ma thuật bẩm sinh |
| **Warlock** | CHA | Khế ước siêu nhiên |
| **Paladin** | CHA | Sức mạnh từ lời thề |

### Tính toán

- **Spell Save DC** = `8 + Proficiency Bonus + Ability Modifier`
- **Spell Attack Bonus** = `Proficiency Bonus + Ability Modifier`

---

## 3. Spell Slots Theo Level

### Full Caster (Wizard, Cleric, Druid, Bard, Sorcerer)

| Level | 1st | 2nd | 3rd | 4th | 5th | 6th | 7th | 8th | 9th |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 | — | — | — | — | — | — | — | — |
| 2 | 3 | — | — | — | — | — | — | — | — |
| 3 | 4 | 2 | — | — | — | — | — | — | — |
| 4 | 4 | 3 | — | — | — | — | — | — | — |
| 5 | 4 | 3 | 2 | — | — | — | — | — | — |
| 6 | 4 | 3 | 3 | — | — | — | — | — | — |
| 7 | 4 | 3 | 3 | 1 | — | — | — | — | — |
| 8 | 4 | 3 | 3 | 2 | — | — | — | — | — |
| 9 | 4 | 3 | 3 | 3 | 1 | — | — | — | — |
| 10 | 4 | 3 | 3 | 3 | 2 | — | — | — | — |
| 11 | 4 | 3 | 3 | 3 | 2 | 1 | — | — | — |
| 12 | 4 | 3 | 3 | 3 | 2 | 1 | — | — | — |
| 13 | 4 | 3 | 3 | 3 | 2 | 1 | 1 | — | — |
| 14 | 4 | 3 | 3 | 3 | 2 | 1 | 1 | — | — |
| 15 | 4 | 3 | 3 | 3 | 2 | 1 | 1 | 1 | — |
| 16 | 4 | 3 | 3 | 3 | 2 | 1 | 1 | 1 | — |
| 17 | 4 | 3 | 3 | 3 | 2 | 1 | 1 | 1 | 1 |
| 18 | 4 | 3 | 3 | 3 | 3 | 1 | 1 | 1 | 1 |
| 19 | 4 | 3 | 3 | 3 | 3 | 2 | 1 | 1 | 1 |
| 20 | 4 | 3 | 3 | 3 | 3 | 2 | 2 | 1 | 1 |

### Half Caster (Paladin, Ranger)
- Bắt đầu có phép từ **level 2**
- Slots = khoảng ½ Full Caster

### Warlock (Pact Magic — khác biệt!)
- Ít slots (1–4) nhưng **luôn cast ở level cao nhất**
- **Hồi slot sau Short Rest** (1 giờ) thay vì Long Rest

---

## 4. Cách Học & Chuẩn Bị Phép

### Wizard — Spellbook
- Có **sách phép** chứa tất cả phép đã học
- Mỗi level lên → thêm **2 phép miễn phí** vào sách
- Tìm **Spell Scroll / sách phép khác** → chép vào (tốn vàng + thời gian)
- Mỗi sáng (Long Rest) → chọn **phép chuẩn bị** từ sách
  - Số phép chuẩn bị = **INT modifier + Wizard level** (tối thiểu 1)
- **Ritual Casting**: Cast phép ritual từ sách mà không tốn slot (thêm 10 phút)

### Cleric / Druid — Full Access
- **Biết toàn bộ** spell list của class
- Mỗi Long Rest → chọn phép chuẩn bị
  - Cleric: **WIS mod + Cleric level**
  - Druid: **WIS mod + Druid level**
- Đổi phép tự do mỗi ngày

### Sorcerer / Bard / Ranger — Known Spells
- Biết sẵn một **số lượng cố định** phép (theo bảng class)
- Lên level → thêm phép mới
- Lên level → có thể **swap 1 phép** cũ thành phép mới
- **Không đổi phép hàng ngày**

### Warlock — Known Spells
- Giống Sorcerer: số phép cố định
- Luôn cast ở **level slot cao nhất**
- Slot hồi sau **Short Rest**

### Paladin — Prepared Spells
- Giống Cleric: chọn phép chuẩn bị mỗi ngày
- Số phép = **CHA mod + ½ Paladin level** (làm tròn xuống)
- Bắt đầu có phép từ **level 2**

---

## 5. Upcasting (Nâng cấp phép)

Cast phép bằng **slot cao hơn** → hiệu quả tăng!

| Phép | Level gốc | Upcasting |
|---|---|---|
| **Cure Wounds** | 1st (1d8) | Mỗi level +1d8 (Slot 3 = 3d8) |
| **Fireball** | 3rd (8d6) | Mỗi level +1d6 (Slot 5 = 10d6) |
| **Magic Missile** | 1st (3 mũi tên) | Mỗi level +1 mũi tên |
| **Healing Word** | 1st (1d4) | Mỗi level +1d4 |

> Không phải phép nào cũng upcast được — xem mô tả từng phép

---

## 6. Concentration

Một số phép yêu cầu **Concentration** (tập trung):

### Quy tắc:
- Chỉ giữ **1 phép Concentration** tại 1 thời điểm
- Cast phép Concentration mới → phép cũ **tự hủy**
- Bị damage → roll **CON Saving Throw**:
  - DC = **10** hoặc **½ damage nhận** (lấy số cao hơn)
  - Thất bại → mất Concentration → phép hủy
- Bất tỉnh / chết → mất Concentration

### Phép Concentration phổ biến:
Bless, Hex, Hunter's Mark, Haste, Fly, Hold Person, Invisibility, Spirit Guardians

---

## 7. Ritual Casting

Một số phép có tag **Ritual**:
- Cast **không tốn slot** nhưng tốn thêm **10 phút** cast time
- Chỉ class/feature có "Ritual Casting" mới dùng được
- **Wizard**: Cast ritual từ Spellbook (không cần chuẩn bị)
- **Cleric/Druid**: Cần chuẩn bị phép đó

### Phép Ritual phổ biến:
Detect Magic, Identify, Find Familiar, Comprehend Languages, Speak with Animals

---

## 8. Components (Thành Phần Phép)

| Ký hiệu | Thành phần | Yêu cầu |
|---|---|---|
| **V** | Verbal (Lời nói) | Phải **nói được** (không bị Silenced) |
| **S** | Somatic (Cử chỉ) | Cần **1 tay tự do** |
| **M** | Material (Vật liệu) | Cần **túi component** hoặc **focus** (gậy, thánh giá...) |

### Lưu ý:
- M không có ghi giá → **không tiêu hao**, dùng túi component thay được
- M có ghi giá (VD: "100 GP diamond") → **phải có đúng vật liệu đó**
- M có ghi "consumed" → vật liệu **bị tiêu hao** khi cast
- Mặc giáp chưa proficient → **không cast được phép** (V, S, M đều bị block)

---

## 9. Areas of Effect

| Hình dạng | Mô tả | Ví dụ |
|---|---|---|
| **Cone** | Hình nón từ caster | Burning Hands (15 ft) |
| **Cube** | Khối vuông | Fog Cloud (20 ft) |
| **Cylinder** | Hình trụ | Moonbeam (5 ft bán kính) |
| **Line** | Đường thẳng | Lightning Bolt (100 ft × 5 ft) |
| **Sphere** | Hình cầu | Fireball (20 ft bán kính) |
| **Emanation** | Tỏa ra từ nguồn | Spirit Guardians (15 ft) |

---

## 10. Cantrips (Phép Cơ Bản)

- **Miễn phí**, không tốn slot
- **Damage tăng theo level**:

| Character Level | Cantrip Damage |
|---|---|
| 1–4 | 1 dice |
| 5–10 | 2 dice |
| 11–16 | 3 dice |
| 17–20 | 4 dice |

VD: Fire Bolt ở level 5 = 2d10, level 11 = 3d10, level 17 = 4d10
