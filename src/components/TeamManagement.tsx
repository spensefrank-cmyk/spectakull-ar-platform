'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  Users, Plus, Crown, Mail, Settings, UserPlus,
  Shield, Star, ChevronRight, Copy, Check, X
} from 'lucide-react';

export function TeamManagement() {
  const {
    currentTeam,
    teams,
    createTeam,
    switchTeam,
    inviteToTeam,
    currentTier,
    isFeatureAvailable
  } = useSubscription();

  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [isCreating, setIsCreating] = useState(false);

  if (!isFeatureAvailable('teamManagement')) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Collaboration</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upgrade to Pro or Enterprise to create teams and collaborate with your colleagues in real-time.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Team Features Include:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Real-time collaboration</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Team project sharing</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Role-based permissions</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Team analytics</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Pro Plan</h4>
              <p className="text-2xl font-bold text-blue-600 mb-2">$29<span className="text-sm text-gray-600">/month</span></p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Up to 10 team members</li>
                <li>• 50 projects</li>
                <li>• 50GB storage</li>
                <li>• Priority support</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Upgrade to Pro
              </Button>
            </div>

            <div className="border-2 border-purple-200 rounded-lg p-4 bg-gradient-to-b from-purple-50 to-white">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">Enterprise</h4>
                <Crown className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-2">$99<span className="text-sm text-gray-600">/month</span></p>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Unlimited team members</li>
                <li>• Unlimited projects</li>
                <li>• 500GB storage</li>
                <li>• Custom branding</li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Upgrade to Enterprise
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return;

    setIsCreating(true);
    try {
      await createTeam(teamName, 'pro'); // Default to pro for new teams
      setTeamName('');
      setShowCreateTeam(false);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !currentTeam) return;

    try {
      await inviteToTeam(inviteEmail, inviteRole);
      setInviteEmail('');
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Collaborate with your team on AR projects</p>
        </div>

        <Button
          onClick={() => setShowCreateTeam(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      {/* Current Team */}
      {currentTeam && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentTeam.name}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentTeam.tier === 'pro' ? 'bg-blue-100 text-blue-700' :
                  currentTeam.tier === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {currentTeam.tier.charAt(0).toUpperCase() + currentTeam.tier.slice(1)} Plan
                </span>
                <span className="text-gray-600 text-sm">{currentTeam.members.length} members</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => setShowInviteModal(true)}
                variant="outline"
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Team Members</h3>
            {currentTeam.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {member.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{member.email}</div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.role === 'owner' ? 'bg-yellow-100 text-yellow-700' :
                        member.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.role === 'owner' && <Crown className="w-3 h-3 inline mr-1" />}
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {member.role !== 'owner' && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Team Features */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentTeam.features.maxProjects === -1 ? '∞' : currentTeam.features.maxProjects}</div>
              <div className="text-gray-600 text-sm">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentTeam.features.storageGB}GB</div>
              <div className="text-gray-600 text-sm">Storage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentTeam.members.length}</div>
              <div className="text-gray-600 text-sm">Members</div>
            </div>
          </div>
        </div>
      )}

      {/* All Teams */}
      {teams.length > 1 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Switch Teams</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  currentTeam?.id === team.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => switchTeam(team.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{team.name}</h4>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600">
                  {team.members.length} members • {team.tier} plan
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Team</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Team Plan: Pro</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Up to 10 team members</li>
                    <li>• 50 projects</li>
                    <li>• Real-time collaboration</li>
                    <li>• Priority support</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowCreateTeam(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTeam}
                    disabled={!teamName.trim() || isCreating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isCreating ? 'Creating...' : 'Create Team'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Invite Team Member</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setInviteRole('member')}
                      className={`p-3 rounded-lg border-2 text-left ${
                        inviteRole === 'member'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">Member</div>
                      <div className="text-sm text-gray-600">Can edit projects</div>
                    </button>
                    <button
                      onClick={() => setInviteRole('admin')}
                      className={`p-3 rounded-lg border-2 text-left ${
                        inviteRole === 'admin'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">Admin</div>
                      <div className="text-sm text-gray-600">Can invite others</div>
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowInviteModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteUser}
                    disabled={!inviteEmail.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
