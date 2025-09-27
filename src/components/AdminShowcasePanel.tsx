'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Eye, ThumbsUp, ThumbsDown, Share2, User, Calendar, Tag, Globe,
  Twitter, Linkedin, Instagram, Facebook, Star, ExternalLink
} from 'lucide-react';
import { ShowcaseProject } from '@/types/showcase';

interface AdminShowcasePanelProps {
  onApprove: (projectId: string) => void;
  onReject: (projectId: string) => void;
}

export function AdminShowcasePanel({ onApprove, onReject }: AdminShowcasePanelProps) {
  const [filter, setFilter] = useState<'pending' | 'approved'>('pending');

  // Mock showcase submissions
  const mockProjects: ShowcaseProject[] = [
    {
      id: 'showcase_1',
      projectId: 'project_123',
      projectName: 'Interactive Product Demo',
      description: 'Amazing AR experience showcasing our new smart watch with interactive features.',
      creatorName: 'Sarah Johnson',
      creatorEmail: 'sarah@techcorp.com',
      thumbnailUrl: '/spectakull_logo.png',
      qrCodeUrl: 'https://spectakull.com/ar/project_123',
      showcaseEnabled: true,
      approvedByAdmin: false,
      submittedAt: Date.now() - 86400000,
      tags: ['product-demo', 'smartwatch', 'tech'],
      category: 'business',
      engagementStats: { views: 0, scans: 0, shares: 0 },
      socialPlatforms: { twitter: true, linkedin: true, instagram: false, facebook: false }
    },
    {
      id: 'showcase_2',
      projectId: 'project_456',
      projectName: 'Educational Solar System',
      description: 'Interactive 3D solar system for students to explore planets and learn about space.',
      creatorName: 'Prof. Michael Chen',
      creatorEmail: 'mchen@university.edu',
      thumbnailUrl: '/spectakull_logo.png',
      qrCodeUrl: 'https://spectakull.com/ar/project_456',
      showcaseEnabled: true,
      approvedByAdmin: true,
      submittedAt: Date.now() - 172800000,
      approvedAt: Date.now() - 86400000,
      tags: ['education', 'solar-system', 'astronomy'],
      category: 'education',
      engagementStats: { views: 1250, scans: 340, shares: 28 },
      socialPlatforms: { twitter: true, linkedin: true, instagram: true, facebook: false }
    }
  ];

  const filteredProjects = mockProjects.filter(project =>
    filter === 'pending' ? !project.approvedByAdmin : project.approvedByAdmin
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Share2 className="w-6 h-6 mr-3 text-purple-600" />
            Social Media Showcase
          </h2>
          <p className="text-gray-600 mt-1">Manage user submissions for social media featuring</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setFilter('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              filter === 'pending'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              filter === 'approved'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved & Featured
          </button>
        </nav>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{project.projectName}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                    {project.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{project.creatorName} ({project.creatorEmail})</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted {new Date(project.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a href={project.qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View AR Project <ExternalLink className="w-3 h-3 inline" />
                      </a>
                    </div>
                    {project.approvedByAdmin && (
                      <div className="text-sm text-green-600">
                        ✓ Approved - {project.engagementStats.views} views, {project.engagementStats.scans} scans
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social Platforms */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Platforms:</span>
                  {project.socialPlatforms.twitter && <Twitter className="w-4 h-4 text-blue-500" />}
                  {project.socialPlatforms.linkedin && <Linkedin className="w-4 h-4 text-blue-600" />}
                  {project.socialPlatforms.instagram && <Instagram className="w-4 h-4 text-pink-500" />}
                  {project.socialPlatforms.facebook && <Facebook className="w-4 h-4 text-blue-700" />}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-4">
                {!project.approvedByAdmin ? (
                  <>
                    <Button
                      onClick={() => onApprove(project.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => onReject(project.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2">
                      <Star className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">Featured</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
