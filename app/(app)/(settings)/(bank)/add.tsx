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
import { GQL_Query } from "@/constants";
// TouchableOpacity

const countries = [
  { id: 0, label: "🇺🇸 United States", value: "US" },
  { id: 1, label: "🇨🇦 Canada", value: "CA" },
  { id: 2, label: "🇬🇧 United Kingdom", value: "UK" },
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

export default function updateUsername() {
  const [username, setUserName] = useState(
    useSelector((state) => state.user.user.agent_linked_code)
  );
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [selectedBank, setSelectedBank] = useState(null);

  const [bankList, setBankList] = useState([]);
  const [accNo, setAccNo] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [mainToggle, setMainToggle] = useState(false);

  const countrySheetRef = useRef(null);
  const bankSheetRef = useRef(null);


  const {
    loading: bank_loading,
    data: bank_data,
    error,
    refetch,
  } = useQuery(GQL_Query.GET_ALL_BANKS);

  useEffect(() => {
    if (bank_data && bank_data.banks) {
      setBankList(bank_data.banks); // Set bank data only when it changes
    }
  }, [bank_data]); // The effect will only run when `data` changes


  const [createUserBankMutation] = useMutation(GQL_Query.CREATE_USER_BANK_MUTATION);

    const addBank = async () => {

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

    if (!branch) {
      Toast.show({
        type: "error",
        text1: "Branch is required",
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    const confirmed = await confirm(
      "Do you want to proceed with adding the bank?"
    );

    // const confirmed = true;

    if (confirmed) {
      try {
        createUserBankMutation({
          variables: {
            bank_account: accNo,
            account_name: name,
            bank_id: selectedBank.id,
            branch_name: branch,
            is_primary: mainToggle,
          },
          onCompleted: (infoData) => {
              console.log(infoData);
              if (infoData.createUserBank.success) {
                  // Handle success
                  Toast.show({
                      type: "success",
                      text1: "Registered Successfully",
                      visibilityTime: 3000,
                  });
                  router.navigate("/(app)/(bank)/bank");
              } else {
                  // Handle case where success is false
                  console.error(infoData.createUserBank.message);
              }
          },        
          onError: ({ graphQLErrors, networkError }) => {
            console.log('tester erroer')
            if (graphQLErrors) {
              graphQLErrors.forEach(({ message, locations, path }) => {
                // alert("Registration failed. Please try again. /n" + message);
                console.log(message);
                Toast.show({
                  type: "error",
                  text1: "Registration failed. Please try again later",
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
        });
        // console.log("Bank Added successfully!");
      } catch (err) {
        console.log("functionerror, ", err);
        Toast.show({
          type: "error",
          text1: "An Error occuered. Please try again later",
          visibilityTime: 3000,
        });
      } finally {
      }
    } else { 
      console.log("Bank Cancelled to be add!");
    }
    setLoading(false);
  };

  const handleExpandCountry = () => countrySheetRef.current?.present();
  const handleExpandBank = () => bankSheetRef.current?.present();
  const handleDismissCountry = () => countrySheetRef.current?.close();
  const handleDismissBank = () => bankSheetRef.current?.close();

  const handleCountryPress = (item) => {
    setSelectedCountry(item); // or item.value
    handleDismissCountry();
  };

  const handleBankPress = (item) => {
    setSelectedBank(item); // or item.value
    handleDismissBank();
  };

  const renderCountryItem = (item) => (
    <TouchableOpacity
      style={{ alignItems: "center", padding: 10 }}
      onPress={() => handleCountryPress(item)}
    >
      <Text style={{ fontSize: 18 }}>{item.label}</Text>
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
          // editable={false}
          type="input"
          label="Bank a/c"
          keyboardType="phone-pad"
          // style={{marginTop:15}}
          inputValue={accNo}
          handleFunction={(text) => {const numericValue = text.replace(/[^0-9]/g, "");
            setAccNo(numericValue)}}
          optional="Enter bank account"
        ></ThemedRow>
        <ThemedRow
          // editable={selectedBank ? true : false}
          type="input"
          label="Name"
          inputValue={name}
          handleFunction={setName}
          optional="Your Name"
        ></ThemedRow>
        <ThemedRow
          // editable={selectedBank ? false : true}
          type="select"
          label="Bank"
          optional="Please Select a Bank"
          optional={selectedBank?.name}
          handleFunction={handleExpandBank}
        ></ThemedRow>
        <ThemedRow
          // editable={selectedBank ? true : false}
          type="input"
          label="Branch"
          inputValue={branch}
          handleFunction={setBranch}
          optional="Account branch"
          style={{ borderBottomWidth: 1 }}
        ></ThemedRow>

        <ThemedView
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            onPress={() => setMainToggle(!mainToggle)}
            status={mainToggle ? "checked" : "unchecked"}
          />
          <ThemedText>Main Account</ThemedText>
        </ThemedView>

        <View style={styles.action}>
          <ThemedButton
            title="Submit"
            onPress={addBank}
            disabled={loading} // Disable button when loading
            loading={loading}
          ></ThemedButton>
        </View>
      </KeyboardAvoidingView>
      <BottomSheetComponent
        data={countries}
        bottomSheetRef={countrySheetRef}
        onDismiss={handleDismissCountry}
        onItemPress={handleCountryPress}
        renderCustomItem={renderCountryItem}
        title="Select a Country"
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
