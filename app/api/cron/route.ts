import { NextResponse } from 'next/server';
import { generateVideoContent } from '@/lib/video-generator';
import { uploadToYouTube } from '@/lib/youtube-uploader';

export const maxDuration = 300; // 5 minutes max execution

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Cron job triggered at:', new Date().toISOString());

    // Generate video content
    const videoData = await generateVideoContent();

    // Upload to YouTube
    const youtubeResult = await uploadToYouTube(
      videoData.videoBuffer,
      videoData.title,
      videoData.description,
      videoData.tags
    );

    console.log('Cron job completed successfully:', youtubeResult.id);

    return NextResponse.json({
      success: true,
      message: 'Video generated and uploaded',
      youtubeId: youtubeResult.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
