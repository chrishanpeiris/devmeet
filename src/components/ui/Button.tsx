import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';

interface ButtonProps {
  label:     string;
  onPress:   () => void;
  variant?:  'primary' | 'secondary' | 'ghost';
  loading?:  boolean;
  disabled?: boolean;
  style?:    ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary', loading, disabled, style, fullWidth,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        variant === 'primary'   && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost'     && styles.ghost,
        fullWidth && { alignSelf: 'stretch' },
        (disabled || loading)   && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} size="small" />
        : <Text style={[styles.label, variant !== 'primary' && styles.labelAlt]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height:          52,
    borderRadius:    radius.md,
    paddingHorizontal: spacing.xl,
    alignItems:      'center',
    justifyContent:  'center',
    alignSelf:       'flex-start',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth:     1.5,
    borderColor:     colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '600',
  },
  labelAlt: {
    color: colors.primary,
  },
});
