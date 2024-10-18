import { useMutation, useQuery } from "@apollo/client";

import { Link, router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

import Toast from "react-native-toast-message";
import {
  ParallaxScrollView,
  ThemedText,
  ThemedView,
  ThemedButton,
  ThemedInput,
  ThemedFA6,
  ThemedRow,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import BottomSheetComponent from "@/components/base/bottomSheet";
import PinPromptBottomSheet from "@/components/base/pinPromptBottomSheet";
import GqlQuery, {
  CREATE_WITHDRAW_REQUEST_MUTATION,
} from "@/constants/GqlQuery";
import { useMutationAPI } from "@/services/api";
import { GQL_Query } from "@/constants";
import { handleError } from "@/utils/handleError";
import { Route } from "expo-router/build/Route";
import { useRoute } from "@react-navigation/native";
import { handleWithdrawalRequest } from '@/services/withdrawal';
import useWithdrawalRequest from '@/hooks/useWithdrawal';

// TouchableOpacity

import {
  addWithdrawData,
  addWithdrawSecurityStep,
} from "@/redux/actions/withdraw";

const dummyQuestions = [
  { id: 1, question: "What was the name of your first pet?" },
  { id: 2, question: "What is your favorite book?" },
  { id: 3, question: "In what city were you born?" },
];

export default function Withdraw() {
  const dispatch = useDispatch();
  const { handleWithdrawalRequest } = useWithdrawalRequest();

  const [username, setUserName] = useState(
    useSelector((state) => state.user.user.agent_linked_code)
  );
  const { handleMutation: withdraw_mutation, loading: withdraw_loading } =
    useMutationAPI(GQL_Query.CREATE_WITHDRAW_REQUEST_MUTATION);

  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  const [userBankList, setUserBankList] = useState([]);

  const [bankList, setBankList] = useState([]);
  const [accNo, setAccNo] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [amount, setAmount] = useState();

  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const savedAccoutSheetRef = useRef(null);
  const bankSheetRef = useRef(null);
  const pinSheetRef = useRef(null);

  const [allowPin, setAllowPin] = useState(false);
  const [allowBiometrics, setAllowBiometrics] = useState(false);
  const [allowQnA, setAllowQnA] = useState(true);

  const [biometricsStatus, setBiometricsStatus] = useState(false);
  const [biometricsValue, setBiometricsValue] = useState("");

  const [qnaData, setQnaData] = useState([]);

  const {
    loading: bank_loading,
    data: bank_data,
    error,
    refetch,
  } = useQuery(GqlQuery.GET_ALL_BANKS);

  useEffect(() => {
    if (bank_data && bank_data.banks) {
      setBankList(bank_data.banks); // Set bank data only when it changes
    }
  }, [bank_data]);

  const {
    loading: user_bank_loading,
    data: user_bank_data,
    error: user_bank_error,
    refetch: user_bank_refetch,
  } = useQuery(GQL_Query.GET_USER_BANK);

  useEffect(() => {
    let userBankListTemp = user_bank_data?.userBanks?.data;
    if (userBankListTemp) {
      setUserBankList(userBankListTemp); // Set bank data only when it changes
    }
  }, [user_bank_data]);

  useEffect(() => {
    refetch();
    user_bank_refetch();

    
    let payload = {
      allowQnA,
      allowBiometrics,
      allowPin,
    };

    dispatch(addWithdrawSecurityStep(payload));

  }, []);

  // useEffect(() => {
  //   console.log(route.params);
  //   if (route.params) {
  //     // await handleWithdrawalRequest(withdrawData);
  //     if (Object.keys(route.params).length > 0) {
  //       const {
  //         pin: finalPin,
  //         accNo: finalAccNo,
  //         bank: finalBank,
  //         name: finalName,
  //         amount: finalAmount,
  //         branch: finalBranch,
  //         allowPin: finalAllowPin,
  //         allowBiometrics: finalBiometrics,
  //         biometricsStatus: finalBiometricsStatus,
  //         biometricsValue: finalBiometricsValue,
  //         allowQnA: finalAllowQnA,
  //         QnA: finalQNA,
  //       } = route.params;

  //       console.log(route.params);

  //       setAllowBiometrics(
  //         finalBiometrics === "true" || finalBiometrics === true
  //       );
  //       setAllowQnA(finalAllowQnA === "true" || finalAllowQnA === true);
  //       setAllowPin(finalAllowPin === "true" || finalAllowPin === true);

  //       setPin(finalPin);
  //       setAccNo(finalAccNo);
  //       setSelectedBank(finalBank);
  //       setName(finalName);
  //       setBranch(finalBranch);

  //       setAmount(finalAmount);

  //       setBiometricsStatus(finalBiometricsStatus);
  //       setBiometricsValue(finalBiometricsValue);

  //       setQnaData(JSON.parse(finalQNA));

  //       submitWithdrawalRequest();

  //       // setQuestions([{ question: qu/estion1, answer: answer1 }, { question: question2, answer: answer2 }]);
  //     }
  //   }
  // }, [route.params]);

  const resetPin = () => {
    setPin(["", "", "", "", "", ""]);
  };

  const withdrawHandler = async () => {
    // Validate account number
    // if (!accNo) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Account number is required",
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }

    // // Validate account name
    // if (!name) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Account name is required",
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }

    // // Validate bank selection
    // if (!selectedBank || !selectedBank?.id) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Bank selection is required",
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }

    // if (!branch) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Branch is required",
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }

    // // ** Amount Validation (>20)*/
    // // ** */
    // if ( !amount  || amount <= 0){
    //   Toast.show({
    //     type: "error",
    //     text1: "Amount is required",
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }
    // // ** */

    // Optional: Validate account number format (example for digits only)
    // const accountNoRegex = /^[0-9]{6,20}$/; // Example: 6-20 digits
    // if (!accountNoRegex.test(accNo)) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Invalid account number format",
    //     visibilityTime: 3000,
    //   });
    //   return;
    // }

    // const confirmed = await confirm("Do you want to proceed with request?");

    if (allowPin) {
      handlePinPresentPress();
    } else {
      // alert('not allow pin');
      submitPinHandler();
      // submitWithdrawalRequest();
    }
  };

  const submitPinHandler = () => {
    if (allowPin) {
      if (pin.join("").length != 6) {
        return;
      }

      handlePinDismissPress();
    }

    let payload = {
      pin,
      selectedAccount: selectedAccount,
      accNo,
      bank: selectedBank,
      name,
      amount,
      branch,
    };
    dispatch(addWithdrawData(payload));
    if (allowBiometrics) {
      router.push({
        pathname: "/bioMetrics",
        params: {
          pin,
          accNo,
          selectedAccount: JSON.stringify(selectedAccount),
          bank: JSON.stringify(selectedBank),
          name,
          amount,
          branch,
          allowQnA,
          allowBiometrics,
          allowPin,
          QnA: JSON.stringify(dummyQuestions), // Use JSON.stringify instead of JSON.encode
        },
      });
    } else if (allowQnA) {
      router.push({
        pathname: "/qna",
        params: {
          pin,
          accNo,
          selectedAccount: JSON.stringify(selectedAccount),
          bank: JSON.stringify(selectedBank),
          name,
          amount,
          branch,
          allowQnA,
          allowBiometrics,
          allowPin,
          QnA: JSON.stringify(dummyQuestions), // Use JSON.stringify instead of JSON.encode
        },
      });
    } else {
      // submitWithdrawalRequest();
       handleTest();
    }
  };

  const [createUserBankMutation] = useMutation(
    GQL_Query.CREATE_USER_BANK_MUTATION
  );

  const [createWithdrawRequestMutation] = useMutation(
    GQL_Query.CREATE_WITHDRAW_REQUEST_MUTATION
  );

  const submitWithdrawalRequest = async () => {
    setLoading(true);

    if (!selectedAccount) {
      var bankRegisterResult = null;
      // const result = await graphQL_registerBank({accNo, name, selectedBank, branch});
      try {
        await createUserBankMutation({
          variables: {
            bank_account: accNo,
            account_name: name,
            bank_id: selectedBank.id,
            branch_name: branch,
            is_primary: false,
          },
          onCompleted: (infoData) => {
            console.log(infoData);
            bankRegisterResult = {
              success: true,
              data: infoData,
              error: false,
            };
          },
          onError: ({ graphQLErrors, networkError }) => {
            console.log("tester erroer");
            if (graphQLErrors) {
              graphQLErrors.forEach(({ message, locations, path }) => {
                // alert("Registration failed. Please try again. /n" + message);
                console.log(message);
                Toast.show({
                  type: "error",
                  text1: "Bank Registration failed. Please try again later",
                  visibilityTime: 3000,
                });
                bankRegisterResult = {
                  success: false,
                  data: message,
                  error: "graphQL",
                };
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
              bankRegisterResult = {
                success: false,
                data: networkError,
                error: "network",
              };
            }
            // setLoading(false);
          },
        });
        // console.log("Bank Added successfully!");
      } catch (err) {
        console.log("functionerror, ", err);
        Toast.show({
          type: "error",
          text1: "An Error occuered. Please try again later",
          visibilityTime: 3000,
        });
        bankRegisterResult = { success: false, data: err, error: "function" };
      } finally {
      }

      if (
        bankRegisterResult.success &&
        bankRegisterResult?.data?.createUserBank.success
      ) {
        console.log("buat bank sukes juga dh", bankRegisterResult);

        setSelectedAccount(bankRegisterResult?.data?.createUserBank?.data);

        let variable = {
          bank_account_id: bankRegisterResult?.data?.createUserBank?.data?.id,
          amount: parseInt(amount), // Ensure the amount is a float
          pin: pin.join(""),
        };

        await withdrawAPI(variable);
      }
    } else {
      let variable = {
        bank_account_id: selectedAccount.id,
        amount: parseInt(amount), // Ensure the amount is a float
        pin: pin.join(""),
      };
      console.log("jalan bans no register", variable);

      await withdrawAPI(variable);
    }

    setLoading(false);
  };

  const withdrawAPI = async (variable) => {
    const result = await withdraw_mutation(variable);

    if (result.success) {
      let dataContainer = result.data.createWithdrawRequest;
      if (dataContainer.success) {
        console.log("withdraw success", dataContainer.data);
        Toast.show({
          type: "success",
          text1: "Withdwraw Request Successful",
          visibilityTime: 3000,
        });
        router.navigate("/(tabs)/home");
      } else {
        console.log("withdraw success", dataContainer.errors);
        Toast.show({
          type: "error",
          text1: dataContainer.errors[0].message,
          visibilityTime: 3000,
        });
      }
    } else {
      handleError(result.error, new Error("Outside of Scope"), {
        component: "Withdraw-API",
        errorType: result.error,
        errorMessage: result?.data?.[0]?.message ?? "",
      });
    }

    resetPin();
    await user_bank_refetch();
  };

  const handleExpandSavedAccount = () => {
    if (selectedAccount) {
      setSelectedAccount(null);
      setAccNo("");
      setName("");
      setBranch("");
      setSelectedBank(null);
      return;
    } else {
      savedAccoutSheetRef.current?.present();
    }
  };
  const handleExpandBank = () => {
    if (selectedAccount) {
      return;
    } else {
      bankSheetRef.current?.present();
    }
  };
  const handleDismissSavedAccount = () => savedAccoutSheetRef.current?.close();
  const handleDismissBank = () => bankSheetRef.current?.close();

  const handleSavedAccount = (item) => {
    setSelectedAccount(item); // or item.value

    setAccNo(item.bank_account);
    setName(item.account_name);
    setBranch(item.branch_name);

    let bankTemp = bankList.findIndex((bank) => bank.id == item.bank_id);

    console.log(bankTemp);
    setSelectedBank(bankList[bankTemp]);

    handleDismissSavedAccount();
  };

  const handleBankPress = (item) => {
    setSelectedBank(item); // or item.value
    handleDismissBank();
  };

  const handlePinPresentPress = () => {
    pinSheetRef.current?.present();
  };

  const handlePinDismissPress = () => {
    pinSheetRef.current?.dismiss();
  };

  const handlePinChange = (newPin: string) => {
    setPin(newPin); // Update pin state
  };

  const renderSavedAccount = (item) => (
    <TouchableOpacity
      style={{ alignItems: "left", padding: 10 }}
      onPress={() => handleSavedAccount(item)}
    >
      <Text style={{ fontSize: 18 }}>
        {item.account_name} (***{item.bank_account.slice(-3)})
      </Text>
    </TouchableOpacity>
  );

  const renderBankItem = (item) => (
    <TouchableOpacity
      style={{ alignItems: "left", padding: 10 }}
      onPress={() => handleBankPress(item)}
    >
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleTest = async () => {
    const result = handleWithdrawalRequest();

    if((await result).success){
      Toast.show({
          type: 'success',
          text1: 'Withdrawal Request Successful',
          visibilityTime: 3000,
        });
    }else{
      Toast.show({
        type: 'error',
        text1: (await result).message,
        visibilityTime: 3000,
      });
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.formSection}>
        {/* Input Password */}
        {/* <ThemedRow
          type="select"
          label="Currency"
          style={{borderBottomWidth:1}} 
          optional={selectedCountry?.label}
          handleFunction={handleExpandCountry}
        ></ThemedRow>
         */}
        <ThemedRow
          type="select"
          label="Saved Account"
          style={{ marginBottom: 15, borderBottomWidth: 1 }}
          handleFunction={handleExpandSavedAccount}
          customChevronIcon={selectedAccount ? "circle-xmark" : ""}
          // optional="Enter bank account"
        ></ThemedRow>
        <ThemedRow
          editable={selectedAccount ? false : true}
          type="input"
          label="Bank a/c"
          // style={{marginTop:15}}
          keyboardType="number-pad"
          inputValue={accNo}
          handleFunction={(text) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            setAccNo(numericValue);
          }}
          optional="Enter bank account"
        ></ThemedRow>
        <ThemedRow
          editable={selectedAccount ? false : true}
          type="input"
          label="Name"
          inputValue={name}
          handleFunction={setName}
          optional="Your Name"
        ></ThemedRow>
        <ThemedRow
          editable={selectedAccount ? false : true}
          type="select"
          label="Bank"
          optional="Please Select a Bank"
          optional={selectedBank?.name}
          handleFunction={handleExpandBank}
        ></ThemedRow>
        <ThemedRow
          editable={selectedAccount ? false : true}
          type="input"
          label="Branch"
          inputValue={branch}
          handleFunction={setBranch}
          optional="Account branch"
          style={{ borderBottomWidth: 1 }}
        ></ThemedRow>

        <View
          style={{
            marginTop: 25,
            justifyContent: "flex-end",
            paddingHorizontal: 10,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <ThemedText style={{ color: "#b5b5b5", fontSize: 13 }}>
            Available:
          </ThemedText>
          <ThemedText style={{ fontSize: 15, color: "#0051BA" }}>
            {" "}
            100
          </ThemedText>
        </View>
        <ThemedRow
          type="input"
          label="𝒫"
          keyboardType="number-pad"
          optional="Withdraw Amount"
          inputValue={amount}
          handleFunction={(text) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            setAmount(numericValue);
          }}
          style={{ marginBottom: 25, borderBottomWidth: 1 }}
        ></ThemedRow>

        <View style={styles.action}>
          <ThemedButton
            title="Submit request"
            onPress={withdrawHandler}
            disabled={loading} // Disable button when loading
            loading={loading}
          ></ThemedButton>
        </View>
        <View style={styles.action}>
          <ThemedButton
            title="Tet"
            onPress={handleTest}
            disabled={loading} // Disable button when loading
            loading={loading}
          ></ThemedButton>
        </View>
      </KeyboardAvoidingView>
      <BottomSheetComponent
        data={userBankList}
        bottomSheetRef={savedAccoutSheetRef}
        onDismiss={handleDismissSavedAccount}
        onItemPress={handleSavedAccount}
        renderCustomItem={renderSavedAccount}
        loading={user_bank_loading}
        title="Select a Preset"
        multiple={false}
        lock={false}
      />

      <BottomSheetComponent
        data={bankList}
        bottomSheetRef={bankSheetRef}
        onDismiss={handleDismissBank}
        onItemPress={handleBankPress}
        renderCustomItem={renderBankItem}
        loading={bank_loading}
        title="Select a Bank"
        multiple={false}
        lock={false}
      />
      <PinPromptBottomSheet
        bottomSheetRef={pinSheetRef}
        onDismiss={handlePinDismissPress}
        pin={pin} // Pass down the current pin state
        lock={false}
        loading={loading}
        // handleSubmission={submitWithdrawalRequest}
        handleSubmission={submitPinHandler}
        onChangePin={handlePinChange} // Callback to handle changes in the pin input
        title="Enter Your PIN"
      ></PinPromptBottomSheet>
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
    paddingHorizontal: 10,
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
