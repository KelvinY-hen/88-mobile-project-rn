import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Link, router } from "expo-router";

import { useState } from "react";

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
import { BottomSheetComponent, ParallaxScrollView, ThemedText, ThemedView } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import ThemedRow from "@/components/base/RowBar";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { ThemedLink } from "@/components/ThemedLink";
import { GQL_Query } from "@/constants";
import { useBottomSheet } from "@/hooks/useBottomSheet";
// TouchableOpacity

export default function loginPasswordSetting() {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.user.user);

  // const GET_USER_DATA = gql`
  //   query Query {
  //     me {
  //       id
  //       mobile_number
  //       agent_linked_code
  //     }
  //   }
  // `;

  // const { loading, data, error, refetch } = useQuery(GET_USER_DATA);

  const checkPassword = () => {
    try {
      router.push('/newLoginPasswordSetting')
    } catch (error) {
      console.log('functionerror, ',error);
      Toast.show({
        type: 'error',
        text1: 'An Error occuered. Please try again later',
        visibilityTime: 3000
      });
    }
  }

  //** Question and Answer */
  const {sheetRef: sheet_q1, handleDismiss: handleDismiss_q1, handleExpand: handleExpand_q1} = useBottomSheet();
  const {sheetRef: sheet_q2, handleDismiss: handleDismiss_q2, handleExpand: handleExpand_q2} = useBottomSheet();
  const {sheetRef: sheet_q3, handleDismiss: handleDismiss_q3, handleExpand: handleExpand_q3} = useBottomSheet();

  const {
    loading: loading_question,
    data: data_question,
    error: error_question,
    refetch: refetch_question,
  } = useQuery(GQL_Query.GET_ALL_BANKS);

  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  const handleQuestion1Press = (item) => {
    setQuestion1(item); // or item.value
    handleDismiss_q1();
  };
  const handleQuestion2Press = (item) => {
    setQuestion2(item); // or item.value
    handleDismiss_q1();
  };
  const handleQuestion3Press = (item) => {
    setQuestion3(item); // or item.value
    handleDismiss_q1();
  };

  const renderQuestionItem = (item) => (
    <TouchableOpacity
      style={{ alignItems: "left", padding: 10 }}
      onPress={() => handleQuestion1Press(item)}
    >
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  );
  const renderQuestion2Item = (item) => (
    <TouchableOpacity
      style={{ alignItems: "left", padding: 10 }}
      onPress={() => handleQuestion2Press(item)}
    >
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  );
  const renderQuestion3Item = (item) => (
    <TouchableOpacity
      style={{ alignItems: "left", padding: 10 }}
      onPress={() => handleQuestion3Press(item)}
    >
      <Text style={{ fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  );


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
                Question Answer Modification
              </ThemedText>
              <ThemedText style={styles.rowLabel}>
                Modify The Question and Answer for Verification
              </ThemedText>
            </ThemedView>

            {/* <ThemedView style={[{ flexDirection: "row", marginTop: 4 }]}>
              <ThemedInput
                style={styles.inputPhone}
                onChangeText={setQuestion}
                value={question}
                autoCapitalize="none"
                placeholder="Input Question"
                // secureTextEntry={!showPassword}
              ></ThemedInput>
            </ThemedView>
            <ThemedView style={[{ flexDirection: "row", marginBottom: 4,  }]}>
              <ThemedInput
                style={[styles.inputPhone, {borderBottomWidth:1}]}
                onChangeText={setAnswer}
                value={answer}
                autoCapitalize="none"
                placeholder="Input the Answer"
                // secureTextEntry={!showPassword}
              ></ThemedInput>
            </ThemedView> */}
            <ThemedView style={{paddingHorizontal:20}}>

            <View style={{ flexDirection: "row", marginVertical: 4 }}>
            <TouchableOpacity style={{width:'100%', padding:10, borderBottomWidth:1}} onPress={() => {handleExpand_q1()}}>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <ThemedText style={{}}>Question 1</ThemedText>
                    <ThemedFA6 name={"chevron-right"} size={20} style={{marginRight:3,}} color="#ababab" />
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
            <TouchableOpacity style={{width:'100%', padding:10, borderBottomWidth:1}} onPress={() => {handleExpand_q1()}}>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <ThemedText style={{}}>Question 2</ThemedText>
                    <ThemedFA6 name={"chevron-right"} size={20} style={{marginRight:3,}} color="#ababab" />
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
            <TouchableOpacity style={{width:'100%', padding:10, borderBottomWidth:1}} onPress={() => {handleExpand_q1()}}>
                <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <ThemedText style={{}}>Question 3</ThemedText>
                    <ThemedFA6 name={"chevron-right"} size={20} style={{marginRight:3,}} color="#ababab" />
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
            </ThemedView>


            <ThemedView style={styles.action}>
              <ThemedButton
                title="Next"
                onPress={checkPassword}
                disabled={loading} // Disable button when loading
                loading={loading}
              ></ThemedButton>
            </ThemedView>
          </ThemedView>
        </KeyboardAvoidingView>
        <BottomSheetComponent
        data={data_question}
        bottomSheetRef={sheet_q1}
        onDismiss={handleDismiss_q1}
        onItemPress={handleQuestion1Press}
        renderCustomItem={renderQuestionItem}
        loading={loading_question}
        title="Select a Question 1"
        multiple={false}
        lock={false}
      />
      <BottomSheetComponent
        data={data_question}
        bottomSheetRef={sheet_q2}
        onDismiss={handleDismiss_q2}
        onItemPress={handleQuestion2Press}
        renderCustomItem={renderQuestion2Item}
        loading={loading_question}
        title="Select a Question 2"
        multiple={false}
        lock={false}
      />
      <BottomSheetComponent
        data={data_question}
        bottomSheetRef={sheet_q3}
        onDismiss={handleDismiss_q3}
        onItemPress={handleQuestion3Press}
        renderCustomItem={renderQuestion3Item}
        loading={loading_question}
        title="Select a Question 3"
        multiple={false}
        lock={false}
      />
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
