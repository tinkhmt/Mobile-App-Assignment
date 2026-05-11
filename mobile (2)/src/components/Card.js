import { View, StyleSheet } from 'react-native';
import theme from '../theme';

export default function Card({ style, children, accentColor }) {
  return (
    <View style={[styles.card, accentColor && { borderLeftColor: accentColor, borderLeftWidth: 6 }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.radius.xl,
    padding: 24,
    shadowColor: theme.colors.onSurface,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerLow
  }
});