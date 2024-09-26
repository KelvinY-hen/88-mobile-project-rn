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
import { useSelector } from "react-redux";
// TouchableOpacity

export default function updateUsername() {
  const [username, setUserName] = useState(useSelector((state) => state.auth.user.agent_linked_code));
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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.formSection}>
        {/* Input Password */}
        <View style={{ flexDirection: "row", marginVertical: 4 }}>
          <ThemedInput
            style={styles.inputPhone}
            onChangeText={setUserName}
            value={username}
            autoCapitalize="none"
            placeholder="Username"
          ></ThemedInput>
          <TouchableOpacity
            style={styles.eyeContainer}
            onPress={() => setUserName('')}
          >
            <ThemedFA6 name={"x"} size={15} />
          </TouchableOpacity>
        </View>


        <View style={styles.action}>
          <ThemedButton
            title="Update Username"
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
    paddingHorizontal: 0,
    flex: 1,
    justifyContent: "center",
  },
  formSection: {
    flex: 2,
    // justifyContent: "center",
  },
  inputPhone: {
    padding: 10,
    height: 40,
    flex: 1,
    borderBottomWidth: 1,
  },
  action: {
    marginTop: 20,
    paddingHorizontal:10
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
