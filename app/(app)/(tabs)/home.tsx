import {
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  View,
  Text,
  Pressable,
} from "react-native";

import { HelloWave, ParallaxScrollView, ThemedText, ThemedView} from "@/components"

import { Ionicons, FontAwesome6, AntDesign } from "@expo/vector-icons";

import middleMenuData from '../../../constants/MiddleMenu.json'
import { useRouter } from "expo-router";


export default function HomeScreen() {
  const router = useRouter();

  const handleMiddleMenu = (route) => {
    router.push(route); // Programmatically navigate to the (app) route
  }
  return (
    <View style={styles.outlineContainer}>
      <View style={styles.topContainer}>
        <View style={styles.imageContainer}>
          <Ionicons
            size={40}
            style={[{ marginBottom: -3 }]}
            name="scan"
          />
          <Text style={styles.topText}>Scan Code</Text>
        </View>
        <View style={styles.imageContainer}>
          <Ionicons
            size={40}
            style={[{ marginBottom: -3 }]}
            name="qr-code"
          />
          <Text style={styles.topText}>Receive Code</Text>
        </View>
      </View>

      <View style={styles.middleContainer}>
        {middleMenuData.map((item, index) => (
          <Pressable  key={index} style={styles.imageContainerMiddle}  onPress={()=>handleMiddleMenu(item.navigation)}>
              <FontAwesome6 name={item.icon} size={25} style={[{ marginBottom: -3 }]} />
              <ThemedText style={styles.middleText}>{item.name}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}


const screenWidth = Dimensions.get("window").width; // Get the screen width

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  topContainer: {
    backgroundColor: "#14437C",
    flexDirection: "row",
    borderRadius: 10,
  },
  middleContainer: {
    backgroundColor: "#19559E",
    flexDirection: "row",
    flexWrap: 'wrap',
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
  imageContainerMiddle: {
    flexBasis: '33.333%', // Adjust the basis to create more space
    alignItems: "center",
    paddingVertical: 15,
    borderWidth: 1, // Create thin lines between items
    borderColor: 'transparent', // Set the border to transparent
    borderBottomColor: '#14437C', // Set the color for bottom separation
    borderRightColor: '#14437C', // Set the color for right-side separation
  },
  topText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "500",
  },
  middleText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "500",
  },
  outlineContainer: {
    padding: 12,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
