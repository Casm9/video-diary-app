import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoStore } from '../store/videoStore';
import { VideoPlayer } from '../components/VideoPlayer';

interface VideoItem {
  id: string;
  name: string;
  uri: string;
}

export default function MainScreen() {
  const router = useRouter();
  const { videos } = useVideoStore();

  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <View style={{ height: 250 }}>
      <TouchableOpacity
        style={{ padding: 10, margin: 10, backgroundColor: 'lightgray' }}
        onPress={() => router.push({
          pathname: '/details',
          params: { videoId: item.id }
        })}
      >
        <Text style={{ textAlign: 'center' }}>
          {item.name}
        </Text>
        <VideoPlayer
          source={{ uri: item.uri }}
          style={{ width: '100%', height: 200 }}
        />
      </TouchableOpacity>
    </View>

  );

  return (
    <View style={{ flex: 1 }}>
      {videos.length === 0 ? (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            No videos yet. Start cropping your first video!
          </Text>
        </View>
      ) : (
        <FlatList style={{ padding: 10 }}
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity
        style={{ padding: 10, backgroundColor: 'lightblue', margin: 10 }}
        onPress={() => router.push('/crop')}
      >
        <Text style={{ textAlign: 'center' }}>Crop New Video</Text>
      </TouchableOpacity>
    </View>
  );
}
