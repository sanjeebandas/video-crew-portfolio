# SMTP Configuration for Nodemailer

This document explains how to configure SMTP settings for the Video Crew portfolio website email functionality.

## Required Environment Variables

Add the following environment variables to your `.env` file:

```env
# SMTP Configuration for Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
```

## Gmail SMTP Setup

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication if not already enabled

### 2. Generate App Password
- Go to Google Account → Security → 2-Step Verification → App passwords
- Generate a new app password for "Mail"
- Use this app password as `SMTP_PASS` (not your regular Gmail password)

### 3. SMTP Settings for Gmail
- **Host**: smtp.gmail.com
- **Port**: 587 (for TLS) or 465 (for SSL)
- **Secure**: false for port 587, true for port 465
- **Authentication**: Your Gmail address and app password

## Alternative SMTP Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
```

## Testing Email Configuration

The application will automatically verify the SMTP configuration on startup. You should see:
- ✅ "SMTP server is ready to send emails" - Configuration is correct
- ❌ "SMTP configuration error" - Check your credentials and settings

## Email Functionality

The system sends two types of emails:

1. **Admin Notification**: Sent to `admin@videocrew.com` when someone submits the contact form
2. **Customer Confirmation**: Sent to the customer's email address confirming their submission

Both emails use professional HTML templates and include proper reply-to addresses for easy communication.
