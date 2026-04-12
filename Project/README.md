# DragonScroll — D&D 5E Character Manager

## Tổng quan

**DragonScroll** là ứng dụng web quản lý nhân vật Dungeons & Dragons 5E, hoàn toàn bằng **tiếng Việt**, tích hợp **AI Gemini** để tự động tạo nhân vật và tra cứu quái vật.

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | TailwindCSS (CDN) + custom theme `dragon-*` |
| Font | Cinzel (headers) + Inter (body) |
| Icons | Lucide React |
| AI | Google Gemini 3 Flash (`@google/genai`) |

## Cấu trúc thư mục

```
dndsupport/
├── index.html              # Entry HTML, Tailwind config & custom theme
├── index.tsx               # React root mount
├── App.tsx                 # Component chính, navigation bar
├── types.ts                # TypeScript interfaces (Character, Monster, DiceRoll, ...)
├── constants.ts            # Dữ liệu D&D 5E tiếng Việt (classes, races, skills, weapons, ...)
├── components/
│   ├── CharacterSheet.tsx  # Hồ sơ nhân vật đầy đủ 3 trang (937 dòng)
│   ├── DiceRoller.tsx      # Modal tung xúc xắc d4–d100 (112 dòng)
│   └── MonsterManual.tsx   # Tra cứu quái vật qua AI (262 dòng)
├── services/
│   └── geminiService.ts    # Gọi Gemini API: tạo nhân vật & tra cứu quái vật
├── Gamerule/               # Tài liệu tham khảo (PDF/DOCX sách luật D&D)
└── Project/                # Thư mục tóm tắt dự án (file này)
```

## Các tính năng chính

### 1. 📋 Hồ sơ nhân vật (`CharacterSheet.tsx`)

Chia thành **3 tab**:

- **Combat** — Ability scores, saving throws, skills, AC, HP, initiative, speed, death saves, tấn công, trang bị, tiền
- **Bio** — Tính cách, lý tưởng, ràng buộc, khuyết điểm, ngoại hình, backstory
- **Spells** — Spellcasting ability, DC, bonus, danh sách phép cấp 0–9

Tính năng nổi bật:
- Dropdown Class/Race/Background/Alignment có **tooltip giải thích tiếng Việt**
- Tự động tính **modifier** khi thay đổi ability score
- Tự động cập nhật saving throws, proficient skills khi đổi class
- Tự động cập nhật speed, traits khi đổi race
- Thêm vũ khí từ danh sách **38 loại** D&D 5E

### 2. 🎲 Tung xúc xắc (`DiceRoller.tsx`)

- Hỗ trợ d4, d6, d8, d10, d12, d20, d100
- Animation khi tung, lịch sử kết quả
- Highlight **Bạo kích!** (nat 20) và fumble (nat 1)
- Nút floating cho mobile

### 3. 👹 Tra cứu quái vật (`MonsterManual.tsx`)

- Nhập tên quái vật → AI trả về stat block tiếng Việt
- Bộ lọc: Type (14 loại), Size (6 cỡ), CR (29 mức)
- Hiển thị đầy đủ: AC, HP, speed, stats, traits, actions, legendary actions

### 4. 🤖 AI Tạo nhân vật (`geminiService.ts`)

- Nhập mô tả tiếng Việt (VD: *"Pháp sư Tiefling cấp 5 chuyên về lửa"*)
- Gemini trả về JSON đầy đủ → tự động điền toàn bộ hồ sơ

## Dữ liệu D&D 5E (`constants.ts`)

~493 dòng dữ liệu dịch tiếng Việt:
- 12 Classes (Barbarian → Wizard) với saving throws, default skills, hit die
- 10 Species (Aasimar → Tiefling) với speed, traits
- 16 Backgrounds (Acolyte → Wayfarer) với ability/skill bonuses
- 9 Alignments, 18 Skills, 6 Ability Scores, 38 Weapons, 7 Dice types
- Blank character template + Default character mẫu

## Cách chạy

```bash
npm install
# Tạo file .env.local và set GEMINI_API_KEY
npm run dev
```

## Hệ thống đăng nhập & đồng bộ

### Luồng hoạt động

1. **Lần đầu truy cập** → hiển thị màn hình chào với 2 lựa chọn:
   - **Đăng nhập & Đồng bộ** — nhập nickname → sync data riêng lên Google Sheet
   - **Chơi Local** — không đồng bộ, data lưu trong localStorage
2. **Session** lưu ở `localStorage['dragonscroll_session']` gồm `{ username, mode }`
3. **Profiles** mỗi người chỉ thấy profiles của mình (`userId === username`)
4. **Đăng xuất** — xóa session, quay về màn hình chào. Data local vẫn giữ nguyên.

### Google Apps Script (GAS)

Script đầy đủ và hướng dẫn deploy xem tại **[README.md — Cấu hình đồng bộ Google Sheets](../README.md)**.

Tóm tắt luồng API mà `services/googleSheetService.ts` sử dụng:

| | Endpoint |
|---|---|
| **Load** | `GET ?action=loadProfiles&user=<username>` → `SavedProfile[]` chỉ của user đó |
| **Save** | `POST { action, user, profiles }` → xóa row cũ của user, ghi lại mới |

Sheet dùng tên tab `DragonScroll`, 3 cột: `[id, updatedAt, profileJson]`.  
Mỗi row là một `SavedProfile` serialized JSON (giữ nguyên `userId` để phân tách user).
