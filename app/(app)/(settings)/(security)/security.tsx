import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Link, router, useFocusEffect } from "expo-router";

import { useCallback, useEffect, useState } from "react";

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
import { ParallaxScrollView, ThemedFA6, ThemedText, ThemedView } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import ThemedRow from "@/components/base/RowBar";
import { getUserData } from "@/redux/actions/auth";
import { GQL_Query } from "@/constants";
// TouchableOpacity

export default function Register() {


  const { loading, data, error, refetch } = useQuery(GQL_Query.ME_QUERY);

  useEffect(() => {
    if (data) {
      console.log("test", data);
      dispatch(getUserData(data?.me));
    }
  }, [data]); // Empty dependency array to run on mount

  useFocusEffect(
    useCallback(() => {
      // Refetch data when the screen is focused
      try {
        refetch();
      } catch (error) {
        console.log(error);
      }
      console.log("user refetch");

      // Optional: If you need to do something on unmounting the focus
      return () => {};
    }, [refetch]) // Dependency array to ensure stable reference
  );


  const dispatch = useDispatch();
  const [paymentPasswordLink, setPaymentPasswordLink] = useState("");

  const userData = useSelector((state) => state.user.user); 

  useEffect(() => {
    if(userData){
      setPaymentPasswordLink(userData.has_pin ? '/reEnterPaymentPasswordSetting' : '/paymentPasswordSetting')
    }
  },[userData])


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
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>Account Security</ThemedText>
          </ThemedView> 
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={styles.subTitle}>Two-Factor Authetication (2FA)</ThemedText>
            {/* <ThemedText style={styles.subCaption}>To protect your account, it is recommended to turn on at least one 2FA</ThemedText> */}
            <ThemedText style={styles.subCaption}>To protect your account, below setting are needed</ThemedText>
          </ThemedView>
          <ThemedView style={styles.securityBox}>

            {/* Not available */}
            {/* <TouchableOpacity onPress={() => router.push('/gesturePasswordSetting')}>
              <ThemedView style={styles.lineBox}>
                <ThemedView style={styles.lineBoxName}>
                  <ThemedFA6 size={20}  name={'keycdn'}></ThemedFA6> <ThemedText style={styles.lineBoxText}>Passykeys (Biometrics)</ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => router.push('/questionAnswerSettingVerify')}>
              <ThemedView style={styles.lineBox}>
                <ThemedView style={styles.lineBoxName}>
                  <ThemedFA6 size={20}  name={'circle-question'}></ThemedFA6> <ThemedText style={styles.lineBoxText}>Security Question</ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push(paymentPasswordLink)}>
              <ThemedView style={styles.lineBox}>
                <ThemedView style={styles.lineBoxName}>
                  <ThemedFA6 size={20}  name={'unlock-keyhole'}></ThemedFA6> <ThemedText style={styles.lineBoxText}>PIN</ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/loginPasswordSetting')}>
              <ThemedView  iew style={styles.lineBox}>
                <ThemedView  style={styles.lineBoxName}>
                  <ThemedFA6 size={20}  name={'key'}></ThemedFA6> <ThemedText style={styles.lineBoxText}>Password</ThemedText>
                </ThemedView>
            </ThemedView>
            </TouchableOpacity>
          </ThemedView>

            {/* <ThemedRow
              type="link"
              label="Login Password Setting"
              // optional=""
              link="/loginPasswordSetting"
              ></ThemedRow>
            <ThemedRow
              type="link"
              label="Payment Password Setting"
              link={paymentPasswordLink}
              style={{borderWidth: 1}}
              ></ThemedRow> */}
            {/* <ThemedRow
              type="link"
              label="Question Answer Setting"
              link="/questionAnswerSettingVerify"
              style={{borderWidth: 1}}
              ></ThemedRow> */}
            {/* <ThemedRow
              type="link"
              label="Gesture Password Setting"
              link="/gesturePasswordSetting"
              style={{borderWidth: 1}}
              // optional=""
            ></ThemedRow> */}
            {/* <ThemedText>Id: {userData.agent_linked_code}</ThemedText>
            <ThemedText>Mobile Number: {userData.mobile_number}</ThemedText> */}
            {/* <ThemedButton
              title="Update Password"
              onPress={() => router.push('/(app)/(settings)/profile/updatePassword')}
              loading={loading}
              disabled={loading} // Dis
            /> */}
          </ThemedView>
        </KeyboardAvoidingView>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 2,
  },
  securityBox: {
    paddingHorizontal: 15,
    marginBottom: 24,
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    paddingTop: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  subCaption: {
    fontSize: 11,
    fontWeight: "500",
    color: "#b5b5b5",
    letterSpacing:0.005,
    marginBottom: 6,
  },
  lineBox:{
    display:'flex',
    paddingHorizontal:20,
    paddingVertical:20,
    marginVertical:7,
    borderWidth:1,
    borderRadius:10,
    flexDirection:'row',
  },
  lineBoxName:{
    display:'flex',
    flex:1,
    flexDirection:'row',
  },
  lineBoxText:{
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10, // Adjust space between image and input fields
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
  input: {
    marginVertical: 4,
    backgroundColor: '#ababab',
    padding: 10,
    height: 40,
    borderBottomWidth: 1,
  },
  inputPhone: {
    padding: 10,
    height: 40,
    flex: 1,
    borderBottomWidth: 1,
  },
  action: {
    marginTop: 20,
  },
  option: {
    display: "flex",
    flexDirection: "row",
  },
  link: {
    width: "33.333%",
    // textAlign:'center',
    marginTop: 5,
  },
  countryCodeContainer: {
    width: 100,
    height: 40,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginHorizontal: 5,
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
