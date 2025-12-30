# Deployment Guide: Vercel

Since you have connected this repo to Vercel via GitHub, pushing your changes will trigger a new deployment. However, you **MUST** configure the Environment Variables in your Vercel Project Settings for the app to run correctly.

## 1. Environment Variables

Go to your Vercel Dashboard -> Project -> Settings -> Environment Variables and add the following:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Your Supabase **Transaction Pooler** URL (port 6543/5432). |
| `NEXTAUTH_SECRET` | A random string for auth encryption. |
| `NEXTAUTH_URL` | Your Vercel domain (e.g. `https://your-app.vercel.app`). Auto-set by Vercel usually, but good to explicit. |
| `GOOGLE_ID` | Google OAuth Client ID. |
| `GOOGLE_SECRET` | Google OAuth Client Secret. |
| `RESEND_API_KEY` | Key for sending emails. |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Token. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Site Key. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile Secret Key. |

> **Note**: For `DATABASE_URL`, ensure you use the "Transaction" pooler connection string (usually port 6543 or 5432 with pooler host) compatible with serverless environments.

## 2. Push Changes

I will now push the migrating code to GitHub. This will trigger the build.

## 3. Build Verification

Watch the deployment logs in Vercel. 
- It will run `prisma generate` automatically during `npm install` or build.
- It should succeed if the `DATABASE_URL` is correct.
