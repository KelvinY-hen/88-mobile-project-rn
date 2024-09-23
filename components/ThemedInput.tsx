import { StyleSheet, TextInput, useColorScheme, View, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({ style, lightColor, darkColor, ...otherProps }: ThemedInputProps) {
    const colorScheme = useColorScheme ();
    const color = colorScheme == 'dark' ? '#FFFFFF' : '#000000'; // Corrected color code
  

  return <TextInput style={[{ color }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
      },
})
