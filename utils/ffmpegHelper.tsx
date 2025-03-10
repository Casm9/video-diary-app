import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

export async function cropVideo(
  inputUri: string,
  startTime: number,
  endTime: number
): Promise<string> {
  const outputUri = `${FileSystem.documentDirectory}cropped_video_${Date.now()}.mp4`;

  const ffmpegCommand = `-i ${inputUri} -ss ${startTime} -to ${endTime} -c copy ${outputUri}`;

  try {
    const session = await FFmpegKit.execute(ffmpegCommand);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      return outputUri;
    } else {
      throw new Error('Video cropping failed');
    }
  } catch (error) {
    console.error('FFMPEG Cropping Error:', error);
    throw error;
  }
}