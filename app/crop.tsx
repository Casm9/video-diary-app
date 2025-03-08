import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CropModal } from '../components/CropModal';
import { MetadataForm } from '../components/MetadataForm';
import { VideoPlayer } from '../components/VideoPlayer';
import { useVideoOperations } from '../utils/queryConfig';
import { useVideoStore } from '../store/videoStore';
import { videoMetadataSchema, VideoMetadata } from '../utils/validation';

export default function CropScreen() {
  const router = useRouter();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isCropModalVisible, setIsCropModalVisible] = useState(false);
  const { addVideo } = useVideoStore();
  const { cropVideoMutation } = useVideoOperations();

  // Form setup
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<VideoMetadata>({
    resolver: zodResolver(videoMetadataSchema)
  });

  // Handle video selection from CropModal
  const handleVideoPicked = (uri: string, selectedStartTime: number, seletectedEndTime: number) => {
    setVideoUri(uri);
    setStartTime(selectedStartTime);
    setEndTime(seletectedEndTime);
  };

  // Submit form with cropped video
  const onSubmit = async (metadata: VideoMetadata) => {
    if (!videoUri) {
      Alert.alert('Error', 'Please select a video first');
      return;
    }

    try {
      // Crop video using mutation
      const croppedVideoUri = await cropVideoMutation.mutateAsync({
        videoUri,
        startTime,
        endTime,
      });

      // Add to video store
      addVideo({
        uri: croppedVideoUri,
        name: metadata.name,
        description: metadata.description || ''
      });

      // Navigate back to home
      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to crop video');
    }
  };

  return (
    <View style={{ padding: 20 }}>

      {/* Video Selection */}
      <TouchableOpacity 
        onPress={() => setIsCropModalVisible(true)}
        style={{ padding: 10, backgroundColor: 'lightblue', margin: 10 }}
      >
        <Text style={{ textAlign: 'center' }}>
          {videoUri ? 'Change Video' : 'Select Video'}
        </Text>
      </TouchableOpacity>

      {/* Video Preview */}
      {videoUri && (
        <View style={{ marginVertical: 10 }}>
          <VideoPlayer
            source={{ uri: videoUri }}
            style={{ width: '100%', height: 200 }}
          />
        </View>
      )}

      {/* Metadata Form */}
      <MetadataForm 
        control={control}
        errors={errors}
      />

      {/* Submit Button */}
      <TouchableOpacity 
        onPress={handleSubmit(onSubmit)}
        disabled={!videoUri}
        style={{
          padding: 16,
          borderRadius: 4,
          marginTop: 16,
          backgroundColor: videoUri ? '#10b981' : '#d1d5db'
        }}
      >
        <Text style={{ textAlign: 'center' }}>
          Crop and Save Video
        </Text>
      </TouchableOpacity>

      {/* Crop Modal */}
      <CropModal
        isVisible={isCropModalVisible}
        onClose={() => setIsCropModalVisible(false)}
        onVideoPicked={handleVideoPicked}
      />
    </View>
  );
}