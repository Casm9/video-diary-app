import React from 'react';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { useVideoStore } from '../store/videoStore';
import { cropVideo } from '../utils/ffmpegHelper';

// Create a query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
});

// Custom hook for video cropping
export function useVideoCrop() {
  const { addVideo } = useVideoStore();

  const cropVideoMutation = useMutation({
    mutationFn: async ({ 
      videoUri, 
      startTime,
      endTime, 
      name, 
      description 
    }: {
      videoUri: string, 
      startTime: number,
      endTime: number, 
      name: string, 
      description?: string
    }) => {
      try {
        // Crop the video
        const croppedVideoUri = await cropVideo(videoUri, startTime, endTime);
        
        // Add to store
        addVideo({
          uri: croppedVideoUri,
          name,
          description: description || ''
        });

        return croppedVideoUri;
      } catch (error) {
        console.error('Video cropping failed', error);
        throw error;
      }
    }
  });

  return cropVideoMutation;
}

// Wrap your app with QueryClientProvider
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}