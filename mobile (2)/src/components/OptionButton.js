import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import theme from '../theme';

export default function OptionButton({ label, selected, onPress, correct, showResult }) {
  const getStyles = () => {
    if (showResult) {
      if (correct) return { bg: '#C8E6C9', border: '#2E7D32', icon: 'checkmark-circle', iconColor: '#2E7D32' };
      if (selected) return { bg: '#FFCDD2', border: '#C62828', icon: 'close-circle', iconColor: '#C62828' };
    }
    if (selected) return { bg: theme.colors.primaryContainer, border: theme.colors.primary, icon: 'checkmark-circle', iconColor: theme.colors.onPrimary };
    return { bg: theme.colors.surfaceContainerLow, border: theme.colors.outlineVariant, icon: null, iconColor: null };
  };

  const { bg, border, icon, iconColor } = getStyles();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, { backgroundColor: bg, borderColor: border }]}
    >
      {icon && (
        <Ionicons name={icon} size={28} color={iconColor} style={styles.icon} />
      )}
      <AppText style={styles.text}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: theme.radius.lg,
    borderWidth: 3,
    marginBottom: 16
  },
  icon: {
    marginRight: 14
  },
  text: {
    flex: 1,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurface
  }
});