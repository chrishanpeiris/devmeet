// ─── Design tokens ────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  primary:     '#6C63FF',
  primaryDark: '#574FCC',
  secondary:   '#FF6584',
  accent:      '#43C6AC',

  // Backgrounds
  bg:          '#0F0E17',
  surface:     '#1A1929',
  surfaceHigh: '#252438',
  border:      '#2E2D45',

  // Text
  textPrimary:   '#FFFFFE',
  textSecondary: '#A7A5C0',
  textMuted:     '#5C5A78',

  // Status
  success: '#3fb950',
  warning: '#f59e0b',
  error:   '#f87171',

  // Tags
  tagBg:     '#1E1D30',
  tagBorder: '#3A3860',
  tagText:   '#A7A5C0',
  tagActive:     '#6C63FF',
  tagActiveBg:   '#2A2850',
  tagActiveBorder: '#6C63FF',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const radius = {
  sm:   8,
  md:   12,
  lg:   20,
  xl:   28,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 24, fontWeight: '700' as const, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  h4: { fontSize: 16, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textSecondary },
  small: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
  label: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted, letterSpacing: 0.8 },
};
