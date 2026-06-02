// ─── Profile store (MMKV-backed, offline-first) ───────────────────────────────
// Stores the local user's profile and their connections so the app works
// even without an internet connection.

import { createMMKV } from 'react-native-mmkv';
import type { Profile, Connection } from '@/types';

const storage = createMMKV({ id: 'devmeet-profile' });

// ── Profile ───────────────────────────────────────────────────────────────────

export function saveProfile(profile: Profile): void {
  storage.set('profile', JSON.stringify(profile));
}

export function getProfile(): Profile | null {
  const raw = storage.getString('profile');
  return raw ? (JSON.parse(raw) as Profile) : null;
}

export function clearProfile(): void {
  storage.remove('profile');
}

// ── Connections ───────────────────────────────────────────────────────────────

export function saveConnection(connection: Connection): void {
  const existing = getConnections();
  const updated  = [connection, ...existing.filter((c) => c.id !== connection.id)];
  storage.set('connections', JSON.stringify(updated));
}

export function getConnections(): Connection[] {
  const raw = storage.getString('connections');
  return raw ? (JSON.parse(raw) as Connection[]) : [];
}

export function clearConnections(): void {
  storage.remove('connections');
}

// ── Skipped attendees ─────────────────────────────────────────────────────────
// Track who was swiped left so they don't appear again in the same session.

export function addSkipped(userId: string): void {
  const existing = getSkipped();
  storage.set('skipped', JSON.stringify([...existing, userId]));
}

export function getSkipped(): string[] {
  const raw = storage.getString('skipped');
  return raw ? (JSON.parse(raw) as string[]) : [];
}

export function clearSkipped(): void {
  storage.remove('skipped');
}
