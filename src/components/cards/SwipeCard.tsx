// ─── SwipeCard ────────────────────────────────────────────────────────────────
// Reanimated 3 + Gesture Handler swipe card.
// Swipe right = connect, swipe left = skip.
// The card rotates and shows a CONNECT / SKIP overlay as you drag.

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Tag } from '@/components/ui/Tag';
import { colors, spacing, radius } from '@/theme';
import { ROLE_LABELS, LOOKING_FOR_ICONS } from '@/lib/constants';
import type { Attendee } from '@/types';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.35;
const CARD_W = SCREEN_W - spacing.lg * 2;

interface SwipeCardProps {
  attendee:  Attendee;
  onConnect: (attendee: Attendee) => void;
  onSkip:    (attendee: Attendee) => void;
  isTop:     boolean;
}

export function SwipeCard({ attendee, onConnect, onSkip, isTop }: SwipeCardProps) {
  const tx      = useSharedValue(0);
  const ty      = useSharedValue(0);
  const startX  = useSharedValue(0);
  const startY  = useSharedValue(0);

  function handleConnect() { onConnect(attendee); }
  function handleSkip()    { onSkip(attendee); }

  const gesture = Gesture.Pan()
    .enabled(isTop)
    .onBegin(() => {
      startX.value = tx.value;
      startY.value = ty.value;
    })
    .onUpdate((e) => {
      tx.value = startX.value + e.translationX;
      ty.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      if (tx.value > SWIPE_THRESHOLD) {
        tx.value = withTiming(SCREEN_W * 1.5, { duration: 280 });
        runOnJS(handleConnect)();
      } else if (tx.value < -SWIPE_THRESHOLD) {
        tx.value = withTiming(-SCREEN_W * 1.5, { duration: 280 });
        runOnJS(handleSkip)();
      } else {
        tx.value = withSpring(0, { damping: 15 });
        ty.value = withSpring(0, { damping: 15 });
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      tx.value,
      [-SCREEN_W / 2, 0, SCREEN_W / 2],
      [-14, 0, 14],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { translateX: tx.value },
        { translateY: ty.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const connectOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [0, SWIPE_THRESHOLD * 0.6], [0, 1], Extrapolation.CLAMP),
  }));

  const skipOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [-SWIPE_THRESHOLD * 0.6, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const initials = attendee.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, cardStyle]}>
        {/* CONNECT overlay */}
        <Animated.View style={[styles.overlay, styles.connectOverlay, connectOverlayStyle]}>
          <Text style={styles.overlayText}>CONNECT</Text>
        </Animated.View>

        {/* SKIP overlay */}
        <Animated.View style={[styles.overlay, styles.skipOverlay, skipOverlayStyle]}>
          <Text style={[styles.overlayText, styles.skipText]}>SKIP</Text>
        </Animated.View>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>

        {/* Name + role */}
        <Text style={styles.name}>{attendee.name}</Text>
        <Text style={styles.role}>{ROLE_LABELS[attendee.role] ?? attendee.role}</Text>

        {/* Bio */}
        {attendee.bio && (
          <Text style={styles.bio} numberOfLines={2}>{attendee.bio}</Text>
        )}

        {/* Looking for */}
        <View style={styles.lookingFor}>
          {attendee.looking_for.map((lf) => (
            <Text key={lf} style={styles.lookingForItem}>
              {LOOKING_FOR_ICONS[lf]} {lf}
            </Text>
          ))}
        </View>

        {/* Tags */}
        <View style={styles.tagSection}>
          {attendee.mutual_tags.length > 0 && (
            <>
              <Text style={styles.tagSectionLabel}>MUTUAL SKILLS</Text>
              <View style={styles.tagRow}>
                {attendee.mutual_tags.map((t) => (
                  <Tag key={t} label={t} highlight size="sm" />
                ))}
              </View>
            </>
          )}

          {attendee.tech_stack.filter((t) => !attendee.mutual_tags.includes(t)).length > 0 && (
            <>
              <Text style={[styles.tagSectionLabel, { marginTop: spacing.sm }]}>TECH STACK</Text>
              <View style={styles.tagRow}>
                {attendee.tech_stack
                  .filter((t) => !attendee.mutual_tags.includes(t))
                  .slice(0, 5)
                  .map((t) => (
                    <Tag key={t} label={t} size="sm" />
                  ))}
              </View>
            </>
          )}
        </View>

        {/* Hint */}
        {isTop && (
          <Text style={styles.hint}>← Skip   Connect →</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position:        'absolute',
    width:           CARD_W,
    backgroundColor: colors.surface,
    borderRadius:    radius.xl,
    borderWidth:     1,
    borderColor:     colors.border,
    padding:         spacing.lg,
    alignItems:      'center',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.35,
    shadowRadius:    16,
    elevation:       8,
  },
  overlay: {
    position:     'absolute',
    top:          spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.xs,
    borderRadius:  radius.sm,
    borderWidth:   2.5,
    zIndex:        10,
  },
  connectOverlay: {
    right:       spacing.lg,
    borderColor: colors.accent,
    transform:   [{ rotate: '15deg' }],
  },
  skipOverlay: {
    left:        spacing.lg,
    borderColor: colors.secondary,
    transform:   [{ rotate: '-15deg' }],
  },
  overlayText: {
    fontSize:    20,
    fontWeight:  '800',
    color:       colors.accent,
    letterSpacing: 1.5,
  },
  skipText: {
    color: colors.secondary,
  },
  avatar: {
    width:           88,
    height:          88,
    borderRadius:    44,
    backgroundColor: colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    spacing.md,
  },
  initials: {
    fontSize:   30,
    fontWeight: '700',
    color:      '#fff',
  },
  name: {
    fontSize:   22,
    fontWeight: '700',
    color:      colors.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize:     14,
    color:        colors.primary,
    fontWeight:   '500',
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize:    14,
    color:       colors.textSecondary,
    textAlign:   'center',
    lineHeight:  20,
    marginBottom: spacing.sm,
  },
  lookingFor: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            spacing.sm,
    justifyContent: 'center',
    marginBottom:   spacing.md,
  },
  lookingForItem: {
    fontSize:  12,
    color:     colors.textMuted,
    textTransform: 'capitalize',
  },
  tagSection: {
    width:     '100%',
    marginTop: spacing.sm,
  },
  tagSectionLabel: {
    fontSize:      10,
    fontWeight:    '700',
    color:         colors.textMuted,
    letterSpacing: 1.2,
    marginBottom:  spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.xs,
  },
  hint: {
    marginTop:  spacing.lg,
    fontSize:   12,
    color:      colors.textMuted,
    letterSpacing: 0.5,
  },
});
