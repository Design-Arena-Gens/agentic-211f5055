# Alternative Cron Setup

Since the Vercel account has reached its cron job limit, here are alternative ways to schedule the daily video uploads:

## Option 1: External Cron Service (Recommended)

Use a free cron service like:
- **cron-job.org** (Free)
- **EasyCron** (Free tier available)
- **GitHub Actions** (Free for public repos)

Configure it to hit:
```
POST https://agentic-211f5055.vercel.app/api/cron
Headers:
  Authorization: Bearer YOUR_CRON_SECRET
```

Schedule: `30 15 * * *` (Daily at 9 PM IST / 3:30 PM UTC)

## Option 2: GitHub Actions

Create `.github/workflows/daily-upload.yml`:

```yaml
name: Daily Video Upload

on:
  schedule:
    - cron: '30 15 * * *'  # 9 PM IST
  workflow_dispatch:  # Allow manual trigger

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Video Generation
        run: |
          curl -X POST https://agentic-211f5055.vercel.app/api/cron \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Option 3: Manual Trigger

Use the web interface at https://agentic-211f5055.vercel.app to manually trigger uploads daily.

## Setup Instructions

1. Choose your preferred method above
2. Set the CRON_SECRET environment variable in Vercel
3. Configure the cron service with the URL and secret
4. Test by manually triggering to ensure it works
