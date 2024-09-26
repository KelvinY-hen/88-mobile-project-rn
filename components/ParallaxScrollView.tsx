import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView, ThemedViewProps } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

const HEADER_HEIGHT = 250;

type Props = ThemedViewProps & PropsWithChildren< {
  headerBackgroundColor: { dark: string; light: string };
  lightColor?: string;
  darkColor?: string;
}>;

export default function ParallaxScrollView({
  children,
  style,
  lightColor, darkColor,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text'
  );

  return (
    <ThemedView style={[{backgroundColor},styles.container, style]}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // height: 250,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    // padding: 32,
    // gap: 16,
    overflow: 'hidden',
  },
});
