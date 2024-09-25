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
} from "react-native";
import {
  ThemedButton,
  ThemedView,
  ThemedText,
  Collapsible,
  ExternalLink,
  ParallaxScrollView,
} from "@/components";

import { RowBar } from "@/components/base/RowBar";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "@/redux/actions/auth";
import Toast from "react-native-toast-message";
import { FontAwesome6 } from "@expo/vector-icons";
// import { View } from "react-native-reanimated/lib/typescript/Animated";

const PROFILE_SECTIONS = [
  {
    header: "Account",
    items: [
      { id: "profile", icon: "user", label: "Profile", type: "link", link:'/(settings)/profile/profile'  },
      {
        id: "logout",
        icon: "arrow-right-from-bracket",
        label: "Logout",
        type: "logout",
      },
    ],
  },
];

export default function TabTwoScreen() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

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
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    //   headerImage={
    //     <Ionicons size={310} name="code-slash" style={styles.headerImage} />
    //   }
    // >
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Explore</ThemedText>
    //   </ThemedView>
    //   <ThemedButton
    //     title="Logout"
    //     onPress={logout}
    //     loading={loading}
    //     disabled={loading} // Disable button when loadingent style when disabled
    //   ></ThemedButton>
    //   <RowBar>
    //     <ThemedText>
    //       This app includes example code to help you get started.
    //     </ThemedText>
    //   </RowBar>
    //   <ThemedText>
    //     This app includes example code to help you get started.
    //   </ThemedText>

    // </ParallaxScrollView>
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Ionicons size={310} name="code-slash" style={styles.headerImage} />
        }
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Profile</ThemedText>
        </ThemedView>
        {PROFILE_SECTIONS.map(({ header, items }) => (
          <ThemedView style={styles.section} key={header}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>{header}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.sectionBody}>
              {items.map(({ label, id, type, icon, link }, index) => (
                <ThemedView
                  style={[
                    styles.rowWrapper,
                    index === 0 && { borderTopWidth: 0 },
                  ]}
                  key={id}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if(type == 'link' && link){
                        router.push(link);
                      }else if(type == 'logout'){
                        logout();
                      }
                    }}
                  >
                    <ThemedView style={styles.row}>
                      <FontAwesome6
                        name={icon}
                        size={20}
                        style={{ marginRight: 32 }}
                      />
                      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
                      <ThemedView style={styles.rowSpacer} />
                      {/* {
                          type === 'select' && (
                            <ThemedText style={styles.rowValue}>
                              {
                                form[id]
                              }
                            </ThemedText>
                          )
                        } */}
                      {["select", "link"].includes(type) && (
                        <FontAwesome6
                          name={"chevron-right"}
                          size={20}
                          color="#ababab"
                        />
                      )}
                    </ThemedView>
                  </TouchableOpacity>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        ))}
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
  // container: {
  //   paddingVertical: 24,
  //   paddingHorizontal: 0,
  //   flexGrow: 1,
  //   flexShrink: 1,
  //   flexBasis: 0,
  // },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  /** Header */
  sectionHeader: {
    paddingHorizontal: 24,
    paddingBottom: 12,
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
  /** Profile */
  profile: {
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#090909",
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "400",
    color: "#848484",
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: '#007bff',
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  /** Section */
  section: {
    paddingTop: 24,
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
