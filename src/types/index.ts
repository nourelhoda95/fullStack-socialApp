// Core type definitions for the application

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  coverPhoto?: string;
  followers: string[]; // User IDs
  following: string[]; // User IDs
  role: 'user' | 'admin';
  createdAt: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images?: string[];
  likes: string[]; // User IDs
  comments: Comment[];
  savedBy: string[]; // User IDs who saved this post
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  seen: boolean;
  createdAt: string;
}

export interface Conversation {
  userId: string;
  lastMessage: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  userId: string; // Who triggered the notification
  targetUserId: string; // Who receives the notification
  postId?: string; // For likes and comments
  content: string;
  read: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface Theme {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
}
