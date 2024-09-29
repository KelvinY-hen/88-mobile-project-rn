import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedInput } from './ThemedInput';
import { ThemedText } from './ThemedText';
import { useTheme } from 'react-native-paper';

const PinInputGrid = ({ pin, onChangePin }) => {
//   const [pin, setPin] = useState(['', '', '', '', '', '']);
  const inputRefs = Array(6).fill(0).map(() => useRef(null));
  const colorScheme = useColorScheme ();
  const color = colorScheme == 'dark' ? '#FFFFFF' : '#000000'; // Corrected color code


  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
        // Update the pin state at the current index
        const newPin = [...pin];
        newPin[index] = text;
        onChangePin(newPin);
  
        // Move to next input if current is filled and focus on the next input
        if (index < 5) {
          inputRefs[index + 1].current.focus();
        }
      } else if (text === '') {
        // Allow clearing the field
        const newPin = [...pin];
        newPin[index] = '';
        onChangePin(newPin);
  
        // Move to the previous input if backspace is pressed
        if (index > 0) {
          inputRefs[index - 1].current.focus();
        }
      }
  };

  return (
    <ThemedView style={styles.container}>
      {pin.map((digit, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          style={[styles.input, {color}]}
          maxLength={1} // Only allow 1 digit
          keyboardType="decimal-pad" // Numeric keyboard
          onChangeText={text => handleChange(text, index)} // Handle input change
          value={digit}
        />
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    width:'100%',
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 5,
  },
});

export default PinInputGrid;
