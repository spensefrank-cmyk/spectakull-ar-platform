// AR Connection Manager for Live View
// Handles WebSocket connections, WebRTC, and fallbacks

export interface ARConnectionConfig {
  serverUrl?: string;
  enableWebRTC?: boolean;
  enableWebSocket?: boolean;
  fallbackToPolling?: boolean;
  heartbeatInterval?: number;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface ARLiveData {
  objects: any[];
  camera: {
    position: [number, number, number];
    rotation: [number, number, number];
    fov: number;
  };
  timestamp: number;
  sessionId: string;
}

export class ARConnectionManager {
  private config: ARConnectionConfig;
  private websocket: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private onDataCallback: ((data: ARLiveData) => void) | null = null;
  private onStatusCallback: ((status: 'connecting' | 'connected' | 'disconnected' | 'error') => void) | null = null;

  constructor(config: ARConnectionConfig = {}) {
    this.config = {
      serverUrl: this.getWebSocketUrl(),
      enableWebRTC: true,
      enableWebSocket: true,
      fallbackToPolling: true,
      heartbeatInterval: 30000, // 30 seconds
      reconnectAttempts: 5,
      reconnectDelay: 3000, // 3 seconds
      ...config
    };
  }

  private getWebSocketUrl(): string {
    if (typeof window === 'undefined') {
      return 'ws://localhost:3000';
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;

    // For Vercel deployments, always use wss://
    if (host.includes('.vercel.app') || window.location.protocol === 'https:') {
      return `wss://${host}/api/ar-websocket`;
    }

    // For local development with proper binding
    if (host.includes('localhost') || host.includes('127.0.0.1') || host.startsWith('0.0.0.0')) {
      return `ws://${host}/api/ar-websocket`;
    }

    // Default to secure WebSocket
    return `wss://${host}/api/ar-websocket`;
  }

  public async connect(): Promise<boolean> {
    if (this.isConnected) {
      console.log('🔗 AR Connection: Already connected');
      return true;
    }

    this.onStatusCallback?.('connecting');
    console.log('🚀 AR Connection: Attempting to connect to', this.config.serverUrl);

    try {
      // First, try WebSocket connection
      if (this.config.enableWebSocket) {
        const connected = await this.connectWebSocket();
        if (connected) {
          this.startHeartbeat();
          return true;
        }
      }

      // If WebSocket fails, try WebRTC (for peer-to-peer AR sharing)
      if (this.config.enableWebRTC) {
        console.log('📡 Attempting WebRTC connection for AR live view...');
        // WebRTC implementation would go here
        // For now, we'll simulate a fallback
      }

      // Final fallback to polling
      if (this.config.fallbackToPolling) {
        console.log('🔄 Falling back to polling for AR data...');
        this.startPolling();
        return true;
      }

      throw new Error('All connection methods failed');

    } catch (error) {
      console.error('❌ AR Connection failed:', error);
      this.onStatusCallback?.('error');

      // Attempt reconnection
      if (this.reconnectAttempts < (this.config.reconnectAttempts || 5)) {
        this.reconnectAttempts++;
        console.log(`🔄 Retrying AR connection (${this.reconnectAttempts}/${this.config.reconnectAttempts})...`);

        setTimeout(() => {
          this.connect();
        }, this.config.reconnectDelay);
      }

      return false;
    }
  }

  private async connectWebSocket(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        console.log('🌐 Creating WebSocket connection to:', this.config.serverUrl);
        this.websocket = new WebSocket(this.config.serverUrl!);

        const connectionTimeout = setTimeout(() => {
          console.warn('⏰ WebSocket connection timeout');
          this.websocket?.close();
          resolve(false);
        }, 10000); // 10 second timeout

        this.websocket.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('✅ WebSocket connected for AR live view');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.onStatusCallback?.('connected');
          resolve(true);
        };

        this.websocket.onmessage = (event) => {
          try {
            const data: ARLiveData = JSON.parse(event.data);
            this.onDataCallback?.(data);
          } catch (error) {
            console.error('❌ Failed to parse AR data:', error);
          }
        };

        this.websocket.onclose = (event) => {
          console.log('🔌 WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          this.onStatusCallback?.('disconnected');
          this.stopHeartbeat();

          // Auto-reconnect for unexpected disconnections
          if (event.code !== 1000 && this.reconnectAttempts < (this.config.reconnectAttempts || 5)) {
            setTimeout(() => this.connect(), this.config.reconnectDelay);
          }
        };

        this.websocket.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error('❌ WebSocket error:', error);
          this.onStatusCallback?.('error');
          resolve(false);
        };

      } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        resolve(false);
      }
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.websocket?.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private startPolling(): void {
    // Fallback polling implementation for when WebSocket/WebRTC fail
    console.log('📊 Starting AR data polling fallback...');

    const poll = async () => {
      try {
        const response = await fetch('/api/ar-data');
        if (response.ok) {
          const data: ARLiveData = await response.json();
          this.onDataCallback?.(data);
        }
      } catch (error) {
        console.warn('⚠️ Polling failed:', error);
      }

      // Continue polling every 2 seconds
      setTimeout(poll, 2000);
    };

    poll();
    this.isConnected = true;
    this.onStatusCallback?.('connected');
  }

  public sendData(data: Partial<ARLiveData>): void {
    if (this.websocket?.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
    } else {
      console.warn('⚠️ Cannot send data: WebSocket not connected');
    }
  }

  public onData(callback: (data: ARLiveData) => void): void {
    this.onDataCallback = callback;
  }

  public onStatus(callback: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void): void {
    this.onStatusCallback = callback;
  }

  public disconnect(): void {
    console.log('🔌 Disconnecting AR connection...');

    this.stopHeartbeat();

    if (this.websocket) {
      this.websocket.close(1000, 'Client disconnecting');
      this.websocket = null;
    }

    this.isConnected = false;
    this.onStatusCallback?.('disconnected');
  }

  public getConnectionStatus(): {
    isConnected: boolean;
    connectionType: 'websocket' | 'webrtc' | 'polling' | 'none';
    url: string | undefined;
  } {
    let connectionType: 'websocket' | 'webrtc' | 'polling' | 'none' = 'none';

    if (this.websocket?.readyState === WebSocket.OPEN) {
      connectionType = 'websocket';
    } else if (this.isConnected) {
      connectionType = 'polling';
    }

    return {
      isConnected: this.isConnected,
      connectionType,
      url: this.config.serverUrl
    };
  }
}

// React hook for AR connection
import { useEffect, useState, useCallback } from 'react';

export function useARConnection(config?: ARConnectionConfig) {
  const [connection] = useState(() => new ARConnectionManager(config));
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [data, setData] = useState<ARLiveData | null>(null);

  useEffect(() => {
    connection.onStatus(setStatus);
    connection.onData(setData);

    // Auto-connect
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [connection]);

  const sendData = useCallback((data: Partial<ARLiveData>) => {
    connection.sendData(data);
  }, [connection]);

  const reconnect = useCallback(() => {
    connection.connect();
  }, [connection]);

  return {
    status,
    data,
    sendData,
    reconnect,
    connectionInfo: connection.getConnectionStatus()
  };
}

export default ARConnectionManager;
