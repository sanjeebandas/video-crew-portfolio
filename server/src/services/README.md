# Email Service

This service handles email notifications for the Video Crew portfolio website using Nodemailer.

## Features

- **Contact Form Notifications**: Sends email notifications to admin when someone submits the contact form
- **Customer Confirmation Emails**: Sends thank you emails to customers after form submission
- **HTML Email Templates**: Beautiful, responsive email templates with professional design
- **Error Handling**: Graceful error handling that doesn't break the main application flow
- **Debug Logging**: Comprehensive logging for troubleshooting
- **SMTP Configuration**: Flexible SMTP configuration supporting Gmail, Outlook, and custom SMTP servers

## Configuration

The service uses the following environment variables:

- `SMTP_HOST`: SMTP server hostname (e.g., smtp.gmail.com)
- `SMTP_PORT`: SMTP server port (e.g., 587 for TLS, 465 for SSL)
- `SMTP_SECURE`: Whether to use SSL/TLS (true for port 465, false for port 587)
- `SMTP_USER`: Your email address for authentication
- `SMTP_PASS`: Your email password or app password

## Usage

### Contact Form Notifications

When a user submits the contact form, the system automatically:

1. Saves the inquiry to the database
2. Sends an email notification to `admin@videocrew.com` (Admin)
3. Sends a confirmation email to the customer
4. Both emails use beautifully formatted HTML templates

### Email Template Features

- Responsive design that works on all devices
- Professional styling with Video Crew branding
- Clean, concise admin notifications with essential info
- Professional customer confirmations with personalized messages
- Reply-to properly configured for easy communication

## SMTP Setup

### Gmail Configuration
1. Enable 2-Factor Authentication on your Google Account
2. Generate an App Password for "Mail"
3. Use the app password as `SMTP_PASS` (not your regular password)

### Environment Variables
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here
```

### Testing
The application automatically verifies SMTP configuration on startup:
- ✅ "SMTP server is ready to send emails" - Configuration is correct
- ❌ "SMTP configuration error" - Check your credentials and settings

## Supported SMTP Providers

- **Gmail**: smtp.gmail.com:587
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Any SMTP server with authentication

### Production Setup
The email system is ready for production use with proper SMTP configuration. No additional domain verification is required as with third-party services.

## Error Handling

If email sending fails:
- The error is logged to the console with full details
- The contact form submission still succeeds
- The user gets a success message
- The inquiry is still saved to the database

This ensures that email issues don't prevent users from submitting contact forms.

## Migration History

This service was migrated from MailerSend and Brevo to Resend due to better reliability and easier setup.

## Files

- `emailService.ts`: Main email service implementation using Resend
- `contact.controller.ts`: Updated to integrate email notifications
