import { Stack } from 'expo-router';
import { QueryProvider } from '../utils/queryConfig';

export default function Layout() {
  return (
    <QueryProvider>
      <Stack 
        screenOptions={{
          headerStyle: { backgroundColor: '#f4f4f4' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen name="index" options={{ title: 'My Video Diary' }} />
        <Stack.Screen name="crop" options={{ title: 'Crop Video' }} />
        <Stack.Screen name="details" options={{ title: 'Video Details' }} />
        <Stack.Screen name="edit" options={{ title: 'Edit Video' }} />
      </Stack>
    </QueryProvider>
  );
}