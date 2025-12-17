'use client';

import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastVideo, setLastVideo] = useState<any>(null);

  const generateVideo = async () => {
    setLoading(true);
    setStatus('Generating video...');

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setStatus('Video generated and uploaded successfully!');
        setLastVideo(data.video);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setStatus('Testing YouTube authentication...');

    try {
      const response = await fetch('/api/test-auth');
      const data = await response.json();
      setStatus(data.authenticated ? 'YouTube authenticated ✓' : 'YouTube not authenticated - please complete OAuth flow');
    } catch (error) {
      setStatus(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">
          🦁 Animal Video Automation 🎬
        </h1>
        <p className="text-xl text-gray-300 mb-8 text-center">
          Automatically generates and uploads AI videos with animals in crazy situations
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Schedule</h2>
          <p className="text-gray-200 mb-2">
            ⏰ Daily uploads at <strong>9:00 PM IST</strong>
          </p>
          <p className="text-gray-300 text-sm">
            Videos are automatically generated using AI and uploaded to YouTube
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Manual Controls</h2>

          <div className="space-y-4">
            <button
              onClick={testAuth}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Test YouTube Authentication
            </button>

            <button
              onClick={generateVideo}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : 'Generate Video Now'}
            </button>
          </div>

          {status && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <p className="text-white">{status}</p>
            </div>
          )}

          {lastVideo && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Last Generated Video:</h3>
              <p className="text-gray-300">Title: {lastVideo.title}</p>
              <p className="text-gray-300">Description: {lastVideo.description}</p>
              {lastVideo.youtubeId && (
                <a
                  href={`https://youtube.com/watch?v=${lastVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Watch on YouTube
                </a>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Setup Instructions</h2>
          <ol className="text-gray-200 space-y-2 list-decimal list-inside">
            <li>Create a Google Cloud project and enable YouTube Data API v3</li>
            <li>Create OAuth 2.0 credentials and add authorized redirect URIs</li>
            <li>Get an OpenAI API key for video generation</li>
            <li>Set up environment variables in Vercel</li>
            <li>Complete OAuth flow by visiting <code className="bg-black/30 px-2 py-1 rounded">/api/auth/youtube</code></li>
            <li>Cron job will automatically run daily at 9 PM IST</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
