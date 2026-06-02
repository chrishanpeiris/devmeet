// ─── Web fallback for profileStore ───────────────────────────────────────────
// MMKV is native-only. On web we use localStorage instead.
// React Native picks profileStore.web.ts automatically on web platform.

import type { Profile, Connection } from '@/types';

// ── Profile ───────────────────────────────────────────────────────────────────

export function saveProfile(profile: Profile): void {
  localStorage.setItem('profile', JSON.stringify(profile));
}

export function getProfile(): Profile | null {
  const raw = localStorage.getItem('profile');
  return raw ? (JSON.parse(raw) as Profile) : null;
}

export function clearProfile(): void {
  localStorage.removeItem('profile');
}

// ── Connections ───────────────────────────────────────────────────────────────

export function saveConnection(connection: Connection): void {
  const existing = getConnections();
  const updated  = [connection, ...existing.filter((c) => c.id !== connection.id)];
  localStorage.setItem('connections', JSON.stringify(updated));
}

export function getConnections(): Connection[] {
  const raw = localStorage.getItem('connections');
  return raw ? (JSON.parse(raw) as Connection[]) : [];
}

export function clearConnections(): void {
  localStorage.removeItem('connections');
}

// ── Skipped attendees ─────────────────────────────────────────────────────────

export function addSkipped(userId: string): void {
  const existing = getSkipped();
  localStorage.setItem('skipped', JSON.stringify([...existing, userId]));
}

export function getSkipped(): string[] {
  const raw = localStorage.getItem('skipped');
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export function clearSkipped(): void {
  localStorage.removeItem('skipped');
}
