'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  Plus, Folder, Edit3, Trash2, Star, Calendar,
  Eye, Share2, MoreVertical, X, Save, FolderPlus
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lastModified: string;
  thumbnail?: string;
  isStarred: boolean;
  status: 'draft' | 'published' | 'archived';
  qrCodeCount: number;
  totalViews: number;
}

interface ProjectManagerProps {
  currentProject: { id: string; name: string };
  onProjectChange: (project: { id: string; name: string }) => void;
  onClose?: () => void;
}

export function ProjectManager({ currentProject, onProjectChange, onClose }: ProjectManagerProps) {
  const { user } = useAuth();
  const { canCreateProject, features } = useSubscription();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Load projects from localStorage
  useEffect(() => {
    if (user) {
      const savedProjects = localStorage.getItem(`spectakull_projects_${user.id}`);
      if (savedProjects) {
        try {
          const projectsData = JSON.parse(savedProjects) as Project[];
          setProjects(projectsData);
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      } else {
        // Create default project if none exist
        const defaultProject: Project = {
          id: 'demo-project',
          name: 'My First AR Experience',
          description: 'Getting started with Spectakull AR',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          isStarred: false,
          status: 'draft',
          qrCodeCount: 0,
          totalViews: 0
        };
        setProjects([defaultProject]);
        localStorage.setItem(`spectakull_projects_${user.id}`, JSON.stringify([defaultProject]));
      }
    }
  }, [user]);

  // Save projects to localStorage
  useEffect(() => {
    if (user && projects.length > 0) {
      localStorage.setItem(`spectakull_projects_${user.id}`, JSON.stringify(projects));
    }
  }, [user, projects]);

  const createProject = () => {
    if (!canCreateProject()) {
      alert(`Project limit reached!\n\nYour current plan allows ${features.maxProjects} projects.\nUpgrade to create more projects.`);
      return;
    }

    if (!newProjectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    const newProject: Project = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: newProjectName.trim(),
      description: newProjectDescription.trim() || 'AR project created with Spectakull',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isStarred: false,
      status: 'draft',
      qrCodeCount: 0,
      totalViews: 0
    };

    setProjects(prev => [newProject, ...prev]);
    onProjectChange({ id: newProject.id, name: newProject.name });
    setShowCreateModal(false);
    setNewProjectName('');
    setNewProjectDescription('');

    alert(`✅ Project "${newProject.name}" created!\n\nProject ID: ${newProject.id}\nStatus: Draft\n\nYou can now:\n• Add AR objects\n• Create QR codes\n• Share with team`);
  };

  const deleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (confirm(`Delete project "${project.name}"?\n\nThis will permanently delete:\n• All AR objects\n• QR codes and analytics\n• Project data\n\nThis cannot be undone.`)) {
      setProjects(prev => prev.filter(p => p.id !== projectId));

      // If deleting current project, switch to another one
      if (projectId === currentProject.id) {
        const remainingProjects = projects.filter(p => p.id !== projectId);
        if (remainingProjects.length > 0) {
          onProjectChange({ id: remainingProjects[0].id, name: remainingProjects[0].name });
        }
      }
    }
  };

  const toggleStar = (projectId: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, isStarred: !p.isStarred } : p
    ));
  };

  const updateProjectName = (projectId: string, newName: string) => {
    if (!newName.trim()) return;

    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, name: newName.trim(), lastModified: new Date().toISOString() }
        : p
    ));

    // Update current project if it's the one being edited
    if (projectId === currentProject.id) {
      onProjectChange({ id: projectId, name: newName.trim() });
    }

    setEditingProject(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Project Manager</h2>
                <p className="text-gray-600 text-sm">Create and manage your AR projects</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                disabled={!canCreateProject()}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                  project.id === currentProject.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {editingProject === project.id ? (
                        <input
                          type="text"
                          defaultValue={project.name}
                          onBlur={(e) => updateProjectName(project.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateProjectName(project.id, e.currentTarget.value);
                            }
                            if (e.key === 'Escape') {
                              setEditingProject(null);
                            }
                          }}
                          className="text-lg font-semibold text-gray-900 border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          {project.isStarred && <Star className="w-4 h-4 text-yellow-500" />}
                          {project.id === currentProject.id && (
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Current
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Modified {formatDate(project.lastModified)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{project.totalViews} views</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStar(project.id)}
                    >
                      <Star className={`w-4 h-4 ${project.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingProject(project.id)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onProjectChange({ id: project.id, name: project.name })}
                      disabled={project.id === currentProject.id}
                    >
                      <FolderPlus className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Create your first AR project to get started</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-purple-500 to-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Project</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project name"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your AR project"
                    rows={3}
                    maxLength={200}
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    <strong>Plan Limit:</strong> {features.maxProjects === -1 ? 'Unlimited' : `${projects.length}/${features.maxProjects}`} projects
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={createProject}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                  disabled={!newProjectName.trim() || !canCreateProject()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProjectName('');
                    setNewProjectDescription('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
