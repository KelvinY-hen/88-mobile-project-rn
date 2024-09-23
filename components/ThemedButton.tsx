import { TouchableOpacity, type TouchableOpacityProps, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  title: string;
  loading?: boolean; // Optional loading state
};

export function ThemedButton({
  lightColor,
  darkColor,
  title,
  loading = false,
  style,
  ...otherProps
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <TouchableOpacity
      style={[{ backgroundColor }, style, styles.button, loading && styles.disabledButton]}
      disabled={loading} // Disable when loading
      {...otherProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={{ color: '#fff', textTransform: 'uppercase' }}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center",
        // width: 200,
      },
      disabledButton: {
        backgroundColor: "#8BC34A", // Lighter color for disabled stater
      },
      buttonText: {
        color: "#fff",
        fontSize: 14,
        textTransform: 'uppercase',
      },
})
