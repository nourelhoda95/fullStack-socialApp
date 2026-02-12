# 🚀 Social Media Web Application

A modern, full-featured social media platform built with React, TypeScript, and Tailwind CSS. This production-ready application demonstrates best practices in frontend development with simulated backend functionality.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with validation
- **Login/Logout** functionality
- **JWT-based authentication** (simulated)
- **Protected routes** and session management
- **Role-based access** (User/Admin support)

### 👤 User Profile Management
- **Edit profile** (bio, profile picture, cover photo)
- **Follow/Unfollow** users
- **View followers & following** lists
- **Profile statistics** (posts, followers, following counts)
- **User status** (online/offline indicators)

### 📝 Posts & Content
- **Create, edit, and delete** posts
- **Upload multiple images** per post (up to 4)
- **Image carousel** for multi-image posts
- **Like/Unlike** posts with real-time updates
- **Comment system** (add/delete comments)
- **Save posts** for later viewing
- **Post visibility** controls

### 💬 Real-Time Messaging
- **One-to-one private messaging**
- **Real-time chat interface** with simulated updates
- **Online/Offline user status** indicators
- **Message timestamps** with relative time
- **Seen indicators** for read messages
- **Chat list** with last message preview
- **Unread message badges**

### 🔔 Notifications
- **Real-time notifications** for likes, comments, and follows
- **Notification dropdown** with unread count
- **Mark as read** functionality
- **Mark all as read** option
- **Interactive notification actions**

### 🔍 Search & Discovery
- **Search users** by username or full name
- **Suggested users** to follow
- **Trending posts** based on engagement
- **Real-time search results**

### 🎨 UI/UX Features
- **Dark/Light mode** with system preference detection
- **Fully responsive** design (mobile, tablet, desktop)
- **Smooth animations** using Motion (Framer Motion)
- **Loading skeletons** for better UX
- **Toast notifications** for user feedback
- **Hover effects** and transitions
- **Modal dialogs** for actions
- **Animated dropdowns** and menus

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Motion** (Framer Motion) for animations
- **Lucide React** for icons
- **date-fns** for date formatting
- **Sonner** for toast notifications

### Architecture
- **Component-based architecture** with reusable components
- **Context API** for state management
- **Custom hooks** for business logic
- **Mock API layer** simulating backend operations
- **LocalStorage** for data persistence

## 📁 Project Structure

```
/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Modal.tsx
│   │   └── Skeleton.tsx
│   ├── AuthPage.tsx     # Authentication page
│   ├── LoginForm.tsx    # Login form component
│   ├── RegisterForm.tsx # Registration form
│   ├── Navbar.tsx       # Main navigation
│   ├── Feed.tsx         # Home feed
│   ├── PostCard.tsx     # Individual post display
│   ├── CreatePostModal.tsx # Post creation/editing
│   ├── Search.tsx       # Search & discovery
│   ├── Messages.tsx     # Messaging interface
│   └── Profile.tsx      # User profile page
├── contexts/
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # Theme management
├── types/
│   └── index.ts         # TypeScript type definitions
├── lib/
│   └── mockApi.ts       # Simulated backend API
├── styles/
│   └── globals.css      # Global styles & CSS variables
└── App.tsx              # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Modern web browser

### Demo Credentials

Use these credentials to test the application:

**User Account:**
- Email: `john@example.com`
- Password: `password123`

**Other Available Users:**
- sarah@example.com (password123)
- mike@example.com (password123)
- emily@example.com (password123)
- alex@example.com (password123) - Admin role

### Key Concepts

#### Mock Data
The application uses localStorage to simulate a database. Data persists across browser sessions:
- Users, posts, comments are stored locally
- Messages and notifications are simulated
- Real-time updates are polled every 5-10 seconds

#### Authentication Flow
1. User registers or logs in
2. Mock JWT token is generated and stored
3. User session persists in localStorage
4. Protected routes check authentication status

#### State Management
- **AuthContext**: Manages user authentication state
- **ThemeContext**: Handles dark/light mode
- Local component state for UI interactions

## 🎨 Design Features

### Color System
- Primary: Blue (`#3B82F6`)
- Destructive: Red (`#EF4444`)
- Light mode: Clean whites and grays
- Dark mode: Slate backgrounds

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Animations
- Page transitions: 300ms ease-out
- Hover effects: 200ms transitions
- Modal animations: Scale and fade
- Loading skeletons: Shimmer effect

## 🔒 Security Features (Simulated)

- **Password hashing simulation** (bcrypt concept)
- **JWT token validation** (mock implementation)
- **Input validation** on forms
- **XSS protection** through React's built-in escaping
- **CSRF protection** concepts demonstrated

## 📊 Data Models

### User
```typescript
{
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  coverPhoto?: string;
  followers: string[];
  following: string[];
  role: 'user' | 'admin';
  createdAt: string;
  isOnline?: boolean;
}
```

### Post
```typescript
{
  id: string;
  userId: string;
  content: string;
  images?: string[];
  likes: string[];
  comments: Comment[];
  savedBy: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Message
```typescript
{
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  seen: boolean;
  createdAt: string;
}
```

## 🧪 Testing the Application

### User Interactions to Test

1. **Authentication**
   - Register a new account
   - Log in with existing credentials
   - Log out

2. **Posts**
   - Create a post with/without images
   - Like/unlike posts
   - Comment on posts
   - Edit your own posts
   - Delete your own posts
   - Save posts for later

3. **Social Features**
   - Search for users
   - Follow/unfollow users
   - View user profiles
   - Check followers/following lists

4. **Messaging**
   - Send messages to other users
   - View conversation history
   - Check online/offline status
   - See message read receipts

5. **Notifications**
   - Receive notifications for interactions
   - Mark notifications as read
   - Click notifications to navigate

6. **Theme**
   - Toggle between dark and light modes
   - System preference detection

## 🎯 Best Practices Demonstrated

- ✅ **Clean component architecture**
- ✅ **TypeScript for type safety**
- ✅ **Reusable UI components**
- ✅ **Context API for global state**
- ✅ **Custom hooks for logic separation**
- ✅ **Loading states and error handling**
- ✅ **Responsive design patterns**
- ✅ **Accessibility considerations**
- ✅ **Performance optimizations**
- ✅ **Clean code principles**

## 🚧 Future Enhancements

While this is a frontend demonstration, here are features that would be added with a real backend:

- Real-time WebSocket connections
- Image upload to cloud storage
- Video post support
- Stories feature
- Group chats
- Push notifications
- Email verification
- Password reset flow
- OAuth integration (Google, Facebook)
- Advanced search filters
- Hashtag system
- Mention system (@username)
- Direct message groups
- Post analytics
- User verification badges
- Content moderation tools
- Report system
- Block/Mute users
- Privacy settings
- Export user data

## 📝 Notes

- **Demo Purpose**: This application uses simulated backend functionality for demonstration
- **Data Persistence**: All data is stored in browser localStorage
- **Images**: Uses Unsplash placeholder images
- **Not for Production**: This is a portfolio/demo project showcasing frontend skills

## 🤝 Contributing

This is a demonstration project, but feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Developer

Built with ❤️ as a full-stack social media application demonstration

---

**Note**: This application simulates backend functionality using localStorage and mock APIs. In a production environment, you would integrate with a real backend API (Node.js/Express, Django, etc.) and database (MongoDB, PostgreSQL, etc.).
