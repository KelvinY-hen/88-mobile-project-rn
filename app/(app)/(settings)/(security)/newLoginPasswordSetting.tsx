import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Link, router } from "expo-router";

import { useState } from "react";

import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { GraphQLError } from "graphql";
import Toast from "react-native-toast-message";
import { ParallaxScrollView, ThemedText, ThemedView } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import ThemedRow from "@/components/base/RowBar";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { ThemedLink } from "@/components/ThemedLink";
// TouchableOpacity

export default function NewLoginPasswordSetting() {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.user.user);

  // const GET_USER_DATA = gql`
  //   query Query {
  //     me {
  //       id
  //       mobile_number
  //       agent_linked_code
  //     }
  //   }
  // `;

  // const { loading, data, error, refetch } = useQuery(GET_USER_DATA);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Ionicons size={310} name="code-slash" style={styles.headerImage} />
        }
      >
        <KeyboardAvoidingView behavior="padding" style={styles.formSection}>
          <ThemedView style={styles.bodyContainer}>
            <ThemedView style={styles.rowWrapper}>
              <ThemedText style={styles.rowHeader}>
                Set new password
              </ThemedText>
              <ThemedText style={styles.rowLabel}>
                Please set 6-11 numbers or letters
              </ThemedText>
            </ThemedView>
            <ThemedView style={[{ flexDirection: "row", marginVertical: 4 }]}>
            <ThemedInput
            style={styles.inputPhone}
            onChangeText={setPassword}
            value={password}
            autoCapitalize="none"
            placeholder="Your New Password"
            secureTextEntry={!showPassword}
          ></ThemedInput>
          <TouchableOpacity
            style={styles.eyeContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <ThemedFA6 name={showPassword ? "eye-slash" : "eye"} size={15} />
          </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.action}>
              <ThemedButton
                title="Enter"
                // onPress={signUp}
                disabled={loading} // Disable button when loading
                loading={loading}
              ></ThemedButton>
            </ThemedView>
          </ThemedView>
        </KeyboardAvoidingView>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: "#e5e5e5",
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  action: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 12,
  },
  bodyContainer: {
    // paddingHorizontal: 24,
  },
  outlineContainer: {
    padding: 50,
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: "absolute",
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
  inputPhone: {
    padding: 10,
    paddingHorizontal: 13,
    height: 40,
    flex: 1,
    borderColor: "#e5e5e5",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    textAlign:'center'
  },
  option: {
    width: 100,
    paddingTop: 5,
    textAlign: "center",
    borderColor: "#e5e5e5",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  rowHeader: {
    fontSize: 18,
    fontWeight: "500",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8B8B8B",
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
