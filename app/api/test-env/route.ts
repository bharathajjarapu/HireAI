import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasGoogleApiKey = !!process.env.GOOGLE_API_KEY;
    const hasEmailConfig = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    return NextResponse.json({
      environment: process.env.NODE_ENV || 'development',
      googleApiKey: hasGoogleApiKey ? 'Configured ✅' : 'Missing ❌',
      emailConfig: hasEmailConfig ? 'Configured ✅' : 'Not configured (optional)',
      message: hasGoogleApiKey 
        ? 'Environment is properly configured!' 
        : 'Google API key is missing. Please add GOOGLE_API_KEY to your .env.local file.'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check environment configuration' },
      { status: 500 }
    );
  }
} 