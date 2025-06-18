# Vercel Deployment Guide for HireAI

This guide will help you deploy your HireAI project to Vercel successfully.

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

Make sure your project has these essential files:
- `package.json` ✅
- `next.config.mjs` ✅
- `vercel.json` ✅
- `.gitignore` ✅
- `.env.example` (for reference)

### 2. Environment Variables

You'll need to set these environment variables in Vercel:

**Required:**
- `GOOGLE_API_KEY` - Your Google Gemini AI API key

**Optional (for email functionality):**
- `EMAIL_USER` - Your email address
- `EMAIL_PASS` - Your email password/app password
- `SMTP_HOST` - SMTP server (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 587)
- `PERPLEXITY_API_KEY` - For search functionality
- `GROQ_API_KEY` - For additional AI features

### 3. Vercel Configuration

Your project is configured with these settings:

**Framework Preset:** Next.js
**Root Directory:** `./`
**Build Command:** `npm run build`
**Output Directory:** `.next` (automatic)
**Install Command:** `npm install`

### 4. Deployment Process

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your HireAI repository

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add all required variables:
     ```
     GOOGLE_API_KEY = your_actual_api_key
     EMAIL_USER = your_email@gmail.com
     EMAIL_PASS = your_app_password
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

## 🔧 Build Configuration

The project includes these optimizations for Vercel:

### `vercel.json`
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "app/api/upload-resume/route.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"]
}
```

### `next.config.mjs`
```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['pdf-parse'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'pdf-parse'];
    }
    return config;
  },
}
```

## 📝 Getting API Keys

### Google Gemini AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your environment variables

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Google account
2. Go to App Passwords in your Google account settings
3. Generate a new app password
4. Use this password (not your regular password) in `EMAIL_PASS`

### Perplexity API Key (Optional)
1. Sign up at [perplexity.ai](https://www.perplexity.ai/)
2. Get your API key from the dashboard
3. Add to environment variables

### Groq API Key (Optional)
1. Sign up at [groq.com](https://groq.com/)
2. Get your API key from the dashboard
3. Add to environment variables

## 🐛 Troubleshooting

### Common Deployment Issues

1. **Build Failures:**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript errors are resolved
   - Verify environment variables are set

2. **PDF Processing Issues:**
   - The `pdf-parse` library is configured as external
   - Server-side externals are handled in `next.config.mjs`

3. **API Route Timeouts:**
   - Function timeouts are set to 30 seconds in `vercel.json`
   - For longer processing, consider upgrading Vercel plan

4. **Environment Variable Issues:**
   - Double-check all required env vars are set
   - Ensure no typos in variable names
   - Redeploy after adding new variables

### Build Commands

If you need to run builds locally:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 🎯 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Resume upload works
- [ ] AI analysis completes successfully
- [ ] Chat functionality works
- [ ] Email sending works (if configured)
- [ ] All API endpoints respond correctly

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check browser console for errors

Your HireAI application should now be successfully deployed on Vercel! 🎉 