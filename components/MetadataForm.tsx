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
    <View style={{ marginVertical: 16 }}>
      {/* Name Input */}
      <View>
        <Text style={{ marginBottom: 8, color: '#4a5568' }}>Video Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                placeholder="Enter video name"
                value={value}
                onChangeText={onChange}
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 4,
                  borderColor: errors.name ? '#f56565' : '#d1d5db'
                }}
              />
              {errors.name && (
                <Text style={{ color: '#f56565', marginTop: 4 }}>
                  {errors.name.message}
                </Text>
              )}
            </View>
          )}
        />
      </View>

      {/* Description Input */}
      <View style={{ marginTop: 16 }}>
        <Text style={{ marginBottom: 8, color: '#4a5568' }}>Description (Optional)</Text>
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
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 4,
                  height: 96,
                  borderColor: errors.description ? '#f56565' : '#d1d5db'
                }}
              />
              {errors.description && (
                <Text style={{ color: '#f56565', marginTop: 4 }}>
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