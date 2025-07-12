const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use email from .env
    pass: process.env.EMAIL_PASS, // Use App Password from .env
  },
});

// OTP function for registration and password reset
const sendOtpEmail = async (email, otp, purpose = 'registration') => {
  const purposes = {
    registration: {
      subject: 'OTP for Registration',
      text: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`
    },
    reset: {
      subject: 'OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
    }
  };

  if (!purposes[purpose]) {
    throw new Error('Invalid OTP purpose');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: purposes[purpose].subject,
    text: purposes[purpose].text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email (${purpose}) sent successfully`);
  } catch (error) {
    console.error(`❌ Error sending OTP email (${purpose}):`, error);
    throw new Error(`Failed to send OTP for ${purpose}`);
  }
};

// General notification email function
const sendNotificationEmail = async (email, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
    throw new Error('Failed to send email notification');
  }
};

// Referral notification function
const sendReferralNotification = async (alumniEmail, studentName, position, company, message, resumeUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: alumniEmail,
    subject: `New Referral Request for ${position} at ${company}`,
    text: `
      Dear Alumni,
      
      You have received a referral request from ${studentName} for:
      Position: ${position}
      Company: ${company}
      
      Student's Message:
      ${message}
      
      Resume: ${resumeUrl}
      
      Please log in to your account to respond to this request.
      
      Best regards,
      Alumni Connect Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50;">New Referral Request</h2>
        <p>Dear Alumni,</p>
        <p>You have received a referral request from <strong>${studentName}</strong> for:</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Position:</strong> ${position}</p>
          <p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>
        </div>
        <div style="margin: 15px 0;">
          <p><strong>Student's Message:</strong></p>
          <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${message}</p>
        </div>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resumeUrl}" target="_blank" style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
          ">
            View Resume
          </a>
        </div>
        <p>Please log in to your account to respond to this request.</p>
        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
          <p>Best regards,<br>The Alumni Connect Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Referral notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending referral notification:', error);
    throw new Error('Failed to send referral notification');
  }
};

// Referral status update function
const sendReferralStatusUpdate = async (studentEmail, alumniName, position, company, status, reason = '') => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: `Update on Your Referral Request for ${position}`,
    text: `
      Dear Student,
      
      Your referral request for ${position} at ${company} has been ${status.toLowerCase()} by ${alumniName}.
      
      ${status === 'Rejected' ? `Reason: ${reason}` : ''}
      
      ${status === 'Accepted' ? 'Congratulations! The alumni has agreed to refer you.' : ''}
      
      Best regards,
      Alumni Connect Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Referral status update sent successfully');
  } catch (error) {
    console.error('❌ Error sending status update:', error);
    throw new Error('Failed to send status update');
  }
};

module.exports = { 
  sendOtpEmail, 
  sendNotificationEmail, 
  sendReferralNotification, 
  sendReferralStatusUpdate 
};
