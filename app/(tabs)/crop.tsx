import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Import new components and utilities
import { CropModal } from '../../components/CropModal';
import { MetadataForm } from '../../components/MetadataForm';
import { VideoPlayer } from '../../components/VideoPlayer';
import { useVideoOperations } from '../../utils/queryConfig';
import { useVideoStore } from '../../store/videoStore';
import { videoMetadataSchema, VideoMetadata } from '../../utils/validation';

export default function CropScreen() {
  const router = useRouter();
  const [videoUri, setVideoUri] = useState<string | null>(null);
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
  const handleVideoPicked = (uri: string) => {
    setVideoUri(uri);
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
        startTime: 0, // You might want to pass this from CropModal
        duration: 5
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
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Crop Video</Text>

      {/* Video Selection */}
      <TouchableOpacity 
        onPress={() => setIsCropModalVisible(true)}
        className="bg-blue-500 p-4 rounded items-center mb-4"
      >
        <Text className="text-white">
          {videoUri ? 'Change Video' : 'Select Video'}
        </Text>
      </TouchableOpacity>

      {/* Video Preview */}
      {videoUri && (
        <View className="mb-4">
          <VideoPlayer
            source={{ uri: videoUri }}
            className="w-full h-64"
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
        className={`p-4 rounded mt-4 ${
          videoUri 
            ? 'bg-green-500' 
            : 'bg-gray-300'
        }`}
      >
        <Text className="text-white text-center">
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