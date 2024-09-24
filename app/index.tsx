import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Button,
  TouchableOpacity,
} from "react-native";

import { useState } from "react";
import { Link, router } from "expo-router";
import { images } from "../constants";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components";
import { ThemedButton } from "@/components/ThemedButton";
import { gql, useMutation } from "@apollo/client";

import { loginSuccess, toggleIsLoggedIn } from '../redux/actions/auth'; 


import { useDispatch } from "react-redux";

export default function LoginScreen() {
  const dispatch = useDispatch()

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const LOGIN_MUTATION = gql`
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        token
      }
    }
  `;

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const signIn = () => {
    setLoading(true);
    try {
      loginMutation({
        variables: {
          input: {
            mobile_number: phone,
            password: password,
          },
        },
        onCompleted: (infoData) => {
          console.log(infoData.login.token);
          // setLoading(false);
          dispatch(loginSuccess(infoData.login));
          router.replace('/(app)/(tabs)/home')
        },
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              console.log(graphQLErrors);
            });
          }
          if (networkError) console.log(networkError);
          // setLoading(false);
        },
      });
    } catch (err) {
      console.log(err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity>
          <Image
            source={images.logo} // Replace with your image path
            style={styles.logo}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Payment APP</Text>
      </View>
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
              <FontAwesome6
                name={"angle-down"}
                // size={25}
                style={[{ marginBottom: -3 }]}
              />
            </View>
          </TouchableOpacity>

          {/* Phone Number */}
          <ThemedInput
            style={styles.input}
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
            <FontAwesome6 name={showPassword ? "eye-slash" : "eye"} size={15} />
          </TouchableOpacity>
        </View>

        <View style={styles.action}>
          <ThemedButton
            title="Login"
            onPress={signIn}
            loading={loading}
            disabled={loading} // Disable button when loadingent style when disabled
          ></ThemedButton>
          <View style={styles.option}>
            <Link style={styles.link} push href="/">
              Forget?
            </Link>
            <Link
              style={[styles.link, { textAlign: "center" }]}
              push
              href="/(app)/(tabs)/home"
            >
              E-Rate
            </Link>
            <Link
              style={[styles.link, { textAlign: "right" }]}
              push={true}
              href="/(auth)/register"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
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
    paddingVertical: 20, // Adjust space between image and input fields
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
    // marginVertical: 4,
    // backgroundColor: "#fff",
    // color:'#00000',
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
});
