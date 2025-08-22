# Email Service

This service handles email notifications for the Video Crew portfolio website using Resend.

## Features

- **Contact Form Notifications**: Sends email notifications to admin when someone submits the contact form
- **Customer Confirmation Emails**: Sends thank you emails to customers after form submission
- **HTML Email Templates**: Beautiful, responsive email templates with professional design
- **Error Handling**: Graceful error handling that doesn't break the main application flow
- **Debug Logging**: Comprehensive logging for troubleshooting

## Configuration

The service uses the following environment variables:

- `RESEND_API_KEY`: Your Resend API key for sending emails

## Usage

### Contact Form Notifications

When a user submits the contact form, the system automatically:

1. Saves the inquiry to the database
2. Sends an email notification to `sanjeeban@learning-crew.com` (Admin)
3. Sends a confirmation email to the customer
4. Both emails use beautifully formatted HTML templates

### Email Template Features

- Responsive design that works on all devices
- Professional styling with Video Crew branding
- Clean, concise admin notifications with essential info
- Professional customer confirmations with personalized messages
- Reply-to properly configured for easy communication

## Testing

### Current Testing Mode
Due to Resend's domain verification requirements, the system currently operates in **test mode**:

- **Admin notifications**: ✅ Work perfectly (sent to `sanjeeban@learning-crew.com`)
- **Customer confirmations**: 🔄 Sent to admin email for testing (with clear TEST MODE indicators)

### Test Email Addresses
For testing email functionality, you can use Resend's test email addresses:

- **Successful delivery**: `delivered@resend.dev`
- **Bounced emails**: `bounced@resend.dev`
- **Spam marked**: `complained@resend.dev`

You can also use labels for testing: `delivered+test1@resend.dev`

### Production Setup
To enable customer confirmation emails in production, you need to:

1. **Verify a domain** at [resend.com/domains](https://resend.com/domains)
2. **Update the sender email** in `emailService.ts` to use your verified domain
3. **Change `NODE_ENV`** to `production` in your `.env` file

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
