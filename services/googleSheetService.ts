import { SavedProfile } from '../types';

const GAS_URL = import.meta.env.VITE_GAS_URL as string | undefined;

export function isGoogleSheetEnabled(): boolean {
  return !!GAS_URL;
}

/**
 * Load profiles từ Google Sheets, lọc theo user.
 * GAS endpoint cần hỗ trợ query param: ?action=loadProfiles&user=xxx
 */
export async function fetchProfilesFromSheet(userId: string): Promise<SavedProfile[]> {
  if (!GAS_URL) return [];
  try {
    const url = `${GAS_URL}?action=loadProfiles&user=${encodeURIComponent(userId)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Lưu profiles lên Google Sheets, kèm userId.
 * GAS endpoint nhận POST với body: { action, user, profiles }
 * Fire-and-forget.
 */
export function syncProfilesToSheet(profiles: SavedProfile[], userId: string): void {
  if (!GAS_URL) return;
  fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'saveProfiles', user: userId, profiles }),
  }).catch(() => {/* silently ignore */});
}

/**
 * Merge local profiles với remote profiles.
 * - Cùng ID: giữ cái mới hơn (updatedAt).
 * - Chỉ ở remote: thêm vào.
 * - Chỉ ở local: giữ lại.
 */
export function mergeProfiles(
  local: SavedProfile[],
  remote: SavedProfile[]
): SavedProfile[] {
  const map = new Map<string, SavedProfile>();
  for (const p of local) map.set(p.id, p);
  for (const p of remote) {
    if (!p?.id || !p?.character) continue;
    const existing = map.get(p.id);
    if (!existing || new Date(p.updatedAt) > new Date(existing.updatedAt)) {
      map.set(p.id, p);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
