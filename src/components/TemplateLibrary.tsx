'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Star, Download, Eye, Filter } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
  downloads: number;
  objects: Array<{
    id: string;
    type: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color?: string;
    metallic?: number;
    roughness?: number;
  }>;
  tags: string[];
  isPro: boolean;
}

interface TemplateLibraryProps {
  onTemplateSelect?: (template: Template) => void;
  onClose?: () => void;
}

export function TemplateLibrary({ onTemplateSelect, onClose }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: 'product-showcase',
      name: 'Product Showcase',
      description: 'Perfect for displaying products with realistic materials and lighting',
      category: 'Business',
      thumbnail: '📦',
      rating: 4.8,
      downloads: 1250,
      isPro: false,
      tags: ['product', 'showcase', 'business', 'retail'],
      objects: [
        {
          id: 'platform',
          type: 'cylinder',
          position: [0, -0.5, 0],
          rotation: [0, 0, 0],
          scale: [2, 0.1, 2],
          color: '#333333',
          metallic: 0.8,
          roughness: 0.2
        },
        {
          id: 'product',
          type: 'cube',
          position: [0, 0.5, 0],
          rotation: [0, 45, 0],
          scale: [1, 1, 1],
          color: '#ff6b6b',
          metallic: 0.1,
          roughness: 0.3
        }
      ]
    },
    {
      id: 'art-gallery',
      name: 'Virtual Art Gallery',
      description: 'Display multiple artworks or images in a gallery setting',
      category: 'Creative',
      thumbnail: '🖼️',
      rating: 4.9,
      downloads: 890,
      isPro: false,
      tags: ['art', 'gallery', 'museum', 'creative'],
      objects: [
        {
          id: 'frame1',
          type: 'plane',
          position: [-1.5, 1, 0],
          rotation: [0, 0, 0],
          scale: [1, 1.3, 1],
          color: '#8B4513'
        },
        {
          id: 'frame2',
          type: 'plane',
          position: [0, 1, 0],
          rotation: [0, 0, 0],
          scale: [1, 1.3, 1],
          color: '#8B4513'
        },
        {
          id: 'frame3',
          type: 'plane',
          position: [1.5, 1, 0],
          rotation: [0, 0, 0],
          scale: [1, 1.3, 1],
          color: '#8B4513'
        }
      ]
    },
    {
      id: 'education-solar',
      name: 'Solar System Explorer',
      description: 'Interactive learning environment with animated planets',
      category: 'Education',
      thumbnail: '🌍',
      rating: 5.0,
      downloads: 2100,
      isPro: true,
      tags: ['education', 'science', 'astronomy', 'interactive'],
      objects: [
        {
          id: 'sun',
          type: 'sphere',
          position: [0, 1, 0],
          rotation: [0, 0, 0],
          scale: [1.5, 1.5, 1.5],
          color: '#FFD700',
          metallic: 0,
          roughness: 0.8
        },
        {
          id: 'earth',
          type: 'sphere',
          position: [3, 1, 0],
          rotation: [0, 0, 0],
          scale: [0.8, 0.8, 0.8],
          color: '#4169E1'
        },
        {
          id: 'moon',
          type: 'sphere',
          position: [4, 1, 0],
          rotation: [0, 0, 0],
          scale: [0.3, 0.3, 0.3],
          color: '#C0C0C0'
        }
      ]
    },
    {
      id: 'furniture-room',
      name: 'Furniture Showroom',
      description: 'Room setup for furniture and interior design visualization',
      category: 'Design',
      thumbnail: '🛋️',
      rating: 4.7,
      downloads: 675,
      isPro: false,
      tags: ['furniture', 'interior', 'room', 'design'],
      objects: [
        {
          id: 'floor',
          type: 'plane',
          position: [0, 0, 0],
          rotation: [-90, 0, 0],
          scale: [4, 4, 1],
          color: '#DEB887'
        },
        {
          id: 'sofa',
          type: 'cube',
          position: [0, 0.4, 0],
          rotation: [0, 0, 0],
          scale: [2, 0.8, 1],
          color: '#8B4513'
        }
      ]
    },
    {
      id: 'business-presentation',
      name: 'Business Presentation',
      description: 'Professional setup for presentations and data visualization',
      category: 'Business',
      thumbnail: '📊',
      rating: 4.6,
      downloads: 1890,
      isPro: true,
      tags: ['business', 'presentation', 'charts', 'professional'],
      objects: [
        {
          id: 'screen',
          type: 'plane',
          position: [0, 2, -2],
          rotation: [0, 0, 0],
          scale: [3, 2, 1],
          color: '#1a1a1a'
        },
        {
          id: 'chart1',
          type: 'cube',
          position: [-1, 0.5, 0],
          rotation: [0, 0, 0],
          scale: [0.3, 1, 0.3],
          color: '#4CAF50'
        },
        {
          id: 'chart2',
          type: 'cube',
          position: [0, 0.8, 0],
          rotation: [0, 0, 0],
          scale: [0.3, 1.6, 0.3],
          color: '#2196F3'
        }
      ]
    },
    {
      id: 'gaming-arena',
      name: 'Gaming Arena',
      description: 'Interactive gaming environment with obstacles and collectibles',
      category: 'Gaming',
      thumbnail: '🎮',
      rating: 4.9,
      downloads: 3200,
      isPro: true,
      tags: ['gaming', 'interactive', 'arena', 'obstacles'],
      objects: [
        {
          id: 'platform1',
          type: 'cube',
          position: [-2, 0.5, -2],
          rotation: [0, 0, 0],
          scale: [1, 0.2, 1],
          color: '#FF6B6B'
        },
        {
          id: 'platform2',
          type: 'cube',
          position: [2, 1, 0],
          rotation: [0, 0, 0],
          scale: [1, 0.2, 1],
          color: '#4ECDC4'
        },
        {
          id: 'collectible',
          type: 'sphere',
          position: [0, 2, 0],
          rotation: [0, 0, 0],
          scale: [0.3, 0.3, 0.3],
          color: '#FFD700',
          metallic: 0.8,
          roughness: 0.1
        }
      ]
    }
  ];

  const categories = ['all', 'Business', 'Creative', 'Education', 'Design', 'Gaming'];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">📚 Template Library</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm opacity-90 mt-1">Professional AR scene templates to jumpstart your projects</p>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Categories */}
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-4 max-h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Template Header */}
                <div className="bg-gray-100 p-4 text-center">
                  <div className="text-4xl mb-2">{template.thumbnail}</div>
                  <h3 className="font-semibold">{template.name}</h3>
                  {template.isPro && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mt-1 inline-block">
                      PRO
                    </span>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      <span>{template.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowPreview(template.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => onTemplateSelect?.(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg max-w-2xl w-full m-4">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Template Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p>3D preview would render here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
