import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
} from "react-native";
import { ThemedView, ThemedText, ParallaxScrollView } from "@/components";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { confirm } from "@/components/base/confirm";
import Toast from "react-native-toast-message";
import { router, useFocusEffect } from "expo-router";

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      >
        <ThemedView style={[styles.section]}>
          <ScrollView style={{ display: "flex", flexDirection: "column" }}>
            {withdrawList.map(
              ({ id, amount, created_at, status, bankAccount }, index) => {
                const date = new Date(created_at);

                // Extracting the desired parts using local timezone
                const options = {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false, // Use 24-hour format
                };

                // Convert the date to a locale string based on the user's settings
                const localDateString = date.toLocaleString(undefined, options);
                const [day, month, year, time] =
                  localDateString.split(/[\s,]+/); // Split the string into parts

                const formattedAmount = amount.toLocaleString("en-US");
                return (
                  <ThemedView
                    key={id}
                    style={{
                      display: "flex",
                      // gap: 10,
                      //   margin: 5,
                      //   marginHorizontal: 13,
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      borderRadius: 3,
                      // backgroundColor: "skyblue",
                      borderBottomWidth: 1,
                      borderColor: color,
                    }}
                  >
                    <ThemedView
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        // justifyContent: "space-between",

                        //   backgroundColor: "skyblue",
                      }}
                    >
                      <ThemedView
                        style={{ paddingHorizontal: 15, alignItems: "center" }}
                      >
                        <ThemedText style={{ fontWeight: 500, fontSize: 32 }}>
                          {day}
                        </ThemedText>
                        <ThemedText
                          style={{
                            fontWeight: 300,
                            fontSize: 24,
                            paddingTop: 5,
                          }}
                        >
                          {month}
                        </ThemedText>
                        <ThemedText>{year}</ThemedText>
                        {/* <ThemedText>{`${hours}:${minutes}`}</ThemedText> */}
                        <ThemedText>{time}</ThemedText>
                      </ThemedView>
                      <ThemedView style={{ paddingLeft: 20, flex: 1 }}>
                        <ThemedText>{id}</ThemedText>
                        <ThemedText style={{ textAlign: "left" }}>
                          {bankAccount.account_name}
                        </ThemedText>
                        <ThemedText style={{ textAlign: "left" }}>
                          MYR. {formattedAmount}
                        </ThemedText>
                        <ThemedText
                          style={{
                            textAlign: "left",
                            textTransform: "uppercase",
                            color:
                              status === "success"
                                ? "green"
                                : status === "failed"
                                ? "red"
                                : status === "pending"
                                ? "orange"
                                : "black",
                          }}
                        >
                          {status}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                  </ThemedView>
                );
              }
            )}
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
