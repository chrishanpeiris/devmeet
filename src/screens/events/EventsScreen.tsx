// ─── Events screen ────────────────────────────────────────────────────────────
// Browse seeded events or join one by a short code.
// Tapping an event navigates to attendees for that event.

import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Modal, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, spacing, radius, typography } from '@/theme';
import { fetchEvents, fetchEventByCode } from '@/lib/api';
import type { Event, MainTabParamList } from '@/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

interface Props {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Events'>;
}

export function EventsScreen({ navigation }: Props) {
  const [events, setEvents]     = useState<Event[]>([]);
  const [loading, setLoading]   = useState(true);
  const [joinModal, setJoinModal] = useState(false);
  const [code, setCode]         = useState('');
  const [codeError, setCodeError] = useState('');

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  async function joinByCode() {
    const event = await fetchEventByCode(code);
    if (!event) {
      setCodeError('No event found with that code. Try: REACT26, TS2026, or DEVSF');
      return;
    }
    setJoinModal(false);
    setCode('');
    setCodeError('');
    navigation.navigate('Attendees', { eventId: event.id, eventName: event.name });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity style={styles.joinBtn} onPress={() => setJoinModal(true)}>
          <Text style={styles.joinBtnText}>+ Join by code</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: spacing.xxl }} color={colors.primary} />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(e) => e.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('Attendees', {
                    eventId: item.id, eventName: item.name,
                  })
                }
              >
                <View style={styles.cardTop}>
                  <Text style={styles.eventName}>{item.name}</Text>
                  <View style={styles.attendeeBadge}>
                    <Text style={styles.attendeeCount}>
                      {item.attendee_count} attending
                    </Text>
                  </View>
                </View>
                <Text style={styles.eventDesc} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.meta}>📍 {item.location_name}</Text>
                  <Text style={styles.meta}>🗓 {formatDate(item.date)}</Text>
                </View>
                <View style={styles.codeRow}>
                  <Text style={styles.codeLabel}>Code: </Text>
                  <Text style={styles.code}>{item.join_code}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}

      {/* Join by code modal */}
      <Modal
        visible={joinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setJoinModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setJoinModal(false)}
        />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Join by event code</Text>
          <Text style={styles.modalSubtitle}>
            Enter the code shown on screen at your event.
          </Text>
          <TextInput
            style={styles.codeInput}
            placeholder="e.g. REACT26"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={(t) => { setCode(t); setCodeError(''); }}
            autoCapitalize="characters"
            autoFocus
          />
          {codeError ? <Text style={styles.error}>{codeError}</Text> : null}
          <TouchableOpacity
            style={[styles.goBtn, !code && styles.goBtnDisabled]}
            onPress={joinByCode}
            disabled={!code}
          >
            <Text style={styles.goBtnText}>Join event</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
  },
  title:    { ...typography.h2 },
  joinBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    borderRadius:      radius.md,
  },
  joinBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  list: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius:    radius.lg,
    borderWidth:     1,
    borderColor:     colors.border,
    padding:         spacing.md,
  },
  cardTop: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   spacing.xs,
  },
  eventName: {
    ...typography.h4,
    flex: 1,
    marginRight: spacing.sm,
  },
  attendeeBadge: {
    backgroundColor: colors.tagActiveBg,
    borderRadius:    radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  attendeeCount: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  eventDesc: {
    ...typography.body,
    fontSize:     13,
    marginBottom: spacing.sm,
    lineHeight:   18,
  },
  cardFooter: { gap: 4, marginBottom: spacing.sm },
  meta:       { fontSize: 12, color: colors.textMuted },
  codeRow:    { flexDirection: 'row', alignItems: 'center' },
  codeLabel:  { fontSize: 12, color: colors.textMuted },
  code:       { fontSize: 12, color: colors.primary, fontWeight: '700', letterSpacing: 1 },
  modalOverlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius:  radius.xl,
    borderTopRightRadius: radius.xl,
    padding:         spacing.xl,
    paddingBottom:   spacing.xxl,
  },
  modalTitle:    { ...typography.h3, marginBottom: spacing.xs },
  modalSubtitle: { ...typography.body, fontSize: 14, marginBottom: spacing.lg },
  codeInput: {
    backgroundColor:   colors.surfaceHigh,
    borderWidth:       1,
    borderColor:       colors.border,
    borderRadius:      radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.md,
    color:             colors.textPrimary,
    fontSize:          20,
    fontWeight:        '700',
    letterSpacing:     3,
    textAlign:         'center',
    marginBottom:      spacing.sm,
  },
  error:   { color: colors.error, fontSize: 13, marginBottom: spacing.md, textAlign: 'center' },
  goBtn: {
    backgroundColor: colors.primary,
    borderRadius:    radius.md,
    paddingVertical: spacing.md,
    alignItems:      'center',
    marginTop:       spacing.sm,
  },
  goBtnDisabled: { opacity: 0.4 },
  goBtnText:     { color: '#fff', fontWeight: '700', fontSize: 16 },
});
