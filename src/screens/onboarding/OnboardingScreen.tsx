// ─── Onboarding ───────────────────────────────────────────────────────────────
// 3-step profile setup: name + role → tech stack → looking for.
// Animated progress bar and slide transitions between steps.

import { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { colors, spacing, radius, typography } from '@/theme';
import { TECH_TAGS, INTEREST_TAGS, ROLE_LABELS, LOOKING_FOR_LABELS } from '@/lib/constants';
import { saveProfile } from '@/store/profileStore';
import type { Profile, Role, LookingFor } from '@/types';

const ROLES: Role[]       = ['junior', 'mid', 'senior', 'lead', 'founder'];
const LOOKING: LookingFor[] = ['job', 'collaboration', 'mentorship', 'networking', 'hiring'];
const STEPS = 3;

interface Props {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep]           = useState(0);
  const [name, setName]           = useState('');
  const [bio, setBio]             = useState('');
  const [role, setRole]           = useState<Role>('mid');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<LookingFor[]>([]);

  const progress = useSharedValue(1 / STEPS);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  function goNext() {
    const next = step + 1;
    progress.value = withTiming((next + 1) / STEPS, { duration: 300 });
    setStep(next);
  }

  function toggleTag<T extends string>(arr: T[], val: T, set: (v: T[]) => void) {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  async function finish() {
    const profile: Profile = {
      id:          'local-' + Date.now(),
      name:        name.trim(),
      bio:         bio.trim() || undefined,
      role,
      tech_stack:  techStack,
      interests:   [],
      looking_for: lookingFor,
      created_at:  new Date().toISOString(),
    };
    saveProfile(profile);
    onComplete();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>DevMeet</Text>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
          </View>
          <Text style={styles.stepLabel}>Step {step + 1} of {STEPS}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Step 0 — Name + role */}
          {step === 0 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Let's set up your profile</Text>
              <Text style={styles.stepSubtitle}>
                This is what other attendees will see when they swipe on your card.
              </Text>

              <Text style={styles.fieldLabel}>YOUR NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Alex Chen"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoFocus
                returnKeyType="next"
              />

              <Text style={styles.fieldLabel}>SHORT BIO (optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                placeholder="e.g. Building developer tools at startups"
                placeholderTextColor={colors.textMuted}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={2}
                returnKeyType="done"
              />

              <Text style={styles.fieldLabel}>YOUR ROLE</Text>
              <View style={styles.roleGrid}>
                {ROLES.map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleChip, role === r && styles.roleChipActive]}
                    onPress={() => setRole(r)}
                  >
                    <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                      {ROLE_LABELS[r]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                label="Continue"
                onPress={goNext}
                disabled={name.trim().length < 2}
                fullWidth
                style={{ marginTop: spacing.xl }}
              />
            </View>
          )}

          {/* Step 1 — Tech stack */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Your tech stack</Text>
              <Text style={styles.stepSubtitle}>
                Pick the technologies you work with. These are used to highlight mutual skills on cards.
              </Text>
              <Text style={styles.fieldLabel}>
                SELECTED: {techStack.length}
              </Text>
              <View style={styles.tagCloud}>
                {TECH_TAGS.map((t) => (
                  <Tag
                    key={t}
                    label={t}
                    active={techStack.includes(t)}
                    onPress={() => toggleTag(techStack, t, setTechStack)}
                  />
                ))}
              </View>

              <Button
                label="Continue"
                onPress={goNext}
                disabled={techStack.length === 0}
                fullWidth
                style={{ marginTop: spacing.xl }}
              />
            </View>
          )}

          {/* Step 2 — Looking for */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>What are you here for?</Text>
              <Text style={styles.stepSubtitle}>
                This helps people understand why you want to connect.
              </Text>

              <View style={styles.lookingForList}>
                {LOOKING.map((lf) => (
                  <TouchableOpacity
                    key={lf}
                    style={[styles.lfChip, lookingFor.includes(lf) && styles.lfChipActive]}
                    onPress={() => toggleTag(lookingFor, lf, setLookingFor)}
                  >
                    <Text style={styles.lfText}>{LOOKING_FOR_LABELS[lf]}</Text>
                    {lookingFor.includes(lf) && (
                      <Text style={styles.lfCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                label="Start exploring"
                onPress={finish}
                disabled={lookingFor.length === 0}
                fullWidth
                style={{ marginTop: spacing.xl }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    paddingBottom:     spacing.sm,
  },
  logo: {
    fontSize:     22,
    fontWeight:   '800',
    color:        colors.primary,
    marginBottom: spacing.md,
  },
  progressTrack: {
    height:          4,
    backgroundColor: colors.surfaceHigh,
    borderRadius:    2,
    overflow:        'hidden',
  },
  progressBar: {
    height:          4,
    backgroundColor: colors.primary,
    borderRadius:    2,
  },
  stepLabel: {
    marginTop: spacing.xs,
    fontSize:  12,
    color:     colors.textMuted,
  },
  content: {
    flexGrow: 1,
    padding:  spacing.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
    lineHeight:   22,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    marginTop:    spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color:           colors.textPrimary,
    fontSize:        16,
  },
  inputMulti: {
    height:    80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm + 2,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.sm,
  },
  roleChip: {
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    borderRadius:      radius.md,
    borderWidth:       1,
    borderColor:       colors.border,
    backgroundColor:   colors.surface,
  },
  roleChipActive: {
    borderColor:     colors.primary,
    backgroundColor: colors.tagActiveBg,
  },
  roleChipText: {
    fontSize:   14,
    color:      colors.textSecondary,
    fontWeight: '500',
  },
  roleChipTextActive: {
    color: colors.primary,
  },
  tagCloud: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.sm,
  },
  lookingForList: {
    gap: spacing.sm,
  },
  lfChip: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.md,
    borderRadius:      radius.md,
    borderWidth:       1,
    borderColor:       colors.border,
    backgroundColor:   colors.surface,
  },
  lfChipActive: {
    borderColor:     colors.primary,
    backgroundColor: colors.tagActiveBg,
  },
  lfText: {
    fontSize:   15,
    color:      colors.textSecondary,
    fontWeight: '500',
  },
  lfCheck: {
    fontSize: 16,
    color:    colors.primary,
    fontWeight: '700',
  },
});
