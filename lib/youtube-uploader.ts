import { google } from 'googleapis';
import { Readable } from 'stream';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

export async function uploadToYouTube(
  videoBuffer: Buffer,
  title: string,
  description: string,
  tags: string[]
) {
  if (!process.env.YOUTUBE_REFRESH_TOKEN) {
    throw new Error('YouTube refresh token not configured. Please complete OAuth flow.');
  }

  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  // Convert buffer to readable stream
  const videoStream = Readable.from(videoBuffer);

  try {
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: '24', // Entertainment
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: videoStream,
      },
    });

    console.log('Video uploaded successfully:', response.data.id);

    return {
      id: response.data.id,
      url: `https://youtube.com/watch?v=${response.data.id}`,
    };
  } catch (error: any) {
    console.error('YouTube upload error:', error.message);
    throw new Error(`Failed to upload to YouTube: ${error.message}`);
  }
}

export async function testYouTubeAuth(): Promise<boolean> {
  try {
    if (!process.env.YOUTUBE_REFRESH_TOKEN) {
      return false;
    }

    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    await youtube.channels.list({ part: ['snippet'], mine: true });

    return true;
  } catch (error) {
    return false;
  }
}
