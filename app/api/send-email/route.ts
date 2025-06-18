import { NextResponse } from 'next/server';
import { sendResumeAnalysisEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { recipientEmail, candidateName, analysis } = await request.json();

    if (!recipientEmail || !candidateName || !analysis) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientEmail, candidateName, or analysis' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const success = await sendResumeAnalysisEmail(recipientEmail, candidateName, analysis);

    if (success) {
      return NextResponse.json({ 
        message: 'Email sent successfully',
        success: true 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email. Please check email configuration.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 