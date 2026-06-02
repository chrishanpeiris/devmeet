// ─── Attendees screen ─────────────────────────────────────────────────────────
// Swipe-card deck for attendees at the current event.
// Mutual tech stack tags are highlighted in teal.
// Connect = saved to MMKV + Supabase. Skip = hidden for session.

import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeIn, FadeOut, useSharedValue, withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeCard } from '@/components/cards/SwipeCard';
import { colors, spacing, radius, typography } from '@/theme';
import { getProfile, saveConnection, addSkipped, getSkipped } from '@/store/profileStore';
import { fetchAttendees, joinEvent, saveConnectionRemote } from '@/lib/api';
import type { Attendee, Connection } from '@/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@/types';

const { width: SCREEN_W } = Dimensions.get('window');


type Props = BottomTabScreenProps<MainTabParamList, 'Attendees'>;

export function AttendeesScreen({ route, navigation }: Props) {
  const { eventId, eventName } = route.params;

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading]     = useState(true);
  const [matchFlash, setMatchFlash] = useState<string | null>(null);

  useEffect(() => {
    const profile = getProfile();
    if (!profile) { setLoading(false); return; }

    // Register attendance in Supabase, then load other attendees
    joinEvent(eventId, profile.id)
      .catch(() => {}) // non-fatal if already joined
      .finally(() =>
        fetchAttendees(eventId, profile, getSkipped())
          .then(setAttendees)
          .catch(() => setAttendees([]))
          .finally(() => setLoading(false)),
      );
  }, [eventId]);

  const handleConnect = useCallback((attendee: Attendee) => {
    const profile = getProfile();
    // Save offline first (instant, works without internet)
    const conn: Connection = {
      id:             `conn_${Date.now()}`,
      connected_user: attendee,
      event_name:     eventName,
      connected_at:   new Date().toISOString(),
    };
    saveConnection(conn);
    // Then sync to Supabase in background (non-blocking)
    if (profile) {
      saveConnectionRemote(profile.id, attendee.id, eventId).catch(() => {});
    }
    setMatchFlash(attendee.name);
    setTimeout(() => setMatchFlash(null), 1800);
    setAttendees((prev) => prev.slice(0, -1));
  }, [eventName, eventId]);

  const handleSkip = useCallback((attendee: Attendee) => {
    addSkipped(attendee.id);
    setAttendees((prev) => prev.slice(0, -1));
  }, []);

  const remaining = attendees.length;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={styles.backBtn}>← Events</Text>
          </TouchableOpacity>
          <Text style={styles.eventName} numberOfLines={1}>{eventName}</Text>
          <Text style={styles.remaining}>
            {remaining} left
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
        ) : remaining === 0 ? (
          <Animated.View entering={FadeIn} style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>You've seen everyone!</Text>
            <Text style={styles.emptySubtitle}>
              Check your Connections tab to see who you connected with.
            </Text>
            <TouchableOpacity
              style={styles.connectionsBtn}
              onPress={() => navigation.navigate('Connections')}
            >
              <Text style={styles.connectionsBtnText}>View Connections</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.deck}>
            {/* Render bottom card first, top card last (so top is above) */}
            {attendees.slice(-2).map((attendee, idx, arr) => (
              <SwipeCard
                key={attendee.id}
                attendee={attendee}
                onConnect={handleConnect}
                onSkip={handleSkip}
                isTop={idx === arr.length - 1}
              />
            ))}
          </View>
        )}

        {/* Action hint buttons */}
        {remaining > 0 && !loading && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.skipBtn]}
              onPress={() => handleSkip(attendees[attendees.length - 1])}
            >
              <Text style={styles.actionIcon}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.connectBtn]}
              onPress={() => handleConnect(attendees[attendees.length - 1])}
            >
              <Text style={styles.actionIcon}>✓</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Match flash overlay */}
        {matchFlash && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(400)}
            style={styles.matchFlash}
          >
            <Text style={styles.matchEmoji}>🎉</Text>
            <Text style={styles.matchText}>Connected with</Text>
            <Text style={styles.matchName}>{matchFlash}</Text>
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.sm,
  },
  backBtn:   { color: colors.primary, fontSize: 14, fontWeight: '600' },
  eventName: { ...typography.h4, flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
  remaining: { fontSize: 13, color: colors.textMuted, minWidth: 40, textAlign: 'right' },
  deck: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingBottom:  80,
  },
  actions: {
    flexDirection:     'row',
    justifyContent:    'center',
    gap:               spacing.xl,
    paddingBottom:     spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  actionBtn: {
    width:          60,
    height:         60,
    borderRadius:   30,
    alignItems:     'center',
    justifyContent: 'center',
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.3,
    shadowRadius:   8,
    elevation:      4,
  },
  skipBtn:    { backgroundColor: colors.surfaceHigh, borderWidth: 1.5, borderColor: colors.secondary },
  connectBtn: { backgroundColor: colors.primary },
  actionIcon: { fontSize: 22, color: '#fff', fontWeight: '700' },
  empty: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        spacing.xl,
  },
  emptyEmoji:    { fontSize: 56, marginBottom: spacing.md },
  emptyTitle:    { ...typography.h3, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.body, textAlign: 'center', lineHeight: 22, marginBottom: spacing.xl },
  connectionsBtn: {
    backgroundColor: colors.primary,
    borderRadius:    radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  connectionsBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  matchFlash: {
    position:        'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(108, 99, 255, 0.92)',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          100,
  },
  matchEmoji: { fontSize: 64, marginBottom: spacing.md },
  matchText:  { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  matchName:  { fontSize: 30, fontWeight: '800', color: '#fff' },
});
