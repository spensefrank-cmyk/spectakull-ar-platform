'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: number;
  cursor?: { x: number; y: number };
  currentObject?: string; // ID of object being edited
  color: string; // User's unique color for cursors/selections
}

export interface CollaborationEvent {
  id: string;
  type: 'object_update' | 'object_select' | 'cursor_move' | 'chat_message' | 'user_join' | 'user_leave';
  userId: string;
  timestamp: number;
  data: Record<string, unknown>;
}

interface CollaborationContextType {
  isConnected: boolean;
  users: CollaborationUser[];
  messages: Array<{ userId: string; userName: string; message: string; timestamp: number }>;
  connectToProject: (projectId: string) => void;
  disconnect: () => void;
  broadcastObjectUpdate: (objectId: string, objectData: Record<string, unknown>) => void;
  broadcastObjectSelection: (objectId: string | null) => void;
  broadcastCursorMove: (x: number, y: number) => void;
  sendChatMessage: (message: string) => void;
  isUserEditingObject: (objectId: string) => boolean;
  getUserEditingObject: (objectId: string) => CollaborationUser | null;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<CollaborationUser[]>([]);
  const [messages, setMessages] = useState<Array<{ userId: string; userName: string; message: string; timestamp: number }>>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    if (user && currentProjectId) {
      // Simulate other users in the project
      const mockUsers: CollaborationUser[] = [
        {
          id: 'user_1',
          name: 'Sarah Wilson',
          email: 'sarah@company.com',
          isOnline: true,
          lastSeen: Date.now(),
          color: '#ff6b6b'
        },
        {
          id: 'user_2',
          name: 'Mike Chen',
          email: 'mike@company.com',
          isOnline: true,
          lastSeen: Date.now() - 300000, // 5 minutes ago
          color: '#4ecdc4'
        },
        {
          id: 'user_3',
          name: 'Alex Rodriguez',
          email: 'alex@company.com',
          isOnline: false,
          lastSeen: Date.now() - 3600000, // 1 hour ago
          color: '#45b7d1'
        }
      ];

      setUsers(mockUsers);
      setIsConnected(true);

      // Simulate some chat messages
      setMessages([
        {
          userId: 'user_1',
          userName: 'Sarah Wilson',
          message: 'Just added a new cube to the scene!',
          timestamp: Date.now() - 600000
        },
        {
          userId: 'user_2',
          userName: 'Mike Chen',
          message: 'Looking great! Can we make it a bit more metallic?',
          timestamp: Date.now() - 300000
        }
      ]);
    }
  }, [user, currentProjectId]);

  const connectToProject = useCallback((projectId: string) => {
    setCurrentProjectId(projectId);
    setIsConnected(true);
    console.log(`Connected to project: ${projectId}`);
  }, []);

  const disconnect = useCallback(() => {
    setCurrentProjectId(null);
    setIsConnected(false);
    setUsers([]);
    setMessages([]);
    console.log('Disconnected from collaboration');
  }, []);

  const broadcastObjectUpdate = useCallback((objectId: string, objectData: Record<string, unknown>) => {
    console.log('Broadcasting object update:', { objectId, objectData });
    // In a real implementation, this would send data to WebSocket/WebRTC

    // Update user's current object
    if (user) {
      setUsers(prev => prev.map(u =>
        u.id === user.id
          ? { ...u, currentObject: objectId }
          : u
      ));
    }
  }, [user]);

  const broadcastObjectSelection = useCallback((objectId: string | null) => {
    console.log('Broadcasting object selection:', objectId);
    // In a real implementation, this would send data to WebSocket/WebRTC

    if (user) {
      setUsers(prev => prev.map(u =>
        u.id === user.id
          ? { ...u, currentObject: objectId || undefined }
          : u
      ));
    }
  }, [user]);

  const broadcastCursorMove = useCallback((x: number, y: number) => {
    // Only broadcast cursor moves occasionally to avoid spam
    if (user) {
      setUsers(prev => prev.map(u =>
        u.id === user.id
          ? { ...u, cursor: { x, y } }
          : u
      ));
    }
  }, [user]);

  const sendChatMessage = useCallback((message: string) => {
    if (user && message.trim()) {
      const newMessage = {
        userId: user.id,
        userName: user.name,
        message: message.trim(),
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newMessage]);
      console.log('Sent chat message:', newMessage);
    }
  }, [user]);

  const isUserEditingObject = useCallback((objectId: string): boolean => {
    return users.some(u => u.currentObject === objectId && u.id !== user?.id);
  }, [users, user]);

  const getUserEditingObject = useCallback((objectId: string): CollaborationUser | null => {
    return users.find(u => u.currentObject === objectId && u.id !== user?.id) || null;
  }, [users, user]);

  return (
    <CollaborationContext.Provider value={{
      isConnected,
      users,
      messages,
      connectToProject,
      disconnect,
      broadcastObjectUpdate,
      broadcastObjectSelection,
      broadcastCursorMove,
      sendChatMessage,
      isUserEditingObject,
      getUserEditingObject
    }}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}
