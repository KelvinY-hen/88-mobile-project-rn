import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6 } from "@expo/vector-icons";
import { gql, useMutation } from "@apollo/client";
import { images } from "../../../../constants";


import { Link, router } from "expo-router";

import { useCallback, useRef, useState } from "react";

import {
  ActivityIndicator,
  Button,
  Image,
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
import { useDispatch, useSelector } from "react-redux";
import ThemedRow from "@/components/base/RowBar";
import BottomSheetComponent from "@/components/base/bottomSheet";
import CameraBottomSheet from "@/components/base/cameraBottomSheet";
import { updatePotrait } from "@/redux/actions/user";
// TouchableOpacity
const GENDER_RADIO = [
  { id: 1, label: "Male", value: "m" },
  { id: 2, label: "Female", value: "f" },
];

type DOC_TYPE_TYPE = {
  id:string;
  label:string;
  value:string;
}

const DOC_TYPE_SELECT = [
  { id: 1, label: "ID Card", value: "1" },
  { id: 2, label: "Passport", value: "2" },
];

export default function updateUsername() {
  const dispatch = useDispatch();

  const [username, setUserName] = useState(
    useSelector((state) => state.user.user.agent_linked_code)
  );
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("m");
  const [docType, setDocType] = useState(DOC_TYPE_SELECT[0]);
  const bottomSheetRef = useRef(null);


  const docTypeSheetRef = useRef(null);
  const handlePresentDocType = () => docTypeSheetRef.current?.present();
  const handleDismissDocType = () => docTypeSheetRef.current?.close();

  const handleDocTypePress = (item:DOC_TYPE_TYPE) => {
    setDocType(item); // or item.value
    handleDismissDocType();
  };

  const renderDocTypeItem = (item:DOC_TYPE_TYPE) => (
    <TouchableOpacity
      style={{ alignItems: "center", padding:10 }}
      onPress={() => handleDocTypePress(item)}
    >
      <Text style={{ fontSize: 18 }}>{item.label}</Text>
    </TouchableOpacity>
  );


  const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        token
        status
      }
    }
  `;

  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const signUp = async () => {
    setLoading(true);
    try {
    } catch (err) {
      console.log("functionerror, ", err);
      Toast.show({
        type: "error",
        text1: "An Error occuered. Please try again later",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };


  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleItemPress = (item) => {
    // setSelectedCountry(item.label);
    bottomSheetRef.current?.dismiss();
  };

  const renderCustomItem = (item) => (
    <TouchableOpacity
      style={{ alignItems: "center", padding:10 }}
      onPress={() => handleItemPress(item)}
    >
      <Text style={{ fontSize: 18 }}>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleImage = (image) => {
    console.log(image);
 }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      style={styles.container}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.formSection}>
        {/* Input Password */}
        <ThemedRow type="input" label="Name" optional="your name"></ThemedRow>
        <ThemedRow
          type="radio"
          label="Gender"
          data={GENDER_RADIO}
          stateValue={gender}
          handleFunction={setGender}
          //   optional=""
        ></ThemedRow>
        <ThemedRow
          type="select"
          label="Document Type"
          optional={docType?.label}
          handleFunction={handlePresentDocType}
        ></ThemedRow>
        <ThemedRow
          type="input"
          label="ID Number"
          optional="Your ID Number"
        ></ThemedRow>

        {/* <View style={{ flexDirection: "row", marginVertical: 4 }}>
          <ThemedInput
            style={styles.inputPhone}
            onChangeText={setUserName}
            value={username}
            autoCapitalize="none"
            // placeholder="Username"
          ></ThemedInput>
        </View> */}
        <ThemedView style={{display:'flex',flexDirection:'row', paddingHorizontal: 15, paddingVertical:10, borderTopWidth:1, borderBottomWidth:1, borderColor: '#e5e5e5', justifyContent:'space-between'}}>
          <ThemedView>
            <ThemedText style={{fontSize:16, fontWeight: "500",}}>
              ID Photo
            </ThemedText>
            <ThemedText style={{fontSize:14}}>
              Upload your ID photo
            </ThemedText>
          </ThemedView>
          <TouchableOpacity onPress={ handlePresentPress}>
            <Image
              source={images.dummyId} // Replace with your image path
              style={styles.dummyId}
            />
          </TouchableOpacity>
        </ThemedView>

        <View style={styles.action}>
          <ThemedButton
            title="Add more"
            onPress={signUp}
            disabled={loading} // Disable button when loading
            loading={loading}
          ></ThemedButton>

          <ThemedButton
            title="Submit"
            onPress={signUp}
            disabled={loading} // Disable button when loading
            loading={loading}
          ></ThemedButton>
        </View>
      </KeyboardAvoidingView>
      <BottomSheetComponent
        data={DOC_TYPE_SELECT}
        bottomSheetRef={docTypeSheetRef}
        onDismiss={handleDismissDocType}
        onItemPress={handleDocTypePress} 
        renderCustomItem={renderDocTypeItem} 
        title="Certificate Type Selection"
        multiple={false} 

        lock={false}
      />
      <CameraBottomSheet
        handleImage={handleImage}
        handlePresentPress={handlePresentPress}
        handleDismissPress={handleDismissPress}
        bottomSheetRef={bottomSheetRef}
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
    gap:10,
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
  dummyId: {
    width: 120, // Set the size of the image
    height: 120,
    resizeMode: "contain", // Ensures the image maintains aspect ratio
  },
});
