
import { useRef, useState } from "react";
import { TouchableOpacity } from "react-native";


export const useBottomSheet = () => {
  const sheetRef = useRef(null);

  const handleDismiss = () => sheetRef.current?.close();

  const handleExpand = () => sheetRef.current?.present();

  return {
    sheetRef,
    handleDismiss,
    handleExpand,
  };

};
