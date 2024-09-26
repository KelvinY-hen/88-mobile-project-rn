import { View, Text } from 'react-native'
import React from 'react'

export default function Radio() {
  return (
    <TouchableOpacity
    style={[styles.radioButton,
    { backgroundColor: selected ? '#007BFF' : '#FFF' }]}
    onPress={onSelect}
>
    <Text style={[styles.radioButtonText,
    { color: selected ? '#FFF' : '#000' }]}>
        {label}
    </Text>
</TouchableOpacity>
  )
}