'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Eye, Globe, Heart, Star, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { ShowcaseProject } from '@/types/showcase';

interface ProjectShowcaseToggleProps {
  projectId: string;
  projectName: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean, details: Partial<ShowcaseProject>) => void;
}

export function ProjectShowcaseToggle({
  projectId,
  projectName,
  isEnabled,
  onToggle
}: ProjectShowcaseToggleProps) {
  const [showModal, setShowModal] = useState(false);
  const [showcaseData, setShowcaseData] = useState({
    description: '',
    category: 'business' as ShowcaseProject['category'],
    tags: [] as string[],
    socialPlatforms: {
      twitter: true,
      linkedin: true,
      instagram: false,
      facebook: false
    }
  });
  const [currentTag, setCurrentTag] = useState('');

  const categories = [
    { value: 'business', label: 'Business & Corporate' },
    { value: 'education', label: 'Education & Training' },
    { value: 'entertainment', label: 'Entertainment & Gaming' },
    { value: 'art', label: 'Art & Creative' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'other', label: 'Other' }
  ];

  const handleToggle = () => {
    if (isEnabled) {
      // Disable showcase
      onToggle(false, {});
    } else {
      // Show modal to configure showcase
      setShowModal(true);
    }
  };

  const handleSubmit = () => {
    onToggle(true, {
      projectId,
      projectName,
      description: showcaseData.description,
      category: showcaseData.category,
      tags: showcaseData.tags,
      socialPlatforms: showcaseData.socialPlatforms,
      showcaseEnabled: true,
      approvedByAdmin: false, // Requires admin approval
      submittedAt: Date.now()
    });
    setShowModal(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !showcaseData.tags.includes(currentTag.trim())) {
      setShowcaseData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setShowcaseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media Showcase</h3>
              <p className="text-gray-600 text-sm mb-3">
                Allow Spectakull to feature your amazing AR project on our social media channels
              </p>

              {isEnabled ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">Showcase Enabled</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Your project is pending admin approval for social media showcase
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>Get featured</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>Reach thousands</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>Help others</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm">
                      <strong>Benefits:</strong> Get your work featured on Twitter, LinkedIn and Instagram.
                      Help inspire other creators and showcase the power of no-code AR!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleToggle}
            variant={isEnabled ? "outline" : "default"}
            className={isEnabled ? "text-red-600 border-red-200 hover:bg-red-50" : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"}
          >
            {isEnabled ? "Disable Showcase" : "Enable Showcase"}
          </Button>
        </div>
      </div>

      {/* Configuration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">Enable Social Media Showcase</h2>
              <p className="text-gray-600 text-sm mt-1">Configure how your project will be featured</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={showcaseData.description}
                  onChange={(e) => setShowcaseData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your AR project and what makes it special..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={showcaseData.category}
                  onChange={(e) => setShowcaseData(prev => ({ ...prev, category: e.target.value as ShowcaseProject['category'] }))}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Help others discover your project)
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Enter a tag..."
                    className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {showcaseData.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Social Media Platforms
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-500' },
                    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
                    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
                    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-700' }
                  ].map(platform => (
                    <label key={platform.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showcaseData.socialPlatforms[platform.key as keyof typeof showcaseData.socialPlatforms]}
                        onChange={(e) => setShowcaseData(prev => ({
                          ...prev,
                          socialPlatforms: {
                            ...prev.socialPlatforms,
                            [platform.key]: e.target.checked
                          }
                        }))}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <platform.icon className={`w-5 h-5 ${platform.color}`} />
                      <span className="text-sm font-medium text-gray-700">{platform.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">
                  <strong>Terms:</strong> By enabling showcase, you grant Spectakull permission to feature your project
                  on our social media channels. We will always credit you as the creator. You can disable this at any time.
                  All showcased projects require admin approval.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!showcaseData.description.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              >
                Submit for Approval
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
