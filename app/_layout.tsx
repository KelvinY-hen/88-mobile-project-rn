import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
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
import { toastConfig } from "@/constants/ToastConfig";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://15c08f6102226410afa636f7f06748c3@o4508046229372928.ingest.us.sentry.io/4508046301265920',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});


// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();



 function RootLayout() {
  const httpLink = new HttpLink({
    uri: "http://13.212.214.34/graphql",
  });

  // const token = await AsyncStorage.getItem("token")

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
      // SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // useEffect(() => {
  //   if(token){
  //     router.replace('/(tabs)/home')
  //   }else{
  //     router.replace('/')
  //   }

  //   // SplashScreen.hideAsync();

  // },[token])

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
                    name="(auth)/forget"
                    options={{
                      headerShown: true,
                      title: "Forget Password",
                      headerTitleAlign: "center",
                      animation: "slide_from_right",
                      animationDuration: 50,
                    }}
                  />
                  <Stack.Screen
                    name="(app)/(tabs)"
                    options={{
                      headerShown: true,
                      // headerStyle:{backgroundColor:'#0051BA'},
                      title: "81 Pay",
                      animation: "slide_from_right",
                      headerTitleAlign: "center",
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

                  {/* Home Screen Setting */}

                  {/* QR */}
                  <Stack.Screen
                    name="(app)/(qr)/qr"
                    options={{
                      headerShown: true,
                      title: "QR",
                      headerTitleAlign: "center",
                      animation: "slide_from_right",
                      animationDuration: 50,
                    }}
                  />

                  {/* withdraw */}
                  <Stack.Screen
                    name="(app)/(withdraw)/withdraw"
                    options={{
                      headerShown: true,
                      title: "Withdraw",
                      headerTitleAlign: "center",
                      animation: "slide_from_right",
                      animationDuration: 50,
                      headerRight: () => (
                        <ThemedLink
                          push
                          style={[{ marginHorizontal: 3 }]}
                          href="(app)/(withdraw)/withdrawHistory"
                        >
                          History
                        </ThemedLink>
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="(app)/(withdraw)/withdrawHistory"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      title: "Transaction History",
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
                  <Stack.Screen
                    name="(app)/(settings)/profile/authentication"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      title: "Authenticate Account",
                      animation: "slide_from_right",
                      animationDuration: 50,
                    }}
                  />

                  {/* Bank */}
                  <Stack.Screen
                    name="(app)/(settings)/(bank)/bank"
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
                    name="(app)/(settings)/(security)/security"
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
                    name="(app)/(settings)/(security)/newLoginPasswordSetting"
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
                      title: "New Pin",
                      animation: "slide_from_right",
                      animationDuration: 50,
                    }}
                  />
                  <Stack.Screen
                    name="(app)/(settings)/(security)/reEnterPaymentPasswordSetting"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      title: "Verify Pin",
                      animation: "slide_from_right",
                      animationDuration: 50,
                    }}
                  />
                  <Stack.Screen
                    name="(app)/(settings)/(security)/(forget)/pin"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      title: "Reset PIN TAC",
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
                    name="(app)/(settings)/(security)/questionAnswerSetting"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      title: "Question Answer Setting",
                      animation: "slide_from_right",
                      animationDuration: 50,
                    }}
                  />
                  <Stack.Screen
                    name="(app)/(settings)/(security)/questionAnswerSettingVerify"
                    options={{
                      headerShown: true,
                      headerTitleAlign: "center",
                      title: "Question Answer Setting",
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
                <Toast config={toastConfig}/>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </PaperProvider>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>

    // </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout)