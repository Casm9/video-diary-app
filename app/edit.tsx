import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVideoStore } from '../store/videoStore';
import { videoMetadataSchema, VideoMetadata } from '../utils/validation';
import { MetadataForm } from '../components/MetadataForm';
import { VideoPlayer } from '../components/VideoPlayer';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 18, color: '#EF4444' }}>Video not found</Text>
        <TouchableOpacity 
          onPress={() => router.push('/')}
          style={{ marginTop: 16, backgroundColor: '#3B82F6', padding: 12, borderRadius: 4 }}
        >
          <Text style={{ color: 'white' }}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* Video Preview */}
      <VideoPlayer
        source={{ uri: video.uri }}
        style={{ width: '100%', height: 256, marginBottom: 16 }}
      />

      {/* Metadata Form */}
      <MetadataForm 
        control={control}
        errors={errors}
      />

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
        <TouchableOpacity 
          onPress={handleSubmit(onSubmit)}
          style={{ backgroundColor: '#22C55E', padding: 12, borderRadius: 4, flex: 1, marginRight: 8 }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Save Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ backgroundColor: '#6B7280', padding: 12, borderRadius: 4, flex: 1 }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}