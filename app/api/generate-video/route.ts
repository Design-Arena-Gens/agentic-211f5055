import { NextResponse } from 'next/server';
import { generateVideoContent } from '@/lib/video-generator';
import { uploadToYouTube } from '@/lib/youtube-uploader';

export async function POST(request: Request) {
  try {
    console.log('Starting video generation...');

    // Generate video content (images and metadata)
    const videoData = await generateVideoContent();

    console.log('Video content generated:', videoData.title);

    // Upload to YouTube
    const youtubeResult = await uploadToYouTube(
      videoData.videoBuffer,
      videoData.title,
      videoData.description,
      videoData.tags
    );

    console.log('Upload successful:', youtubeResult.id);

    return NextResponse.json({
      success: true,
      video: {
        title: videoData.title,
        description: videoData.description,
        youtubeId: youtubeResult.id,
      },
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
