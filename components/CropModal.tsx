import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { VideoPlayer } from './VideoPlayer';

interface CropModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVideoPicked: (uri: string, startTime: number, endTime: number) => void;
}

export const CropModal: React.FC<CropModalProps> = ({
  isVisible,
  onClose,
  onVideoPicked
}) => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // Pick a video from device
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
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
      onVideoPicked(videoUri, startTime, endTime);
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
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 16
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 8,
          width: '100%',
          padding: 16
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 16
          }}>Select Video</Text>

          {/* Video Picker */}
          {!videoUri ? (
            <TouchableOpacity
              onPress={pickVideo}
              style={{
                backgroundColor: '#3B82F6',
                padding: 16,
                borderRadius: 4,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white' }}>Pick Video</Text>
            </TouchableOpacity>
          ) : (
            <>
              {/* Video Preview */}
              <VideoPlayer
                source={{ uri: videoUri }}
                style={{
                  width: '100%',
                  height: 256,
                  marginBottom: 16
                }}
              />

              {/*Time Slider */}
              <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 8 }}>Video Duration: {(videoDuration / 1000).toFixed(2)} seconds</Text>
              <Text style={{ marginBottom: 8 }}>Start Time: {(startTime / 1000).toFixed(2)} seconds</Text>
                <Slider
                  value={startTime}
                  onValueChange={setStartTime}
                  minimumValue={0}
                  maximumValue={videoDuration}
                  step={1}
                  minimumTrackTintColor="#3B82F6"
                  maximumTrackTintColor="#CCCCCC"
                />
                 <Text style={{ marginTop: 8 }}>End Time: {(endTime / 1000).toFixed(2)} seconds</Text>
                <Slider
                  value={videoDuration}
                  onValueChange={setEndTime}
                  minimumValue={startTime}
                  maximumValue={videoDuration}
                  step={1}
                  minimumTrackTintColor="#3B82F6"
                  maximumTrackTintColor="#CCCCCC"
                />
              </View>

              {/* Confirm Buttons */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={{
                    backgroundColor: '#10B981',
                    padding: 12,
                    borderRadius: 4,
                    flex: 1,
                    marginRight: 8
                  }}
                >
                  <Text style={{
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    Confirm
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor: '#EF4444',
                    padding: 12,
                    borderRadius: 4,
                    flex: 1
                  }}
                >
                  <Text style={{
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};