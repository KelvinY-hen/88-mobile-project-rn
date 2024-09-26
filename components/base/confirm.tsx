import { View, Text, Alert } from 'react-native'
import React from 'react'


export const confirm = (message:string, yesString:string = 'Yes', noString:string = 'No') =>
    new Promise((resolve) =>
      Alert.alert("Confirmation", message, [
        { text: noString, onPress: () => resolve(false) },
        { text: yesString, onPress: () => resolve(true), style: "default" }, // 'style' can be used to highlight the button
      ])
);