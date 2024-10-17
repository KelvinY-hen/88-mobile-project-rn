import { useState, type PropsWithChildren, type ReactElement } from 'react';
import { RefreshControl, StyleSheet, useColorScheme } from 'react-native';
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
  allowRefresh: boolean;
  handleReloadFuction?: () => void;
}>;

export default function ParallaxScrollView({
  children,
  style,
  lightColor, darkColor,
  headerBackgroundColor,
  handleReloadFuction,
  allowRefresh = false,
  ...props
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    
    try {
      console.log('refetch');
      await handleReloadFuction();
    } catch (err) {
      console.log('Error during refetch: ', err);
    } finally {
      setRefreshing(false);
    }
  };

  


  return (
    <ThemedView style={[{backgroundColor},styles.container, style]}>
      <Animated.ScrollView style={{height:'100%'}} ref={scrollRef} scrollEventThrottle={16} 
      
      refreshControl={
        allowRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }>

        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%',
  },
  header: {
    // height: 250,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    height:'100%',
    // padding: 32,
    // gap: 16,
    overflow: 'hidden',
  },
});
