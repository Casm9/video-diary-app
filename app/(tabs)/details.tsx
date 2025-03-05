import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { VideoPlayer } from '../../components/VideoPlayer';
import { useVideoStore } from '../../store/videoStore';

export default function DetailsScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { videos, deleteVideo } = useVideoStore();
  
  // Find the specific video
  const video = videos.find(v => v.id === videoId);

  // Handle video deletion
  const handleDelete = () => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteVideo(videoId);
            router.push('/');
          }
        }
      ]
    );
  };

  // If no video found
  if (!video) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Video not found</Text>
        <TouchableOpacity 
          onPress={() => router.push('/')}
          className="mt-4 bg-blue-500 p-2 rounded"
        >
          <Text className="text-white">Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      {/* Video Player */}
      <VideoPlayer
        source={{ uri: video.uri }}
        className="w-full h-64 mb-4"
      />

      {/* Metadata Display */}
      <View>
        <Text className="text-2xl font-bold">{video.name}</Text>
        <Text className="text-gray-600 mb-4">
          {video.description || 'No description'}
        </Text>
        
        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <TouchableOpacity 
            onPress={() => router.push(`/edit?videoId=${videoId}`)}
            className="bg-blue-500 p-2 rounded flex-1 mr-2"
          >
            <Text className="text-white text-center">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDelete}
            className="bg-red-500 p-2 rounded flex-1"
          >
            <Text className="text-white text-center">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}