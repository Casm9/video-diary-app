import React from 'react';
import { Video, VideoProps } from 'expo-av';
import { View, StyleSheet } from 'react-native';

interface CustomVideoPlayerProps extends VideoProps {
  width?: number | string;
  height?: number | string;
}

export const VideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  source,
  width = '100%',
  height = 200,
  ...props
}) => {
  return (
    <View style={[styles.container]}>
      <Video
        source={source}
        useNativeControls
        style={styles.video}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});