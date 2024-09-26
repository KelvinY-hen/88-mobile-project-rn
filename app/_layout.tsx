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
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { ThemedLink } from "@/components/ThemedLink";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const httpLink = new HttpLink({
    uri: "http://47.129.200.19/graphql",
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem("token");

    console.log(token);
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

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
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider value={colorScheme == "dark" ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack initialRouteName="(auth)">
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: false,
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />
                <Stack.Screen
                  name="(auth)/register"
                  options={{
                    headerShown: true,
                    title: "Register",
                    headerTitleAlign: "center",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />
                <Stack.Screen
                  name="(app)/(tabs)"
                  options={{
                    headerShown: true,
                    title: "81 Pay",
                    animation: "slide_from_right",
                    animationDuration: 50,
                    headerRight: () => (
                      <FontAwesome6
                        name={"bell"}
                        size={25}
                        style={[{ marginHorizontal: 16 }]}
                      />
                    ),
                  }}
                />
                <Stack.Screen
                  name="(app)/withdraw"
                  options={{
                    headerShown: true,
                    title: "Withdraw",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />

                {/* About Me Setting */}
                {/* Profile */}
                <Stack.Screen
                  name="(app)/(settings)/profile/profile"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Edit Profile",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />

                <Stack.Screen
                  name="(app)/(settings)/profile/updateUsername"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Change Username",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />

                {/* Bank */}
                <Stack.Screen
                  name="(app)/(settings)/(bank)/index"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Bank Account",
                    animation: "slide_from_right",
                    animationDuration: 50,
                    headerRight: () => (
                      <ThemedLink
                        push
                        style={[{ marginHorizontal: 5 }]}
                        href="(app)/(settings)/(bank)/add"
                      >
                        Add
                      </ThemedLink>
                    ),
                  }}
                />
                <Stack.Screen
                  name="(app)/(settings)/(bank)/add"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Add Bank Account",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />

                {/* security */}
                <Stack.Screen
                  name="(app)/(settings)/(security)/index"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Account Security",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />
                <Stack.Screen
                  name="(app)/(settings)/(security)/loginPasswordSetting"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Login Password Setting",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />
                <Stack.Screen
                  name="(app)/(settings)/(security)/paymentPasswordSetting"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Payment Password Setting",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />
                <Stack.Screen
                  name="(app)/(settings)/(security)/gesturePasswordSetting"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Gesture Password Setting",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />
                <Stack.Screen
                  name="(app)/(settings)/(security)/forgotPassword"
                  options={{
                    headerShown: true,
                    headerTitleAlign: "center",
                    title: "Forgot Password",
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />

                <Stack.Screen
                  name="+not-found"
                  options={{
                    animation: "slide_from_right",
                    animationDuration: 50,
                  }}
                />
              </Stack>
              <Toast />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
          </PaperProvider>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>

    // </GestureHandlerRootView>
  );
}
