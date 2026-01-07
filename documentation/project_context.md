# Project Context: FindMyStuff

## 1. Overview
**FindMyStuff** is a premium Progressive Web App (PWA) for reporting and finding lost items. It utilizes location-based services to connect owners with finders, featuring a secure claim system, masked chat, and reputation tracking.

## 2. Tech Stack & Services
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM) [Migrating to Supabase/PostgreSQL]
- **Auth**: NextAuth.js (Google OAuth + Credentials)
- **Real-time**: Server-Sent Events (SSE) for Chat
- **Rate Limiting**: Upstash Redis (Confimed Active)
- **Emails**: Resend (Confirmed Active)
- **Spam Protection**: Cloudflare Turnstile (Confirmed Active)
- **Maps**: Leaflet / React-Leaflet
- **Images**: Cloudinary (Upload & Storage)
- **PWA**: `@ducanh2912/next-pwa`

## 3. Architecture & Directory Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth (Google + Custom Creds)
│   │   ├── claims/         # Claim creation & logic
│   │   ├── threads/        # Chat threads
│   │   │   └── [id]/stream # SSE endpoint for real-time chat
│   │   └── ...
│   ├── ...                 # Pages ((auth), dashboard, feed, report)
├── components/
│   ├── chat/               # MaskedChat, StatusBadge
│   ├── claims/             # ClaimForm
│   ├── map/                # Map components
│   └── ...
├── lib/
│   ├── claimScore.ts       # Automated matching logic (0-100 score)
│   ├── ratelimit.ts        # Upstash configuration
│   ├── email.ts            # Resend email sending
│   ├── turnstile.ts        # Turnstile validation
│   └── ...
└── models/                 # User, Post, Claim, ChatThread, Message
```

## 4. Key Features & Implementation Status

### A. Authentication
- **Status**: ✅ Implemented
- **Details**: `src/app/api/auth/[...nextauth]` handles Google OAuth and Email/Password login. It syncs Google profiles to the local MongoDB `User` collection.

### B. Lost/Found Reporting (`Post` Model)
- **Status**: ✅ Implemented
- **Details**: Users can create posts with location (Leaflet), images (Cloudinary), and description. 'Sensitive Areas' on images can be masked for privacy.

### C. Claims System (`Claim` Model)
- **Status**: ✅ Implemented
- **Details**:
  - **Scoring**: `src/lib/claimScore.ts` calculates a match score.
  - **Logic**: `api/claims/route.ts` handles logic and calls `claimRateLimit`.
  - **Rate Limiting**: Uses Upstash Redis to limit claims/day.

### D. Message/Chat System (`ChatThread`, `Message`)
- **Status**: ✅ Implemented (SSE)
- **Details**:
  - **Privacy**: Masked handles hidden behind `maskedHandleMap`.
  - **Real-time**: `api/threads/[id]/stream` provides SSE stream.

### E. Integrations (Active)
- **Resend**: Used in `src/lib/email.ts` for verification emails.
- **Turnstile**: Used to prevent bot submissions.
- **Upstash**: Active for API rate limiting.

## 5. Environment Variables
Known Configuration:
- `MONGODB_URI`: Remote Atlas instance (To be replaced).
- `RESEND_API_KEY`: Configured.
- `UPSTASH_REDIS_*`: Configured.
- `NEXT_PUBLIC_TURNSTILE_*`: Configured.

## 6. Migration Status (Mongo -> Supabase)
- **Goal**: Move core application data (Users, Posts, Claims, Chats) to PostgreSQL.
- **Retain**: Upstash (Redis), Resend, Cloudinary, and Turnstile will remain as-is (they are DB agnostic).
