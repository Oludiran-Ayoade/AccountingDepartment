'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showSuccess, showError } from '@/lib/toast';
import api from '@/lib/api';

interface ProfilePictureUploadProps {
  currentImage?: string;
  userName: string;
  onUploadSuccess?: (imageUrl: string) => void;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  userName,
  onUploadSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showError('Image size must be less than 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showError('File must be an image (JPEG, PNG, or WebP)');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url;
      
      // Update backend
      await api.put('/users/profile-picture', {
        profilePicture: imageUrl,
      });

      showSuccess('Profile picture updated successfully!');
      if (onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }
    } catch (error) {
      showError('Failed to upload profile picture');
      setPreviewUrl(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    try {
      await api.put('/users/profile-picture', {
        profilePicture: '',
      });
      setPreviewUrl(null);
      showSuccess('Profile picture removed');
      if (onUploadSuccess) {
        onUploadSuccess('');
      }
    } catch (error) {
      showError('Failed to remove profile picture');
    }
  };

  const getInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Profile Picture Display */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-4xl">
              {getInitials()}
            </div>
          )}
          
          {/* Upload Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Camera Button */}
        <button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
        </button>

        {/* Remove Button */}
        {previewUrl && !isUploading && (
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Instructions */}
      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          JPG, PNG or WebP (Max 5MB)
        </p>
      </div>
    </div>
  );
};
