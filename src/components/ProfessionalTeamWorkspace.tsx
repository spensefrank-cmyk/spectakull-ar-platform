'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  Users, MessageCircle, Video, Eye, Share2, Download,
  Clock, Activity, Zap, Crown, Star,
  ChevronRight, Plus, Settings, Globe,
  MousePointer, Edit3, Copy, Play, Pause, UserPlus
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  isOnline: boolean;
  lastActive: string;
  cursor?: { x: number; y: number; color: string };
}

interface TeamProject {
  id: string;
  name: string;
  thumbnail: string;
  lastModified: string;
  collaborators: string[];
  status: 'draft' | 'review' | 'published';
  views: number;
}

export function ProfessionalTeamWorkspace() {
  const { currentTeam, isFeatureAvailable } = useSubscription();
  const [activeView, setActiveView] = useState<'projects' | 'members' | 'activity'>('projects');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [showLiveCursors, setShowLiveCursors] = useState(true);
  const [realTimeActivity, setRealTimeActivity] = useState({
    editsToday: 12,
    totalViews: 8400,
    onlineMembers: 2
  });

  // Professional team collaboration data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: '👩‍🎨',
      role: 'owner',
      isOnline: true,
      lastActive: 'now',
      cursor: { x: 45, y: 60, color: '#3B82F6' }
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      email: 'marcus@company.com',
      avatar: '👨‍💻',
      role: 'admin',
      isOnline: true,
      lastActive: '2 min ago',
      cursor: { x: 70, y: 30, color: '#10B981' }
    },
    {
      id: '3',
      name: 'Aisha Patel',
      email: 'aisha@company.com',
      avatar: '👩‍🔬',
      role: 'editor',
      isOnline: false,
      lastActive: '1 hour ago'
    }
  ]);

  const [teamProjects] = useState<TeamProject[]>([
    {
      id: '1',
      name: 'Product Launch AR Experience',
      thumbnail: '/api/placeholder/300/200',
      lastModified: '5 minutes ago',
      collaborators: ['1', '2'],
      status: 'review',
      views: 1234
    },
    {
      id: '2',
      name: 'Training Module - Safety Procedures',
      thumbnail: '/api/placeholder/300/200',
      lastModified: '2 hours ago',
      collaborators: ['1', '2', '3'],
      status: 'published',
      views: 5678
    },
    {
      id: '3',
      name: 'Interactive Product Demo',
      thumbnail: '/api/placeholder/300/200',
      lastModified: 'Yesterday',
      collaborators: ['2'],
      status: 'draft',
      views: 89
    }
  ]);

  const [recentActivity] = useState([
    {
      id: '1',
      user: 'Sarah Chen',
      action: 'published',
      target: 'Product Launch AR Experience',
      time: '5 min ago',
      type: 'publish'
    },
    {
      id: '2',
      user: 'Marcus Rodriguez',
      action: 'commented on',
      target: 'Training Module - Safety Procedures',
      time: '15 min ago',
      type: 'comment'
    },
    {
      id: '3',
      user: 'Aisha Patel',
      action: 'edited',
      target: 'Interactive Product Demo',
      time: '1 hour ago',
      type: 'edit'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-purple-600';
      case 'admin': return 'text-blue-600';
      case 'editor': return 'text-green-600';
      case 'viewer': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  // Simulate real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeActivity(prev => ({
        editsToday: prev.editsToday + Math.floor(Math.random() * 3),
        totalViews: prev.totalViews + Math.floor(Math.random() * 10),
        onlineMembers: teamMembers.filter(m => m.isOnline).length
      }));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [teamMembers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Team Workspace Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Spectakull Teams</h1>
                  <p className="text-sm text-gray-600">{currentTeam?.name || 'Collaborative AR Studio'}</p>
                </div>
              </div>

              {/* Live Collaboration Indicator */}
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">
                  {teamMembers.filter(m => m.isOnline).length} online
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Video Call Button */}
              <Button
                variant={isVideoCallActive ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (!isVideoCallActive) {
                    // Simulate requesting camera/microphone permissions
                    if (confirm('📹 Start team video call?\n\nThis will:\n• Request camera and microphone access\n• Notify all online team members\n• Enable real-time collaboration\n\nProceed?')) {
                      setIsVideoCallActive(true);
                      // Simulate notification to team
                      setTimeout(() => {
                        alert('📞 AR Team Call Started!\n\nOnline members notified:\n• Sarah Chen (Owner) - Joined\n• Marcus Rodriguez (Admin) - Joining...\n\nSpectakull Features:\n• AR workspace sync\n• Live 3D object sharing\n• Real-time AR collaboration');
                      }, 1000);
                    }
                  } else {
                    setIsVideoCallActive(false);
                    alert('📞 Video call ended.\n\nCall summary:\n• Duration: 15 minutes\n• Participants: 2\n• Features used: Screen sharing, AR sync');
                  }
                }}
                className={isVideoCallActive ? "bg-red-600 hover:bg-red-700 text-white" : ""}
              >
                <Video className="w-4 h-4 mr-2" />
                {isVideoCallActive ? 'End Call' : 'Start Call'}
              </Button>

              {/* Live Cursors Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLiveCursors(!showLiveCursors)}
                className={showLiveCursors ? "bg-blue-50 border-blue-200" : ""}
              >
                <MousePointer className="w-4 h-4 mr-2" />
                Cursors
              </Button>

              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Team Members Strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Team:</span>
              <div className="flex -space-x-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="relative"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm">
                      {member.avatar}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const email = prompt('Enter email address to invite:');
                  if (email) {
                    alert(`✅ Invitation sent to ${email}!\n\nThey will receive:\n• Access to team workspace\n• Real-time collaboration\n• Project permissions\n\nInvite link: spectakull.com/invite/${Math.random().toString(36).substr(2, 8)}`);
                  }
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Invite
              </Button>
            </div>

            {/* Real-time Activity */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>{realTimeActivity.editsToday} edits today</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{(realTimeActivity.totalViews / 1000).toFixed(1)}K total views</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'projects', label: 'Projects', icon: Globe },
            { id: 'members', label: 'Team', icon: Users },
            { id: 'activity', label: 'Activity', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Views */}
        {activeView === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Team Projects</h2>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  const projectName = prompt('Enter project name:');
                  if (projectName) {
                    alert(`✅ Project "${projectName}" created!\n\nFeatures enabled:\n• Real-time collaboration\n• Live AR preview\n• Team member access\n• Version control\n\nProject ID: proj_${Date.now()}`);
                  }
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>Modified {project.lastModified}</span>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{project.views.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {project.collaborators.slice(0, 3).map((memberId) => {
                          const member = teamMembers.find(m => m.id === memberId);
                          return member ? (
                            <div key={memberId} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                              {member.avatar}
                            </div>
                          ) : null;
                        })}
                        {project.collaborators.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                            +{project.collaborators.length - 3}
                          </div>
                        )}
                      </div>

                      <Button variant="ghost" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <Button variant="outline">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              {teamMembers.map((member, index) => (
                <div key={member.id} className={`p-4 ${index !== teamMembers.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                          {member.avatar}
                        </div>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          <span className={`text-sm font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                          {member.role === 'owner' && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-xs text-gray-500">Last active: {member.lastActive}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {member.isOnline && (
                        <div className="flex items-center space-x-1 text-green-600 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Online</span>
                        </div>
                      )}
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'activity' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>

            <div className="bg-white rounded-lg border border-gray-200">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className={`p-4 ${index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'publish' ? 'bg-green-100' :
                      activity.type === 'comment' ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      {activity.type === 'publish' && <Globe className="w-4 h-4 text-green-600" />}
                      {activity.type === 'comment' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'edit' && <Edit3 className="w-4 h-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Cursors Overlay */}
      {showLiveCursors && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {teamMembers
            .filter(member => member.isOnline && member.cursor)
            .map(member => (
              <div
                key={member.id}
                className="absolute transition-all duration-100 ease-out"
                style={{
                  left: `${member.cursor!.x}%`,
                  top: `${member.cursor!.y}%`,
                  color: member.cursor!.color
                }}
              >
                <MousePointer className="w-5 h-5" style={{ color: member.cursor!.color }} />
                <div className="ml-2 mt-1 px-2 py-1 rounded-md text-xs font-medium text-white"
                     style={{ backgroundColor: member.cursor!.color }}>
                  {member.name}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Video Call Overlay */}
      {isVideoCallActive && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Team Call Active</span>
          </div>
          <div className="flex space-x-2">
            {teamMembers.filter(m => m.isOnline).map(member => (
              <div key={member.id} className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-sm border">
                {member.avatar}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setIsVideoCallActive(false)}
          >
            End Call
          </Button>
        </div>
      )}
    </div>
  );
}
