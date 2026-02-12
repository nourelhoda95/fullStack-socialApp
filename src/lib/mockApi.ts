import { User, Post, Message, Notification, Comment } from '../types';

// Mock data generator
const STORAGE_KEYS = {
  USERS: 'social_app_users',
  POSTS: 'social_app_posts',
  MESSAGES: 'social_app_messages',
  NOTIFICATIONS: 'social_app_notifications',
  CURRENT_USER: 'social_app_current_user',
  AUTH_TOKEN: 'social_app_token',
};

// Initialize mock data
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'johndoe',
        email: 'john@example.com',
        fullName: 'John Doe',
        bio: 'Software Engineer | Tech Enthusiast | Coffee Lover ☕',
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
        followers: ['2', '3', '4'],
        following: ['2', '3'],
        role: 'user',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        isOnline: true,
      },
      {
        id: '2',
        username: 'sarahsmith',
        email: 'sarah@example.com',
        fullName: 'Sarah Smith',
        bio: 'Digital Artist | Creative Mind | Nature Lover 🌿',
        profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
        followers: ['1', '3', '4', '5'],
        following: ['1', '4'],
        role: 'user',
        createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        username: 'mikejohnson',
        email: 'mike@example.com',
        fullName: 'Mike Johnson',
        bio: 'Fitness Coach | Motivational Speaker | Living my best life 💪',
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
        followers: ['1', '2', '5'],
        following: ['1', '2', '4'],
        role: 'user',
        createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        isOnline: true,
      },
      {
        id: '4',
        username: 'emilydavis',
        email: 'emily@example.com',
        fullName: 'Emily Davis',
        bio: 'Travel Blogger | Photography | Exploring the world 🌍✈️',
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
        followers: ['1', '2', '3'],
        following: ['2', '3', '5'],
        role: 'user',
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
        isOnline: false,
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        username: 'alexwilson',
        email: 'alex@example.com',
        fullName: 'Alex Wilson',
        bio: 'Music Producer | DJ | Sound Engineer 🎵',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        coverPhoto: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200',
        followers: ['2', '4'],
        following: ['1', '2', '3', '4'],
        role: 'admin',
        createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
        isOnline: true,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    const mockPosts: Post[] = [
      {
        id: '1',
        userId: '2',
        content: 'Just finished this amazing artwork! What do you think? 🎨',
        images: ['https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800'],
        likes: ['1', '3', '4'],
        comments: [
          {
            id: 'c1',
            postId: '1',
            userId: '1',
            content: 'This is absolutely stunning! Love the colors!',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'c2',
            postId: '1',
            userId: '3',
            content: 'Amazing work! Keep it up! 🔥',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          },
        ],
        savedBy: ['1', '4'],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId: '1',
        content: 'Beautiful sunset at the beach today! 🌅 #nature #photography',
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
        likes: ['2', '3', '4', '5'],
        comments: [
          {
            id: 'c3',
            postId: '2',
            userId: '2',
            content: 'Wow! Where is this?',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
        ],
        savedBy: ['2', '3'],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        userId: '3',
        content: 'Morning workout done! 💪 Remember, consistency is key! #fitness #motivation',
        images: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'],
        likes: ['1', '2', '5'],
        comments: [],
        savedBy: ['1'],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        userId: '4',
        content: 'Exploring the streets of Paris! This city never gets old ❤️🗼 #travel #paris',
        images: [
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
        ],
        likes: ['1', '2', '3', '5'],
        comments: [
          {
            id: 'c4',
            postId: '4',
            userId: '1',
            content: 'Paris is beautiful! I need to visit again soon!',
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'c5',
            postId: '4',
            userId: '5',
            content: 'Great photos! 📸',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          },
        ],
        savedBy: ['1', '2', '3'],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        userId: '5',
        content: 'New track dropping this Friday! 🎵 Who\'s ready? #music #producer',
        images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'],
        likes: ['2', '4'],
        comments: [
          {
            id: 'c6',
            postId: '5',
            userId: '2',
            content: 'Can\'t wait to hear it!',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          },
        ],
        savedBy: ['4'],
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        userId: '2',
        content: 'Working on a new project. Stay tuned! 🎨✨',
        likes: ['1', '3', '5'],
        comments: [],
        savedBy: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mockPosts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    const mockMessages: Message[] = [
      {
        id: 'm1',
        senderId: '2',
        receiverId: '1',
        content: 'Hey! Thanks for the comment on my artwork!',
        seen: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'm2',
        senderId: '1',
        receiverId: '2',
        content: 'No problem! It was really impressive!',
        seen: true,
        createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      },
      {
        id: 'm3',
        senderId: '2',
        receiverId: '1',
        content: 'I really appreciate it! 😊',
        seen: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
      {
        id: 'm4',
        senderId: '3',
        receiverId: '1',
        content: 'Hey, want to grab coffee this weekend?',
        seen: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(mockMessages));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    const mockNotifications: Notification[] = [
      {
        id: 'n1',
        type: 'like',
        userId: '2',
        targetUserId: '1',
        postId: '2',
        content: 'liked your post',
        read: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: 'n2',
        type: 'comment',
        userId: '3',
        targetUserId: '1',
        postId: '2',
        content: 'commented on your post',
        read: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'n3',
        type: 'follow',
        userId: '4',
        targetUserId: '1',
        content: 'started following you',
        read: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
  }
};

// API simulation functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u) => u.email === email);
    
    if (!user || password !== 'password123') {
      throw new Error('Invalid credentials');
    }
    
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    
    return { user, token };
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }): Promise<{ user: User; token: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (users.some((u) => u.email === data.email || u.username === data.username)) {
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      ...data,
      followers: [],
      following: [],
      role: 'user',
      createdAt: new Date().toISOString(),
      isOnline: true,
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    
    return { user: newUser, token };
  },

  // Users
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  getUserById: (id: string): User | null => {
    const users = mockApi.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  updateUser: (userId: string, data: Partial<User>): User => {
    const users = mockApi.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    users[index] = { ...users[index], ...data };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Update current user if it's the same
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      if (parsed.id === userId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
      }
    }
    
    return users[index];
  },

  followUser: (currentUserId: string, targetUserId: string): void => {
    const users = mockApi.getUsers();
    const currentUser = users.find((u) => u.id === currentUserId);
    const targetUser = users.find((u) => u.id === targetUserId);
    
    if (!currentUser || !targetUser) throw new Error('User not found');
    
    if (!currentUser.following.includes(targetUserId)) {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      // Create notification
      mockApi.createNotification({
        type: 'follow',
        userId: currentUserId,
        targetUserId,
        content: 'started following you',
      });
    }
  },

  unfollowUser: (currentUserId: string, targetUserId: string): void => {
    const users = mockApi.getUsers();
    const currentUser = users.find((u) => u.id === currentUserId);
    const targetUser = users.find((u) => u.id === targetUserId);
    
    if (!currentUser || !targetUser) throw new Error('User not found');
    
    currentUser.following = currentUser.following.filter((id) => id !== targetUserId);
    targetUser.followers = targetUser.followers.filter((id) => id !== currentUserId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Posts
  getPosts: (): Post[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
  },

  getPostById: (id: string): Post | null => {
    const posts = mockApi.getPosts();
    return posts.find((p) => p.id === id) || null;
  },

  createPost: (userId: string, content: string, images?: string[]): Post => {
    const posts = mockApi.getPosts();
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId,
      content,
      images,
      likes: [],
      comments: [],
      savedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return newPost;
  },

  updatePost: (postId: string, content: string, images?: string[]): Post => {
    const posts = mockApi.getPosts();
    const index = posts.findIndex((p) => p.id === postId);
    if (index === -1) throw new Error('Post not found');
    
    posts[index] = {
      ...posts[index],
      content,
      images,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return posts[index];
  },

  deletePost: (postId: string): void => {
    const posts = mockApi.getPosts();
    const filtered = posts.filter((p) => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(filtered));
  },

  likePost: (postId: string, userId: string): void => {
    const posts = mockApi.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
      
      // Create notification
      if (post.userId !== userId) {
        mockApi.createNotification({
          type: 'like',
          userId,
          targetUserId: post.userId,
          postId,
          content: 'liked your post',
        });
      }
    }
  },

  unlikePost: (postId: string, userId: string): void => {
    const posts = mockApi.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    post.likes = post.likes.filter((id) => id !== userId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  savePost: (postId: string, userId: string): void => {
    const posts = mockApi.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    if (!post.savedBy.includes(userId)) {
      post.savedBy.push(userId);
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }
  },

  unsavePost: (postId: string, userId: string): void => {
    const posts = mockApi.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    post.savedBy = post.savedBy.filter((id) => id !== userId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  // Comments
  addComment: (postId: string, userId: string, content: string): Comment => {
    const posts = mockApi.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId,
      content,
      createdAt: new Date().toISOString(),
    };
    
    post.comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    
    // Create notification
    if (post.userId !== userId) {
      mockApi.createNotification({
        type: 'comment',
        userId,
        targetUserId: post.userId,
        postId,
        content: 'commented on your post',
      });
    }
    
    return newComment;
  },

  deleteComment: (postId: string, commentId: string): void => {
    const posts = mockApi.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    post.comments = post.comments.filter((c) => c.id !== commentId);
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  // Messages
  getMessages: (): Message[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
  },

  getConversations: (userId: string): Conversation[] => {
    const messages = mockApi.getMessages();
    const conversationMap = new Map<string, Conversation>();
    
    messages.forEach((msg) => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const existing = conversationMap.get(otherUserId);
      
      if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
        const unreadCount = messages.filter(
          (m) => m.senderId === otherUserId && m.receiverId === userId && !m.seen
        ).length;
        
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          lastMessage: msg,
          unreadCount,
        });
      }
    });
    
    return Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );
  },

  getConversationMessages: (userId1: string, userId2: string): Message[] => {
    const messages = mockApi.getMessages();
    return messages
      .filter(
        (m) =>
          (m.senderId === userId1 && m.receiverId === userId2) ||
          (m.senderId === userId2 && m.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  sendMessage: (senderId: string, receiverId: string, content: string): Message => {
    const messages = mockApi.getMessages();
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId,
      content,
      seen: false,
      createdAt: new Date().toISOString(),
    };
    
    messages.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return newMessage;
  },

  markMessagesAsSeen: (userId: string, otherUserId: string): void => {
    const messages = mockApi.getMessages();
    messages.forEach((msg) => {
      if (msg.senderId === otherUserId && msg.receiverId === userId) {
        msg.seen = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  // Notifications
  getNotifications: (userId: string): Notification[] => {
    const notifications: Notification[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
    );
    return notifications
      .filter((n) => n.targetUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createNotification: (data: Omit<Notification, 'id' | 'read' | 'createdAt'>): void => {
    const notifications: Notification[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
    );
    
    const newNotification: Notification = {
      id: `notif_${Date.now()}`,
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    notifications.push(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  markNotificationAsRead: (notificationId: string): void => {
    const notifications: Notification[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
    );
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  },

  markAllNotificationsAsRead: (userId: string): void => {
    const notifications: Notification[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
    );
    notifications.forEach((n) => {
      if (n.targetUserId === userId) {
        n.read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
};

export default STORAGE_KEYS;
