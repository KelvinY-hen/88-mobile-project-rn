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
import PinInputGrid from "@/components/ThemedPinInput";
import { confirm } from "@/components/base/confirm";
import { GQL_Query } from "@/constants";
// TouchableOpacity

export default function Register() {
  const dispatch = useDispatch();
  const [pin, setPin] = useState(Array(6).fill("")); // State to hold the PIN input
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.user.user);


  const [setPinMutation] = useMutation(GQL_Query.SET_PIN_MUTATION);

  const setPinFunction = async () => {
    if( pin.join("").length != 6 ){
      return;
    }

    let home = userData.has_pin
    // Set loading state to true

    // setLoading(true);

    // Show confirmation dialog
    const confirmed = await confirm("Do you want to proceed with the PIN?");

    // const confirmed = true;

    if (confirmed) {
      try {
        const pinString = pin.join("");
        // Call your GraphQL API to delete the image
        await setPinMutation({
          variables: { pin: pinString },
          onCompleted: (infoData) => {
            console.log(infoData);
            Toast.show({
              type: "success",
              text1: "Pin Setup Successfully",
              visibilityTime: 3000,
            });
            if(home){
              router.navigate("/(app)/profile");
            }else{
              router.navigate("/home");
            }
          },
          onError: ({ graphQLErrors, networkError }) => {
            console.log("tester erroer");
            if (graphQLErrors) {
              graphQLErrors.forEach(({ message, locations, path }) => {
                // alert("Registration failed. Please try again. /n" + message);
                console.log(message);
                Toast.show({
                  type: "error",
                  text1: "Pin Setup failed. Please try again later",
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
        }); // Pass appropriate variables

        console.log("User Bank deleted successfully!");
      } catch (err) {
        console.log("Error deleting User Bank: ", err);
      }
    } else {
      console.log("User cancelled the deletion.");
    }
  };

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
                Reset payment PIN
              </ThemedText>
              <ThemedView
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText style={styles.rowLabel}>
                  please input a six-digit password
                </ThemedText>
                {/* <ThemedLink style={styles.rowOption} href={"/forgotPassword"}>
                  Forget?
                </ThemedLink> */}
              </ThemedView>
            </ThemedView>
            <ThemedView style={[{ flexDirection: "row", marginVertical: 4 }]}>
              <PinInputGrid pin={pin} onChangePin={setPin} />
            </ThemedView>
            <ThemedView style={styles.action}>
              <ThemedButton
                title="Enter"
                onPress={setPinFunction}
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
    borderBottomWidth: 1,
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
  },
  //   option: {
  //     width: 100,
  //     paddingTop: 5,
  //     textAlign: "center",
  //     borderColor: "#e5e5e5",
  //     borderTopWidth: 1,
  //     borderBottomWidth: 1,
  //   },
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
