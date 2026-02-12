import { User, Post, Message, Notification } from '../types';

// Mock data generation
export const generateMockUsers = (): User[] => {
  return [
    {
      id: '1',
      username: 'johndoe',
      email: 'john@example.com',
      fullName: 'John Doe',
      bio: 'Software Engineer | Coffee Enthusiast ☕',
      profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      coverPhoto: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
      followers: ['2', '3', '4'],
      following: ['2', '5'],
      role: 'user',
      createdAt: '2024-01-15T10:00:00Z',
      isOnline: true,
    },
    {
      id: '2',
      username: 'sarahsmith',
      email: 'sarah@example.com',
      fullName: 'Sarah Smith',
      bio: 'Digital Artist 🎨 | Travel Lover',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      coverPhoto: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200',
      followers: ['1', '3'],
      following: ['1', '4', '5'],
      role: 'user',
      createdAt: '2024-01-10T10:00:00Z',
      isOnline: true,
    },
    {
      id: '3',
      username: 'mikejohnson',
      email: 'mike@example.com',
      fullName: 'Mike Johnson',
      bio: 'Photographer 📸 | Nature Enthusiast',
      profilePicture: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
      coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      followers: ['1', '2', '4'],
      following: ['1', '2'],
      role: 'user',
      createdAt: '2024-01-20T10:00:00Z',
      isOnline: false,
    },
    {
      id: '4',
      username: 'emilydavis',
      email: 'emily@example.com',
      fullName: 'Emily Davis',
      bio: 'Content Creator | Fitness Coach 💪',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      coverPhoto: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
      followers: ['2', '3'],
      following: ['1', '2', '5'],
      role: 'user',
      createdAt: '2024-02-01T10:00:00Z',
      isOnline: true,
    },
    {
      id: '5',
      username: 'alexchen',
      email: 'alex@example.com',
      fullName: 'Alex Chen',
      bio: 'Tech Enthusiast | Gamer 🎮',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      coverPhoto: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
      followers: ['1', '4'],
      following: ['2', '3'],
      role: 'user',
      createdAt: '2024-01-25T10:00:00Z',
      isOnline: false,
    },
  ];
};

export const generateMockPosts = (): Post[] => {
  return [
    {
      id: '1',
      userId: '2',
      content: 'Just finished my latest digital artwork! What do you think? 🎨',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      likes: ['1', '3', '4'],
      comments: [
        {
          id: 'c1',
          userId: '1',
          content: 'This is amazing! Love the colors 🔥',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'c2',
          userId: '3',
          content: 'Incredible work!',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ],
      savedBy: ['1'],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      userId: '3',
      content: 'Captured this beautiful sunset during my hike today 🌅',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      likes: ['1', '2', '4', '5'],
      comments: [
        {
          id: 'c3',
          userId: '2',
          content: 'Stunning shot! 📸',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
      ],
      savedBy: ['1', '2'],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      userId: '1',
      content: 'Coffee and code - the perfect combination for a productive day ☕💻',
      image: 'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=800',
      likes: ['2', '4'],
      comments: [],
      savedBy: ['3'],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      userId: '4',
      content: 'Morning workout done! Remember, consistency is key 💪 #FitnessMotivation',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      likes: ['1', '2', '3'],
      comments: [
        {
          id: 'c4',
          userId: '1',
          content: 'Inspiring! 🔥',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ],
      savedBy: [],
      createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      userId: '5',
      content: 'Just beat the final boss! This game is incredible 🎮',
      likes: ['1', '3'],
      comments: [
        {
          id: 'c5',
          userId: '3',
          content: 'Congrats! How long did it take?',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: 'c6',
          userId: '5',
          content: 'About 3 hours of attempts 😅',
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
      ],
      savedBy: ['1'],
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

export const generateMockMessages = (): Message[] => {
  return [
    {
      id: 'm1',
      senderId: '2',
      receiverId: '1',
      content: 'Hey! How are you doing?',
      read: true,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'm2',
      senderId: '1',
      receiverId: '2',
      content: "I'm great, thanks! Just working on a new project.",
      read: true,
      createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    },
    {
      id: 'm3',
      senderId: '2',
      receiverId: '1',
      content: 'That sounds exciting! What kind of project?',
      read: true,
      createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    },
    {
      id: 'm4',
      senderId: '1',
      receiverId: '2',
      content: 'A social media app with React and TypeScript. Pretty cool stuff!',
      read: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'm5',
      senderId: '3',
      receiverId: '1',
      content: 'Love your latest post! 📸',
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ];
};

export const generateMockNotifications = (): Notification[] => {
  return [
    {
      id: 'n1',
      userId: '1',
      type: 'like',
      fromUserId: '2',
      postId: '3',
      message: 'liked your post',
      read: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'n2',
      userId: '1',
      type: 'comment',
      fromUserId: '3',
      postId: '3',
      message: 'commented on your post',
      read: false,
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      id: 'n3',
      userId: '1',
      type: 'follow',
      fromUserId: '4',
      message: 'started following you',
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'n4',
      userId: '1',
      type: 'like',
      fromUserId: '5',
      postId: '3',
      message: 'liked your post',
      read: true,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  ];
};

// LocalStorage keys
export const STORAGE_KEYS = {
  USER: 'social_app_user',
  USERS: 'social_app_users',
  POSTS: 'social_app_posts',
  MESSAGES: 'social_app_messages',
  NOTIFICATIONS: 'social_app_notifications',
  THEME: 'social_app_theme',
};

// Initialize mock data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(generateMockUsers()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(generateMockPosts()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(generateMockMessages()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(generateMockNotifications()));
  }
};

// Utility functions
export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : generateMockUsers();
};

export const updateStoredUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getStoredPosts = (): Post[] => {
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
  return posts ? JSON.parse(posts) : generateMockPosts();
};

export const updateStoredPosts = (posts: Post[]) => {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
};

export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString();
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
