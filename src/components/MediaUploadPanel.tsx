'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, Video, Music, FileText, Download, Trash2 } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | '3d-model';
  url: string;
  size: number;
  uploadedAt: Date;
}

interface MediaUploadPanelProps {
  onMediaSelect?: (media: MediaItem) => void;
  onClose?: () => void;
}

export function MediaUploadPanel({ onMediaSelect, onClose }: MediaUploadPanelProps) {
  const [uploadedMedia, setUploadedMedia] = useState<MediaItem[]>([
    // Demo media items
    {
      id: '1',
      name: 'product-showcase.jpg',
      type: 'image',
      url: '/spectakull_background_skull_image.jpg',
      size: 245760,
      uploadedAt: new Date()
    },
    {
      id: '2',
      name: 'logo-animation.mp4',
      type: 'video',
      url: '/hero_image.png',
      size: 1048576,
      uploadedAt: new Date()
    }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video' | 'audio' | '3d-model'>('all');

  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      const newMedia: MediaItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' :
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : '3d-model',
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date()
      };
      setUploadedMedia(prev => [...prev, newMedia]);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Music className="w-5 h-5" />;
      case '3d-model': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const filteredMedia = selectedType === 'all'
    ? uploadedMedia
    : uploadedMedia.filter(item => item.type === selectedType);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">📁 Media Library</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm opacity-90 mt-1">Upload and manage your AR assets</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
              Supports: Images (JPG, PNG), Videos (MP4, MOV), Audio (MP3, WAV), 3D Models (GLB, OBJ)
            </p>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.mp3,.wav,.glb,.obj,.fbx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Choose Files
              </Button>
            </label>
          </div>

          {/* Media Type Filter */}
          <div className="flex space-x-2 mb-4">
            {[
              { key: 'all', label: 'All', icon: '📁' },
              { key: 'image', label: 'Images', icon: '🖼️' },
              { key: 'video', label: 'Videos', icon: '🎬' },
              { key: 'audio', label: 'Audio', icon: '🎵' },
              { key: '3d-model', label: '3D Models', icon: '🎯' }
            ].map(filter => (
              <Button
                key={filter.key}
                variant={selectedType === filter.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(filter.key as any)}
                className="flex items-center space-x-1"
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </Button>
            ))}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {filteredMedia.map(item => (
              <div
                key={item.id}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer group"
                onClick={() => onMediaSelect?.(item)}
              >
                <div className="flex items-center justify-between mb-2">
                  {getMediaIcon(item.type)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedMedia(prev => prev.filter(m => m.id !== item.id));
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                )}

                <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                <p className="text-xs text-gray-400">{item.uploadedAt.toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No {selectedType === 'all' ? '' : selectedType} files uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
