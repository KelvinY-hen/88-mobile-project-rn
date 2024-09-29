import { StyleSheet, TextInput, useColorScheme, View, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from 'react-native-paper';


export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({ style, lightColor, darkColor, ...otherProps }: ThemedInputProps) {
    const colorScheme = useColorScheme ();
    const theme = useTheme();
    // const color = colorScheme == 'dark' ? '#FFFFFF' : '#000000'; // Corrected color code
    const placeholderColor = colorScheme == 'dark' ? '#FFFFFF' : '#b5b5b5'; // Corrected color code
    const color = colorScheme == 'dark' ? '#FFFFFF' : '#000000'; // Corrected color code
  

  return <TextInput style={[{ color }, style,styles.input]} placeholderTextColor={placeholderColor}  {...otherProps} />;
}

const styles = StyleSheet.create({
    link: {
        lineHeight: 40,
        fontSize: 16,
        color: '#0a7ea4',
      },
    input: {
      fontSize: 16,
      // letterSpacing: 1.2,
      // padding: 10,
      // paddingHorizontal: 13,
      // height: 40,
      // flex: 1,
      // borderColor: "#e5e5e5",
      // borderTopWidth: 1,
      // borderBottomWidth: 1,
    },
})
