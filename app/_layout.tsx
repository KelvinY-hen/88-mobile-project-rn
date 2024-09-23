import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const client = new ApolloClient({
  //   uri: "http://47.129.200.19/graphiql",
  //   cache: new InMemoryCache(),
  // });
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const defaultNoBorder = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      border: "transparent", // Making the border transparent
    },
    // font:'#28a745'
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Initialize Stack Navigator

  return (
    // <GestureHandlerRootView>
      // <ApolloProvider client={client}>
        <ThemeProvider value={colorScheme == "dark" ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="(auth)">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/register"
              options={{ headerShown: true, title: "Register Account" }}
            />
            <Stack.Screen
              name="(app)/(tabs)"
              options={{
                headerShown: true,
                title: "81 Pay",
                headerRight: () => (
                  <FontAwesome6
                    name={"bell"}
                    size={25}
                    style={[{ marginHorizontal: 16 }]}
                  />
                ),
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      // </ApolloProvider>
    // </GestureHandlerRootView>
  );
}
