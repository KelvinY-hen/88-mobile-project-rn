import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Switch,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import {
  ThemedButton,
  ThemedView,
  ThemedText,
  Collapsible,
  ExternalLink,
  ParallaxScrollView,
} from "@/components";

import ThemedRow, { RowBar } from "@/components/base/RowBar";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/redux/actions/auth";
import Toast from "react-native-toast-message";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedFA6 } from "@/components/ThemedFA6";
// import { View } from "react-native-reanimated/lib/typescript/Animated";

const PROFILE_SECTIONS = [
  {
    header: "Account",
    items: [
      {
        id: "profile",
        icon: "user",
        label: "Profile",
        type: "link",
        link: "/(settings)/profile/profile",
      },
      {
        id: "Bank",
        icon: "building-columns",
        label: "Bank",
        type: "link",
        link: "/(settings)/bank",
      },
      {
        id: "acc_sec",
        icon: "shield-heart",
        label: "Account Security",
        type: "link",
        link: "/(settings)/bank",
      },
      {
        id: "logout",
        icon: "arrow-right-from-bracket",
        label: "Logout",
        type: "logout",
      },
    ],
  },
];

const BANK_SECTIONS = [
  {
    id: "c",
    label: "Hong Leong Bank",
    name: "d",
    acc: "111",
    country: "🇲🇾",
  },

  {
    id: "c2",
    label: "Hong Leong Bank",
    name: "m",
    acc: "231",
    country: "🇸🇬",
  },

  {
    id: "c3",
    label: "Hong Leong Bank",
    name: "t",
    acc: "777",
    country: "🇮🇩",
  },

  {
    id: "c4",
    label: "Hong Leong Bank",
    name: "a",
    acc: "231",
    country: "🇭🇰",
  },
];

export default function TabTwoScreen() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const LOGOUT_MUTATION = gql`
    mutation {
      logout {
        status
        message
      }
    }
  `;

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const logout = () => {
    setLoading(true);
    try {
      logoutMutation({
        onCompleted: (infoData: Object) => {
          console.log(infoData);
          // setLoading(false);
          Toast.show({
            type: "success",
            text1: "Logout Succesfully",
            visibilityTime: 3000,
          });
          dispatch(logoutSuccess());
          router.replace("/");
        },
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              // alert("Registration failed. Please try again. /n" + message);
              console.log(message);
              Toast.show({
                type: "error",
                text1: "Logout failed. Please try again later",
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
        },
      });
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      >
        <ThemedView style={[styles.section]}>
          <ScrollView style={{ display: "flex", flexDirection: "column" }}>
            {BANK_SECTIONS.map(({ id, label, name, acc, country }, index) => (
              <ThemedView
                key={id}
                style={{
                  display: "flex",
                  gap: 10,
                  margin: 5,
                  marginHorizontal: 13,
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  borderRadius: 3,
                  backgroundColor: "skyblue",
                }}
              >
                <ThemedView
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "skyblue",
                  }}
                >
                  <ThemedText>{label}</ThemedText>
                  <TouchableOpacity>
                    <ThemedFA6
                      name="trash-can"
                      size={20}
                      style={[
                        { marginBottom: -3, textAlign: "right" },
                        // isMaintenance && styles.maintenanceIcon,
                      ]}
                    ></ThemedFA6>
                  </TouchableOpacity>
                </ThemedView>
                <ThemedText style={{ textAlign: "left" }}>{name}**</ThemedText>
                <ThemedText style={{ textAlign: "left" }}>
                  (last num{acc}) {country}
                </ThemedText>
              </ThemedView>
            ))}
          </ScrollView>
        </ThemedView>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    marginBottom: 12,
  },
  outlineContainer: {
    padding: 50,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
    paddingTop: 10,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    marginTop: 6,
  },
  section: {
    paddingTop: 13,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a7a7a7",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: {
    // paddingLeft: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  /** Row */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 16,
    height: 50,
  },
  rowWrapper: {
    paddingLeft: 20,
    borderTopWidth: 1,
    borderColor: "#e3e3e3",
    backgroundColor: "#fff",
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: "500",
    color: "#8B8B8B",
    marginRight: 4,
  },
});
