import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6 } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";

import { Link, router } from "expo-router";

import { useState } from "react";

import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { GraphQLError } from "graphql";
import Toast from "react-native-toast-message";
import { ParallaxScrollView } from "@/components";
import { ThemedFA6 } from "@/components/ThemedFA6";
// TouchableOpacity

export default function Register() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        token
        status
      }
    }
  `;

  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const signUp = async () => {
    setLoading(true);
    try {
      registerMutation({
        variables: {
          input: {
            mobile_number: phone,
            password: password,
            password_confirmation: password,
          },
        },
        onCompleted: (infoData) => {
          console.log(infoData);
          Toast.show({
            type: "success",
            text1: "Registered Succesfully",
            visibilityTime: 3000,
          });
          router.replace("/");
          // setLoading(false);
        },
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              // alert("Registration failed. Please try again. /n" + message);
              console.log(message);
              Toast.show({
                type: "error",
                text1: "Registration failed. Please try again later",
                visibilityTime: 3000,
              });
            });
          }
          if (networkError) {
            console.log(networkError);
            // console.log(message);
            Toast.show({
              type: "error",
              text1: "Network error. Please try again later",
              visibilityTime: 3000,
            });
          }
          // setLoading(false);
        },
      });
    } catch (err) {
      console.log("functionerror, ", err);
      Toast.show({
        type: "error",
        text1: "An Error occuered. Please try again later",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = () => {};

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.formSection}>
        {/* Input Phone Number */}
        <View style={{ flexDirection: "row", marginVertical: 4 }}>
          {/* Country Code */}
          <TouchableOpacity style={styles.countryCodeContainer}>
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
          </TouchableOpacity>

          {/* Phone Number */}
          <ThemedInput
            style={styles.inputPhone}
            onChangeText={setPhone}
            value={phone}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholder="Your Phone Number"
          ></ThemedInput>
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
            disabled={loading} // Disable button when loading
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
    display: "flex",
    flexDirection: "row",
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
    marginHorizontal: 5,
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
