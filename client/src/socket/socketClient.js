import { io } from 'socket.io-client';

// Get the API base URL dynamically
const getSocketUrl = () => {
  const hostname = window.location.hostname;

  // Development environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5001';
  }

  // Production environment
  if (hostname.includes('project-pilot') || hostname.includes('render.com')) {
    return 'https://project-pilot-tx67.onrender.com';
  }

  // Fallback
  return process.env.NODE_ENV === 'production'
    ? 'https://project-pilot-tx67.onrender.com'
    : 'http://localhost:5001';
};

// Create socket instance
const socket = io(getSocketUrl(), {
  autoConnect: false,
  forceNew: true,
  timeout: 5000,
  transports: ['websocket', 'polling'],
});

// Connection state management
let isConnected = false;
let currentUserId = null;
let projectRooms = [];

// Event listeners
const listeners = new Map();

// Connection event handlers
socket.on('connect', () => {
  console.log('🎯 Connected to server:', socket.id);
  isConnected = true;

  // Re-authenticate if we have a user ID
  if (currentUserId) {
    socket.emit('authenticate', currentUserId);
  }

  // Rejoin project rooms
  projectRooms.forEach(projectId => {
    socket.emit('join_project', projectId);
  });
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
  isConnected = false;
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error.message);
  isConnected = false;
});

socket.on('reconnect', (attempt) => {
  console.log('🔄 Reconnected after', attempt, 'attempts');
  isConnected = true;
});

// Authentication
export const authenticateSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
  }

  currentUserId = userId;
  socket.emit('authenticate', userId);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Authentication timeout'));
    }, 5000);

    socket.once('authenticated', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
};

// Project room management
export const joinProjectRoom = (projectId) => {
  if (socket.connected) {
    socket.emit('join_project', projectId);
    if (!projectRooms.includes(projectId)) {
      projectRooms.push(projectId);
    }
  }
};

export const leaveProjectRoom = (projectId) => {
  if (socket.connected) {
    socket.emit('leave_project', projectId);
    projectRooms = projectRooms.filter(id => id !== projectId);
  }
};

// Event subscription management
export const on = (event, callback) => {
  const eventKey = `task_${event}`;

  if (!listeners.has(eventKey)) {
    listeners.set(eventKey, []);
    socket.on(eventKey, (data) => {
      listeners.get(eventKey).forEach(cb => cb(data));
    });
  }

  listeners.get(eventKey).push(callback);

  // Return unsubscribe function
  return () => off(event, callback);
};

export const off = (event, callback) => {
  const eventKey = `task_${event}`;
  const eventListeners = listeners.get(eventKey);

  if (eventListeners) {
    const index = eventListeners.indexOf(callback);
    if (index !== -1) {
      eventListeners.splice(index, 1);
    }

    if (eventListeners.length === 0) {
      socket.off(eventKey);
      listeners.delete(eventKey);
    }
  }
};

// Cleanup function
export const disconnectSocket = () => {
  socket.disconnect();
  isConnected = false;
  currentUserId = null;
  projectRooms = [];
  listeners.clear();
};

// Connection status
export const isSocketConnected = () => isConnected;
export const getSocketId = () => socket.id;

// Export socket instance for advanced usage
export { socket };
export default socket;
