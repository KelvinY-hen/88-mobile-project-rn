import {
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Alert,
    useColorScheme,
    Text,
  } from "react-native";
  import { ThemedView, ThemedText, ParallaxScrollView } from "@/components";
  
  import { gql, useMutation, useQuery } from "@apollo/client";
  import { useCallback, useEffect, useState } from "react";
  import { useDispatch } from "react-redux";
  import { ThemedFA6 } from "@/components/ThemedFA6";
  import { confirm } from "@/components/base/confirm";
  import Toast from "react-native-toast-message";
  import { router, useFocusEffect } from "expo-router";
import QRCodeGenerator from "@/components/base/qr";
  
  export default function bankAccount() {
    const dispatch = useDispatch();
    const [userBankList, setUserBankList] = useState([]);
    const [withdrawList, setWithdrawList] = useState([]);
  
    const GET_WITHDRAW_REQUEST = gql`
      query {
        allWithdrawRequests {
          success
          message
          data {
            ... on WithdrawRequest {
              id
              user_id
              bank_account_id
              amount
              status
              created_at
              updated_at
              bankAccount {
                id
                bank_account
                account_name
                branch_name
                is_primary
                bank {
                  id
                  name
                  country_code
                }
              }
            }
          }
          errors {
            code
            message
          }
        }
      }
    `;
  
    const {
      loading: withdraw_loading,
      data: withdraw_data,
      error: withdraw_error,
      refetch: withdraw_refetch,
    } = useQuery(GET_WITHDRAW_REQUEST);
  
    if (withdraw_data) {
      console.log(withdraw_data);
    }
  
    useEffect(() => {
      // Refetch data when the component mounts or when the page is navigated to
      withdraw_refetch();
    }, []); // Empty dependency array to run on mount
  
    useFocusEffect(
      useCallback(() => {
        // Refetch data when the screen is focused
        withdraw_refetch();
        console.log("bank refetch");
  
        // Optional: If you need to do something on unmounting the focus
        return () => {};
      }, [withdraw_refetch]) // Dependency array to ensure stable reference
    );
  
    useEffect(() => {
      let temp = withdraw_data?.allWithdrawRequests?.data;
      if (temp) {
        setWithdrawList(temp); // Set bank data only when it changes
      }
    }, [withdraw_data]);
  
    const colorScheme = useColorScheme();
    const color = colorScheme == "dark" ? "#FFFFFF" : "#b5b5b5"; // Corrected color code
    const bankAccount = "8888";

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        >
          <QRCodeGenerator code={bankAccount}/>
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
      // paddingTop: 13,
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
  