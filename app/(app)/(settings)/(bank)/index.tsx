import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { ThemedView, ThemedText, ParallaxScrollView } from "@/components";

import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ThemedFA6 } from "@/components/ThemedFA6";
import { confirm } from "@/components/base/confirm";

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
  // const [selectedBank, setSelectedBank] = useState(null);

  const LOGOUT_MUTATION = gql`
    mutation {
      logout {
        status
        message
      }
    }
  `;

  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  const deleteImage = async (selectedBank:string) => {
    // Set loading state to true
    setLoading(true);

    // Show confirmation dialog
    const confirmed = await confirm(
      "Do you want to proceed with deleting the image?"
    );

    if (confirmed) {
      try {
        // Call your GraphQL API to delete the image
        // await deleteImageMutation({ variables: { imageId } }); // Pass appropriate variables

        console.log("Image deleted successfully!");
      } catch (err) {
        console.log("Error deleting image: ", err);
      }
    } else {
      console.log("User cancelled the deletion.");
    }
    // Set loading state to false after API call is done or cancelled
    setLoading(false);
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
                  <TouchableOpacity onPress={deleteImage}>
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
