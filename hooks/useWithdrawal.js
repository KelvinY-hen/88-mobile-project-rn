import { useState } from "react";
import { useMutationAPI } from "@/services/api";
import { useMutation } from "@apollo/client";
import { GQL_Query } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { clearWithdrawData } from "@/redux/actions/withdraw";
// import Toast from 'react-native-toast-message';

const useWithdrawalRequest = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [createUserBankMutation] = useMutation(
    GQL_Query.CREATE_USER_BANK_MUTATION
  );

  const { handleMutation: withdraw_mutation, loading: withdraw_loading } =
    useMutationAPI(GQL_Query.CREATE_WITHDRAW_REQUEST_MUTATION);

  // Redux selector for getting withdrawal data
  const withdrawData = useSelector((state) => state.withdraw.withdraw);

  const handleWithdrawalRequest = async () => {
    setLoading(true);
    const {
      pin,
      accNo,
      selectedAccount,
      bank,
      accName,
      amount,
      branch,
      allowPin,
      allowBiometrics,
      biometricsStatus,
      biometricsValue,
      allowQnA,
      QnA,
    } = withdrawData;

    let bankRegisterResult = null;

    let success = false;
    let message = "API Error";

    try {
      // Register the bank if no account is selected
      //   if (!selectedAccount) {
      //     await createUserBankMutation({
      //       variables: {
      //         bank_account: accNo,
      //         account_name: accName,
      //         bank_id: bank.id,
      //         branch_name: branch,
      //         is_primary: false,
      //       },
      //       onCompleted: (infoData) => {
      //         bankRegisterResult = {
      //           success: true,
      //           data: infoData,
      //           error: false,
      //         };
      //       },
      //       onError: ({ graphQLErrors, networkError }) => {
      //         if (graphQLErrors) {
      //           graphQLErrors.forEach(({ message }) => {
      //             Toast.show({
      //               type: 'error',
      //               text1: 'Bank Registration failed. Please try again later',
      //               visibilityTime: 3000,
      //             });
      //             bankRegisterResult = {
      //               success: false,
      //               data: message,
      //               error: 'graphQL',
      //             };
      //           });
      //         }
      //         if (networkError) {
      //           Toast.show({
      //             type: 'error',
      //             text1: 'Network error. Please try again later',
      //             visibilityTime: 3000,
      //           });
      //           bankRegisterResult = {
      //             success: false,
      //             data: networkError,
      //             error: 'network',
      //           };
      //         }
      //       },
      //     });
      //   }

      // Proceed to withdraw if bank registration was successful or if the account already exists
      //   const bankAccountId = bankRegisterResult?.data?.createUserBank?.data?.id || selectedAccount?.id;
      const bankAccountId = 1;
      if (bankAccountId) {
        const variables = {
          bank_account_id: bankAccountId,
          amount: parseInt(amount), // Ensure amount is a number
          pin: pin.join(""),
          allowPin,
          allowBiometrics,
          biometricsStatus,
          biometricsValue,
          allowQnA,
          QnA,
        };
        console.log("var kita", variables);
        console.log("var kita2", withdrawData);

         dispatch(clearWithdrawData());

        // const result = await executeWithdrawal(variables);

        result = {
          success: true,
          message: "ok",
        };
        success = result.success;
        message = result.message;
      }
    } catch (err) {
      console.log("Error handling withdrawal request:", err);

      success = false;
      message = "error handling withdrawal request";
      Toast.show({
        type: "error",
        text1: "An error occurred. Please try again later.",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
    return {
      success,
      message,
    };
  };

  const executeWithdrawal = async (variables) => {
    const result = await withdraw_mutation(variables);
    let success = "error";
    let message = "Withdrawal failed Unknown";

    if (result.success) {
      const dataContainer = result.data.createWithdrawRequest;
      if (dataContainer.success) {
        // Toast.show({
        //   type: 'success',
        //   text1: 'Withdrawal Request Successful',
        //   visibilityTime: 3000,
        // });
        // Optionally navigate to another screen if needed

        success = true;
        message = "Withdrawal Request Successful";
      } else {
        // Toast.show({
        //   type: 'error',
        //   text1: dataContainer.errors[0].message,
        //   visibilityTime: 3000,
        // });

        success = false;
        message = dataContainer.errors[0].message;
      }
    } else {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Withdrawal failed. Please try again later.',
      //     visibilityTime: 3000,
      //   });

      success = false;
      message = "Withdrawal failed. Please try again later.";
    }

    return {
      success,
      message,
    };
  };

  return { handleWithdrawalRequest, loading: loading || withdraw_loading };
};

export default useWithdrawalRequest;
