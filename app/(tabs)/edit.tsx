import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useVideoStore } from '../../store/videoStore';
import { videoMetadataSchema, VideoMetadata } from '../../utils/validation';
import { MetadataForm } from '../../components/MetadataForm';
import { VideoPlayer } from '../../components/VideoPlayer';

export default function EditScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { videos, updateVideo } = useVideoStore();
  
  // Find the specific video
  const video = videos.find(v => v.id === videoId);

  // Form setup
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<VideoMetadata>({
    resolver: zodResolver(videoMetadataSchema),
    defaultValues: {
      name: video?.name || '',
      description: video?.description || ''
    }
  });

  // Handle updating video metadata
  const onSubmit = (data: VideoMetadata) => {
    if (videoId) {
      updateVideo(videoId, data);
      router.push(`/details?videoId=${videoId}`);
    }
  };

  // If no video found
  if (!video) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-lg text-red-500">Video not found</Text>
        <TouchableOpacity 
          onPress={() => router.push('/')}
          className="mt-4 bg-blue-500 p-3 rounded"
        >
          <Text className="text-white">Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      {/* Video Preview */}
      <VideoPlayer
        source={{ uri: video.uri }}
        className="w-full h-64 mb-4"
      />

      {/* Metadata Form */}
      <MetadataForm 
        control={control}
        errors={errors}
      />

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)}
          className="bg-green-500 p-3 rounded flex-1 mr-2"
        >
          <Text className="text-white text-center">Save Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-gray-500 p-3 rounded flex-1"
        >
          <Text className="text-white text-center">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}