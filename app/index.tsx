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
import { Link } from "expo-router";
import { images } from "../constants";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = () => {
    setLoading(true);
    try {
      alert("Check Your Emails!");
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const signIn = () => {};

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
        <TextInput
          style={styles.input}
          onChangeText={setPhone}
          value={phone}
          autoCapitalize="none"
          keyboardType="phone-pad"
          placeholder="Your Phone Number"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          autoCapitalize="none"
          placeholder="Your Password"
          secureTextEntry
        ></TextInput>
        <View style={styles.action}>
          <Button onPress={signIn} title="Log In" />
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
              push
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
    marginVertical: 4,
    // backgroundColor: "#fff",
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
    borderRadius: 4,
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
});
