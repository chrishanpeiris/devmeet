// ─── Connections screen ───────────────────────────────────────────────────────
// Shows all saved connections from MMKV offline store.
// Works fully without internet.

import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Tag } from '@/components/ui/Tag';
import { colors, spacing, radius, typography } from '@/theme';
import { getConnections } from '@/store/profileStore';
import { ROLE_LABELS, LOOKING_FOR_ICONS } from '@/lib/constants';
import type { Connection } from '@/types';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ConnectionsScreen() {
  const [connections, setConnections] = useState<Connection[]>([]);

  // Reload every time the tab is focused (new connections from swipe screen)
  useFocusEffect(
    useCallback(() => {
      setConnections(getConnections());
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Connections</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{connections.length}</Text>
        </View>
      </View>

      {connections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🤝</Text>
          <Text style={styles.emptyTitle}>No connections yet</Text>
          <Text style={styles.emptySubtitle}>
            Join an event and swipe right on people you want to meet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={connections}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
              <TouchableOpacity style={styles.card} activeOpacity={0.8}>
                {/* Avatar + main info */}
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.initials}>
                      {getInitials(item.connected_user.name)}
                    </Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.connected_user.name}</Text>
                    <Text style={styles.role}>
                      {ROLE_LABELS[item.connected_user.role] ?? item.connected_user.role}
                    </Text>
                    {item.connected_user.bio && (
                      <Text style={styles.bio} numberOfLines={1}>
                        {item.connected_user.bio}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.time}>{timeAgo(item.connected_at)}</Text>
                </View>

                {/* Looking for */}
                <View style={styles.lookingFor}>
                  {item.connected_user.looking_for.map((lf) => (
                    <Text key={lf} style={styles.lfItem}>
                      {LOOKING_FOR_ICONS[lf]}
                    </Text>
                  ))}
                </View>

                {/* Tags */}
                {item.connected_user.tech_stack.length > 0 && (
                  <View style={styles.tagRow}>
                    {item.connected_user.tech_stack.slice(0, 4).map((t) => (
                      <Tag key={t} label={t} size="sm" />
                    ))}
                    {item.connected_user.tech_stack.length > 4 && (
                      <Text style={styles.moreTags}>
                        +{item.connected_user.tech_stack.length - 4}
                      </Text>
                    )}
                  </View>
                )}

                {/* Event */}
                <View style={styles.eventRow}>
                  <Text style={styles.eventLabel}>Met at </Text>
                  <Text style={styles.eventName}>{item.event_name}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
  },
  title: { ...typography.h2 },
  badge: {
    backgroundColor: colors.primary,
    borderRadius:    radius.full,
    minWidth:        24,
    height:          24,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  list:  { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius:    radius.lg,
    borderWidth:     1,
    borderColor:     colors.border,
    padding:         spacing.md,
    gap:             spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           spacing.md,
  },
  avatar: {
    width:           48,
    height:          48,
    borderRadius:    24,
    backgroundColor: colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  initials:  { color: '#fff', fontWeight: '700', fontSize: 16 },
  info:      { flex: 1 },
  name:      { ...typography.h4, fontSize: 15 },
  role:      { fontSize: 13, color: colors.primary, fontWeight: '500', marginTop: 2 },
  bio:       { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  time:      { fontSize: 11, color: colors.textMuted },
  lookingFor: {
    flexDirection: 'row',
    gap:           spacing.xs,
  },
  lfItem:    { fontSize: 16 },
  tagRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.xs,
    alignItems:    'center',
  },
  moreTags: { fontSize: 12, color: colors.textMuted },
  eventRow: {
    flexDirection: 'row',
    alignItems:    'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop:    spacing.sm,
  },
  eventLabel: { fontSize: 12, color: colors.textMuted },
  eventName:  { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  empty: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        spacing.xl,
  },
  emptyEmoji:    { fontSize: 52, marginBottom: spacing.md },
  emptyTitle:    { ...typography.h3, marginBottom: spacing.sm },
  emptySubtitle: { ...typography.body, textAlign: 'center', lineHeight: 22 },
});
