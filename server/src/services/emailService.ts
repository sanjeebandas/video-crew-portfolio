import "dotenv/config";
import nodemailer from "nodemailer";
import validator from "validator";

// Initialize Nodemailer transporter with fallback
const createTransporter = () => {
  console.log("🔧 Creating SMTP transporter...");
  console.log("📧 SMTP_USER:", process.env.SMTP_USER ? "✅ Set" : "❌ Missing");
  console.log("📧 SMTP_PASS:", process.env.SMTP_PASS ? "✅ Set" : "❌ Missing");
  console.log("📧 SMTP_HOST:", process.env.SMTP_HOST || "smtp.gmail.com");
  console.log("📧 SMTP_PORT:", process.env.SMTP_PORT || "587");
  console.log("📧 SMTP_SECURE:", process.env.SMTP_SECURE || "false");
  
  // Check if SMTP credentials are provided
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not provided. Email functionality will be disabled.");
    console.warn("⚠️ To enable emails, set SMTP_USER and SMTP_PASS environment variables.");
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log("✅ SMTP transporter created successfully");
  return transporter;
};

const transporter = createTransporter();

// Verify transporter configuration only if transporter exists
if (transporter) {
  console.log("🔍 Verifying SMTP connection...");
  transporter.verify((error: any, success: any) => {
    if (error) {
      console.error("❌ SMTP configuration error:", error);
      console.error("❌ Please check your SMTP credentials and try again.");
    } else {
      console.log("✅ SMTP server is ready to send emails");
    }
  });
} else {
  console.log("📧 Email service disabled - SMTP credentials not configured");
}

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

// Security: Input sanitization for portfolio website
const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .substring(0, maxLength); // Limit length
};

// Security: HTML escaping to prevent XSS
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Security: Email validation
const validateEmail = (email: string): boolean => {
  return validator.isEmail(email) && email.length <= 254;
};

// Security: Input validation for contact form
const validateContactData = (data: ContactFormData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required field validation
  if (!data.name || !data.email || !data.subject || !data.message) {
    errors.push("Name, email, subject, and message are required");
  }

  // Length validation (reasonable limits for portfolio website)
  if (data.name && data.name.length > 100) {
    errors.push("Name must be less than 100 characters");
  }
  if (data.subject && data.subject.length > 200) {
    errors.push("Subject must be less than 200 characters");
  }
  if (data.message && data.message.length > 2000) {
    errors.push("Message must be less than 2000 characters");
  }

  // Email validation
  if (data.email && !validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  return { isValid: errors.length === 0, errors };
};

export const sendContactNotification = async (contactData: ContactFormData) => {
  try {
    // Security: Validate input data
    const validation = validateContactData(contactData);
    if (!validation.isValid) {
      console.error("❌ Invalid contact data:", validation.errors);
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if transporter is available
    if (!transporter) {
      console.warn("⚠️ Email service disabled - SMTP not configured");
      return { messageId: "disabled", status: "skipped" };
    }

    console.log("📧 Preparing secure admin notification email...");

    // Security: Sanitize and clean subject line
    const cleanSubject = sanitizeInput(contactData.subject, 200)
      .replace(/• Platform:.*$/, "")
      .trim();

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
                <span class="info-value">${escapeHtml(sanitizeInput(contactData.name, 100))}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">✉️</span>
                <span class="info-label">Email:</span>
                <span class="info-value">${escapeHtml(sanitizeInput(contactData.email, 254))}</span>
              </div>
              
              <div class="info-row">
                <span class="info-icon">📌</span>
                <span class="info-label">Subject:</span>
                <span class="info-value">${escapeHtml(cleanSubject)}</span>
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

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || "sanjeeban@learning-crew.com",
      subject: `New Contact Form: ${escapeHtml(sanitizeInput(contactData.name, 100))} - ${escapeHtml(cleanSubject)}`,
      html: htmlContent,
      replyTo: sanitizeInput(contactData.email, 254),
      // Security: Add security headers
      headers: {
        'X-Mailer': 'Video Crew Contact Form',
        'X-Priority': '3',
      }
    };

    console.log("📧 Sending admin notification email...");
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Contact notification email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Error sending contact notification email:", error);
    throw error;
  }
};

export const sendCustomerConfirmation = async (
  contactData: ContactFormData
) => {
  try {
    // Security: Validate input data
    const validation = validateContactData(contactData);
    if (!validation.isValid) {
      console.error("❌ Invalid contact data:", validation.errors);
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if transporter is available
    if (!transporter) {
      console.warn("⚠️ Email service disabled - SMTP not configured");
      return { messageId: "disabled", status: "skipped" };
    }

    console.log("📧 Preparing secure customer confirmation email...");

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
                Dear <strong>${escapeHtml(sanitizeInput(contactData.name, 100))}</strong>,<br><br>
                
                Thank you for reaching out to Video Crew! We've successfully received your inquiry about "${escapeHtml(sanitizeInput(contactData.subject, 200))}" and appreciate you taking the time to contact us.<br><br>
                
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

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: sanitizeInput(contactData.email, 254),
      subject: "Thank you for contacting Video Crew - We'll be in touch soon!",
      html: htmlContent,
      replyTo: process.env.ADMIN_EMAIL || "sanjeeban@learning-crew.com",
      // Security: Add security headers
      headers: {
        'X-Mailer': 'Video Crew Contact Form',
        'X-Priority': '3',
      }
    };

    console.log("📧 Sending customer confirmation email...");
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Customer confirmation email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Error sending customer confirmation email:", error);
    throw error;
  }
};
