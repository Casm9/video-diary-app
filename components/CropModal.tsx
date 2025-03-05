import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';

import { VideoPlayer } from './VideoPlayer';

interface CropModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVideoPicked: (uri: string) => void;
}

export const CropModal: React.FC<CropModalProps> = ({ 
  isVisible, 
  onClose, 
  onVideoPicked 
}) => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // Pick a video from device
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const pickedVideo = result.assets[0];
        setVideoUri(pickedVideo.uri);
        setVideoDuration(pickedVideo.duration || 0);
      }
    } catch (error) {
      console.error('Video selection error', error);
    }
  };

  // Confirm video selection
  const handleConfirm = () => {
    if (videoUri) {
      onVideoPicked(videoUri);
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View className="bg-white rounded-lg w-full p-4">
          <Text className="text-xl font-bold mb-4">Select Video</Text>

          {/* Video Picker */}
          {!videoUri ? (
            <TouchableOpacity 
              onPress={pickVideo}
              className="bg-blue-500 p-4 rounded items-center"
            >
              <Text className="text-white">Pick Video</Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Video Preview */}
              <VideoPlayer
                source={{ uri: videoUri }}
                className="w-full h-64 mb-4"
              />

              {/* Start Time Slider */}
              <View className="mb-4">
                <Text>Start Time: {startTime.toFixed(2)} seconds</Text>
                <Slider
                  value={startTime}
                  onValueChange={setStartTime}
                  minimumValue={0}
                  maximumValue={videoDuration}
                  step={0.1}
                  minimumTrackTintColor="#3B82F6"
                  maximumTrackTintColor="#CCCCCC"
                />
              </View>

              {/* Confirm Buttons */}
              <View className="flex-row justify-between">
                <TouchableOpacity 
                  onPress={handleConfirm}
                  className="bg-green-500 p-3 rounded flex-1 mr-2"
                >
                  <Text className="text-white text-center">Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={onClose}
                  className="bg-red-500 p-3 rounded flex-1"
                >
                  <Text className="text-white text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};