import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useVideoStore } from '../../store/videoStore';
import { VideoPlayer } from '../../components/VideoPlayer';

interface VideoItem {
  id: string;
  name: string;
  uri: string;
}

export default function MainScreen() {
  const router = useRouter();
  const { videos } = useVideoStore();

  const renderVideoItem = ({ item }: {item: VideoItem}) => (
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: '/details',
        params: { videoId: item.id }
      })}
      className="p-4 border-b border-gray-200"
    >
      <Text className="text-lg font-bold mb-2">{item.name}</Text>
      <VideoPlayer
        source={{ uri: item.uri }}
        height={200}
        className="w-full"
      />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      {videos.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">
            No videos yet. Start cropping your first video!
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity 
        onPress={() => router.push('/crop')}
        className="bg-blue-500 p-4 items-center"
      >
        <Text className="text-white font-bold">Crop New Video</Text>
      </TouchableOpacity>
    </View>
  );
}