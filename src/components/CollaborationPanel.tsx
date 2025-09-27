'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  Users, MessageCircle, Video, Share2, Crown,
  Send, X, Mic, MicOff, Video as VideoIcon, VideoOff
} from 'lucide-react';

interface CollaborationPanelProps {
  projectId?: string;
  onClose?: () => void;
}

export function CollaborationPanel({ projectId, onClose }: CollaborationPanelProps) {
  const { user } = useAuth();
  const { isFeatureAvailable, setShowUpgradeModal } = useSubscription();
  const {
    isConnected,
    users,
    messages,
    connectToProject,
    disconnect,
    sendChatMessage
  } = useCollaboration();

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'chat' | 'video'>('users');
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  // Check if collaboration features are available
  if (!isFeatureAvailable('collaboration')) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pro Feature Required</h3>
            <p className="text-white/80 mb-6">
              Real-time collaboration is a Pro feature. Work together with your team in real-time!
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full bg-white/10 border-white/20 text-white">
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendChatMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleConnect = () => {
    if (projectId) {
      connectToProject(projectId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Team Collaboration</h2>
                <p className="text-white/60 text-sm">
                  {isConnected ? `${users.length} member${users.length !== 1 ? 's' : ''} online` : 'Not connected'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="p-4 border-b border-white/20">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-3">Connect to start collaborating</p>
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white"
              >
                Connect to Project
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        {isConnected && (
          <div className="border-b border-white/20">
            <div className="flex">
              {[
                { id: 'users', label: 'Team', icon: Users },
                { id: 'chat', label: 'Chat', icon: MessageCircle },
                { id: 'video', label: 'Video', icon: Video }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 px-4 py-3 flex items-center justify-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white border-b-2 border-purple-400'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {isConnected && (
          <div className="flex-1 overflow-y-auto p-4 max-h-96">
            {activeTab === 'users' && (
              <div className="space-y-3">
                {users.map((collaborationUser) => (
                  <div key={collaborationUser.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: collaborationUser.color }}
                      >
                        {collaborationUser.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">
                          {collaborationUser.name}
                          {collaborationUser.id === user?.id && (
                            <span className="text-cyan-400 text-xs ml-1">(You)</span>
                          )}
                        </div>
                        <div className="text-white/60 text-xs">{collaborationUser.email}</div>
                        {collaborationUser.currentObject && (
                          <div className="text-cyan-400 text-xs">
                            ✏️ Editing object
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${collaborationUser.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  </div>
                ))}

                {users.length === 1 && (
                  <div className="text-center py-6 text-white/60">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-sm">You're the only one here</div>
                    <div className="text-xs mt-1">Share this project to collaborate!</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="space-y-4">
                {/* Messages */}
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-6 text-white/60">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">No messages yet</div>
                      <div className="text-xs">Start a conversation!</div>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-sm">{message.userName}</span>
                          <span className="text-white/60 text-xs">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">{message.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <VideoIcon className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <div className="text-white font-medium mb-2">Video Call</div>
                  <div className="text-white/60 text-sm mb-4">Start a video call with your team</div>

                  <div className="flex justify-center space-x-3 mb-4">
                    <Button
                      onClick={() => setIsMicOn(!isMicOn)}
                      variant="outline"
                      size="sm"
                      className={`border-white/20 ${isMicOn ? 'bg-green-600 text-white' : 'bg-white/10 text-white'}`}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => setIsVideoOn(!isVideoOn)}
                      variant="outline"
                      size="sm"
                      className={`border-white/20 ${isVideoOn ? 'bg-green-600 text-white' : 'bg-white/10 text-white'}`}
                    >
                      {isVideoOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                  </div>

                  <Button className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                    Start Video Call
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        {isConnected && (
          <div className="border-t border-white/20 p-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Project
              </Button>
              <Button
                onClick={disconnect}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
