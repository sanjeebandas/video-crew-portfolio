# Page Visits Tracking System

## Overview
This system tracks page visits using MongoDB instead of localStorage. Every time a user visits a public page, the visit count is incremented in the database.

## How It Works

### Backend Components

1. **PageVisit Model** (`server/src/models/PageVisit.ts`)
   - Stores total visit count and last updated timestamp
   - Uses a single document approach with unique index

2. **PageVisit Controller** (`server/src/controllers/pageVisit.controller.ts`)
   - `incrementPageVisit()`: Increments visit count (public endpoint)
   - `getPageVisits()`: Gets current visit count (admin only)
   - `resetPageVisits()`: Resets visit count to 0 (admin only)

3. **PageVisit Routes** (`server/src/routes/pageVisit.ts`)
   - `POST /api/pagevisit/increment` - Public endpoint for tracking visits
   - `GET /api/pagevisit` - Admin endpoint to get visit count
   - `DELETE /api/pagevisit/reset` - Admin endpoint to reset visits

### Frontend Components

1. **App.tsx**
   - Automatically calls `incrementPageVisit()` on every public page visit
   - Only tracks public pages (excludes admin routes)

2. **AnalyticsRow.tsx**
   - Fetches page visit count from API for admin dashboard
   - Includes reset functionality for testing

3. **API Service** (`client/src/services/api.ts`)
   - `incrementPageVisit()`: Calls increment endpoint
   - `getPageVisitsFromAPI()`: Gets visit count for analytics
   - `resetPageVisitsAPI()`: Resets visit count

## API Endpoints

### Public Endpoints
- `POST /api/pagevisit/increment` - Increment page visit count

### Admin Endpoints (Require Authentication)
- `GET /api/pagevisit` - Get current page visit count
- `DELETE /api/pagevisit/reset` - Reset page visit count to 0

## Usage

### Automatic Tracking
Page visits are automatically tracked when users visit any public page:
- Home (`/`)
- About (`/about`)
- Process (`/process`)
- Portfolio (`/portfolio`)
- Differentiation (`/differentiation`)
- Contact (`/contact`)

### Admin Analytics
- Visit count is displayed in the admin dashboard analytics
- Use "Refresh Analytics" button to update data
- Use "Reset Visits" button to reset the counter for testing

## Database Schema

```javascript
{
  totalVisits: Number,    // Total number of page visits
  lastUpdated: Date,      // Last time visit was recorded
  createdAt: Date,        // Document creation time
  updatedAt: Date         // Document last update time
}
```

## Testing

1. Visit any public page to increment the counter
2. Check admin dashboard to see updated analytics
3. Use "Reset Visits" button to reset counter for testing
4. Monitor console logs for debugging information

## Benefits

- **Persistent**: Data survives browser restarts and server restarts
- **Real-time**: Updates immediately when pages are visited
- **Admin Access**: Admins can view and reset visit counts
- **Scalable**: Can handle multiple concurrent visits
- **Reliable**: Uses MongoDB for data persistence
