import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Video interface
export interface VideoCrop {
  id: string;
  uri: string;
  name: string;
  description: string;
  createdAt: number;
  duration?: number;
}

// Store interface with advanced methods
interface VideoStore {
  videos: VideoCrop[];
  selectedVideo?: VideoCrop | null;
  
  // Core CRUD operations
  addVideo: (video: Omit<VideoCrop, 'id' | 'createdAt'>) => void;
  updateVideo: (id: string, updates: Partial<VideoCrop>) => void;
  deleteVideo: (id: string) => void;
  
  // Selection methods
  selectVideo: (id: string) => void;
  clearSelectedVideo: () => void;
  
  // Utility methods
  clearAllVideos: () => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [],
      selectedVideo: null,
      
      addVideo: (video) => set((state) => ({
        videos: [
          ...state.videos, 
          { 
            ...video, 
            id: Date.now().toString(), 
            createdAt: Date.now() 
          }
        ]
      })),
      
      updateVideo: (id, updates) => set((state) => ({
        videos: state.videos.map(video => 
          video.id === id ? { ...video, ...updates } : video
        )
      })),
      
      deleteVideo: (id) => set((state) => ({
        videos: state.videos.filter(video => video.id !== id)
      })),
      
      selectVideo: (id) => set({
        selectedVideo: get().videos.find(video => video.id === id)
      }),
      
      clearSelectedVideo: () => set({ selectedVideo: null }),
      
      clearAllVideos: () => set({ videos: [], selectedVideo: null })
    }),
    {
      name: 'video-diary-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Optional: Specify which parts of the state to persist
      partialize: (state) => ({
        videos: state.videos
      })
    }
  )
);