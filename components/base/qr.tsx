import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = ({ code }) => {
    
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your QR Code:</Text>
      <QRCode
        value={code} // The data you want to encode as a QR code
        size={200}   // Size of the QR code
        color="black" // QR code color
        backgroundColor="white" // Background color of the QR code
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QRCodeGenerator;
