# Animal Video Automation 🦁🎬

Automatically generates AI videos featuring animals in crazy situations and uploads them to YouTube daily at 9 PM IST.

## Features

- 🎨 AI-generated images using DALL-E 3
- 🎬 Automated video creation with animals in wild scenarios
- 📺 Automatic YouTube uploads
- ⏰ Daily scheduling at 9 PM IST (3:30 PM UTC)
- 🎮 Manual trigger option via web interface
- ✅ YouTube authentication testing

## Setup Instructions

### 1. YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/youtube/callback`
5. Save your Client ID and Client Secret

### 2. OpenAI API Setup

1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Ensure you have credits for DALL-E 3 image generation

### 3. Environment Variables

Set these in Vercel:

```env
OPENAI_API_KEY=sk-...
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REDIRECT_URI=https://your-domain.vercel.app/api/auth/youtube/callback
YOUTUBE_REFRESH_TOKEN=your_refresh_token
CRON_SECRET=random_secret_string
```

### 4. Complete OAuth Flow

1. Deploy to Vercel
2. Visit `https://your-domain.vercel.app/api/auth/youtube`
3. Authorize the application
4. Copy the refresh token from the callback page
5. Add it to your Vercel environment variables as `YOUTUBE_REFRESH_TOKEN`

### 5. Cron Job

The cron job is configured in `vercel.json` to run daily at 9 PM IST (3:30 PM UTC).

## Tech Stack

- **Next.js 14**: Web framework
- **OpenAI DALL-E 3**: Image generation
- **YouTube Data API v3**: Video uploads
- **Vercel Cron**: Scheduled tasks
- **TypeScript**: Type safety
