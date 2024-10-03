import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

import { Link, router } from "expo-router";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Button,
  Dimensions,
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
import useMyLazyQuery from "@/hooks/useMyLazyQuery";
import { GQL_Query } from "@/constants";
import { useOTP } from "@/hooks/useOTP";
import { useMutationAPI } from "@/services/api";
import { handleError } from "@/utils/handleError";
// TouchableOpacity

export default function Register() {
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get("window").width;
  const [pin, setPin] = useState(Array(6).fill("")); // State to hold the PIN input
  const [newPin, setNewPin] = useState(Array(6).fill("")); // State to hold the PIN input
  const [loading, setLoading] = useState(false);
  const { countdown, isCounting, requestOTP, showResendOptions } = useOTP();

  const userData = useSelector((state) => state.user.user);

  // const [checkPinMutation] = useMutation(CHECK_PIN_MUTATION);

  const [checkPin, { data, loading: query_loading, error }] = useMyLazyQuery(
    GQL_Query.CHECK_PIN_QUERY,
    {
      variables: { pin: pin.join("") },
    }
  );

  // useEffect(() => {
  //   if (data) {
  //     let success = data.checkPin.success;
  //     if (success) {
  //       router.navigate("/(app)/(security)/paymentPasswordSetting");
  //     } else {
  //       Toast.show({
  //         type: "error",
  //         text1: "Wrong PIN. ",
  //         visibilityTime: 3000,
  //       });
  //     }
  //   }
  // }, [data]);

  //** Reset PIN with TAC Query */
  const { handleMutation: reset_pin_mutation, loading: reset_pin_loading } =
    useMutationAPI(GQL_Query.RESET_PIN_MUTATION);

  //** handle set pin when clicked */
  const setPinFunction = async () => {
    // ensure pin is properly inputted
    if (pin.join("").length != 6) {
      return;
    }

    if (newPin.join("").length != 6) {
      return;
    }

    let pinJoined = pin.join("");
    let newPinJoined = newPin.join("");

    setLoading(true);

    // if (pin.join("").length == 6) {
    //   await checkPin();
    //   console.log(data);
    // }

    const variables = {
      old_pin: pinJoined,
      new_pin: newPinJoined,
    };

    //call reset pin mutation
    const result = await reset_pin_mutation(variables);

    if (result.success) {
      let dataContainer = result.data.updatePin;
      console.log(dataContainer);
      if (dataContainer.success) {
        console.log("Reset PIN Succesfull", dataContainer.data);
        Toast.show({
          type: "success",
          text1: "Reset PIN Succesfully",
          visibilityTime: 3000,
        });
        router.navigate("/profile");
      } else {
        console.log("Reset PIN Failed", dataContainer?.errors);
        Toast.show({
          type: "error",
          text1: dataContainer?.errors[0]?.message,
          visibilityTime: 3000,
        });
      }
    } else {
      handleError(result.error, new Error("Outside of Scope"), {
        component: "Reset-PIN-API",
        errorType: result.error,
        errorMessage: result?.data?.[0]?.message ?? "",
      });
    }

    setLoading(false);
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
                Enter Current PIN
              </ThemedText>
              <ThemedView
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ThemedText style={styles.rowLabel}>
                  please enter your pin for verification
                </ThemedText>
                <ThemedLink
                  style={styles.rowOption}
                  href={"/(app)/(settings)/(security)/(forget)/pin"}
                >
                  Forget?
                </ThemedLink>
              </ThemedView>
            </ThemedView>
            <ThemedView
              style={{
                paddingVertical: 5,
                borderBottomWidth: 1,
                borderBottomColor: "#e5e5e5",
              }}
            >
              <ThemedText
                style={[
                  {
                    paddingVertical: 7,
                    marginHorizontal: 15,
                    fontSize: 18,
                    fontWeight: "500",
                  },
                ]}
              >
                Enter Your Old Pin:
              </ThemedText>
              <ThemedView style={[{ flexDirection: "row", marginVertical: 4 }]}>
                <PinInputGrid
                  style={{ paddingTop: 5 }}
                  pin={pin}
                  onChangePin={setPin}
                />
              </ThemedView>
            </ThemedView>
            <ThemedView
              style={{
                paddingVertical: 5,
                borderBottomWidth: 1,
                borderBottomColor: "#e5e5e5",
              }}
            >
              <ThemedText
                style={[
                  {
                    paddingVertical: 7,
                    marginHorizontal: 15,
                    fontSize: 18,
                    fontWeight: "500",
                  },
                ]}
              >
                Enter Your New Pin:
              </ThemedText>
              <ThemedView style={[{ flexDirection: "row", marginVertical: 4 }]}>
                <PinInputGrid
                  style={{ paddingTop: 5 }}
                  pin={newPin}
                  onChangePin={setNewPin}
                />
              </ThemedView>
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
  rowOption: {},
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
