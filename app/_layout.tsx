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
import {setContext} from '@apollo/client/link/context'
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const httpLink = new HttpLink({
    uri: "http://47.129.200.19/graphql",
  });

  const authLink = setContext(async(_, {headers}) => {

    const token = await AsyncStorage.getItem('token');
    

    console.log(token)
    return{
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      }
    }
  })

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
      </Provider>
    </ApolloProvider>
    // </GestureHandlerRootView>
  );
}
