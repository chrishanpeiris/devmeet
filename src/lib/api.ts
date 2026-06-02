// ─── Supabase API helpers ─────────────────────────────────────────────────────

import { supabase } from '@/lib/supabase';
import type { Event, Attendee, Profile } from '@/types';

// ── Events ────────────────────────────────────────────────────────────────────

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*, event_attendees(count)')
    .order('date', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((e: any) => ({
    id:             e.id,
    name:           e.name,
    description:    e.description,
    location_name:  e.location_name,
    latitude:       e.latitude,
    longitude:      e.longitude,
    join_code:      e.join_code,
    date:           e.date,
    attendee_count: e.event_attendees?.[0]?.count ?? 0,
  }));
}

export async function fetchEventByCode(code: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .ilike('join_code', code.trim())
    .single();

  if (error || !data) return null;
  return data as Event;
}

// ── Attendees ─────────────────────────────────────────────────────────────────

export async function fetchAttendees(
  eventId:      string,
  myProfile:    Profile,
  excludeIds:   string[],
): Promise<Attendee[]> {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('joined_at, profiles(*)')
    .eq('event_id', eventId)
    .not('user_id', 'in', `(${[myProfile.id, ...excludeIds].join(',')})`);

  if (error) throw error;

  return (data ?? []).map((row: any) => {
    const p: Profile = row.profiles;
    return {
      ...p,
      joined_at:    row.joined_at,
      mutual_tags:  (p.tech_stack ?? []).filter((t: string) =>
        myProfile.tech_stack.includes(t),
      ),
      is_connected: false,
    };
  });
}

// ── Join event ────────────────────────────────────────────────────────────────

export async function joinEvent(eventId: string, userId: string): Promise<void> {
  await supabase
    .from('event_attendees')
    .upsert({ event_id: eventId, user_id: userId }, { onConflict: 'event_id,user_id' });
}

// ── Save connection ───────────────────────────────────────────────────────────

export async function saveConnectionRemote(
  userId:          string,
  connectedUserId: string,
  eventId:         string,
): Promise<void> {
  await supabase.from('connections').upsert(
    { user_id: userId, connected_user_id: connectedUserId, event_id: eventId },
    { onConflict: 'user_id,connected_user_id' },
  );
}

// ── Upsert profile ────────────────────────────────────────────────────────────

export async function upsertProfile(profile: Profile): Promise<void> {
  await supabase.from('profiles').upsert({
    id:          profile.id,
    name:        profile.name,
    bio:         profile.bio ?? null,
    role:        profile.role,
    tech_stack:  profile.tech_stack,
    interests:   profile.interests,
    looking_for: profile.looking_for,
  });
}
