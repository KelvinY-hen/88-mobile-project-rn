import { StyleSheet, TextInput, useColorScheme, View, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome6 } from '@expo/vector-icons';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedFA6({ lightColor, darkColor, ...otherProps }: ThemedInputProps) {
    const colorScheme = useColorScheme ();
    const color = colorScheme == 'dark' ? '#FFFFFF' : '#000000'; // Corrected color code
  

  return <FontAwesome6 color={color} {...otherProps} />;
}

const styles = StyleSheet.create({
})
