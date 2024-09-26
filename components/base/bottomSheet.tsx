import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const BottomSheetComponent = ({
  data,
  bottomSheetRef,
  onDismiss,
  onItemPress,
  renderCustomItem, // Custom rendering logic passed as prop
  multiple = false, // Dynamic check for footer
  title, // Optional title for the bottom sheet
}) => {
  // Snap points for bottom sheet
  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={(props) => <BottomSheetBackdrop {...props} />}
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
      <FlatList
        data={data}
        keyExtractor={(item) => item.value}
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
      />
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
});

export default BottomSheetComponent;
