import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';

const BottomSheetComponent = ({
  data,
  bottomSheetRef,
  onDismiss,
  onItemPress,
  renderCustomItem, 
  lock = true,
  multiple = false, // Dynamic check for footer
  title = false, // Optional title for the bottom sheet
  loading = false,
}) => {
  // Snap points for bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing={lock}
      snapPoints={!lock && snapPoints}
      backdropComponent={(props) => <BottomSheetBackdrop  disappearsOnIndex={-1} pressBehavior='close' {...props} />}
      enableDismissOnClose
      onDismiss={onDismiss}
      footerComponent={
        multiple && (
          <View style={styles.footer}>
            <Text style={styles.dismissText} onPress={onDismiss}>
              Dismiss
            </Text>
          </View>
        )
      }
    >
      {/* Optional title */}
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      {/* Dynamic rendering of items */}
      {/* <BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          renderCustomItem ? (
            renderCustomItem(item) // Use custom rendering if provided
          ) : (
            <TouchableOpacity
              style={styles.item}
              onPress={() => onItemPress && onItemPress(item)}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          )
        }
        contentContainerStyle={styles.listContainer}
      /> */}
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (<BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          renderCustomItem ? (
            renderCustomItem(item) // Use custom rendering if provided
          ) : (
            <TouchableOpacity
              style={styles.item}
              onPress={() => onItemPress && onItemPress(item)}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          )
        }
        contentContainerStyle={styles.listContainer}
      />)}
    </BottomSheetModal>
    
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    // width: '100%',
    // height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Semi-transparent black background
    zIndex: 1000, // Ensure it stays above other components
  },
});

export default BottomSheetComponent;
