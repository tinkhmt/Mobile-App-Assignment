import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import theme from '../theme';

export default function ScreenHeader({ title, subtitle, left, right }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {left ? left : <View style={styles.placeholder} />}
      </View>
      <View style={styles.titleContainer}>
        <AppText style={styles.title}>{title}</AppText>
        {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      </View>
      <View style={styles.rightContainer}>
        {right ? right : <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    minHeight: 44
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start'
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center'
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  placeholder: {
    width: 44
  },
  title: {
    ...theme.typography.headlineMD,
    color: theme.colors.onBackground,
    textAlign: 'center'
  },
  subtitle: {
    marginTop: 4,
    ...theme.typography.bodyMD,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center'
  }
});