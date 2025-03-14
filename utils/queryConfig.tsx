import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation
} from '@tanstack/react-query';
import { cropVideo } from './ffmpegHelper';
import * as FileSystem from 'expo-file-system';

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    }
  }
});

// Custom hook for video operations
export function useVideoOperations() {
  // Video cropping mutation
  const cropVideoMutation = useMutation({
    mutationFn: async ({
      videoUri,
      startTime,
      endTime
    }: {
      videoUri: string,
      startTime: number,
      endTime: number
    }) => {
      try {
        return await cropVideoWithFFMPEG(videoUri, startTime, endTime);
      } catch (error) {
        console.error('Video cropping failed', error);
        throw error;
      }
    }
  });

  // Fetch video details query
  const fetchVideoDetails = (videoId: string) => {
    return useQuery({
      queryKey: ['videoDetails', videoId],
      queryFn: async () => {
        return fetchVideoDetailsFromStorage(videoId);
      }
    });
  };

  return {
    cropVideoMutation,
    fetchVideoDetails
  };
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

async function cropVideoWithFFMPEG(
  videoUri: string,
  startTime: number,
  endTime: number
): Promise<string> {

  //return await cropVideo(videoUri, startTime, endTime);
  console.log('Cropping video', { videoUri, startTime, endTime });
  return videoUri;
}

async function fetchVideoDetailsFromStorage(videoId: string) {

  try {
    const videoPath = `${FileSystem.documentDirectory}${videoId}.mp4`;
    const fileInfo = await FileSystem.getInfoAsync(videoPath);

    if (!fileInfo.exists) {
      throw new Error('Video file not found');
    }

    return {
      uri: videoPath,
      size: fileInfo.size,
      modified: fileInfo.modificationTime
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}
