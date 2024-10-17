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
  Dimensions,
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
import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, logoutSuccess } from "@/redux/actions/auth";
import Toast from "react-native-toast-message";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedFA6 } from "@/components/ThemedFA6";
import GqlQuery from "@/constants/GqlQuery";
import { GQL_Query } from "@/constants";
// import { View } from "react-native-reanimated/lib/typescript/Animated";

const PROFILE_SECTIONS = [
  {
    header: "Account",
    items: [
      // {
      //   id: "profile",
      //   icon: "user",
      //   label: "Profile",
      //   type: "link",
      //   link: "/(settings)/profile/profile",
      // },
      {
        id: "Bank",
        icon: "building-columns",
        label: "Bank",
        type: "link",
        link: "/(app)/(settings)/(bank)/bank",
      },
      {
        id: "acc_sec",
        icon: "shield-heart",
        label: "Account Security",
        type: "link",
        link: "/(settings)/(security)/security",
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
    id: "myr",
    label: "🇲🇾  MYR",
  },
  {
    id: "sgd",
    label: "🇸🇬  SGD",
  },
  {
    id: "thb",
    label: "🇹🇭  THB",
  },
  {
    id: "idr",
    label: "🇮🇩 IDR",
  },
  {
    id: "hkd",
    label: "🇭🇰  HKD",
  },
];

export default function TabTwoScreen() {
  const dispatch = useDispatch();
  const screenWidth = Dimensions.get("window").width;

  const userData = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const [logoutMutation] = useMutation(GQL_Query.LOGOUT_MUTATION);

  const {
    loading: user_data_loading,
    data,
    error,
    refetch,
  } = useQuery(GQL_Query.ME_QUERY);

  useEffect(() => {
    if (data) {
      console.log("test", data);
      dispatch(getUserData(data?.me));
    }
  }, [data]);

  // useFocusEffect(
  //   useCallback(() => {
  //     // Refetch data when the screen is focused
  //     try {
  //       refetch();
  //     } catch (error) {
  //       logout();
  //     }
  //     console.log("user refetch");

  //     // Optional: If you need to do something on unmounting the focus
  //     return () => {};
  //   }, [refetch])
  // );

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
              console.log(graphQLErrors);
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

          dispatch(logoutSuccess());
          router.dismissAll();
          router.replace("/");
        },
      });
    } catch (err) {
      console.log("functionerror, ", err);
      Toast.show({
        type: "error",
        text1: "An Error occuered. Please try again later",
        visibilityTime: 3000,
      });

      dispatch(logoutSuccess());
      router.dismissAll();
      router.replace("/");
    } finally {
      setLoading(false);
      // dispatch(logoutSuccess());
      // router.dismissAll();
      // router.replace('/');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        allowRefresh={true}
        handleReloadFuction={refetch}
      >
        {/* <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Profile</ThemedText>
        </ThemedView> */}

        <ThemedView style={[styles.section]}>
          <ThemedView
            style={{
              paddingTop:25,
              paddingBottom:25,
              backgroundColor: "#0051BA",
              display: "flex",
              flexDirection: "row",
              gap: 17,
              paddingVertical: 10,
              width: screenWidth,
              paddingHorizontal: 15,
            }}
          >
            <ThemedView
              style={{
                padding: 10,
                borderRadius: 100,
                backgroundColor: "rgb(217, 226, 255)",
                width: 80,
                height: 80,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <ThemedFA6
                name={"user"}
                size={28}
                style={{ alignSelf: "center" }}
              />
            </ThemedView>
            <View
              style={{
                gap: 10,
                flexWrap: "wrap",
                flex: 1,
                // width: "70%"
              }}
            >
              <ThemedText
                style={{
                  paddingHorizontal: 5,
                  fontSize: 13,
                  backgroundColor: "#ffffff",
                  alignSelf: "flex-start",
                  borderRadius: 3,
                }}
              >
                <ThemedFA6
                  name={"circle-xmark"}
                  size={13}
                  style={{ alignSelf: "center", marginRight: 3 }}
                />
                Uncertified
              </ThemedText>

              <ThemedText
                style={{
                  fontSize: 24,
                  fontWeight: "500",
                  alignSelf: "flex-start",
                  flexWrap: "wrap",
                  width: "100%", // Or you can use maxWidth: some value
                }}
              >
                {userData.agent_linked_code}
                <ThemedFA6
                  name={"pencil"}
                  size={15}
                  style={{ alignSelf: "center", marginLeft: 5 }}
                />
              </ThemedText>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // gap: 5,
                  alignItems: "center",
                }}
              >
                <ThemedFA6
                  name={"fingerprint"}
                  style={{ color: "#ffffff", paddingRight: 5 }}
                  size={15}
                />
                <Text style={{ fontSize: 15, color: "#ffffff" }}>
                  {userData.agent_linked_code}
                </Text>
                <TouchableOpacity
                // onPress={
                //   copyToClipboard
                //   }
                >
                  <ThemedFA6
                    name={"copy"}
                    style={{ color: "#ffffff", marginLeft: 10 }}
                    size={17}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
          {/* <ThemedView
            style={[
              styles.sectionHeader,
              {
                backgroundColor: "#0051BA",

                display: "flex",
                flexDirection: "row",
                gap: 10,
                paddingTop: 12,
              },
            ]}
          >
            <ThemedText style={styles.sectionTitle}>Balance</ThemedText>
            <TouchableOpacity
              style={{ paddingTop: 6 }}
              onPress={() => setShowBalance(!showBalance)}
            >
              <ThemedFA6 name={showBalance ? "eye" : "eye-slash"} size={13} />
            </TouchableOpacity>
          </ThemedView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: "#0051BA",
              display: "flex",
              flexDirection: "row",
              paddingBottom: 12,
            }}
          >
            {BANK_SECTIONS.map(({ id, label }, index) => {
              let balTemp = 0;
              if (index == 0) {
                balTemp = userData.balance;
              } else {
                balTemp = 0;
              }
              return (
                <ThemedView
                  key={id}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginHorizontal: 5,
                    marginVertical: 7,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    width: 170,
                    borderRadius: 3,
                    // backgroundColor: "skyblue",
                    marginLeft: index === 0 ? 15 : 5,
                    marginRight: index === BANK_SECTIONS.length - 1 ? 15 : 5,
                    shadowColor: "#000", // Color of the shadow
                    shadowOffset: {
                      width: 1, // Horizontal offset
                      height: 1, // Vertical offset
                    },
                    shadowOpacity: 0.2, // Transparency of the shadow
                    elevation: 3, // For Android
                    shadowRadius: 2,
                  }}
                >
                  <ThemedText style={{ fontWeight: 500 }}>{label}</ThemedText>
                  <ThemedText
                    style={{
                      textAlign: "right",
                      fontWeight: 300,
                      fontSize: 20,
                    }}
                  >
                    {showBalance ? balTemp : "****"}
                  </ThemedText>
                </ThemedView>
              );
            })}
          </ScrollView> */}
        </ThemedView>

        {PROFILE_SECTIONS.map(({ header, items }) => (
          <ThemedView style={[styles.section, { paddingTop: 12 }]} key={header}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>{header}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.sectionBody}>
              {items.map(({ label, id, type, icon, link }, index) => (
                <ThemedRow
                  key={id} // Unique key for each row
                  id={id} // Pass the id to ThemedRow
                  index={index} // The index of the row
                  type={type} // The type of row, e.g., 'link' or 'logout'
                  label={label} // The label for the row
                  icon={icon} // The icon for the row
                  link={link} // The link URL (only if type is 'link')
                  logout={type === "logout" ? logout : undefined} // Pass the logout function for 'logout' type
                />
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
    paddingHorizontal: 15,
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
    // paddingTop: 24,
    paddingBottom:5
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
