import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
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

  const GET_USER_BANK = gql`
    query {
      userBanks {
        success
        message
        data {
          ... on UserBank {
            id
            bank_account
            account_name
            bank_id
            branch_name
            is_primary
            created_at
            updated_at
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
    loading: user_bank_loading,
    data: user_bank_data,
    error: user_bank_error,
    refetch: user_bank_refetch,
  } = useQuery(GET_USER_BANK);

  useEffect(() => {
      // Refetch data when the component mounts or when the page is navigated to
      user_bank_refetch();
  }, []); // Empty dependency array to run on mount

  useFocusEffect(
   useCallback(() => {
        // Refetch data when the screen is focused
        user_bank_refetch();
        console.log('bank refetch')

        // Optional: If you need to do something on unmounting the focus
        return () => {
            
        };
    }, [user_bank_refetch]) // Dependency array to ensure stable reference
);

  useEffect(() => {
    let userBankListTemp = user_bank_data?.userBanks?.data;
    if (userBankListTemp) {
      setUserBankList(userBankListTemp); // Set bank data only when it changes
    }
  }, [user_bank_data]);

  const DELETE_USER_BANK_MUTATION = gql`
    mutation DeleteUserBank($id: ID!) {
      deleteUserBank(id: $id) {
        success
        message
        errors {
          code
          message
        }
      }
    }
  `;

  const [deleteUserBankMutation] = useMutation(DELETE_USER_BANK_MUTATION);

  const deleteUserBank = async (bank_id: string) => {
    // Set loading state to true
    // setLoading(true);

    // Show confirmation dialog
    const confirmed = await confirm(
      "Do you want to proceed with deleting the bank?"
    );

    // const confirmed = true;

    if (confirmed) {
      try {
        console.log(bank_id);
        // Call your GraphQL API to delete the image
        await deleteUserBankMutation({
          variables: { 'id': bank_id },
          onCompleted: (infoData) => {
            console.log(infoData);
            Toast.show({
              type: "success",
              text1: "Delete Successfully",
              visibilityTime: 3000,
            });
            user_bank_refetch();
            router.navigate("/(app)/(bank)/bank");
          },
          onError: ({ graphQLErrors, networkError }) => {
            console.log("tester erroer");
            if (graphQLErrors) {
              graphQLErrors.forEach(({ message, locations, path }) => {
                // alert("Registration failed. Please try again. /n" + message);
                console.log(message);
                Toast.show({
                  type: "error",
                  text1: "Delete failed. Please try again later",
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
            // setLoading(false);
          },
        }); // Pass appropriate variables

        console.log("User Bank deleted successfully!");
      } catch (err) {
        console.log("Error deleting User Bank: ", err);
      }
    } else {
      console.log("User cancelled the deletion.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      >
        <ThemedView style={[styles.section]}>
          <ScrollView style={{ display: "flex", flexDirection: "column" }}>
            {userBankList.map(
              (
                { id, bank_account, account_name, bank_id, branch_name },
                index
              ) => (
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
                    <ThemedText>{account_name}</ThemedText>
                    <TouchableOpacity onPress={() => deleteUserBank(id)}>
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
                  <ThemedText style={{ textAlign: "left" }}>
                    {branch_name.charAt(0)}**
                  </ThemedText>
                  <ThemedText style={{ textAlign: "left" }}>
                    (last num{bank_account.slice(-3)}){/* {country} */}
                  </ThemedText>
                </ThemedView>
              )
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
