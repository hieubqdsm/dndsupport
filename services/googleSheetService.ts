import { SavedProfile } from '../types';

const GAS_URL = import.meta.env.VITE_GAS_URL as string | undefined;

export function isGoogleSheetEnabled(): boolean {
  return !!GAS_URL;
}

/**
 * Load all profiles from Google Sheets via Google Apps Script.
 * Returns empty array on any error (network, misconfiguration, etc.)
 */
export async function fetchProfilesFromSheet(): Promise<SavedProfile[]> {
  if (!GAS_URL) return [];
  try {
    const res = await fetch(`${GAS_URL}?action=loadProfiles`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Save all profiles to Google Sheets via Google Apps Script.
 * Fire-and-forget: does not block the UI, silently ignores errors.
 */
export function syncProfilesToSheet(profiles: SavedProfile[]): void {
  if (!GAS_URL) return;
  // Use text/plain to avoid CORS preflight (GAS limitation)
  fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'saveProfiles', profiles }),
  }).catch(() => {/* silently ignore network errors */});
}

/**
 * Merge local profiles with remote profiles.
 * - For same ID: keep the one with the most recent updatedAt.
 * - IDs only in remote: add to result.
 * - IDs only in local: keep in result.
 */
export function mergeProfiles(
  local: SavedProfile[],
  remote: SavedProfile[]
): SavedProfile[] {
  const map = new Map<string, SavedProfile>();
  for (const p of local) map.set(p.id, p);
  for (const p of remote) {
    const existing = map.get(p.id);
    if (!existing || new Date(p.updatedAt) > new Date(existing.updatedAt)) {
      map.set(p.id, p);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
