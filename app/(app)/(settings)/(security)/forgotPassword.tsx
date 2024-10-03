import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import {
  ParallaxScrollView,
  ThemedText,
  ThemedView,
  ThemedButton,
  ThemedInput,
} from "@/components";
import { useSelector } from "react-redux";
import { useOTP } from "@/hooks/useOTP";
import { RootState } from "@/redux/store";
import { handleError } from "@/utils/handleError";

type Params = {
  type: string;
};
export default function Register() {
  const screenWidth = Dimensions.get("window").width;
  const [verificationCode, setVerificationCode] = useState<string>("");
  const { countdown, isCounting, requestOTP, showResendOptions } = useOTP();
  const [loading, setLoading] = useState<boolean>(false);
  const userData = useSelector((state: RootState) => state.user.user);
  const { type } = useLocalSearchParams();

  //** handle to activate request otp
  //**                                */
  const handleClickRequestOTP = async (deliveryType: string) => {
    await requestOTP(userData?.mobile_number, deliveryType);
  };

  //** handle to submit otp verification
  //**                                */
  const submit = async () => {
    setLoading(true);

    try {
      //** route based on parameter */
      if (type == "pin") {
        //* pin route
        router.replace("/paymentPasswordSetting");
      } else if (type == "password") {
        //* password route
        router.replace("/newLoginPasswordSetting");
      }
    } catch (error) {
      console.log(error)
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
              <ThemedText style={styles.rowHeader}>SMS Verification</ThemedText>
              <ThemedText style={styles.rowLabel}>
                account number: {userData.mobile_number}
              </ThemedText>
            </ThemedView>
            <ThemedView style={[{ flexDirection: "row", marginVertical: 4 }]}>
              <ThemedInput
                style={styles.inputPhone}
                onChangeText={setVerificationCode}
                value={verificationCode}
                autoCapitalize="none"
                placeholder="verification code"
              ></ThemedInput>
              {/* OTP Fuction */}
              {showResendOptions ? (
                <>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={
                      isCounting ? null : () => handleClickRequestOTP("sms")
                    }
                    disabled={isCounting}
                  >
                    <ThemedText
                      style={[styles.code, { width: screenWidth / 4 }]}
                    >
                      {isCounting ? ` ${countdown}s` : "SMS"}
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={
                      isCounting
                        ? null
                        : () => handleClickRequestOTP("whatsapp")
                    }
                    disabled={isCounting}
                  >
                    <ThemedText
                      style={[styles.code, { width: screenWidth / 4 }]}
                    >
                      {isCounting ? ` ${countdown}s` : "Whatsapp"}
                    </ThemedText>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.option}
                  onPress={
                    isCounting ? null : () => handleClickRequestOTP("sms")
                  }
                  disabled={isCounting}
                >
                  <ThemedText style={[styles.code, { width: screenWidth / 2 }]}>
                    {isCounting ? ` ${countdown}s` : "Get Code"}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
            <ThemedView style={styles.action}>
              <ThemedButton
                title="Next"
                onPress={submit}
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
  },
  option: {
    // textAlign: "center",
    justifyContent: "center",
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
