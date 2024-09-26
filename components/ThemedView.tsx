import { useColorScheme, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from 'react-native-paper';
import { theme } from '@/constants';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  // const backgroundColor = useTheme();
  const textC = {light: "#D0D0D0", dark: "#353636"};
  const colorScheme = useColorScheme() ?? 'light';
  

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
