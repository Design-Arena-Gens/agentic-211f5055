import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful! Save this refresh token to your environment variables:',
      refresh_token: tokens.refresh_token,
      instructions: 'Add YOUTUBE_REFRESH_TOKEN to your .env file or Vercel environment variables',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get tokens', details: error.message },
      { status: 500 }
    );
  }
}
