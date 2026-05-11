import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import theme from '../theme';

export default function ButtonPrimary({ title, onPress, style, disabled, iconName, variant = 'primary' }) {
  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceContainerHigh;
    switch (variant) {
      case 'secondary':
        return theme.colors.secondaryContainer;
      case 'tertiary':
        return theme.colors.tertiaryContainer;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.primaryContainer;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.onSurfaceVariant;
    switch (variant) {
      case 'secondary':
        return theme.colors.onSecondary;
      case 'tertiary':
        return theme.colors.onTertiary;
      case 'success':
        return '#FFFFFF';
      default:
        return theme.colors.onPrimary;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      {iconName && (
        <Ionicons name={iconName} size={26} color={getTextColor()} style={styles.icon} />
      )}
      <AppText style={[styles.text, { color: getTextColor() }]}>{title}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: theme.radius.lg,
    minHeight: 64,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  pressed: {
    opacity: 0.9,
    transform: [{ translateY: 2 }]
  },
  disabled: {
    opacity: 0.6
  },
  icon: {
    marginRight: 12
  },
  text: {
    ...theme.typography.button
  }
});