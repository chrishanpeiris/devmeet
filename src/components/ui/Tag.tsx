import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@/theme';

interface TagProps {
  label:     string;
  active?:   boolean;
  highlight?: boolean;   // mutual tag highlight
  onPress?:  () => void;
  size?:     'sm' | 'md';
}

export function Tag({ label, active, highlight, onPress, size = 'md' }: TagProps) {
  const isSmall = size === 'sm';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.tag,
        isSmall && styles.tagSm,
        active     && styles.tagActive,
        highlight  && styles.tagHighlight,
      ]}
    >
      <Text style={[
        styles.label,
        isSmall && styles.labelSm,
        active    && styles.labelActive,
        highlight && styles.labelHighlight,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical:   spacing.xs,
    borderRadius:      radius.full,
    borderWidth:       1,
    borderColor:       colors.tagBorder,
    backgroundColor:   colors.tagBg,
  },
  tagSm: {
    paddingHorizontal: spacing.sm,
    paddingVertical:   2,
  },
  tagActive: {
    borderColor:     colors.tagActive,
    backgroundColor: colors.tagActiveBg,
  },
  tagHighlight: {
    borderColor:     colors.accent,
    backgroundColor: 'rgba(67, 198, 172, 0.12)',
  },
  label: {
    fontSize:   13,
    fontWeight: '500',
    color:      colors.tagText,
  },
  labelSm: {
    fontSize: 11,
  },
  labelActive: {
    color: colors.primary,
  },
  labelHighlight: {
    color: colors.accent,
  },
});
