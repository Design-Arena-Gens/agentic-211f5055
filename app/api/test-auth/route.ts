import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );

    if (!process.env.YOUTUBE_REFRESH_TOKEN) {
      return NextResponse.json({
        authenticated: false,
        message: 'No refresh token found. Please complete OAuth flow at /api/auth/youtube',
      });
    }

    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    await youtube.channels.list({ part: ['snippet'], mine: true });

    return NextResponse.json({
      authenticated: true,
      message: 'YouTube authentication successful',
    });
  } catch (error: any) {
    return NextResponse.json({
      authenticated: false,
      error: error.message,
    });
  }
}
