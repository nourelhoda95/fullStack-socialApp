# 🏗️ Application Architecture

## Overview

This social media application follows a modern React architecture with TypeScript, focusing on component reusability, clean code, and scalable design patterns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   React Application                    │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────┐    │  │
│  │  │           App.tsx (Root Component)            │    │  │
│  │  └──────────────────────────────────────────────┘    │  │
│  │                        │                              │  │
│  │       ┌────────────────┴────────────────┐            │  │
│  │       │                                  │            │  │
│  │  ┌────▼─────┐                    ┌──────▼─────┐     │  │
│  │  │  Theme   │                    │    Auth    │     │  │
│  │  │  Context │                    │  Context   │     │  │
│  │  └────┬─────┘                    └──────┬─────┘     │  │
│  │       │                                  │            │  │
│  │       └────────────────┬─────────────────┘            │  │
│  │                        │                              │  │
│  │            ┌───────────▼──────────┐                  │  │
│  │            │    AppContent         │                  │  │
│  │            └───────────┬──────────┘                  │  │
│  │                        │                              │  │
│  │       ┌────────────────┼────────────────┐            │  │
│  │       │                │                │            │  │
│  │  ┌────▼─────┐    ┌────▼────┐    ┌──────▼─────┐     │  │
│  │  │  Navbar  │    │  Feed   │    │  Messages  │     │  │
│  │  │          │    │ Search  │    │   Profile  │     │  │
│  │  └──────────┘    └─────────┘    └────────────┘     │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────┐     │  │
│  │  │         Reusable UI Components              │     │  │
│  │  │  Button, Input, Modal, Skeleton, etc.       │     │  │
│  │  └────────────────────────────────────────────┘     │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │              Mock API Layer (mockApi.ts)           │  │
│  └────────────────────────────────────────────────────┘  │
│                        │                                  │
│  ┌────────────────────▼────────────────────────────────┐ │
│  │           LocalStorage (Simulated Database)         │ │
│  │  - Users  - Posts  - Messages  - Notifications     │ │
│  └────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘
```

## Directory Structure

```
/
├── App.tsx                 # Root component
├── types/
│   └── index.ts           # TypeScript type definitions
├── contexts/
│   ├── AuthContext.tsx    # Authentication state management
│   └── ThemeContext.tsx   # Theme (dark/light) management
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Modal.tsx
│   │   └── Skeleton.tsx
│   ├── AuthPage.tsx       # Login/Register page
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── Navbar.tsx         # Main navigation
│   ├── Feed.tsx           # Home feed
│   ├── PostCard.tsx       # Individual post component
│   ├── CreatePostModal.tsx
│   ├── Search.tsx         # Search and discovery
│   ├── Messages.tsx       # Messaging interface
│   └── Profile.tsx        # User profile page
├── lib/
│   ├── mockApi.ts         # Simulated backend API
│   └── unsplashHelper.ts  # Image search helper
├── styles/
│   └── globals.css        # Global styles and themes
└── docs/
    ├── README.md
    ├── API_DOCUMENTATION.md
    ├── SETUP_DEPLOYMENT.md
    ├── FEATURES.md
    └── QUICKSTART.md
```

## Component Hierarchy

```
App
├── ThemeProvider
│   └── AuthProvider
│       └── AppContent
│           ├── Navbar
│           │   ├── NotificationDropdown
│           │   └── ProfileMenu
│           └── Routes
│               ├── Feed
│               │   ├── CreatePostButton
│               │   ├── PostCard (multiple)
│               │   │   ├── PostHeader
│               │   │   ├── PostContent
│               │   │   ├── PostActions
│               │   │   └── Comments
│               │   └── CreatePostModal
│               ├── Search
│               │   ├── SearchInput
│               │   ├── UserCard (multiple)
│               │   └── TrendingPosts
│               ├── Messages
│               │   ├── ConversationList
│               │   └── ChatWindow
│               └── Profile
│                   ├── ProfileHeader
│                   ├── ProfileTabs
│                   └── PostGrid
```

## Data Flow

### Authentication Flow
```
User Input → LoginForm → AuthContext.login()
  → mockApi.login() → localStorage (token + user)
  → Context State Update → UI Re-render
```

### Post Creation Flow
```
User Input → CreatePostModal → mockApi.createPost()
  → localStorage.posts → Feed Refresh
  → Notification Created (for followers)
```

### Like Flow
```
Like Button Click → PostCard.handleLike()
  → mockApi.likePost() → Update Post Likes
  → Create Notification → Refresh UI
```

### Message Flow
```
Send Message → Messages.handleSendMessage()
  → mockApi.sendMessage() → localStorage.messages
  → Update Conversations → Refresh Chat
```

## State Management

### Global State (Context API)

#### AuthContext
```typescript
{
  user: User | null,
  login: (email, password) => Promise<void>,
  register: (data) => Promise<void>,
  logout: () => void,
  updateProfile: (data) => Promise<void>,
  isAuthenticated: boolean,
  loading: boolean
}
```

#### ThemeContext
```typescript
{
  mode: 'light' | 'dark',
  toggleTheme: () => void
}
```

### Local State

Each component manages its own local state:
- Form inputs
- Modal visibility
- Loading states
- Active tabs
- Dropdown menus

## Design Patterns

### 1. Provider Pattern
Used for global state management with React Context API.

```typescript
<ThemeProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

### 2. Compound Components
Used for building complex UI like modals and dropdowns.

```typescript
<Modal isOpen={open} onClose={handleClose}>
  <Modal.Header>Title</Modal.Header>
  <Modal.Content>Content</Modal.Content>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

### 3. Custom Hooks
Encapsulate reusable logic.

```typescript
const useAuth = () => useContext(AuthContext);
const useTheme = () => useContext(ThemeContext);
```

### 4. Component Composition
Build complex UIs from simple, reusable components.

```typescript
<PostCard>
  <PostHeader />
  <PostContent />
  <PostActions />
  <Comments />
</PostCard>
```

## Data Models

### User Model
```typescript
interface User {
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
  lastSeen?: string;
}
```

### Post Model
```typescript
interface Post {
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

### Message Model
```typescript
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  seen: boolean;
  createdAt: string;
}
```

## API Layer (Mock)

### Structure
```typescript
export const mockApi = {
  // Authentication
  login: (email, password) => Promise<{user, token}>,
  register: (data) => Promise<{user, token}>,
  
  // Users
  getUsers: () => User[],
  getUserById: (id) => User | null,
  updateUser: (id, data) => User,
  followUser: (currentId, targetId) => void,
  unfollowUser: (currentId, targetId) => void,
  
  // Posts
  getPosts: () => Post[],
  createPost: (userId, content, images) => Post,
  updatePost: (id, content, images) => Post,
  deletePost: (id) => void,
  likePost: (postId, userId) => void,
  unlikePost: (postId, userId) => void,
  
  // Comments
  addComment: (postId, userId, content) => Comment,
  deleteComment: (postId, commentId) => void,
  
  // Messages
  getConversations: (userId) => Conversation[],
  sendMessage: (senderId, receiverId, content) => Message,
  markMessagesAsSeen: (userId, otherUserId) => void,
  
  // Notifications
  getNotifications: (userId) => Notification[],
  createNotification: (data) => void,
  markNotificationAsRead: (id) => void,
}
```

## Performance Optimizations

### 1. Component Memoization
```typescript
const MemoizedPostCard = React.memo(PostCard);
```

### 2. Lazy Loading
```typescript
const Profile = lazy(() => import('./components/Profile'));
```

### 3. Debouncing
Used in search functionality to reduce API calls.

### 4. Virtual Scrolling
For long lists of posts and messages (planned).

### 5. Image Optimization
- Lazy loading images
- Responsive images with srcset
- WebP format support

## Security Considerations

### 1. XSS Prevention
- React's built-in escaping
- DOMPurify for user content (recommended for production)

### 2. CSRF Protection
- Token-based authentication
- SameSite cookies (for production)

### 3. Input Validation
- Client-side validation
- Server-side validation (required for production)

### 4. Authentication
- JWT tokens (simulated)
- Secure token storage
- Auto-logout on expiration

## Testing Strategy

### Unit Tests (Recommended)
```typescript
describe('PostCard', () => {
  it('should render post content', () => {
    // test implementation
  });
  
  it('should handle like action', () => {
    // test implementation
  });
});
```

### Integration Tests
- User authentication flow
- Post creation and interaction
- Messaging functionality

### E2E Tests
- Complete user journeys
- Multi-user interactions

## Deployment Architecture

### Development
```
Developer Machine
  ↓
npm run dev
  ↓
Vite Dev Server (localhost:3000)
```

### Production
```
Git Repository
  ↓
CI/CD Pipeline
  ↓
Build Process (npm run build)
  ↓
Static Files (dist/)
  ↓
CDN/Hosting Platform
  ↓
Users
```

## Scalability Considerations

### Frontend
- Code splitting by route
- Component lazy loading
- Optimized bundle size
- CDN for static assets

### Backend (When Integrated)
- Horizontal scaling
- Load balancing
- Database indexing
- Caching layer (Redis)
- Message queue for notifications
- CDN for media files

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
- ES6+ features via Vite
- CSS custom properties fallback

## Accessibility

### WCAG 2.1 Level AA Compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast ratios
- Screen reader support

## Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics 4
- **Performance**: Lighthouse CI
- **Uptime**: UptimeRobot
- **Logs**: LogRocket

## Future Architecture Enhancements

### 1. Microservices (Backend)
```
API Gateway
  ├── Auth Service
  ├── User Service
  ├── Post Service
  ├── Message Service
  └── Notification Service
```

### 2. Real-time Features
```
WebSocket Server
  ├── Chat Rooms
  ├── Live Notifications
  └── Online Status
```

### 3. Caching Strategy
```
Client (React Query)
  ↓
CDN
  ↓
Redis Cache
  ↓
Database
```

### 4. Mobile Apps
```
Shared Business Logic
  ├── React Native (iOS/Android)
  └── React Web
```

## Code Quality

### Linting
- ESLint for JavaScript/TypeScript
- Prettier for code formatting
- Husky for pre-commit hooks

### Type Safety
- TypeScript strict mode
- Interface definitions
- Type guards

### Code Review
- Pull request reviews
- Automated checks
- Code coverage requirements

## Documentation

### Code Documentation
```typescript
/**
 * Creates a new post
 * @param userId - The ID of the user creating the post
 * @param content - The text content of the post
 * @param images - Optional array of image URLs
 * @returns The created post object
 */
createPost(userId: string, content: string, images?: string[]): Post
```

### Component Documentation
- PropTypes/TypeScript interfaces
- Usage examples
- Storybook stories (recommended)

## Version Control

### Git Workflow
```
main (production)
  ↓
develop (staging)
  ↓
feature/* (feature branches)
```

### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes
refactor: Code refactoring
test: Test additions
chore: Build/config changes
```

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clean code structure
- **Testable**: Isolated components
- **Performant**: Optimized rendering
- **Accessible**: WCAG compliant
- **Secure**: Best practices applied

For questions or suggestions, please refer to the other documentation files or open an issue.
