import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

const copyToClipboard = async () => {
    await Clipboard.setStringAsync(userData.agent_linked_code);
    Toast.show({
      type: "info",
      text1: "Agent Code Copied to Clipboard!",
      visibilityTime: 3000,
    });
  };