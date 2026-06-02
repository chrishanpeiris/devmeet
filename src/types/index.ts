// ─── Domain types ─────────────────────────────────────────────────────────────

export type Role = 'junior' | 'mid' | 'senior' | 'lead' | 'founder';
export type LookingFor = 'job' | 'collaboration' | 'mentorship' | 'networking' | 'hiring';

export interface Profile {
  id:          string;
  name:        string;
  role:        Role;
  bio?:        string;
  tech_stack:  string[];
  interests:   string[];
  looking_for: LookingFor[];
  avatar_url?: string;
  created_at:  string;
}

export interface Event {
  id:            string;
  name:          string;
  description:   string;
  location_name: string;
  latitude:      number;
  longitude:     number;
  join_code:     string;
  date:          string;
  attendee_count?: number;
}

export interface Attendee extends Profile {
  joined_at:       string;
  mutual_tags:     string[];
  is_connected:    boolean;
}

export interface Connection {
  id:               string;
  connected_user:   Profile;
  event_name:       string;
  connected_at:     string;
}

// ─── Navigation types ─────────────────────────────────────────────────────────

export type RootStackParamList = {
  Onboarding: undefined;
  Main:       undefined;
};

export type MainTabParamList = {
  Events:      undefined;
  Attendees:   { eventId: string; eventName: string };
  Connections: undefined;
};

export type EventsStackParamList = {
  EventList:   undefined;
  EventDetail: { event: Event };
};
