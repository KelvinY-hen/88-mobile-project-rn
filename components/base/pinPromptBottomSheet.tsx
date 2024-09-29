import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import PinInputGrid from '../ThemedPinInput'; // Assuming PinInputGrid is in the same folder
import { ThemedButton } from '../ThemedButton';

const PinPromptBottomSheet = ({
  bottomSheetRef,
  onDismiss,
  pin,           // Pin state passed down from the parent
  onChangePin,   // Callback to handle pin change
  handleSubmission,
  lock = true,
  title = false, // Optional title for the bottom sheet
  loading
}) => {
  // Snap points for bottom sheet
  const snapPoints = useMemo(() => ['75%'], []);

  const handlerbmissionHandler = () => {
    console.log('baru')
    if( pin.join("").length != 6 ){
      return;
    }else{
      handleSubmission();
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing={lock}
      snapPoints={!lock && snapPoints}
      backdropComponent={(props) => <BottomSheetBackdrop disappearsOnIndex={-1} pressBehavior="close" {...props} />}
      enableDismissOnClose
      onDismiss={onDismiss}
      
    >
      {/* Optional title */}
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {/* Render PinInputGrid */}
      <View style={styles.pinInputContainer}>
        <PinInputGrid pin={pin} onChangePin={onChangePin} />
      </View>

      <View style={styles.action}>
          <ThemedButton
            title="Submit request"
            onPress={handlerbmissionHandler}
            disabled={loading} // Disable button when loading
            loading={loading}
          ></ThemedButton>
        </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  pinInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  action: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  footer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissText: {
    color: 'blue',
    fontSize: 16,
  },
  titleContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PinPromptBottomSheet;
