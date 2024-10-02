import { useState } from "react";
import { useMutationAPI } from "./api";
import { GQL_Query } from "../constants";
import { handleError } from "../utils/handleError";
import Toast from "react-native-toast-message";

export const getCode = () => {
  const [countdown, setCountdown] = useState(0);
  const [showResendOptions, setShowResendOptions] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const { handleMutation: requestOTP_mutation, loading: requestOTP_loading } =
    useMutationAPI(GQL_Query.REQUEST_OTP_MUTATION);

  const requestOTP = async (phoneNumber, deliveryType) => {
    setShowResendOptions(false);
    console.log(deliveryType);
    setCountdown(60); // 60 seconds countdown
    setIsCounting(true);

    Toast.show({
      type: "success",
      text1: "OTP Sent",
      visibilityTime: 3000,
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setIsCounting(false); // Stop the countdown when it reaches 0
          setShowResendOptions(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return;

    const variable = {
      phoneNumber: phoneNumber,
      delivery_type:deliveryType
    }

    const result = await requestOTP_mutation(variable);

    if (result.success) {
      let dataContainer = result.data.createWithdrawRequest;
      if (dataContainer.success) {
        Toast.show({
          type: "success",
          text1: "OTP Sent",
          visibilityTime: 3000,
        });
        router.navigate("/(tabs)/home");
      } else {
        Toast.show({
          type: "error",
          text1: dataContainer.errors[0].message,
          visibilityTime: 3000,
        });
      }
    } else {
      handleError(result.error, new Error("Outside of Scope"), {
        component: "Register-OTP-API",
        errorType: result.error,
        errorMessage: result?.data?.[0]?.message ?? "",
      });

      // if (result.error == "graphql") {
      //   console.log(result.data);
      //   Toast.show({
      //     type: "error",
      //     text1: "Withdrawal Request failed. Please try again later",
      //     visibilityTime: 3000,
      //   });
      // } else if (result.error == "network") {
      //   Toast.show({
      //     type: "error",
      //     text1: "Network error. Please try again later",
      //     visibilityTime: 3000,
      //   });
      // } else if (result.error == "function") {
      //   Toast.show({
      //     type: "error",
      //     text1: "An Error occuered. Please try again later",
      //     visibilityTime: 3000,
      //   });
      // }
    }
  };

  return {
    countdown,
    setCountdown,
    isCounting,
    setIsCounting,
    requestOTP_loading,
    requestOTP,
    setShowResendOptions,
    showResendOptions
  };

};
