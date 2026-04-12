<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DragonScroll — D&D 5E Hồ Sơ Nhân Vật

Ứng dụng quản lý hồ sơ nhân vật D&D 5E, được host trên GitHub Pages.  
Dữ liệu mặc định lưu trong **localStorage** của trình duyệt. Có thể bật tính năng đồng bộ **Google Sheets** để chia sẻ dữ liệu giữa nhiều thiết bị.

---

## Chạy cục bộ

**Yêu cầu:** Node.js

```bash
npm install
npm run dev
```

---

## Cấu hình đồng bộ Google Sheets (tùy chọn)

Khi bật tính năng này, mọi hồ sơ nhân vật sẽ được tự động sao lưu lên Google Sheets và có thể truy cập từ bất kỳ thiết bị nào.

### Bước 1 — Tạo Google Sheet

1. Vào [Google Sheets](https://sheets.google.com) và tạo một bảng tính mới.
2. Đặt tên sheet tab đầu tiên là: **`DragonScroll`** (chú ý viết hoa đúng).

Cấu trúc bảng sẽ được tạo tự động bởi script, nhưng để tham khảo, bảng có dạng:

| A — id | B — name | C — userId | D — updatedAt | E — profileJson |
|--------|----------|-----------|---------------|-----------------|
| `abc123` | `Gandalf` | `alice` | `2025-01-01T00:00:00.000Z` | `{"id":"abc123","name":"Gandalf","userId":"alice",...}` |

> **Lưu ý:** Không cần tạo header thủ công — script sẽ tự ghi. Cột A–D để đọc trực tiếp trên sheet, cột E là JSON đầy đủ để app dùng. Nhiều user có thể dùng chung một Sheet.

---

### Bước 2 — Tạo Google Apps Script

1. Trong Google Sheet vừa tạo, vào menu **Extensions → Apps Script**.
2. Xóa code mẫu có sẵn, dán đoạn code sau:

```javascript
const SHEET_NAME = 'DragonScroll';
// Cột: [id | name | userId | updatedAt | profileJson]

// GET  ?action=loadProfiles&user=<username>
// → Trả về mảng SavedProfile[] chỉ của user đó
function doGet(e) {
  try {
    if (e.parameter.action !== 'loadProfiles') {
      return jsonResponse({ error: 'Unknown action' });
    }

    const user  = e.parameter.user || '';
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) {
      return jsonResponse([]);
    }

    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    const profiles = rows
      .filter(row => row[0] && (!user || String(row[2]) === user))
      .map(row => { try { return JSON.parse(String(row[4])); } catch { return null; } })
      .filter(p => p !== null);

    return jsonResponse(profiles);
  } catch (err) {
    return jsonResponse({ error: String(err) });
  }
}

// POST  body: { action: 'saveProfiles', user: <username>, profiles: SavedProfile[] }
// → Xóa các row cũ của user đó, ghi lại toàn bộ profiles mới
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.action !== 'saveProfiles') {
      return jsonResponse({ error: 'Unknown action' });
    }

    const user     = body.user     || '';
    const profiles = body.profiles || [];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // Tạo header nếu sheet mới
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['id', 'name', 'userId', 'updatedAt', 'profileJson']);
    }

    // Xóa các row thuộc user này — dùng cột C (userId) trực tiếp, không parse JSON
    if (sheet.getLastRow() >= 2) {
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
      for (let i = rows.length - 1; i >= 0; i--) {
        if (!user || String(rows[i][2]) === user) {
          sheet.deleteRow(i + 2); // +2: 1-indexed + bỏ qua header
        }
      }
    }

    // Ghi profiles mới
    profiles.forEach(p => {
      sheet.appendRow([p.id, p.name, p.userId || '', p.updatedAt, JSON.stringify(p)]);
    });

    return jsonResponse({ success: true, count: profiles.length });
  } catch (err) {
    return jsonResponse({ error: String(err) });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Nhấn **Save** (Ctrl+S), đặt tên project tùy ý (ví dụ: `DragonScrollSync`).

---

### Bước 3 — Deploy Apps Script thành Web App

1. Nhấn nút **Deploy → New deployment**.
2. Nhấn biểu tượng bánh răng ⚙️ → chọn **Web app**.
3. Điền thông tin:
   - **Description:** `DragonScroll Sync` (tùy ý)
   - **Execute as:** `Me` (tài khoản Google của bạn)
   - **Who has access:** `Anyone` ← **bắt buộc**
4. Nhấn **Deploy**.
5. Lần đầu sẽ yêu cầu cấp quyền — nhấn **Authorize access** và đồng ý.
6. Sau khi deploy xong, copy **Web app URL** (dạng `https://script.google.com/macros/s/XXXX.../exec`).
AKfycbxQ-w4BtUvZUWcSp9rzQMfct18K_A4eZF1s91Q7v5BDmkfkGU2T8y5YFbY0dpN0452r
https://script.google.com/macros/s/AKfycbxQ-w4BtUvZUWcSp9rzQMfct18K_A4eZF1s91Q7v5BDmkfkGU2T8y5YFbY0dpN0452r/exec

> **Mỗi khi sửa code script**, bạn phải deploy lại (New deployment) — URL sẽ thay đổi, cần cập nhật GitHub Variable.

---

### Bước 4 — Thêm Variable vào GitHub Repository

1. Vào trang GitHub repository của dự án.
2. Chọn **Settings → Secrets and variables → Actions**.
3. Chọn tab **Variables** (không phải Secrets).
4. Nhấn **New repository variable** và điền:
   - **Name:** `VITE_GAS_URL`
   - **Value:** URL Web App vừa copy ở Bước 3
5. Nhấn **Add variable**.

> **Tại sao dùng Variable thay vì Secret?**  
> URL này được nhúng vào bundle JavaScript khi build nên không thể giấu hoàn toàn. Dùng Variable cho phép kiểm tra giá trị dễ hơn. Nếu bạn muốn hạn chế ai biết URL, dùng Secret cũng được — chỉ cần đổi `vars.VITE_GAS_URL` thành `secrets.VITE_GAS_URL` trong file `.github/workflows/deploy.yml`.

---

### Bước 5 — Trigger Deploy lại

Push bất kỳ thay đổi nào lên nhánh `main` để GitHub Actions build lại với biến mới, hoặc vào tab **Actions → chọn workflow → Re-run jobs**.

---

### Kiểm tra hoạt động

Sau khi deploy, mở app và kiểm tra:
- Góc trên cùng bên phải có biểu tượng **đám mây** ☁️ → đồng bộ đang hoạt động.
- Biểu tượng màu **xanh lá** = đã đồng bộ thành công.
- Biểu tượng màu **đỏ** = lỗi (kiểm tra URL trong GitHub Variable và quyền Apps Script).
- Nhấn vào biểu tượng đám mây để đồng bộ thủ công.

---

## Luồng đồng bộ dữ liệu

```
Khởi động app
  └─► Load localStorage (ngay lập tức)
  └─► Fetch Google Sheets (async, nền)
        └─► Merge: ID trùng → giữ bản mới hơn (theo updatedAt)
        └─► ID chỉ có ở Sheets → thêm vào
        └─► ID chỉ có ở local → giữ nguyên

Khi lưu/xóa hồ sơ
  └─► Lưu localStorage (ngay lập tức)
  └─► Sync lên Sheets (background, không chặn UI)
```

Ứng dụng vẫn hoạt động bình thường khi không có internet — localStorage luôn là nguồn dữ liệu chính.

---

## Cấu trúc file quan trọng

| File | Mục đích |
|------|----------|
| `App.tsx` | Logic chính, quản lý hồ sơ, UI navigation |
| `services/googleSheetService.ts` | Toàn bộ logic gọi Google Apps Script |
| `types.ts` | TypeScript interfaces (`Character`, `SavedProfile`, ...) |
| `.github/workflows/deploy.yml` | GitHub Actions: build & deploy lên Pages |
