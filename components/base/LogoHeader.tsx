

  
  import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, View } from 'react-native';

export default function LogoHeader() {
    return (
        <View style={styles.row}>
            <Text style={styles.heading}>81 PAY</Text>
            <Text style={styles.heading}>81 PAY</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
    //   flexDirection: 'row',
      alignItems: 'center',
      fontWeight: '500',
      fontSize: 18
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
  