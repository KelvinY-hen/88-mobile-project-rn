import {
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import {
  HelloWave,
  ParallaxScrollView,
  ThemedText,
  ThemedView,
} from "@/components";

import { Ionicons, FontAwesome6, AntDesign } from "@expo/vector-icons";

import middleMenuData from "../../../constants/MiddleMenu.json";
import { useFocusEffect, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { gql, useMutation, useQuery } from "@apollo/client";
import { getUserData, logoutSuccess } from "@/redux/actions/auth";
import Clipboard from "@react-native-clipboard/clipboard";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state: RootState) => state.auth.Token);
  const userData = useSelector((state) => state.user.user);

  const handleMiddleMenu = (route) => {
    router.push(route); // Programmatically navigate to the (app) route
  };

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
    // setLoading(true);
    try {
      logoutMutation({
        onCompleted: (infoData: Object) => {
          console.log(infoData);
          // setLoading(false);
          Toast.show({
            type: "success",
            text1: "Logged Out, Please Relogin",
            visibilityTime: 3000,
          });
        },
        onError: ({ graphQLErrors, networkError }) => {
          if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
              // alert("Registration failed. Please try again. /n" + message);
              console.log(message);
              Toast.show({
                type: "error",
                text1: "Logged Out with Error",
                visibilityTime: 3000,
              });
            });
          }
          if (networkError) {
            console.log(networkError);
            // console.log(message);
            Toast.show({
              type: "error",
              text1: "Logged Out with Network Error",
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
      // setLoading(false);
      dispatch(logoutSuccess());
      router.dismissAll();
    }
  };

  const GET_USER_DATA = gql`
    query Query {
      me {
        id
        mobile_number
        agent_linked_code
        balance
        has_pin
      }
    }
  `;
  const { loading, data, error, refetch } = useQuery(GET_USER_DATA);

  // useEffect(() => {
  //   try {
  //     refetch();
  //   } catch (error) {
  //     logout();
  //   }
  // }, []); // Empty dependency array to run on mount

  useEffect(() => {
    if (data) {
      console.log("test", data);
      dispatch(getUserData(data?.me));
    }
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      // Refetch data when the screen is focused
      try {
        refetch();
      } catch (error) {
        logout();
      }
      console.log("user refetch");

      // Optional: If you need to do something on unmounting the focus
      return () => {};
    }, [refetch])
  );

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      console.log("refetch");
      await refetch();
    } catch (err) {
      console.log("Error during refetch: ", err);
    } finally {
      setRefreshing(false);
    }
  };

  // if(error){
  //   logout();
  // }

  const notifyNotAvailable = () => {
    Toast.show({
      type: "info",
      text1: "Function is Currently Not Available 🙇🏽",
      visibilityTime: 3000,
    });
  };

  const copyToClipboard = () => {
    Clipboard.setString(userData.agent_linked_code); // Copy to clipboard
    Toast.show({
      type: "info",
      text1: "Agent Code Copied to Clipboard!",
      visibilityTime: 3000,
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      style={styles.outlineContainer}
      allowRefresh={true}
      handleReloadFuction={refetch}
    >
      {/* <View style={styles.topContainer}>
        <View style={styles.imageContainer}>
          <Ionicons size={40} style={[{ marginBottom: -3 }]} name="scan" />
          <Text style={styles.topText}>Scan Code</Text>
        </View>
        <View style={styles.imageContainer}>
          <Ionicons size={40} style={[{ marginBottom: -3 }]} name="qr-code" />
          <Text style={styles.topText}>Receive Code</Text>
        </View>
      </View> */}
      <ThemedView>
        <View style={styles.header}>
          <View style={styles.balanceContainer}>
            <Text style={styles.currencyText}>RM</Text>
            <Text style={styles.balanceText}>
              {showBalance ? userData?.balance : "****"}
            </Text>
            <TouchableOpacity
              style={{ paddingTop: 6 }}
              onPress={() => setShowBalance(!showBalance)}
            >
              <ThemedFA6
                style={styles.eyeIcon}
                name={showBalance ? "eye" : "eye-slash"}
                size={24}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              // gap: 5,
              alignItems:'center',
              marginTop: 10,
            }}
          >
            <ThemedFA6
              name={"fingerprint"}
              style={{ color: "#ffffff" }}
              size={12}
            />{" "}
            <Text style={{ fontSize: 15, color: "#ffffff" }}>
              {" "}
              {userData.agent_linked_code}
            </Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <ThemedFA6 name={"copy"} style={{ color: "#ffffff", marginLeft:10 }} size={15} />{" "}
            </TouchableOpacity>
          </View>
        </View>
        <ThemedView style={styles.headerPadding}></ThemedView>
        {/* <View style={styles.topMenuStyling}> */}
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.imageContainer2}
            onPress={() => notifyNotAvailable()}
          >
            <Ionicons size={30} style={[{ marginBottom: -3 }]} name="scan" />
            <Text style={styles.topText2}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageContainer2}
            onPress={() => {
              true ? router.push("/qr") : notifyNotAvailable();
            }}
          >
            <Ionicons size={30} style={[{ marginBottom: -3 }]} name="qr-code" />
            <Text style={styles.topText2}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageContainer2}
            onPress={() => {
              userData.has_pin
                ? router.push("/(app)/withdraw")
                : router.push("/(app)/(security)/paymentPasswordSetting");
            }}
          >
            <ThemedFA6
              size={30}
              style={[{ marginBottom: -3 }]}
              name="markdown"
            />
            <Text style={styles.topText2}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageContainer2}
            onPress={() => notifyNotAvailable()}
          >
            <ThemedFA6
              size={30}
              style={[{ marginBottom: -3 }]}
              name="money-bill-transfer"
            />
            <Text style={styles.topText2}>Transfer</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </ThemedView>

      <ThemedView style={styles.menuContainer}>
        {middleMenuData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.status == "maintenance") {
                notifyNotAvailable();
              } else {
                router.push(item.navigation);
              }
            }}
          >
            {/* <item.iconLib name={item.icon} size={30} color="blue" /> */}
            <ThemedFA6
              name={item.icon}
              size={25}
              style={[
                { marginBottom: -3 },
                // isMaintenance && styles.maintenanceIcon,
              ]}
            />
            <ThemedText style={styles.menuLabel}>{item.name}</ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* <View style={styles.middleContainer}>
        
        {middleMenuData.map((item, index) => {
          const isMaintenance = item.status === "maintenance";

          return (
            <Pressable
              key={index}
              style={[
                styles.imageContainerMiddle,
                // isMaintenance && styles.maintenanceContainer,
              ]}
              onPress={() => {
                if (!isMaintenance) {
                  handleMiddleMenu(item.navigation);
                }
              }}
              disabled={isMaintenance}
            >
              <ThemedFA6
                name={item.icon}
                size={25}
                style={[
                  { marginBottom: -3 },
                ]}
              />
              <ThemedText
                style={[
                  styles.middleText,
                ]}
              >
                {item.name}
              </ThemedText>

            </Pressable>
          );
        })}
      </View> */}
    </ParallaxScrollView>
  );
}

const screenWidth = Dimensions.get("window").width; // Get the screen width

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  maintenanceContainer: {
    backgroundColor: "#A52A2A", // Brown color for maintenance state
    opacity: 0.6, // Reduced opacity to indicate it is disabled
  },
  maintenanceIcon: {
    color: "#A52A2A", // Brown color for the icon
  },
  maintenanceText: {
    color: "#A52A2A", // Brown color for the text
  },
  diagonalStripe: {
    position: "absolute",
    width: "100%", // Width limited to the container
    height: 10, // Thickness of the stripe
    backgroundColor: "red", // Color of the stripe
    top: "50%", // Vertically center the stripe
    left: 0, // Start from the left edge
    transform: [{ rotate: "45deg" }], // Rotate to create the diagonal effect
    zIndex: 1, // Ensure the stripe stays above other elements
  },
  topContainer: {
    width: "93%",
    margin: -50,
    marginBottom: 15,
    justifyContent: "space-around",
    // width: "100%",
    alignSelf: "center",
    // backgroundColor: "#14437C",
    shadowColor: "#000", // Color of the shadow
    shadowOffset: {
      width: 0, // Horizontal offset
      height: 1, // Vertical offset
    },
    shadowOpacity: 0.1, // Transparency of the shadow
    elevation: 3, // For Android
    shadowRadius: 2, // Blur radius
    flexDirection: "row",
    borderRadius: 15,
    backgroundColor: "white",
  },
  middleContainer: {
    alignSelf: "center",
    width: "93%",
    backgroundColor: "#19559E",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    borderRadius: 10,
    padding: 10, // Add padding to avoid items sticking to the border
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "50%",
    paddingVertical: 15,
    alignItems: "center",
  },
  imageContainer2: {
    // width: "25%",
    paddingVertical: 15,
    alignItems: "center",
  },
  imageContainerMiddle: {
    flexBasis: "33%", // Adjust the basis to create more space
    alignItems: "center",
    paddingVertical: 15,
    borderWidth: 1, // Create thin lines between items
    borderColor: "transparent", // Set the border to transparent
    borderBottomColor: "#14437C", // Set the color for bottom separation
    borderRightColor: "#14437C", // Set the color for right-side separation
    position: "relative",
  },
  topText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "500",
  },
  topText2: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "200",
  },
  middleText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "500",
  },
  outlineContainer: {
    // padding: 12,
    flex: 1,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  header: {
    backgroundColor: "#0051BA", // Blue background
    // backgroundColor: "rgb(176, 198, 255)", // Blue background
    padding: 20,
    // borderBottomLeftRadius: 100,
    // borderBottomRightRadius: 100,
  },
  headerPadding: {
    padding: 30,
    height: 20,
    backgroundColor: "#0051BA", // Blue background
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    // justifyContent: 'space-between',
  },
  currencyText: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },
  balanceText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  eyeIcon: {
    marginLeft: 10,
    color: "white",
  },
  balanceDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  balanceDetailsText: {
    color: "white",
    marginRight: 5,
  },
  menuContainer: {
    alignSelf: "center",
    width: "93%",
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: 'space-between',

    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 3,
  },
  menuItem: {
    width: "25%", // Half width, adjust spacing accordingly
    // backgroundColor: 'white',
    paddingVertical: 8,
    // paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  menuLabel: {
    marginTop: 10,
    fontweight: 200,
    fontSize: 10,
    // color: 'black',
  },
});
