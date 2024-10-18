import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Link, router, useLocalSearchParams, useRouter } from "expo-router";

import { useEffect, useState } from "react";

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
import {
  BottomSheetComponent,
  ParallaxScrollView,
  ThemedText,
  ThemedView,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import ThemedRow from "@/components/base/RowBar";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { ThemedLink } from "@/components/ThemedLink";
import { GQL_Query } from "@/constants";
import { useBottomSheet } from "@/hooks/useBottomSheet";
import { addQnAData } from "../../../redux/actions/withdraw";
import useWithdrawalRequest from '@/hooks/useWithdrawal';
// TouchableOpacity

const dummyQuestions = [
  { id: 1, question: "What was the name of your first pet?" },
  { id: 2, question: "What is your favorite book?" },
  { id: 3, question: "In what city were you born?" },
  { id: 4, question: "What was the name of your elementary school?" },
  { id: 5, question: "What is your favorite movie?" },
  { id: 6, question: "What was your childhood nickname?" },
  { id: 7, question: "What is the name of your best friend?" },
  { id: 8, question: "What was the make of your first car?" },
  { id: 9, question: "What was the name of the street you grew up on?" },
  { id: 10, question: "What is your mother’s maiden name?" },
];


export default function QnAWithdraw() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleWithdrawalRequest, loading:request_loading } = useWithdrawalRequest();


  // const [questions, setQuestions] = useState([]);

  const {
    pin,
    accNo,
    bank,
    name,
    amount,
    branch,
    selectedAccount,
    allowPin,
    allowQnA,
    allowBiometrics,
    biometricsStatus,
    biometricsValue,
    QnA,
  } = useLocalSearchParams();
  const questions = JSON.parse(QnA); // Parse the string back into an object

  // useEffect(() => {
  //   if (QnA) {
  //     setQuestions(JSON.parse(QnA));
  //   }
  // },[QnA])

  const [loading, setLoading] = useState(false);


  // const withdrawData = useSelector((state) => state.withdraw);

  // console.log('iniwithdrawdataqna', withdrawData);


  const [qnaData, setQnaData] = useState(
    (questions || []).map((q) => ({
      question: q.question, // Extract only the question text if needed
      answer: "",
    }))
  );

  const handleInputChange = (index, value) => {
    const newData = [...qnaData];
    newData[index].answer = value; // Update the answer at the specific index
    setQnaData(newData);
  };

  const userData = useSelector((state) => state.user.user);

  const handleQnASubmit = async () => {
    const qna = qnaData.map((qna) => ({
      question: qna.question, // Keep the question
      answer: qna.answer,     // Keep the corresponding answer
    }));

    const payload = {
      qna : qna
    }
    dispatch(addQnAData(payload))
    
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
    
    // var params = {
    //   pin,
    //   accNo,
    //   bank,
    //   name,
    //   amount,
    //   branch,
    //   selectedAccount,
    //   allowPin,
    //   allowBiometrics,
    //   biometricsStatus,
    //   biometricsValue,
    //   allowQnA,
    //   QnA : JSON.stringify(qna),  // Push both questions and answers as an array of objects
    // };

    // // console.log(params)

    // router.navigate({
    //   pathname: "/withdraw",
    //   params: params,
    // });
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
            <ThemedView style={styles.header}>
              <ThemedText style={styles.title}>Security</ThemedText>
            </ThemedView>
            <ThemedView style={styles.sectionHeader}>
              <ThemedText style={styles.subTitle}>Questions</ThemedText>
              {/* <ThemedText style={styles.subCaption}>To protect your account, it is recommended to turn on at least one 2FA</ThemedText> */}
              <ThemedText style={styles.subCaption}>
                To protect your account, please answer below questions to help
                us verify its you
              </ThemedText>
            </ThemedView>
            {/* <ThemedView style={{ paddingHorizontal: 15 }}>
              <View style={{ flexDirection: "row", marginVertical: 4 }}>
                <TouchableOpacity
                  style={{ width: "100%", padding: 10, borderBottomWidth: 1 }}
                  onPress={() => {
                    handleExpand_q1();
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText style={{}}>{question1}</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", marginVertical: 4 }}>
                <ThemedInput
                  style={styles.inputPhone}
                  onChangeText={setAnswer1}
                  value={answer1}
                  autoCapitalize="none"
                  placeholder="Answer 1"
                  secureTextEntry={true}
                ></ThemedInput>
              </View>

              <View style={{ flexDirection: "row", marginVertical: 4 }}>
                <TouchableOpacity
                  style={{ width: "100%", padding: 10, borderBottomWidth: 1 }}
                  onPress={() => {
                    handleExpand_q1();
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText style={{}}>{question2}</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", marginVertical: 4 }}>
                <ThemedInput
                  style={styles.inputPhone}
                  onChangeText={setAnswer2}
                  value={answer2}
                  autoCapitalize="none"
                  placeholder="Answer 2"
                  secureTextEntry={true}
                ></ThemedInput>
              </View>

              <View style={{ flexDirection: "row", marginVertical: 4 }}>
                <TouchableOpacity
                  style={{ width: "100%", padding: 10, borderBottomWidth: 1 }}
                  onPress={() => {
                    handleExpand_q1();
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <ThemedText style={{}}>{question3}</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", marginVertical: 4 }}>
                <ThemedInput
                  style={styles.inputPhone}
                  onChangeText={setAnswer3}
                  value={answer3}
                  autoCapitalize="none"
                  placeholder="Answer 3"
                  secureTextEntry={true}
                ></ThemedInput>
              </View>
            </ThemedView> */}

            <ThemedView style={{ paddingHorizontal: 15 }}>
              {qnaData.map((qna, index) => (
                <View key={index} style={{ marginVertical: 8 }}>
                  {/* Display the question */}
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      padding: 10,
                      borderBottomWidth: 1,
                      marginBottom: 4,
                    }}
                    onPress={() => {
                      // Handle question expansion (optional)
                    }}
                  >
                    <ThemedText>{qna.question}</ThemedText>
                  </TouchableOpacity>

                  {/* Answer Input */}
                  <ThemedInput
                    style={styles.inputPhone}
                    onChangeText={(value) => handleInputChange(index, value)}
                    value={qna.answer}
                    autoCapitalize="none"
                    placeholder={`Answer ${index + 1}`}
                  />
                </View>
              ))}
            </ThemedView>

            <ThemedView style={styles.action}>
              <ThemedButton
                title="Next"
                onPress={handleQnASubmit}
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
    borderBottomWidth: 1,
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
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    paddingTop: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  subCaption: {
    fontSize: 11,
    fontWeight: "500",
    color: "#b5b5b5",
    letterSpacing: 0.005,
    marginBottom: 6,
  },
  sectionHeader: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 2,
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
    // borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  option: {
    width: 100,
    paddingTop: 5,
    textAlign: "center",
    borderColor: "#e5e5e5",
    borderTopWidth: 1,
    borderBottomWidth: 1,
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
