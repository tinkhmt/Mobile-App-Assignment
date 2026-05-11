import { Text } from 'react-native';
import theme from '../theme';

export default function AppText({ style, children, ...rest }) {
  return (
    <Text
      style={[{ color: theme.colors.onBackground }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
