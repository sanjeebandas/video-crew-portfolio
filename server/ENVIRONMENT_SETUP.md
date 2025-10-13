# Environment Setup for Video Crew Server

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

### Required Variables
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/videocrew-portfolio

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Optional Variables (Email Service)
```env
# SMTP Configuration for Nodemailer
# Email service will be disabled if these are not provided
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
```

## Quick Start

1. **Create `.env` file:**
   ```bash
   cd server
   cp .env.example .env  # If you have the example file
   # OR create manually with the required variables above
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

## Email Service Configuration

### Option 1: Disable Email Service (Default)
- Don't set SMTP environment variables
- Server will start without email functionality
- Contact form will still work, but no emails will be sent

### Option 2: Enable Email Service with Gmail
1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Set Environment Variables:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password-here
   ```

### Option 3: Use Other SMTP Providers
- **Outlook:** `smtp-mail.outlook.com:587`
- **Yahoo:** `smtp.mail.yahoo.com:587`
- **Custom SMTP:** Set your provider's details

## Server Status Messages

- ✅ `SMTP server is ready to send emails` - Email service enabled
- ⚠️ `Email service disabled - SMTP credentials not configured` - Email service disabled (normal)
- ❌ `SMTP configuration error` - Invalid credentials (check your settings)

## Development vs Production

- **Development:** Email service is optional, server starts without it
- **Production:** Set up proper SMTP credentials for email functionality
