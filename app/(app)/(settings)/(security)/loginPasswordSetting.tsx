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
import { useMutationAPI } from "@/services/api";
import { GQL_Query } from "@/constants";
import { current } from "@reduxjs/toolkit";
import { handleError } from "@/utils/handleError";
// TouchableOpacity

export default function loginPasswordSetting() {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.user.user);


  //** Reset Password Query*/
  const { handleMutation: change_password_mutation, loading: change_password_loading } =
    useMutationAPI(GQL_Query.CHANGE_PASSWORD_MUTATION);


  const checkPassword = async () => {
    if (!oldPassword) {
      Toast.show({
        type: "error",
        text1: "Old Password Required",
        visibilityTime: 3000,
      });
      return;
    }
    if (!newPassword) {
      Toast.show({
        type: "error",
        text1: "New Password Required",
        visibilityTime: 3000,
      });
      return;
    }
    if (!reNewPassword) {
      Toast.show({
        type: "error",
        text1: "Please Reenter the new password",
        visibilityTime: 3000,
      });
      return;
    }

    if (newPassword !== reNewPassword) {
      Toast.show({
        type: "error",
        text1: "New Passwords do not match",
        visibilityTime: 3000,
      });
      return;
    }


    let variables = {
      input: {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: reNewPassword,
      },
    };
    const result = await change_password_mutation(variables)
    if (result.success) {
      let dataContainer = result.data.updatePassword;
      console.log('updatepassword',dataContainer);
      if (dataContainer.status == "PASSWORD_UPDATED") {
        console.log("Register Sucesfull", dataContainer.data);
        Toast.show({
          type: "success",
          text1: "Password Updated Succesfully",
          visibilityTime: 3000,
        });
        router.navigate("/profile");
      } else {
        console.log("Register Failed", dataContainer?.errors);
        Toast.show({
          type: "error",
          text1: dataContainer?.errors?.[0]?.message ?? 'Password Failed to Update',
          text2: 'Check phone number, password and ensure the OTP is correct',
          visibilityTime: 3000,
        });
      }
    } else {
      handleError(result.error, new Error("Password API Error"), {
        component: "Password-API",
        errorType: result.error,
        errorMessage: result?.data?.[0]?.message ?? "",
      });
    }

  }

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
                Login password modification
              </ThemedText>
              <ThemedText style={styles.rowLabel}>
                account number: {userData.mobile_number}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[{ flexDirection: "row", marginTop: 4 }]}>
              <ThemedInput
                style={[styles.inputPhone, {borderTopWidth:1, borderBottomWidth:1}]}
                onChangeText={setOldPassword}
                value={oldPassword}
                autoCapitalize="none"
                placeholder="Your Old Password"
                secureTextEntry={!showPassword}
              ></ThemedInput>
              {/* <ThemedView style={styles.option}>
                <ThemedLink style={styles.code} href={"/forgotPassword?type=password"}>
                  Forget?
                </ThemedLink>
              </ThemedView> */}
            </ThemedView>
            <ThemedView style={[{ flexDirection: "row" }]}>
              <ThemedInput
                style={[styles.inputPhone, { borderBottomWidth:1}]}
                onChangeText={setNewPassword}
                value={newPassword}
                autoCapitalize="none"
                placeholder="Your New Password"
                secureTextEntry={!showPassword}
              ></ThemedInput>
            </ThemedView>
            <ThemedView style={[{ flexDirection: "row", marginBottom:4, }]}>
              <ThemedInput
                style={[styles.inputPhone, { borderBottomWidth:1}]}
                onChangeText={setReNewPassword}
                value={reNewPassword}
                autoCapitalize="none"
                placeholder="Reenter Your New Password"
                secureTextEntry={!showPassword}
              ></ThemedInput>
            </ThemedView>
            <ThemedView style={styles.action}>
              <ThemedButton
                title="Next"
                onPress={checkPassword}
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
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
  },
  option: {
    // textAlign: "center",
    justifyContent:"center",
    borderColor: "#e5e5e5",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  code: {
    width: 100,
    // paddingTop: 1,
    textAlign: "center",
    borderColor: "#e5e5e5",
    borderLeftWidth: 1,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
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
});
