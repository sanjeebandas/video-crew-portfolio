import "dotenv/config";
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "");

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  budget?: string;
  preferredDate?: string;
  service?: string;
  subject: string;
  message: string;
  referenceVideos?: string;
  websiteLinks?: string;
  productionPurpose?: string;
  uploadPlatform?: string;
  videoCount?: string;
  runningTime?: string;
}

export const sendContactNotification = async (contactData: ContactFormData) => {
  try {
    // Debug: Check if API key is loaded
    console.log("🔍 Debug: Resend API Key loaded:", process.env.RESEND_API_KEY ? "Yes" : "No");
    
    // Clean subject line - remove platform info
    const cleanSubject = contactData.subject.replace(/• Platform:.*$/, '').trim();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
          .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .notification-text { font-size: 16px; margin-bottom: 25px; color: #374151; }
          .info-grid { background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .info-row { display: flex; margin-bottom: 15px; align-items: center; }
          .info-row:last-child { margin-bottom: 0; }
          .info-icon { font-size: 18px; margin-right: 12px; min-width: 20px; }
          .info-label { font-weight: 600; color: #374151; margin-right: 8px; }
          .info-value { color: #1f2937; }
          .cta-section { text-align: center; margin-top: 30px; }
          .cta-button { 
            display: inline-block; 
            background: #2563eb; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600; 
            font-size: 16px;
            transition: background-color 0.3s ease;
          }
          .cta-button:hover { background: #1d4ed8; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 New Contact Form Submission</h1>
            <p>You've received a new contact form submission</p>
          </div>
          
          <div class="content">
            <div class="notification-text">
              Hi Admin,<br><br>
              You've received a new contact form submission.
            </div>
            
            <div class="info-grid">
              <div class="info-row">
                <span class="info-icon">👤</span>
                <span class="info-label">Name:</span>
                <span class="info-value">${contactData.name}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">✉️</span>
                <span class="info-label">Email:</span>
                <span class="info-value">${contactData.email}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">📌</span>
                <span class="info-label">Subject:</span>
                <span class="info-value">${cleanSubject}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">🕒</span>
                <span class="info-label">Submitted:</span>
                <span class="info-value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <div class="cta-section">
              <p style="margin-bottom: 20px; color: #374151;">👉 View full details in your Contact Manager:</p>
              <a href="https://videocrew-portfolio.vercel.app/admin/contact" class="cta-button">
                View Submission
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from your Video Crew website contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log("🔍 Debug: Attempting to send admin notification email...");
    
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sanjeeban@learning-crew.com',
      subject: `New Contact Form: ${contactData.name} - ${cleanSubject}`,
      html: htmlContent,
      replyTo: contactData.email
    });

    console.log("✅ Contact notification email sent successfully");
    console.log("🔍 Debug: Email result:", result);
    return result;
  } catch (error) {
    console.error("❌ Error sending contact notification email:", error);
    console.error("🔍 Debug: Full error details:", JSON.stringify(error, null, 2));
    throw error;
  }
};

export const sendCustomerConfirmation = async (contactData: ContactFormData) => {
  try {
    console.log("🔍 Debug: Attempting to send customer confirmation email...");
    
    // Check if we're in development/testing mode
    const isTestMode = process.env.NODE_ENV === 'development' || contactData.email.includes('@resend.dev');
    
    if (isTestMode) {
      console.log("🔍 Debug: Test mode detected - sending customer confirmation to admin email instead");
      
      // In test mode, send the customer confirmation to admin email for testing
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>TEST MODE - Customer Confirmation Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #dc2626; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .message { font-size: 16px; margin-bottom: 25px; color: #374151; line-height: 1.8; }
            .highlight { background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .test-notice { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 TEST MODE - Customer Confirmation</h1>
              <p>This would normally be sent to: ${contactData.email}</p>
            </div>
            
            <div class="content">
              <div class="test-notice">
                <strong>⚠️ TEST MODE:</strong> This is a test email. In production with a verified domain, this would be sent to the customer.
              </div>
              
              <div class="message">
                Dear <strong>${contactData.name}</strong>,<br><br>
                
                Thank you for reaching out to Video Crew! We've successfully received your inquiry and appreciate you taking the time to contact us.<br><br>
                
                Our team is currently reviewing your project details and will get back to you as soon as possible with a comprehensive response.<br><br>
                
                Please rest assured that we'll reach out to you soon with the next steps for your video production project.
              </div>
              
              <div class="highlight">
                <p style="margin: 0; font-weight: 600; color: #2563eb;">📧 What's Next?</p>
                <p style="margin: 10px 0 0 0; color: #374151;">
                  You can expect to hear from us within 24-48 hours with detailed information about your project timeline, pricing, and next steps.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>This is a test email from Video Crew</p>
              <p>For immediate assistance, please contact us directly</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'sanjeeban@learning-crew.com',
        subject: `[TEST] Customer Confirmation for ${contactData.name} - ${contactData.email}`,
        html: htmlContent,
        replyTo: 'sanjeeban@learning-crew.com'
      });

      console.log("✅ Test customer confirmation email sent to admin successfully");
      console.log("🔍 Debug: Test customer email result:", result);
      return result;
    } else {
      // Production mode - this will work once you verify a domain
      console.log("🔍 Debug: Production mode - attempting to send to customer email");
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Thank you for contacting Video Crew</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 30px 20px; background: #f9fafb; }
            .message { font-size: 16px; margin-bottom: 25px; color: #374151; line-height: 1.8; }
            .highlight { background: white; border-radius: 8px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; background: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Thank You for Contacting Video Crew</h1>
              <p>We've received your inquiry</p>
            </div>
            
            <div class="content">
              <div class="message">
                Dear <strong>${contactData.name}</strong>,<br><br>
                
                Thank you for reaching out to Video Crew! We've successfully received your inquiry and appreciate you taking the time to contact us.<br><br>
                
                Our team is currently reviewing your project details and will get back to you as soon as possible with a comprehensive response.<br><br>
                
                Please rest assured that we'll reach out to you soon with the next steps for your video production project.
              </div>
              
              <div class="highlight">
                <p style="margin: 0; font-weight: 600; color: #2563eb;">📧 What's Next?</p>
                <p style="margin: 10px 0 0 0; color: #374151;">
                  You can expect to hear from us within 24-48 hours with detailed information about your project timeline, pricing, and next steps.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated confirmation from Video Crew</p>
              <p>For immediate assistance, please contact us directly</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: contactData.email,
        subject: "Thank you for contacting Video Crew - We'll be in touch soon!",
        html: htmlContent,
        replyTo: 'sanjeeban@learning-crew.com'
      });

      console.log("✅ Customer confirmation email sent successfully");
      console.log("🔍 Debug: Customer email result:", result);
      return result;
    }
  } catch (error) {
    console.error("❌ Error sending customer confirmation email:", error);
    console.error("🔍 Debug: Full customer email error details:", JSON.stringify(error, null, 2));
    throw error;
  }
};
