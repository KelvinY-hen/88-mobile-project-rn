import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6 } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";

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
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { GraphQLError } from "graphql";
import Toast from "react-native-toast-message";
import { ParallaxScrollView, ThemedText, ThemedView } from "@/components";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { useSelector } from "react-redux";
import ThemedRow from "@/components/base/RowBar";
import BottomSheetComponent from "@/components/base/bottomSheet";
import { confirm } from "@/components/base/confirm";
import { Checkbox } from "react-native-paper";
import PinPromptBottomSheet from "@/components/base/pinPromptBottomSheet";
import { CREATE_WITHDRAW_REQUEST_MUTATION } from "@/constants/GraphQLQuery";
import { useMutationAPI } from "../../../services/api"
// TouchableOpacity

const saved_account_data = [
  {
    id: 0,
    account_name: "🇺🇸 HLB",
    bank_account: "12345",
    bank_id: "asd",
    branch_name: "branch",
  },
  {
    id: 2,
    account_name: "🇺🇸 Maybank",
    bank_account: "12345",
    bank_id: "US",
    branch_name: "branch",
  },
  {
    id: 3,
    account_name: "🇺🇸 OCBC",
    bank_account: "12345",
    bank_id: "US",
    branch_name: "branch",
  },
];

const banks = [
  { id: 0, label: "Maybank", value: "maybank" },
  { id: 1, label: "CIMB Bank", value: "cimb" },
  { id: 2, label: "Public Bank", value: "public" },
  { id: 3, label: "RHB Bank", value: "rhb" },
  { id: 4, label: "Hong Leong Bank", value: "hong_leong" },
  { id: 5, label: "AmBank", value: "ambank" },
  { id: 6, label: "Bank Islam", value: "bank_islam" },
  { id: 7, label: "UOB Bank", value: "uob" },
  { id: 8, label: "HSBC Bank", value: "hsbc" },
];

export default function Withdraw() {
  const [username, setUserName] = useState(
    useSelector((state) => state.user.user.agent_linked_code)
  );
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  const [userBankList, setUserBankList] = useState([]);

  const [bankList, setBankList] = useState([]);
  const [accNo, setAccNo] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [amount, setAmount] = useState();
  const [save, toggleSave] = useState(false);

  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const savedAccoutSheetRef = useRef(null);
  const bankSheetRef = useRef(null);
  const pinSheetRef = useRef(null);

  const GET_ALL_BANKS = gql`
    query Query {
      banks {
        id
        name
      }
    }
  `;

  const GET_USER_BANK = gql`
    query {
      userBanks {
        success
        message
        data {
          ... on UserBank {
            id
            bank_account
            account_name
            bank_id
            branch_name
            is_primary
            created_at
            updated_at
          }
        }
        errors {
          code
          message
        }
      }
    }
  `;

  const {
    loading: bank_loading,
    data: bank_data,
    error,
    refetch,
  } = useQuery(GET_ALL_BANKS);

  const {
    loading: user_bank_loading,
    data: user_bank_data,
    error: user_bank_error,
    refetch: user_bank_refetch,
  } = useQuery(GET_USER_BANK);

  useEffect(() => {
    if (bank_data && bank_data.banks) {
      setBankList(bank_data.banks); // Set bank data only when it changes
    }
  }, [bank_data]);
  useEffect(() => {
    let userBankListTemp = user_bank_data?.userBanks?.data;
    if (userBankListTemp) {
      setUserBankList(userBankListTemp); // Set bank data only when it changes
    }
  }, [user_bank_data]);

  useEffect(() => {
    refetch();
    user_bank_refetch();
  }, []);

  const resetPin = () => {
    setPin(["", "", "", "", "", ""]);
  }

  const withdrawHandler = async () => {
    // Validate account number
    if (!accNo) {
      Toast.show({
        type: "error",
        text1: "Account number is required",
        visibilityTime: 3000,
      });
      return;
    }

    // Validate account name
    if (!name) {
      Toast.show({
        type: "error",
        text1: "Account name is required",
        visibilityTime: 3000,
      });
      return;
    }


    // Validate bank selection
    if (!selectedBank || !selectedBank?.id) {
      Toast.show({
        type: "error",
        text1: "Bank selection is required",
        visibilityTime: 3000,
      });
      return;
    }


    if (!branch) {
      Toast.show({
        type: "error",
        text1: "Branch is required",
        visibilityTime: 3000,
      });
      return;
    }

    if ( parseInt(amount) <  20 || !amount) {
      Toast.show({
        type: "error",
        text1: "Minimum Withdrawal is 20",
        visibilityTime: 3000,
      });
      return;
    }

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

    handlePinPresentPress();
    
  };


  const CREATE_USER_BANK_MUTATION = gql`
    mutation CreateUserBank(
      $bank_account: String!, 
      $account_name: String!, 
      $bank_id: ID!, 
      $branch_name: String!, 
      $is_primary: Boolean!
    ) {
      createUserBank(
        bank_account: $bank_account, 
        account_name: $account_name, 
        bank_id: $bank_id, 
        branch_name: $branch_name, 
        is_primary: $is_primary
      ) {
        success
        message
        data {
          ... on UserBank {
            id
            bank_account
            account_name
            bank_id
            branch_name
            is_primary
          }
        }
        errors {
          code
          message
        }
      }
    }
  `;


  const [createUserBankMutation] = useMutation(CREATE_USER_BANK_MUTATION);

  const [createWithdrawRequestMutation] = useMutation(CREATE_WITHDRAW_REQUEST_MUTATION);

  const submitWithdrawalRequest = async () => {

    if( pin.join("").length != 6 ){
      return;
    }


    handlePinDismissPress();
    setLoading(true);
    
    if(!selectedAccount){
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
                bankRegisterResult = { success: true, data: infoData, error: false };
            },        
            onError: ({ graphQLErrors, networkError }) => {
              console.log('tester erroer')
              if (graphQLErrors) {
                graphQLErrors.forEach(({ message, locations, path }) => {
                  // alert("Registration failed. Please try again. /n" + message);
                  console.log(message);
                  Toast.show({
                    type: "error",
                    text1: "Bank Registration failed. Please try again later",
                    visibilityTime: 3000,
                  });
                  bankRegisterResult = { success: false, data: message,  error: "graphQL" };
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
                bankRegisterResult = { success: false, data: networkError,error: "network" };
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
        
        if(bankRegisterResult.success && bankRegisterResult?.data?.createUserBank.success){
          console.log("buat bank sukes juga dh", bankRegisterResult);

          setSelectedAccount(bankRegisterResult?.data?.createUserBank?.data);

          let variable = {
            bank_account_id: bankRegisterResult?.data?.createUserBank?.data?.id,
            amount: parseInt(amount), // Ensure the amount is a float
            pin: pin.join(""),
          }

          await withdrawAPI(variable);
          
          // console.log("jalan bans register dlx", variable);

          // const result = await useMutationAPI(createWithdrawRequestMutation, variable)
    
    
          // console.log("jalan bans register dl2", result);
        }

    }else{

      let variable = {
        bank_account_id: selectedAccount.id,
        amount: parseInt(amount), // Ensure the amount is a float
        pin: pin.join(""),
      }
      console.log("jalan bans no register", variable);

      await withdrawAPI(variable);
      

    }
    
    
    setLoading(false)

    
    
  };

  const withdrawAPI = async (variable) => {

    const result = await useMutationAPI(createWithdrawRequestMutation, variable)

    if(result.success){
      let dataContainer = result.data.createWithdrawRequest;
      if(dataContainer.success){
        console.log("withdraw success", dataContainer.data);
        Toast.show({
          type: "success",
          text1: "Withdwraw Request Successful",
          visibilityTime: 3000,
        });
        router.navigate("/(tabs)/home");
      }else{
        console.log("withdraw success", dataContainer.errors);
        Toast.show({
          type: "error",
          text1: dataContainer.errors[0].message,
          visibilityTime: 3000,
        });
      }
    }else{
       if(result.error == 'graphql'){
        console.log(result.data)
        Toast.show({
          type: "error",
          text1: "Withdrawal Request failed. Please try again later",
          visibilityTime: 3000,
        });
      }else if(result.error == 'network'){
        Toast.show({
          type: "error",
          text1: "Network error. Please try again later",
          visibilityTime: 3000,
        });
      }else if(result.error == 'function'){
        Toast.show({
          type: "error",
          text1: "An Error occuered. Please try again later",
          visibilityTime: 3000,
        });
      }
    }
    console.log('hasil', result);

    resetPin();

    
  }

  const handleExpandSavedAccount = () => {
    if(selectedAccount){
      setSelectedAccount(null);
      setAccNo('');
      setName('');
      setBranch('');
      setSelectedBank(null)
      return;
    }else{
      savedAccoutSheetRef.current?.present()
    }
  };
  const handleExpandBank = () => {
    if(selectedAccount){
      return
    }else{
      bankSheetRef.current?.present()
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

        {/* <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            onPress={() => toggleSave(!save)}
            status={save ? "checked" : "unchecked"}
          />
          <ThemedText>Save Account</ThemedText>
        </ThemedView> */}

        <ThemedRow
          type="input"
          label="RM"
          keyboardType="number-pad"
          optional="Minimum 20"
          inputValue={amount}
          handleFunction={(text) => {
            const numericValue = text.replace(/[^0-9]/g, "");
            setAmount(numericValue);
          }}
          style={{ marginTop: 25, marginBottom: 25, borderBottomWidth: 1 }}
        ></ThemedRow>

        <View style={styles.action}>
          <ThemedButton
            title="Submit request"
            onPress={withdrawHandler}
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
        handleSubmission={submitWithdrawalRequest}
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
