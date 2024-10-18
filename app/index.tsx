import {
  Image,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { images, GQL_Query } from "../constants";
import { ThemedInput } from "@/components/ThemedInput";
import { ParallaxScrollView, ThemedText, ThemedView } from "@/components";
import { ThemedButton } from "@/components/ThemedButton";
import { useMutation } from "@apollo/client";

import { loginSuccess } from '../redux/actions/auth'; 
import DeviceInfo from 'react-native-device-info';
// import { getUniqueId, getManufacturer } from 'react-native-device-info';

import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { RootState } from "@/redux/store";
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'



// SplashScreen.preventAutoHideAsync();


export default function LoginScreen() {
  const dispatch = useDispatch()

  const [isBiometricSupported, setIsBiometricSupported] = useState(null); 
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricKey, setBiometricKey] = useState(false);

  // const token = useSelector((state: RootState) => state.auth.Token);
  
  const [loginMutation] = useMutation(GQL_Query.LOGIN_MUTATION);

  
  
  // useEffect(() => {
  //   if(token){
  //     router.replace('/(tabs)/home')
  //   }
  //   console.log('test', token);
  // },[token])

  useEffect(() => {

    const fetchToken = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        const storedToken = await AsyncStorage.getItem('token');
        console.log('simpanan', storedToken);

        if (storedToken) {
          dispatch(loginSuccess(storedToken));
          router.replace('/(tabs)/home');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      } finally {
        // Ensure that the splash screen is hidden even if an error occurs
        await SplashScreen.hideAsync();
      }
    };


    const createBiometricKey = async () => {
      const rnBiometrics = new ReactNativeBiometrics()

      const { publicKey } = await rnBiometrics.createKeys();
      setBiometricKey(publicKey);


      // Send the public key to your Laravel backend to register the user
    };

    //** using expo authentication *z/
    // const compatibilityCheck = async () => {
    //   const compatible = await LocalAuthentication.hasHardwareAsync();
    //   const type = await LocalAuthentication.supportedAuthenticationTypesAsync();
    //   const result = await LocalAuthentication.authenticateAsync({
    //     promptMessage:'Biometrics',
    //     cancelLabel:'Cancel Biometrics'
    //   });
    //   // console.log('compatible',result);hmm
    //   setIsBiometricSupported(compatible);
    // };
    // compatibilityCheck();


    //** using rn biometric  
    // const isBiometricSupportFunction = async () => {
    //   const rnBiometrics = new ReactNativeBiometrics()

    //   const { biometryType } = await rnBiometrics.isSensorAvailable()

    //   if (biometryType === BiometryTypes.TouchID) {
    //     console.log('TouchID is supported', biometryType);
    //   } else if (biometryType === BiometryTypes.FaceID) {
    //     console.log('FaceID is supported', biometryType);
    //   } else if (biometryType === BiometryTypes.Biometrics) {
    //     console.log('Biometrics is supported', biometryType);
    //   } else {
    //     console.log('Biometrics not supported', biometryType, BiometryTypes);
    //   }
    //   console.log('test')

    //   rnBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
    //     .then((resultObject) => {
    //       const { success } = resultObject

    //       console.log('test',resultObject)
    //       if (success) {
    //         console.log('successful biometrics provided',resultObject)
    //       } else {
    //         console.log('user cancelled biometric prompt')
    //       }
    //     })
    //     .catch(() => {
    //       console.log('biometrics failed')
    //   })
    // };
  

    // isBiometricSupportFunction();

    // fetchToken();
  }, []); 

  useEffect(() => {
    console.log(isBiometricSupported);
  },[isBiometricSupported])

  const signIn = async () => {


  let deviceId = DeviceInfo.getUniqueIdSync();

    if (!phone) {
      Toast.show({
        type: "error",
        text1: "Phone number is required",
        visibilityTime: 3000,
      });
      return;
    }
  
    // Validate password
    if (!password) {
      Toast.show({
        type: "error",
        text1: "Password is required",
        visibilityTime: 3000,
      });
      return;
    }
  
    // Optional: Phone number format validation (10-15 digits)
    const phoneRegex = /^[0-9]{9,16}$/; 
    // if (!phoneRegex.test(phone)) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Invalid phone number format",
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }
    
    setLoading(true);
    try {
      console.log(deviceId);
      loginMutation({
        variables: {
          input: {
            mobile_number: phone,
            password: password,
            device_id: deviceId
          },
        },
        onCompleted: (infoData) => {
          console.log(infoData.login.token);
          // setLoading(false);
          Toast.show({
            type: 'success',
            text1: 'Login Succesful',
            visibilityTime: 3000
          });

          dispatch(loginSuccess(infoData.login.token));
          router.replace('/(app)/(tabs)/home')
        },
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              console.log(message);
              Toast.show({
                type: 'error',
                text1: message,
                visibilityTime: 3000
              });
            });
          }
          if (networkError) {
            console.log('tetes',networkError);
            Toast.show({
              type: 'error',
              text1: 'Network error. Please try again later',
              visibilityTime: 3000
            });
          }
          // setLoading(false);

        },
      });
    } catch (err) {
      console.log('functionerror, ',err);
      Toast.show({
        type: 'error',
        text1: 'An Error occuered. Please try again later',
        visibilityTime: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <ParallaxScrollView 
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      
    style={styles.container}
    >
      <ThemedView style={styles.topSection}>
        <TouchableOpacity>
          <Image
            source={images.temp_icon} // Replace with your image path
            style={styles.logo}
          />
        </TouchableOpacity>
        <ThemedText style={styles.headerText}>W&G</ThemedText>
      </ThemedView>
      <KeyboardAvoidingView behavior="padding" style={styles.formSection}>
        {/* Input Phone Number */}
        <View style={{ flexDirection: "row", marginVertical: 4 }}>
          {/* Country Code */}
          {/* <TouchableOpacity style={styles.countryCodeContainer}>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <ThemedFA6
                name={"angle-down"}
                // size={25}
                style={[{ marginBottom: -3 }]}
              />
            </View>
              <ThemedText  style={[{ marginTop: 8, marginLeft:5 }]}>
              🇲🇾 +60 
              </ThemedText>
          </TouchableOpacity> */}

          {/* Phone Number */}
          <ThemedInput
            style={styles.input}
            onChangeText={(text) => {const numericValue = text.replace(/[^0-9]/g, "");
              setPhone(numericValue)}}
            value={phone}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholder="Your Phone Number"
          ></ThemedInput>
        </View>

        {/* Input Password */}
        <ThemedView style={{ flexDirection: "row", marginVertical: 4 }}>
          <ThemedInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
            placeholder="Your Password"
            secureTextEntry={!showPassword}
          ></ThemedInput>
          <TouchableOpacity
            style={styles.eyeContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            {/* <FontAwesome6  name={showPassword ? "eye-slash" : "eye"} size={15} /> */}
                <ThemedFA6 name={showPassword ? "eye-slash" : "eye"} size={15} />

          </TouchableOpacity>
        </ThemedView>

        <View style={styles.action}>
          <ThemedButton
            title="Login"
            onPress={signIn}
            loading={loading}
            disabled={loading} // Disable button when loadingent style when disabled
          ></ThemedButton>
          <ThemedView style={styles.option}>
            <ThemedLink style={styles.link} push href="/(auth)/forget">
              Forget?
            </ThemedLink>
            <ThemedLink
              style={[styles.link, { textAlign: "center" }]}
              push
              href= {false ? "/(app)/(tabs)/home" : '/'}
            >
              E-Rate
            </ThemedLink>
            <ThemedLink
              style={[styles.link, { textAlign: "right" }]}
              push={true}
              href="/(auth)/register"
            >
              Sign Up
            </ThemedLink>
          </ThemedView>
        </View>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 70, // Adjust space between image and input fields
    paddingBottom: 70 , // Adjust space between image and input fields
  },
  logo: {
    width: 120, // Set the size of the image
    height: 120,
    resizeMode: "contain", // Ensures the image maintains aspect ratio
  },
  headerText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  formSection: {
    flex: 2,
  },
  input: {
    padding: 10,
    height: 40,
    flex: 1,
    borderBottomWidth: 1,
  },
  action: {
    marginTop: 15,
  },
  option: {
    display: "flex",
    flexDirection: "row",
    marginTop: 7,
  },
  link: {
    width: "33.333%",
    // textAlign:'center',
    marginTop: 5,
  },
  countryCodeContainer: {
    width: 100,
    height: 40,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginRight: 5,
  },
  eyeContainer: {
    // width: 25,
    // height: 40,
    position: "absolute",
    right: 5,
    bottom: 10,
    height: 20,
    width: 25,
  },
});
