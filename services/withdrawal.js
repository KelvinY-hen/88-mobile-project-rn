import { Toast } from 'react-native-toast-message';
import { createUserBankMutation, withdraw_mutation } from '@/constants'; // Assuming you have these mutations defined

/**
 * External function to handle withdrawal requests
 *
 * @param {Object} withdrawData - Data from Redux state
 * @param {Object} additionalData - Additional data (e.g., allowPin, biometricsStatus, QnA)
 * @returns {Promise<void>}
 */

export const handleWithdrawalRequest = async (withdrawData) => {
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

  try {
    // If the selected account is not present, register a new bank account
    // if (!selectedAccount) {
    //   await createUserBankMutation({
    //     variables: {
    //       bank_account: accNo,
    //       account_name: accName,
    //       bank_id: bank.id,
    //       branch_name: branch,
    //       is_primary: false,
    //     },
    //     onCompleted: (infoData) => {
    //       console.log(infoData);
    //       bankRegisterResult = {
    //         success: true,
    //         data: infoData,
    //         error: false,
    //       };
    //     },
    //     onError: ({ graphQLErrors, networkError }) => {
    //       if (graphQLErrors) {
    //         graphQLErrors.forEach(({ message }) => {
    //           Toast.show({
    //             type: "error",
    //             text1: "Bank Registration failed. Please try again later",
    //             visibilityTime: 3000,
    //           });
    //           bankRegisterResult = {
    //             success: false,
    //             data: message,
    //             error: "graphQL",
    //           };
    //         });
    //       }
    //       if (networkError) {
    //         Toast.show({
    //           type: "error",
    //           text1: "Network error. Please try again later",
    //           visibilityTime: 3000,
    //         });
    //         bankRegisterResult = {
    //           success: false,
    //           data: networkError,
    //           error: "network",
    //         };
    //       }
    //     },
    //   });
    // }

    // If registration is successful or the account already exists, proceed with withdrawal
    // const bankAccountId = bankRegisterResult?.data?.createUserBank?.data?.id || selectedAccount?.id;
    const bankAccountId = 1; //STUB - testing
    if (bankAccountId) {
        let variable = {
            bank_account_id: bankAccountId,
            amount: parseInt(amount), // Ensure amount is a number
            pin: pin.join(""),
            allowPin: allowPin,
            allowBiometrics: allowBiometrics,
            biometricsStatus: biometricsStatus,
            biometricsValue: biometricsValue,
            allowQnA: allowQnA,
            QnA: QnA,
        }    

      await executeWithdrawal(variable);
    }
  } catch (err) {
    console.log("Error in handling withdrawal request: ", err);
    Toast.show({
      type: "error",
      text1: "An error occurred. Please try again later.",
      visibilityTime: 3000,
    });
  }
};

/**
 * Executes the withdrawal request
 *
 * @param {Object} variable - Variables for the withdrawal mutation
 * @returns {Promise<void>}
 */
const executeWithdrawal = async (variable) => {
  const result = await withdraw_mutation(variable);

  if (result.success) {
    let dataContainer = result.data.createWithdrawRequest;
    if (dataContainer.success) {
      console.log("Withdrawal successful", dataContainer.data);
      Toast.show({
        type: "success",
        text1: "Withdrawal Request Successful",
        visibilityTime: 3000,
      });
      // Navigate to home or any other page if needed
    } else {
      console.log("Withdrawal failed", dataContainer.errors);
      Toast.show({
        type: "error",
        text1: dataContainer.errors[0].message,
        visibilityTime: 3000,
      });
    }
  } else {
    handleError(result.error, new Error('Outside of Scope'), {
      component: 'Withdraw-API',
      errorType: result.error,
      errorMessage: result?.data?.[0]?.message ?? '',
    });
  }
};
