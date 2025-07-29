import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000; // Start with 1 second
    this.maxReconnectInterval = 30000; // Max 30 seconds
    
    // Event listeners storage
    this.eventListeners = new Map();
    
    // Polling fallback
    this.isPolling = false;
    this.pollingIntervals = new Map();
    this.pollingCallbacks = new Map();
    
    // Connection state callbacks
    this.connectionStateCallbacks = [];
  }

  /**
   * Initialize WebSocket connection
   * @param {string} userId - Current user ID
   * @param {string} token - Authentication token
   */
  async connect(userId, token) {
    if (this.isConnecting || this.isConnected) {
      return;
    }

    this.isConnecting = true;
    this.userId = userId;
    this.token = token;

    try {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
      
      this.socket = io(wsUrl, {
        auth: {
          token: token,
          userId: userId
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectInterval,
        reconnectionDelayMax: this.maxReconnectInterval,
      });

      this.setupEventHandlers();
      
      // Wait for connection or timeout
      await this.waitForConnection();
      
    } catch (error) {
      console.warn('WebSocket connection failed, falling back to polling:', error);
      this.fallbackToPolling();
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Wait for WebSocket connection to be established
   */
  waitForConnection() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      if (this.socket) {
        this.socket.on('connect', () => {
          clearTimeout(timeout);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.notifyConnectionState('connected');
          console.log('WebSocket connected successfully');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          console.error('WebSocket connection error:', error);
          reject(error);
        });
      } else {
        reject(new Error('Socket not initialized'));
      }
    });
  }

  /**
   * Set up WebSocket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.notifyConnectionState('connected');
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.notifyConnectionState('disconnected');
      console.log('WebSocket disconnected:', reason);
      
      // Don't attempt reconnection if it was intentional
      if (reason === 'io client disconnect') {
        return;
      }
      
      // Fallback to polling if reconnection fails
      setTimeout(() => {
        if (!this.isConnected) {
          this.fallbackToPolling();
        }
      }, 5000);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached, falling back to polling');
        this.fallbackToPolling();
      }
    });

    // Follow-related events
    this.socket.on('follow_update', (data) => {
      this.handleFollowUpdate(data);
    });

    this.socket.on('notification', (data) => {
      this.handleNotification(data);
    });

    // User count updates
    this.socket.on('user_counts_update', (data) => {
      this.handleUserCountsUpdate(data);
    });
  }

  /**
   * Handle follow update events
   */
  handleFollowUpdate(data) {
    const { type, followerId, followedId, timestamp } = data;
    
    // Notify all registered listeners
    const listeners = this.eventListeners.get('follow_update') || [];
    listeners.forEach(callback => {
      try {
        callback({ type, followerId, followedId, timestamp });
      } catch (error) {
        console.error('Error in follow update listener:', error);
      }
    });
  }

  /**
   * Handle notification events
   */
  handleNotification(data) {
    const listeners = this.eventListeners.get('notification') || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  /**
   * Handle user counts update events
   */
  handleUserCountsUpdate(data) {
    const listeners = this.eventListeners.get('user_counts_update') || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in user counts update listener:', error);
      }
    });
  }

  /**
   * Emit follow action
   */
  emitFollowAction(action, targetUserId) {
    if (this.isConnected && this.socket) {
      this.socket.emit('follow_action', {
        action, // 'follow' or 'unfollow'
        targetUserId,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Subscribe to events
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionStateChange(callback) {
    this.connectionStateCallbacks.push(callback);
  }

  /**
   * Notify connection state change
   */
  notifyConnectionState(state) {
    this.connectionStateCallbacks.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in connection state callback:', error);
      }
    });
  }

  /**
   * Fallback to polling when WebSocket is unavailable
   */
  fallbackToPolling() {
    if (this.isPolling) return;
    
    console.log('Falling back to polling for real-time updates');
    this.isPolling = true;
    this.notifyConnectionState('polling');
    
    // Start polling for follow updates
    this.startPolling('follow_updates', () => this.pollFollowUpdates(), 5000);
    
    // Start polling for notifications
    this.startPolling('notifications', () => this.pollNotifications(), 10000);
  }

  /**
   * Start a polling interval
   */
  startPolling(key, callback, interval) {
    // Clear existing interval if any
    this.stopPolling(key);
    
    // Store callback for later use
    this.pollingCallbacks.set(key, callback);
    
    // Start polling
    const intervalId = setInterval(callback, interval);
    this.pollingIntervals.set(key, intervalId);
    
    // Execute immediately
    callback();
  }

  /**
   * Stop a specific polling interval
   */
  stopPolling(key) {
    if (this.pollingIntervals.has(key)) {
      clearInterval(this.pollingIntervals.get(key));
      this.pollingIntervals.delete(key);
    }
    this.pollingCallbacks.delete(key);
  }

  /**
   * Poll for follow updates
   */
  async pollFollowUpdates() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/follows/updates/`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.updates && data.updates.length > 0) {
          data.updates.forEach(update => this.handleFollowUpdate(update));
        }
      }
    } catch (error) {
      console.error('Error polling follow updates:', error);
    }
  }

  /**
   * Poll for notifications
   */
  async pollNotifications() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/unread/`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.notifications && data.notifications.length > 0) {
          data.notifications.forEach(notification => this.handleNotification(notification));
        }
      }
    } catch (error) {
      console.error('Error polling notifications:', error);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    if (this.isConnected) return 'connected';
    if (this.isPolling) return 'polling';
    return 'disconnected';
  }

  /**
   * Disconnect WebSocket and stop polling
   */
  disconnect() {
    // Clear all polling intervals
    this.pollingIntervals.forEach((intervalId, key) => {
      clearInterval(intervalId);
    });
    this.pollingIntervals.clear();
    this.pollingCallbacks.clear();
    
    // Disconnect socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Reset state
    this.isConnected = false;
    this.isPolling = false;
    this.reconnectAttempts = 0;
    
    this.notifyConnectionState('disconnected');
  }

  /**
   * Retry connection
   */
  async retry() {
    if (this.isConnecting || this.isConnected) return;
    
    this.disconnect();
    await this.connect(this.userId, this.token);
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
