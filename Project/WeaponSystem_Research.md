# Nghiên cứu Hệ thống Vũ khí D&D 5E (2024)

> Tài liệu nghiên cứu phục vụ xây dựng hệ thống vũ khí tự động cho game online.

---

## 1. Công thức Attack Roll (Lượt tấn công)

```
Attack Roll = d20 + Ability Modifier + Proficiency Bonus (nếu thông thạo)
```

### Ability Modifier dùng cho Attack Roll

| Loại tấn công | Ability | Ghi chú |
|---|---|---|
| Melee (cận chiến) | **Strength** | Mặc định |
| Ranged (tầm xa) | **Dexterity** | Mặc định |
| Finesse weapon | **Str HOẶC Dex** | Chọn cái nào CAO hơn |
| Thrown (melee → tầm xa) | **Strength** | Dù ném nhưng vẫn dùng Str (trừ Finesse) |
| Spell attack | **Spellcasting ability** | Varies by class |

### Proficiency Bonus

Chỉ cộng khi **thông thạo** vũ khí đó. Proficiency từ Class:
- **Simple weapons**: Mọi class đều thông thạo (trừ Wizard, Sorcerer)
- **Martial weapons**: Fighter, Paladin, Ranger, Barbarian

### Trúng hay trượt

```
Nếu Attack Roll ≥ AC mục tiêu → TRÚNG → Roll Damage
Nếu Attack Roll < AC mục tiêu → TRƯỢT → Không damage (trừ Graze mastery)
```

**Đặc biệt:**
- **Nat 20** (d20 = 20) → Luôn trúng + **Critical Hit** (roll damage dice 2 lần)
- **Nat 1** (d20 = 1) → Luôn trượt

---

## 2. Công thức Damage Roll (Sát thương)

```
Damage = Weapon Dice + Ability Modifier (cùng modifier dùng cho attack)
```

**Ví dụ:** Longsword (1d8) + STR 16 (+3) = 1d8 + 3 slashing

### Critical Hit Damage

```
Critical Damage = (Weapon Dice × 2) + Ability Modifier
```

Ví dụ: Longsword crit = **2d8 + 3** (không nhân đôi modifier)

### Versatile (Hai tay)

Khi dùng 2 tay → dùng dice lớn hơn:
- Longsword: 1d8 (1 tay) → **1d10** (2 tay)
- Quarterstaff: 1d6 → **1d8**

---

## 3. Tất cả yếu tố ảnh hưởng đến Attack/Damage

### 3.1. Yếu tố ảnh hưởng ATTACK ROLL

| Yếu tố | Ảnh hưởng | Auto-calc? |
|---|---|---|
| **Ability Score** (Str/Dex) | +modifier vào attack roll | ✅ Có |
| **Proficiency Bonus** | +2 đến +6 (theo level) | ✅ Có |
| **Magic weapon** (+1, +2, +3) | Cộng thêm bonus | ⚠️ Item-based |
| **Advantage** | Roll 2d20, lấy cao | ⚙️ Combat state |
| **Disadvantage** | Roll 2d20, lấy thấp | ⚙️ Combat state |
| **Cover** (Half/3/4/Total) | +2 / +5 / impossible AC | ⚙️ Combat state |
| **Heavy property** (Str < 13) | Disadvantage melee | ✅ Có thể check |
| **Ranged trong cận chiến** | Disadvantage | ⚙️ Combat state |
| **Long range** | Disadvantage | ⚙️ Combat state |
| **Underwater** (non-swim) | Disadvantage melee (trừ piercing) | ⚙️ Combat state |
| **Unseen attacker** | Advantage | ⚙️ Combat state |
| **Unseen target** | Disadvantage | ⚙️ Combat state |
| **Bardic Inspiration** | +1d6/d8/d10/d12 | ⚙️ Buff |
| **Fighting Style: Archery** | +2 ranged attack | ✅ Class feature |
| **Class features** (Guided Strike, etc.) | Varies | ⚙️ Feature-based |

### 3.2. Yếu tố ảnh hưởng DAMAGE

| Yếu tố | Ảnh hưởng | Auto-calc? |
|---|---|---|
| **Ability Modifier** | +Str/Dex vào damage | ✅ Có |
| **Weapon dice** | d4 → d12 | ✅ Có |
| **Magic weapon** (+1/+2/+3) | Cộng thêm vào damage | ⚠️ Item-based |
| **Critical Hit** | Dice × 2 | ⚙️ Combat roll |
| **Rage (Barbarian)** | +2/+3/+4 melee damage | ✅ Class feature |
| **Sneak Attack (Rogue)** | +Xd6 (khi đủ điều kiện) | ⚙️ Conditional |
| **Divine Smite (Paladin)** | +2d8 → +5d8 radiant | ⚙️ Resource spend |
| **Hunter's Mark (Ranger)** | +1d6 per hit | ⚙️ Spell buff |
| **Hex (Warlock)** | +1d6 necrotic per hit | ⚙️ Spell buff |
| **Fighting Style: Dueling** | +2 damage (1 tay + shield ok) | ✅ Class feature |
| **Fighting Style: GWF** | Reroll 1s & 2s on damage | ✅ Class feature |
| **Two-Weapon Fighting** | Bonus action attack (không +modifier, trừ Fighting Style) | ✅ |
| **Resistance** | Damage ÷ 2 | ⚙️ Target-based |
| **Vulnerability** | Damage × 2 | ⚙️ Target-based |
| **Immunity** | Damage = 0 | ⚙️ Target-based |

### 3.3. Yếu tố từ WEAPON PROPERTIES

| Property | Ảnh hưởng quan trọng |
|---|---|
| **Finesse** | Chọn Str HOẶC Dex (cả attack + damage) |
| **Light** | Cho phép Two-Weapon Fighting (bonus action attack, nhưng **không** +modifier vào damage trừ khi âm) |
| **Heavy** | Str < 13 (melee) hoặc Dex < 13 (ranged) → **Disadvantage** |
| **Versatile** | 1 tay: dice nhỏ, 2 tay: dice lớn (VD: 1d8 → 1d10) |
| **Thrown** | Melee weapon → có thể ranged attack (vẫn dùng Str) |
| **Ammunition** | Cần đạn, tiêu hao 1/hit, thu hồi 50% sau trận |
| **Loading** | Chỉ 1 shot per action/bonus action/reaction |
| **Two-Handed** | Bắt buộc 2 tay, **không thể dùng shield cùng lúc** |
| **Reach** | Tầm với +5 feet (total 10 feet) → ảnh hưởng Opportunity Attack range |

### 3.4. Yếu tố từ MASTERY PROPERTIES (2024 mới)

> Chỉ kích hoạt khi nhân vật có feature "Weapon Mastery"

| Mastery | Trigger | Hiệu ứng |
|---|---|---|
| **Cleave** | Trúng 1 kẻ | Tấn công thêm 1 kẻ trong 5ft (damage không +modifier) |
| **Graze** | Trượt đòn | Vẫn gây damage = ability modifier |
| **Nick** | Light weapon | Bonus attack thành phần của Attack action (thay vì Bonus Action) |
| **Push** | Trúng đòn | Đẩy lùi mục tiêu 10 feet (≤ Large) |
| **Sap** | Trúng đòn | Mục tiêu chịu Disadvantage ở attack roll kế tiếp |
| **Slow** | Trúng + gây damage | Giảm Speed mục tiêu 10 feet (không stack) |
| **Topple** | Trúng đòn | Mục tiêu save CON (DC 8 + atk mod + prof) hoặc Prone |
| **Vex** | Trúng + gây damage | Advantage cho attack kế tiếp vào mục tiêu đó |

---

## 4. Two-Weapon Fighting (Song vũ khí)

```
Điều kiện: Cả 2 vũ khí đều có property Light
Action: Tấn công bằng vũ khí chính
Bonus Action: Tấn công bằng vũ khí phụ (KHÔNG cộng ability modifier vào damage)

Ngoại lệ: Fighting Style "Two-Weapon Fighting" → cho phép +modifier vào damage
```

---

## 5. Damage Processing Pipeline (cho game engine)

Thứ tự xử lý damage theo PHB:

```
1. Roll damage dice + modifiers (ability, magic weapon, rage, etc.)
2. Áp dụng bonuses/penalties (spells, features)
3. Áp dụng Resistance (÷ 2, round down)
4. Áp dụng Vulnerability (× 2)
5. Trừ vào HP mục tiêu
```

---

## 6. Đề xuất Data Model cho Game Online

### WeaponInstance (vũ khí cụ thể của nhân vật)

```typescript
interface WeaponInstance {
  baseWeapon: string;        // "Longsword"
  name: string;              // "Longsword +1" hoặc custom name
  magicBonus: number;        // 0, +1, +2, +3
  
  // Auto-calculated từ base weapon data:
  damageDice: string;        // "1d8"
  damageType: string;        // "slashing"
  versatileDice?: string;    // "1d10" nếu Versatile
  properties: string[];      // ["Versatile", "Finesse", ...]
  mastery: string;           // "Sap"
  category: 'Simple' | 'Martial';
  type: 'Melee' | 'Ranged';
  range?: { normal: number; long: number };
  weight: number;
  cost: string;
  
  // Runtime state (cho game engine):
  equippedHand: 'main' | 'off' | 'two-handed' | 'none';
  isProficient: boolean;     // Tính từ class proficiency
  usesTwoHands: boolean;     // Đang dùng 2 tay (cho Versatile)
}
```

### AttackCalculation (computed khi tấn công)

```typescript
interface AttackCalculation {
  weapon: WeaponInstance;
  
  // Attack Roll
  abilityMod: number;        // Auto: Str (melee) / Dex (ranged) / higher (Finesse)
  profBonus: number;         // Auto: 0 nếu không proficient
  magicBonus: number;        // Từ weapon
  otherAttackBonuses: number; // Fighting Style, spells, etc.
  totalAttackBonus: number;  // Sum of above
  hasAdvantage: boolean;     // Combat state
  hasDisadvantage: boolean;  // Combat state
  
  // Damage Roll
  damageDice: string;        // "1d8" hoặc "1d10" (versatile 2-hand)
  damageAbilityMod: number;  // Thường = abilityMod, 0 cho off-hand (two-weapon)
  magicDamageBonus: number;  // = magicBonus
  otherDamageBonuses: number; // Rage, Dueling, etc.
  damageType: string;        // "slashing"
  
  // Mastery (if has Weapon Mastery feature)
  masteryActive: boolean;
  masteryProperty: string;
}
```

---

## 7. Các class features phổ biến ảnh hưởng vũ khí

| Class | Feature | Ảnh hưởng |
|---|---|---|
| **Fighter** | Fighting Style (lv1) | Archery +2, Dueling +2 dmg, GWF reroll, Defense +1 AC, TWF +mod |
| **Fighter** | Extra Attack (lv5) | 2 attacks per Attack action |
| **Fighter** | Two Extra Attacks (lv11) | 3 attacks |
| **Fighter** | Three Extra Attacks (lv20) | 4 attacks |
| **Fighter** | Weapon Mastery (lv1) | Unlock mastery properties |
| **Barbarian** | Rage (lv1) | +2/+3/+4 melee damage (Str-based only) |
| **Barbarian** | Reckless Attack (lv2) | Advantage on Str attacks, but enemies get Advantage on you |
| **Barbarian** | Brutal Critical (lv9) | Extra dice on crit |
| **Rogue** | Sneak Attack (lv1) | +Xd6 damage (1/turn, need advantage or ally adjacent) |
| **Paladin** | Divine Smite | +2d8→5d8 radiant damage (spend spell slot) |
| **Ranger** | Hunter's Mark | +1d6 per hit (concentration spell) |
| **Monk** | Martial Arts | Dex for monk weapons, bonus unarmed strike |
| **Monk** | Unarmed damage | d6 → d8 → d10 → d12 (scales with level) |
