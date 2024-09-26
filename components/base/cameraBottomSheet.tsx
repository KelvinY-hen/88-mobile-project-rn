import { View, Text, TouchableOpacity } from 'react-native'
import React, { Ref, useCallback, useRef, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import BottomSheetComponent from './bottomSheet';
import { useDispatch } from 'react-redux';
import { updatePotrait } from '@/redux/actions/user';
import { AppDispatch } from '@/redux/store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
// import { AppDispatch } from '@/constants/Types';

const data = [
  { label: "Take Photo", value: "US" },
  { label: "Album", value: "CA" },
];

type CameraBottomSheetProps = {
  bottomSheetRef: Ref<BottomSheetModal>;
  handleImage?: () => void;
  handlePresentPress?: () => void;
  handleDismissPress?: () => void;
};

const CameraBottomSheet: React.FC<CameraBottomSheetProps> = ({ handleImage, handlePresentPress, handleDismissPress, bottomSheetRef }) => {
  // const bottomSheetRef = useRef(null);
  const dispatch:AppDispatch = useDispatch();
  type ImagePickerResult = ImagePicker.ImagePickerResult;
  const [facing, setFacing] = useState<ImagePicker.CameraType>('back');
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result:ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // dispatch(updatePotrait(result.assets[0].uri));
      handleImage(result.assets[0]);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }
    try {
      let result:ImagePickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 3],
      });
      if (!result.canceled) {
        console.log('simpan gambar',result);
        // dispatch(updatePotrait(result.assets[0].uri));
        handleImage(result.assets[0]);
      }
    } catch (error) {
      console.log("Error occurred while launching the camera: ", error);
    }
  };


  type ITEM_PRESS = {
    value: string
  }

  const handleItemPress = (item:ITEM_PRESS) => {
    switch (item.value) {
      case 'US':
        // takePhoto();
        openCamera();

        break;
      case 'CA':
        pickImage();
        break;
      default:
        break;
    }
    bottomSheetRef.current?.dismiss();
  };

  type Item = {
    label: string;
    value: string;
  };

  const renderCustomItem = (item: Item) => (
    <TouchableOpacity
      style={{ alignItems: "center", padding:10 }}
      onPress={() => handleItemPress(item)}
    >
      <Text style={{ fontSize: 18 }}>{item.label}</Text>
    </TouchableOpacity>
  );


  return (
    <BottomSheetComponent
        data={data}
        bottomSheetRef={bottomSheetRef}
        onDismiss={handleDismissPress}
        onItemPress={handleItemPress} 
        renderCustomItem={renderCustomItem} 
        // title="Select a Country"
        multiple={false} 
      />
  )
}

export default CameraBottomSheet;
