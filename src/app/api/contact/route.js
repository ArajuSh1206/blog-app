// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request) {
  try {
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Get form data from request
    const { name, email, message } = await request.json();

    // Validate form data
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Prepare email content
    const msg = {
      to: process.env.TO_EMAIL, // Your email address
      from: process.env.FROM_EMAIL, // Your verified SendGrid sender
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: `Message: ${message}\n\nFrom: ${name}\nEmail: ${email}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await sgMail.send(msg);
    
    // Return success response
    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return NextResponse.json(
      { message: 'Something went wrong!' },
      { status: 500 }
    );
  }
}