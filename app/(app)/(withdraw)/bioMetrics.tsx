import {
  Image,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";

import { useCallback, useEffect, useState } from "react";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { images, GQL_Query } from "@/constants";
import { ThemedInput } from "@/components";
import { ParallaxScrollView, ThemedText, ThemedView } from "@/components";
import { ThemedButton } from "@/components/ThemedButton";
import { useMutation, useQuery } from "@apollo/client";

import DeviceInfo from "react-native-device-info";
// import { getUniqueId, getManufacturer } from 'react-native-device-info';

import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { RootState } from "@/redux/store";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { getUserData } from "@/redux/actions/auth";
import { addBiometricData } from "@/redux/actions/withdraw";
import useWithdrawalRequest from "@/hooks/useWithdrawal";

// SplashScreen.preventAutoHideAsync();

export default function Biometrics() {
  const { handleWithdrawalRequest, loading:request_loading } = useWithdrawalRequest();
  const dispatch = useDispatch();

  const router = useRouter();
  const {
    pin,
    accNo,
    bank,
    selectedAccount,
    name,
    amount,
    branch,
    allowQnA,
    allowBiometrics,
    allowPin,
    QnA,
  } = useLocalSearchParams();

  const [isBiometricSupported, setIsBiometricSupported] = useState(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricKey, setBiometricKey] = useState(null);
  const userData = useSelector((state) => state.user.user);
  const {allowQnA: newAllowQnA} = useSelector((state) => state.withdraw.withdraw);


  const {
    loading: me_query_loading,
    data,
    error,
    refetch,
  } = useQuery(GQL_Query.ME_QUERY);

  useEffect(() => {
    if (data) {
      console.log("test", data);
      dispatch(getUserData(data?.me));
    }
  }, [data]); // Empty dependency array to run on mount

  useEffect(() => {
    //** using expo authentication */
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
    const isBiometricSupportFunction = async () => {
      const rnBiometrics = new ReactNativeBiometrics()

      const { biometryType } = await rnBiometrics.isSensorAvailable()

      if (biometryType === BiometryTypes.TouchID) {
        console.log('TouchID is supported', biometryType);
        authenticate()
      } else if (biometryType === BiometryTypes.FaceID) {
        console.log('FaceID is supported', biometryType);
        authenticate()
      } else if (biometryType === BiometryTypes.Biometrics) {
        console.log('Biometrics is supported', biometryType);
        authenticate()
      } else {
        console.log('Biometrics not supported', biometryType, BiometryTypes);
      }
      console.log('test')

      // rnBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
      //   .then((resultObject) => {
      //     const { success } = resultObject

      //     console.log('test',resultObject)
      //     if (success) {
      //       handleBiometricsSubmit(true, 'key')
      //       console.log('successful biometrics provided',resultObject)
      //     } else {
      //       console.log('user cancelled biometric prompt')
      //     }
      //   })
      //   .catch(() => {
      //     console.log('biometrics failed')
      // })
    };

    isBiometricSupportFunction();

    // Biometric authentication
    const authenticate = async () => {
      const rnBiometrics = new ReactNativeBiometrics();
      const payload = "Unique payload for authentication"; // Use a meaningful payload for verification
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage: "Authenticate with Biometrics",
        payload,
      });

      if (success) {
        handleBiometricsSubmit(true, signature);
        console.log("successful biometrics provided");
      } else {
        console.log("user cancelled biometric prompt");
      }
    };

    // createBiometricKey();
    // authenticate();

    // fetchToken();
  }, []);

  useEffect(() => {
    console.log(isBiometricSupported);
  }, [isBiometricSupported]);

  const handleBiometricsSubmit = async (status, value) => {
    const payload = {
      status: status,
      value: value,
    };

    dispatch(addBiometricData(payload));

    var params = {
      pin,
      accNo,
      bank,
      selectedAccount,
      name,
      amount,
      branch,
      allowPin,
      allowQnA,
      allowBiometrics,
      biometricsStatus: status,
      biometricsValue: value,
      QnA: QnA,
    };


    console.log('meng',newAllowQnA );
    if (newAllowQnA ) {
      router.replace({
        pathname: "/qna",
        params: params,
      });
    } else {


      const result = handleWithdrawalRequest();
      
      if((await result).success){
        Toast.show({
          type: 'success',
          text1: 'Withdrawal Request Successful',
          visibilityTime: 3000,
        });
      }else{
        Toast.show({
          type: 'error',
          text1: (await result).message,
          visibilityTime: 3000,
        });
      }

      // router.navigate({
      //   pathname: "/withdraw",
      //   pathname: "/home",
      //   params: params,
      // });
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      style={styles.container}
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Security</ThemedText>
      </ThemedView>
      <ThemedView style={styles.sectionHeader}>
        <ThemedText style={styles.subTitle}>Biometrics</ThemedText>
        {/* <ThemedText style={styles.subCaption}>To protect your account, it is recommended to turn on at least one 2FA</ThemedText> */}
        <ThemedText style={styles.subCaption}>
          To protect your account, please fulfill the biometrics or your password below
        </ThemedText>
      </ThemedView>
      <KeyboardAvoidingView behavior="padding" style={styles.formSection}>
        {/* Input Phone Number */}
        <View style={{ flexDirection: "row", marginVertical: 4 }}>
          {/* Phone Number */}
          <ThemedInput
            style={styles.input}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              setPhone(numericValue);
            }}
            value={userData?.mobile_number}
            editable={false}
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
            onPress={() => {
              handleBiometricsSubmit(false, password);
            }}
            loading={loading}
            disabled={loading} // Disable button when loadingent style when disabled
          ></ThemedButton>
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
    paddingBottom: 70, // Adjust space between image and input fields
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

  header: {
    // paddingHorizontal: 15,
    marginTop: 20,
    // marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    paddingTop: 10,
  },
  sectionHeader: {
    // paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  subCaption: {
    fontSize: 11,
    fontWeight: "500",
    color: "#b5b5b5",
    letterSpacing: 0.005,
    marginBottom: 6,
  },
});
