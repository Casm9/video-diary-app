import { z } from 'zod';

// Video Metadata Validation
export const videoMetadataSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be 50 characters or less" })
    .trim(),
  
  description: z.string()
    .max(250, { message: "Description must be 250 characters or less" })
    .optional()
    .transform(val => val || ''),
});

// Video Crop Configuration Validation
export const videoCropConfigSchema = z.object({
  videoUri: z.string().url({ message: "Invalid video URI" }),
  startTime: z.number()
    .min(0, { message: "Start time cannot be negative" })
    .max(3600, { message: "Start time exceeds maximum video length" }),
  duration: z.number()
    .min(1, { message: "Minimum crop duration is 1 second" })
    .max(10, { message: "Maximum crop duration is 10 seconds" })
    .default(5)
});

// Validation Utility
export function validateVideoMetadata(data: unknown) {
  return videoMetadataSchema.parse(data);
}

export function validateVideoCropConfig(data: unknown) {
  return videoCropConfigSchema.parse(data);
}

// Type Exports
export type VideoMetadata = z.infer<typeof videoMetadataSchema>;
export type VideoCropConfig = z.infer<typeof videoCropConfigSchema>;