import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import theme from '../theme';

export default function StatPill({ label, value }) {
  return (
    <View style={styles.pill}>
      <AppText style={styles.label}>{label}</AppText>
      <AppText style={styles.value}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.radius.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
    alignItems: 'center'
  },
  label: {
    ...theme.typography.bodyMD,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant
  },
  value: {
    marginTop: 4,
    ...theme.typography.labelLG,
    color: theme.colors.onSurface
  }
});
