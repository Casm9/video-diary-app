import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VideoPlayer } from '../components/VideoPlayer';
import { useVideoStore } from '../store/videoStore';

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
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text>Video not found</Text>
        <TouchableOpacity
          onPress={() => router.push('/')}
          style={{
            marginTop: 16,
            backgroundColor: '#3B82F6',
            padding: 8,
            borderRadius: 4
          }}
        >
          <Text style={{ color: 'white' }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      padding: 16
    }}>
      {/* Video Player */}
      <VideoPlayer
        source={{ uri: video.uri }}
        style={{
          width: '100%',
          height: 256,
          marginBottom: 16
        }}
      />

      {/* Metadata Display */}
      <View>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold'
        }}>
          {video.name}
        </Text>
        <Text style={{
          color: '#4B5563',
          marginBottom: 16
        }}>
          {video.description || 'No description'}
        </Text>

        {/* Action Buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity
            onPress={() => router.push(`/edit?videoId=${videoId}`)}
            style={{
              backgroundColor: '#3B82F6',
              padding: 8,
              borderRadius: 4,
              flex: 1,
              marginRight: 8
            }}
          >
            <Text style={{
              color: 'white',
              textAlign: 'center'
            }}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              backgroundColor: '#EF4444',
              padding: 8,
              borderRadius: 4,
              flex: 1
            }}
          >
            <Text style={{
              color: 'white',
              textAlign: 'center'
            }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}