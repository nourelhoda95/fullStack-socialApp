# 🔧 Setup & Deployment Guide

## Table of Contents
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [Backend Integration Guide](#backend-integration-guide)
- [Deployment Options](#deployment-options)
- [Production Checklist](#production-checklist)

## Local Development Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd social-media-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false

# OAuth (if implementing)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_FACEBOOK_APP_ID=your_facebook_app_id

# Image Upload
VITE_MAX_IMAGE_SIZE=5242880  # 5MB in bytes
VITE_MAX_IMAGES_PER_POST=4

# Unsplash API (for image search)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

### Backend Environment Variables

If integrating with a backend, create `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/social-media
# or for PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/social_media

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# Security
BCRYPT_SALT_ROUNDS=10
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100

# Email Service (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloud Storage (AWS S3, Cloudinary, etc.)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1

# or Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (for caching & sessions)
REDIS_URL=redis://localhost:6379

# WebSocket
WS_PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3000

# Analytics
GOOGLE_ANALYTICS_ID=your-ga-id

# Error Tracking
SENTRY_DSN=your-sentry-dsn
```

## Backend Integration Guide

### Step 1: Replace Mock API

Replace the mock API calls with real HTTP requests:

**Before (Mock)**:
```typescript
import { mockApi } from '../lib/mockApi';

const posts = mockApi.getPosts();
```

**After (Real API)**:
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};
```

### Step 2: Create API Service

Create `/lib/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API methods
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: RegisterData) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const userApi = {
  getProfile: (id: string) => api.get(`/users/${id}`),
  updateProfile: (id: string, data: Partial<User>) =>
    api.patch(`/users/${id}`, data),
  follow: (id: string) => api.post(`/users/${id}/follow`),
  unfollow: (id: string) => api.delete(`/users/${id}/follow`),
};

export const postApi = {
  getPosts: (params?: any) => api.get('/posts', { params }),
  createPost: (data: CreatePostData) => api.post('/posts', data),
  updatePost: (id: string, data: Partial<Post>) =>
    api.patch(`/posts/${id}`, data),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  likePost: (id: string) => api.post(`/posts/${id}/like`),
  unlikePost: (id: string) => api.delete(`/posts/${id}/like`),
};
```

### Step 3: Implement WebSocket

Create `/lib/socket.ts`:

```typescript
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(WS_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
```

### Step 4: Image Upload

Create `/lib/upload.ts`:

```typescript
import api from './api';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
};
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Add all `VITE_*` variables

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Configure**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
```

Build and run:
```bash
docker build -t social-media-app .
docker run -p 80:80 social-media-app
```

### Option 4: AWS S3 + CloudFront

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure custom error responses (404 → /index.html)
   - Set up SSL certificate

## Backend Deployment

### Option 1: Heroku

```bash
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
# Add other environment variables
```

### Option 2: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

### Option 3: AWS EC2

1. Launch EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Install dependencies
5. Configure environment
6. Start with PM2:
   ```bash
   pm2 start npm --name "social-api" -- start
   pm2 save
   pm2 startup
   ```

## Production Checklist

### Security
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure JWT secrets
- [ ] Enable rate limiting
- [ ] Implement input validation
- [ ] Set up Content Security Policy
- [ ] Enable security headers
- [ ] Use environment variables for secrets
- [ ] Implement CSRF protection
- [ ] Set up monitoring and alerts

### Performance
- [ ] Enable Gzip compression
- [ ] Optimize images
- [ ] Implement CDN
- [ ] Enable browser caching
- [ ] Minimize bundle size
- [ ] Implement lazy loading
- [ ] Set up database indexing
- [ ] Configure Redis caching
- [ ] Optimize API queries
- [ ] Enable service workers

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Implement logging (Winston, Morgan)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up alerts for errors
- [ ] Monitor database performance
- [ ] Track API response times

### Testing
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Test all user flows
- [ ] Test on multiple devices
- [ ] Test on different browsers
- [ ] Load testing
- [ ] Security testing
- [ ] Accessibility testing

### Documentation
- [ ] Update README
- [ ] Document API endpoints
- [ ] Write deployment guide
- [ ] Document environment variables
- [ ] Create user guide
- [ ] Document troubleshooting

### Backup & Recovery
- [ ] Set up database backups
- [ ] Document recovery procedures
- [ ] Test backup restoration
- [ ] Set up automated backups
- [ ] Configure backup retention

## Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist
npm run build
```

**CORS Issues**
- Check backend CORS configuration
- Verify API URL in environment variables
- Check browser console for errors

**Authentication Issues**
- Verify JWT token in localStorage
- Check token expiration
- Verify API authorization headers

**WebSocket Connection Issues**
- Check WebSocket URL
- Verify server WebSocket support
- Check firewall/proxy settings

## Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const Profile = lazy(() => import('./components/Profile'));
const Messages = lazy(() => import('./components/Messages'));
```

### Image Optimization
```typescript
// Use responsive images
<img
  src="image-800.jpg"
  srcSet="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description"
  loading="lazy"
/>
```

### Bundle Analysis
```bash
npm install -D vite-bundle-visualizer
```

Add to `vite.config.ts`:
```typescript
import { visualizer } from 'vite-bundle-visualizer';

export default defineConfig({
  plugins: [visualizer()],
});
```

## Support

For issues or questions:
- Check documentation
- Review API documentation
- Check GitHub issues
- Contact support team

---

**Last Updated**: February 2024
