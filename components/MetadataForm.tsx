import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { VideoMetadata } from '../utils/validation';

interface MetadataFormProps {
  control: Control<VideoMetadata>;
  errors: FieldErrors<VideoMetadata>;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({ 
  control, 
  errors 
}) => {
  return (
    <View className="space-y-4">
      {/* Name Input */}
      <View>
        <Text className="mb-2 text-gray-700">Video Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                placeholder="Enter video name"
                value={value}
                onChangeText={onChange}
                className={`border p-2 rounded ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <Text className="text-red-500 mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Description Input */}
      <View>
        <Text className="mb-2 text-gray-700">Description (Optional)</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                placeholder="Enter video description"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                className={`border p-2 rounded h-24 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <Text className="text-red-500 mt-1">
                  {errors.description.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};