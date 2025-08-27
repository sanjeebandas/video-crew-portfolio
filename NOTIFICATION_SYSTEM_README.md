# Universal Notification System

## Overview
The new universal notification system provides real-time notifications for the admin dashboard, replacing the old localStorage-based approach with a robust database-driven solution.

## Features

### 🔔 Notification Types
- **Portfolio**: Created, updated, deleted portfolio items
- **Contact**: New inquiries received, status updates
- **Page Visit**: Milestone achievements (100, 500, 1000, 5000, 10000, 50000, 100000 visits)
- **System**: System-level notifications

### ✨ Key Features
- **Real-time Updates**: Polling every 30 seconds for new notifications
- **Unread Counter**: Shows "X new" in the notification title
- **Mark as Read**: Individual and bulk mark-as-read functionality
- **Auto-cleanup**: Notifications automatically deleted after 20 days
- **Highlighted New Notifications**: Unread notifications are highlighted with green border
- **Click to Mark Read**: Click on unread notifications to mark them as read

## Database Schema

### UniversalNotification Model
```typescript
interface IUniversalNotification {
  type: "portfolio" | "contact" | "page_visit" | "system";
  title: string;
  message: string;
  isRead: boolean;
  data?: any; // JSON field for additional data
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### GET /api/notifications
- **Purpose**: Fetch notifications with pagination
- **Query Params**: `page` (default: 1), `limit` (default: 20)
- **Response**: `{ notifications[], pagination, unreadCount }`

### PATCH /api/notifications/:id/read
- **Purpose**: Mark specific notification as read
- **Response**: Updated notification object

### PATCH /api/notifications/mark-all-read
- **Purpose**: Mark all notifications as read
- **Response**: Success message

## Automatic Notification Triggers

### Portfolio Operations
- **Create**: Triggered when `POST /api/portfolio` is called
- **Update**: Triggered when `PUT /api/portfolio/:id` is called  
- **Delete**: Triggered when `DELETE /api/portfolio/:id` is called

### Contact Operations
- **New Inquiry**: Triggered when `POST /api/contact` is called
- **Status Update**: Triggered when `PUT /api/contact/:id` with status change

### Page Visit Milestones
- **Automatic Check**: Triggered on every page visit increment
- **Milestones**: 100, 500, 1000, 5000, 10000, 50000, 100000 visits
- **Duplicate Prevention**: Only creates notification once per milestone

## Frontend Integration

### NotificationsRow Component
- **Real-time Polling**: Updates every 30 seconds
- **Loading States**: Shows spinner while loading
- **Error Handling**: Displays error messages with retry option
- **Responsive Design**: Works on mobile and desktop

### API Service Functions
```typescript
// Get notifications with pagination
getNotifications(page?: number, limit?: number)

// Mark specific notification as read
markNotificationAsRead(id: string)

// Mark all notifications as read
markAllNotificationsAsRead()
```

## Configuration

### Auto-cleanup Duration
The notification retention period is configurable in the model:
```typescript
// In UniversalNotification.ts
UniversalNotificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 20 * 24 * 60 * 60 } // 20 days
);
```

### Polling Interval
The frontend polling interval can be adjusted in NotificationsRow.tsx:
```typescript
const interval = setInterval(loadNotifications, 30000); // 30 seconds
```

## Migration from Old System

### What Changed
1. **Database Storage**: Moved from localStorage to MongoDB
2. **Real-time Updates**: Added polling instead of manual refresh
3. **Automatic Triggers**: Backend automatically creates notifications
4. **Better UX**: Improved loading states and error handling

### Backward Compatibility
- Old localStorage notifications are no longer used
- New system is completely independent
- No migration needed for existing data

## Testing

### Manual Testing
1. Create a new portfolio item → Should trigger notification
2. Update contact status → Should trigger notification  
3. Visit page multiple times → Should trigger milestone notifications
4. Mark notifications as read → Counter should update
5. Mark all as read → All notifications should be marked read

### API Testing
```bash
# Get notifications
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/notifications

# Mark as read
curl -X PATCH -H "Authorization: Bearer <token>" http://localhost:5000/api/notifications/<id>/read

# Mark all as read
curl -X PATCH -H "Authorization: Bearer <token>" http://localhost:5000/api/notifications/mark-all-read
```

## Future Enhancements

### Potential Improvements
1. **WebSocket Support**: Replace polling with real-time WebSocket updates
2. **Email Notifications**: Send email alerts for important notifications
3. **Notification Preferences**: Allow admin to configure notification types
4. **Push Notifications**: Browser push notifications for critical alerts
5. **Notification Categories**: Filter notifications by type
6. **Bulk Actions**: Delete multiple notifications at once

### Performance Optimizations
1. **Indexing**: Add compound indexes for better query performance
2. **Caching**: Implement Redis caching for frequently accessed notifications
3. **Pagination**: Optimize pagination for large notification volumes
4. **Batch Operations**: Process notifications in batches for better performance
