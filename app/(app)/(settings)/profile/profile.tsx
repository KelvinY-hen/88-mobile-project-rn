import { ThemedButton } from "@/components/ThemedButton";
import { ThemedInput } from "@/components/ThemedInput";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useQuery } from "@apollo/client";

import { Link, router } from "expo-router";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import { ParallaxScrollView, ThemedText, ThemedView } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import ThemedRow from "@/components/base/RowBar";

import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import BottomSheetComponent from "@/components/base/bottomSheet";
import CameraBottomSheet from "@/components/base/cameraBottomSheet";
import { updatePotrait } from "@/redux/actions/user";

// TouchableOpacity


export default function Register() {
  const dispatch = useDispatch();
  const [authenticatedStatus, setAuthenticatedStatus] = useState(false);
  const bottomSheetRef = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [image, setImage] = useState<string | null>(null);

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

  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.canceled) {
  //     setImage(result.assets[0].uri);
  //   }
  // };

  const handleImage = (image) => {
     dispatch(updatePotrait(image.uri));
    setImage(image)
  }

  useEffect(()=>{
    console.log('duar memek', userData)
  },[userData])

  const handlePresentPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleDismissPress = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const handleItemPress = (item) => {
    setSelectedCountry(item.label);
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
            <ThemedRow
              type="potrait"
              label="Potrait"
              handleFunction={handlePresentPress}
              optional={userData.potrait}
            ></ThemedRow>
            <ThemedRow
              type="link"
              label="Nick Name"
              optional={userData.agent_linked_code}
              link="/(app)/(settings)/profile/updateUsername"
            ></ThemedRow>
            <ThemedRow
              type="link"
              label="Authentication"
              optional={authenticatedStatus ? "Certified" : "Uncertified"}
              link="/(app)/(settings)/profile/authentication"
            ></ThemedRow>
          </ThemedView>
        </KeyboardAvoidingView>
      </ParallaxScrollView>
      <CameraBottomSheet
        handleImage={handleImage}
        handlePresentPress={handlePresentPress}
        handleDismissPress={handleDismissPress}
        bottomSheetRef={bottomSheetRef}
      />
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
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 6,
    paddingTop: 10,
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
    backgroundColor: "#ababab",
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
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  contentContainer: {
    backgroundColor: "white",
  },
});
