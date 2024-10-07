import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6 } from "@expo/vector-icons";
// import { useMutation } from "@apollo/client";

import { router } from "expo-router";

import { useState } from "react";

import { GQL_Query } from "@/constants";

import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { ParallaxScrollView, ThemedText, ThemedFA6 } from "@/components";
import { handleError } from "../../utils/handleError";
import { useMutationAPI } from "@/services/api";
import { useOTP } from "@/hooks/useOTP";


//** Register User Function */
export default function Register() {
  const screenWidth = Dimensions.get("window").width;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //** Register User Parameter Value */
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  // OTP Hooks
  const { countdown, isCounting, requestOTP, showResendOptions } = useOTP();

  // use Mutation Hooks -- with register mutation script
  const { handleMutation: register_mutation, loading: register_loading } =
    useMutationAPI(GQL_Query.REGISTER_MUTATION);

  // const [registerMutation] = useMutation(GQL_Query.REGISTER_MUTATION);

  //** Sign Up Function */
  const signUp = async () => {
    if (!phone) {
      Toast.show({
        type: "error",
        text1: "Phone number is required",
        visibilityTime: 3000,
      });
      return;
    }

    if (!otp) {
      Toast.show({
        type: "error",
        text1: "OTP is required",
        visibilityTime: 3000,
      });
      return;
    }

    if (!password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password and confirmation are required",
        visibilityTime: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
        visibilityTime: 3000,
      });
      return;
    }

    const phoneRegex = /^[0-9]{9,16}$/; // Example: Ensures phone is 10-15 digits
    if (!phoneRegex.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Invalid phone number format",
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    let variables = {
      input: {
        mobile_number: phone,
        password: password,
        password_confirmation: confirmPassword,
        otp: otp,
      },
    };

    const result = await register_mutation(variables);

    if (result.success) {
      let dataContainer = result.data.register;
      console.log(dataContainer);
      if (dataContainer.status == "SUCCESS") {
        console.log("Register Sucesfull", dataContainer.data);
        Toast.show({
          type: "success",
          text1: "Registered Succesfully",
          visibilityTime: 3000,
        });
        router.navigate("/");
      } else {
        console.log("Register Failed", dataContainer?.errors);
        Toast.show({
          type: "error",
          text1: dataContainer?.errors?.[0]?.message ?? 'Register Failed',
          text2: 'Check phone number, password and ensure the OTP is correct',
          visibilityTime: 3000,
        });
      }
    } else {
      handleError(result.error, new Error("Outside of Scope"), {
        component: "Register-API",
        errorType: result.error,
        errorMessage: result?.data?.[0]?.message ?? "",
      });
    }

    setLoading(false);
    // try {

    //   registerMutation({
    //     variables: {
    //       input: {
    //         mobile_number: phone,
    //         password: password,
    //         password_confirmation: confirmPassword,
    //         // otp: otp,
    //       },
    //     },
    //     onCompleted: (infoData) => {
    //       console.log(infoData);
    //       Toast.show({
    //         type: "success",
    //         text1: "Registered Succesfully",
    //         visibilityTime: 3000,
    //       });

    //       router.navigate("/");
    //     },
    //     onError: ({ graphQLErrors, networkError }) => {
    //       if (graphQLErrors) {
    //         graphQLErrors.forEach(({ message, locations, path }) => {
    //           // alert("Registration failed. Please try again. /n" + message);
    //           let temp_message = "Registration failed. Please Try Again Later";
    //           Toast.show({
    //             type: "error",
    //             text1: message ?? temp_message,
    //             visibilityTime: 3000,
    //           });
    //         });
    //       }
    //       if (networkError) {
    //         console.log(networkError);
    //         Toast.show({
    //           type: "error",
    //           text1: "Network error. Please try again later",
    //           visibilityTime: 3000,
    //         });
    //       }
    //       // setLoading(false);
    //     },
    //   });
    // } catch (err) {
    //   console.log("functionerror, ", err);
    //   // handleError(err, {
    //   //   component: "register_signUp",
    //   //   info: "Function Error Sign Up",
    //   // });
    //   Toast.show({
    //     type: "error",
    //     text1: "An Error occuered. Please try again later",
    //     visibilityTime: 3000,
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  //** Handle Request OTP Click */
  const handleClickRequestOTP = async (deliveryType: string) => {
    if (!phone) {
      Toast.show({
        type: "error",
        text1: "Phone number is required",
        visibilityTime: 3000,
      });
      return;
    }

    const phoneRegex = /^[0-9]{9,16}$/; // Example: Ensures phone is 10-15 digits
    if (!phoneRegex.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Invalid phone number format",
        visibilityTime: 3000,
      });
      return;
    }
    
    await requestOTP(phone, deliveryType);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      style={styles.container}
    >
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

            <ThemedText style={[{ marginTop: 8, marginLeft: 5 }]}>
              🇲🇾 +60
            </ThemedText>
          </TouchableOpacity> */}

          {/* Phone Number */}
          <ThemedInput
            style={styles.inputPhone}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              setPhone(numericValue);
            }}
            value={phone}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholder="Your Phone Number (60....)"
          ></ThemedInput>
        </View>

        <View style={[{ flexDirection: "row", marginVertical: 4 }]}>
          <ThemedInput
            style={styles.inputPhone}
            onChangeText={setOtp}
            value={otp}
            autoCapitalize="none"
            placeholder="OTP code"
          ></ThemedInput>

          {/* OTP Fuction -- show default send sms first, if failed  --> show option*/}
          {showResendOptions ? (
            <>
              <TouchableOpacity
                style={styles.option}
                onPress={isCounting ? null : () => handleClickRequestOTP("sms")}
                disabled={isCounting}
              >
                <ThemedText style={[styles.code, { width: screenWidth / 4 }]}>
                  {isCounting ? ` ${countdown}s` : "SMS"}
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={
                  isCounting ? null : () => handleClickRequestOTP("whatsapp")
                }
                disabled={isCounting}
              >
                <ThemedText style={[styles.code, { width: screenWidth / 4 }]}>
                  {isCounting ? ` ${countdown}s` : "Whatsapp"}
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.option}
              onPress={isCounting ? null : () => handleClickRequestOTP("whatsapp")}
              disabled={isCounting}
            >
              <ThemedText style={[styles.code, { width: screenWidth / 2 }]}>
                {isCounting ? ` ${countdown}s` : "Get Code"}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Input Password */}
        <View style={{ flexDirection: "row", marginVertical: 4 }}>
          <ThemedInput
            style={styles.inputPhone}
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
            <ThemedFA6 name={showPassword ? "eye-slash" : "eye"} size={15} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginVertical: 4 }}>
          <ThemedInput
            style={styles.inputPhone}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            autoCapitalize="none"
            placeholder="Reenter Your Password"
            secureTextEntry={true}
          ></ThemedInput>
        </View>

        <View style={styles.action}>
          <ThemedButton
            title="Sign Up"
            onPress={signUp}
            disabled={loading} 
            loading={loading}
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
    paddingBottom: 10, // Adjust space between image and input fields
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
    // justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
  },
  inputPhone: {
    padding: 10,
    height: 40,
    flex: 1,
    borderBottomWidth: 1,
  },
  action: {
    marginTop: 20,
  },
  option: {
    // textAlign: "center",
    justifyContent: "center",
    // borderColor: "#e5e5e5",
    // borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  code: {
    // paddingTop: 1,
    textAlign: "center",
    borderColor: "#e5e5e5",
    borderLeftWidth: 1,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
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
    textTransform: "uppercase",
  },
});
