# 📡 API Documentation

This document describes the mock API interface used in the social media application. In a real implementation, these would be REST API endpoints.

## Base URL
```
/api (simulated through mockApi.ts)
```

## Authentication

All authenticated requests include a JWT token stored in localStorage.

### Register User
**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "fullName": "string"
}
```

**Response**: `201 Created`
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "user",
    "createdAt": "ISO 8601 date"
  },
  "token": "JWT token"
}
```

### Login
**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**: `200 OK`
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "profilePicture": "string",
    "role": "user",
    "followers": ["string"],
    "following": ["string"]
  },
  "token": "JWT token"
}
```

## Users

### Get All Users
**Endpoint**: `GET /users`

**Response**: `200 OK`
```json
[
  {
    "id": "string",
    "username": "string",
    "fullName": "string",
    "profilePicture": "string",
    "bio": "string",
    "followers": ["string"],
    "following": ["string"]
  }
]
```

### Get User by ID
**Endpoint**: `GET /users/:id`

**Response**: `200 OK`
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "fullName": "string",
  "bio": "string",
  "profilePicture": "string",
  "coverPhoto": "string",
  "followers": ["string"],
  "following": ["string"],
  "role": "user",
  "createdAt": "ISO 8601 date"
}
```

### Update User Profile
**Endpoint**: `PATCH /users/:id`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "fullName": "string",
  "bio": "string",
  "profilePicture": "string",
  "coverPhoto": "string"
}
```

**Response**: `200 OK`
```json
{
  "id": "string",
  "username": "string",
  "fullName": "string",
  "bio": "string",
  "profilePicture": "string",
  "coverPhoto": "string"
}
```

### Follow User
**Endpoint**: `POST /users/:id/follow`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Successfully followed user"
}
```

### Unfollow User
**Endpoint**: `DELETE /users/:id/follow`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Successfully unfollowed user"
}
```

## Posts

### Get All Posts
**Endpoint**: `GET /posts`

**Query Parameters**:
- `page`: Page number (optional)
- `limit`: Posts per page (optional)
- `userId`: Filter by user ID (optional)

**Response**: `200 OK`
```json
{
  "posts": [
    {
      "id": "string",
      "userId": "string",
      "content": "string",
      "images": ["string"],
      "likes": ["string"],
      "comments": [
        {
          "id": "string",
          "userId": "string",
          "content": "string",
          "createdAt": "ISO 8601 date"
        }
      ],
      "savedBy": ["string"],
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "pages": "number"
  }
}
```

### Get Post by ID
**Endpoint**: `GET /posts/:id`

**Response**: `200 OK`
```json
{
  "id": "string",
  "userId": "string",
  "content": "string",
  "images": ["string"],
  "likes": ["string"],
  "comments": [...],
  "createdAt": "ISO 8601 date"
}
```

### Create Post
**Endpoint**: `POST /posts`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "content": "string",
  "images": ["string"] // Optional
}
```

**Response**: `201 Created`
```json
{
  "id": "string",
  "userId": "string",
  "content": "string",
  "images": ["string"],
  "likes": [],
  "comments": [],
  "createdAt": "ISO 8601 date"
}
```

### Update Post
**Endpoint**: `PATCH /posts/:id`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "content": "string",
  "images": ["string"]
}
```

**Response**: `200 OK`
```json
{
  "id": "string",
  "content": "string",
  "images": ["string"],
  "updatedAt": "ISO 8601 date"
}
```

### Delete Post
**Endpoint**: `DELETE /posts/:id`

**Headers**: `Authorization: Bearer {token}`

**Response**: `204 No Content`

### Like Post
**Endpoint**: `POST /posts/:id/like`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Post liked",
  "likesCount": "number"
}
```

### Unlike Post
**Endpoint**: `DELETE /posts/:id/like`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Post unliked",
  "likesCount": "number"
}
```

### Save Post
**Endpoint**: `POST /posts/:id/save`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Post saved"
}
```

### Unsave Post
**Endpoint**: `DELETE /posts/:id/save`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Post unsaved"
}
```

## Comments

### Add Comment
**Endpoint**: `POST /posts/:postId/comments`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "content": "string"
}
```

**Response**: `201 Created`
```json
{
  "id": "string",
  "postId": "string",
  "userId": "string",
  "content": "string",
  "createdAt": "ISO 8601 date"
}
```

### Delete Comment
**Endpoint**: `DELETE /posts/:postId/comments/:commentId`

**Headers**: `Authorization: Bearer {token}`

**Response**: `204 No Content`

## Messages

### Get Conversations
**Endpoint**: `GET /messages/conversations`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
[
  {
    "userId": "string",
    "lastMessage": {
      "id": "string",
      "senderId": "string",
      "receiverId": "string",
      "content": "string",
      "seen": "boolean",
      "createdAt": "ISO 8601 date"
    },
    "unreadCount": "number"
  }
]
```

### Get Conversation Messages
**Endpoint**: `GET /messages/:userId`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
[
  {
    "id": "string",
    "senderId": "string",
    "receiverId": "string",
    "content": "string",
    "seen": "boolean",
    "createdAt": "ISO 8601 date"
  }
]
```

### Send Message
**Endpoint**: `POST /messages`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "receiverId": "string",
  "content": "string"
}
```

**Response**: `201 Created`
```json
{
  "id": "string",
  "senderId": "string",
  "receiverId": "string",
  "content": "string",
  "seen": false,
  "createdAt": "ISO 8601 date"
}
```

### Mark Messages as Seen
**Endpoint**: `PATCH /messages/:userId/seen`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Messages marked as seen"
}
```

## Notifications

### Get Notifications
**Endpoint**: `GET /notifications`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
[
  {
    "id": "string",
    "type": "like | comment | follow",
    "userId": "string",
    "targetUserId": "string",
    "postId": "string", // Optional
    "content": "string",
    "read": "boolean",
    "createdAt": "ISO 8601 date"
  }
]
```

### Mark Notification as Read
**Endpoint**: `PATCH /notifications/:id/read`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "Notification marked as read"
}
```

### Mark All Notifications as Read
**Endpoint**: `PATCH /notifications/read-all`

**Headers**: `Authorization: Bearer {token}`

**Response**: `200 OK`
```json
{
  "message": "All notifications marked as read"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation error message",
  "fields": {
    "fieldName": "Error details"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

In production, implement rate limiting:
- **Authentication**: 5 requests per minute
- **Posts**: 10 requests per minute
- **Messages**: 20 requests per minute
- **General**: 100 requests per minute

## WebSocket Events (Real-time)

For real-time features, WebSocket connections would be used:

### Connection
```javascript
ws://api.example.com/socket?token={jwt_token}
```

### Events

**Receive New Message**:
```json
{
  "event": "message:new",
  "data": {
    "id": "string",
    "senderId": "string",
    "content": "string",
    "createdAt": "ISO 8601 date"
  }
}
```

**Receive Notification**:
```json
{
  "event": "notification:new",
  "data": {
    "id": "string",
    "type": "like | comment | follow",
    "userId": "string",
    "content": "string"
  }
}
```

**User Online Status**:
```json
{
  "event": "user:status",
  "data": {
    "userId": "string",
    "isOnline": "boolean"
  }
}
```

**Message Seen**:
```json
{
  "event": "message:seen",
  "data": {
    "messageIds": ["string"],
    "userId": "string"
  }
}
```

## Implementation Notes

### Security
- All passwords should be hashed using bcrypt with salt rounds ≥ 10
- JWT tokens should expire after 7 days
- Implement refresh token mechanism
- Use HTTPS in production
- Sanitize all user inputs
- Implement CORS properly

### Performance
- Implement pagination for all list endpoints
- Use database indexing on frequently queried fields
- Cache frequently accessed data (Redis)
- Optimize image uploads and storage
- Use CDN for static assets

### Validation
- Email: Valid email format
- Password: Minimum 6 characters
- Username: 3-20 characters, alphanumeric
- Content: Maximum 5000 characters
- Images: Maximum 4 per post, 5MB each
