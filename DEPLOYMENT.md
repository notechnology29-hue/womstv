# 🚀 Deployment Guide: WOM Streaming Platform

## Step 1: Push to GitHub

### Option A: Using VS Code (Easiest)
1. Open VS Code
2. Click the **Source Control** tab (left sidebar)
3. You'll see all modified files listed
4. Type a commit message: `Complete streaming platform: auth, uploads, webhooks, global navbar, dashboard`
5. Click the **+** icon next to files or **Stage All Changes** (Ctrl+Shift+A)
6. Click **Commit** (Ctrl+Enter)
7. Click **Sync Changes** to push to GitHub

### Option B: Using Git Command Line
```bash
cd "C:\Users\Notec\OneDrive\Desktop\WOMS\womstv"
git add .
git commit -m "Complete streaming platform: auth, uploads, webhooks, global navbar, dashboard"
git push origin main
```

---

## Step 2: Deploy to Vercel

### Method 1: Connect GitHub to Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find `womstv` and click **"Import"**

### Method 2: Set Environment Variables
Once imported, add these environment variables in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://gjmwmafwwdpdezionrhd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_qImW_OQ0o29Np3wMu3IljA_kgThDtQa
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_qImW_OQ0o29Np3wMu3IljA_kgThDtQa
MUX_TOKEN_ID=Y7NQ8Mc3wrDaToq01VbbLzeW2SO4Gu7mRzSwEGT41Vg00
MUX_TOKEN_SECRET=[paste_your_mux_secret_here]
NEXT_PUBLIC_APP_URL=[your-production-domain].vercel.app
```

3. Click **"Deploy"**

---

## Step 3: Update Mux Webhook URL

After Vercel deployment completes:

1. Note your **production URL** (e.g., `womstv.vercel.app`)
2. Go to [Mux Dashboard](https://dashboard.mux.com)
3. Navigate to **Settings** → **Webhooks**
4. Update the webhook URL to:
   ```
   https://[your-vercel-domain].vercel.app/functions/v1/mux-webhook
   ```

---

## Step 4: Test End-to-End

1. Visit your production URL
2. Click **"Artist Login"** in navbar
3. Create an account or log in
4. Click **"Dashboard"** or go to `/artist/submit`
5. Upload a test video
6. Mux processes the video (usually takes 30-60 seconds)
7. Video appears in `/shows` catalog automatically! 🎬

---

## Completed Features ✅

- ✅ Next.js 16 app with TypeScript
- ✅ Supabase authentication (login/signup)
- ✅ Mux video upload with secure tickets
- ✅ Mux webhook integration (auto-updates playback IDs)
- ✅ Dynamic show pages with Mux player
- ✅ Artist dashboard with upload status
- ✅ Global navbar with auth-aware buttons
- ✅ Beautiful WOM brand styling
- ✅ GitHub repo + Documentation
- ✅ Production-ready deployment

---

## Support URLs

- **Supabase Project**: https://app.supabase.com
- **Mux Dashboard**: https://dashboard.mux.com
- **Vercel Dashboard**: https://vercel.com
- **GitHub Repo**: https://github.com/notechnology29-hue/womstv
