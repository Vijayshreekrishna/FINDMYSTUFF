# FindMyStuff Migration Walkthrough

This document summarizes the changes made to migrate the **FindMyStuff** application from MongoDB (Mongoose) to Supabase (Prisma + PostgreSQL).

## 🚀 Key Changes

### 1. Database Migration
- **Schema**: Transformed Mongoose schemas into a relational `prisma/schema.prisma` file.
- **Data Transfer**: Transferred existing data (Users, Posts, Claims, Messages, ChatThreads) to Supabase using a custom migration script.
- **Connection**: Updated the application to connect to Supabase via the transaction pooler (port 6543).

### 2. Codebase Refactoring
- **ORM Replacement**: Replaced all `mongoose` models and queries with `prisma` client calls.
- **Frontend Updates**: Updated `app/page.tsx`, `feed/[id]`, and `profile` to fetch data using Prisma.
- **API Routes**: Refactored all API routes in `src/app/api/` including:
  - `auth/[...nextauth]` (Prisma Adapter)
  - `posts` & `posts/[id]`
  - `threads`, `messages`, `stream` (Chat)
  - `claims` (All logic: creation, listing, verification, handoff, proof)
  - `user/profile` & `audit`
  - `notifications`
  - `register`
  - `cron/expire`

### 3. Cleanup
- **Removed Dependencies**: Uninstalled `mongoose` and `@types/mongoose`.
- **Deleted Files**: Removed `src/models/` directory and `src/lib/db.ts` (Mongoose connection).
- **Type Safety**: Fixed TypeScript errors related to the new schema types.

## 🛠️ Troubleshooting & Fixes

During the migration verification, the following issues were identified and resolved:

### 1. "Creating Post" Error
- **Issue**: Users were unable to create posts due to a "Foreign Key Constraint Failed" error.
- **Cause**: Stale User IDs from the old MongoDB session were stored in the browser.
- **Fix**: Implemented robust session handling to ensure the correct Supabase User ID (CUID) is used. Users were instructed to re-login.

### 2. Google Login Failure
- **Issue**: Google OAuth login was failing or returning null sessions.
- **Cause**: Incompatibility between `next-auth` (v4) and `@auth/prisma-adapter` (v5).
- **Fix**: Swapped the adapter to `@next-auth/prisma-adapter`.

### 3. Vercel Build Error (Prepared Statements)
- **Issue**: Deployment failed with `prepared statement "s0" already exists`.
- **Cause**: Conflict between Prisma and Supabase Transaction Pooler.
- **Fix**: Added `?pgbouncer=true` to the `DATABASE_URL` in Vercel environment variables.

## ✅ Verification
- **Build Success**: The application successfully passes `npm run build`, confirming type safety and compilation.
- **Schema Validation**: Prisma schema was successfully pushed to the database.
- **Live Deployment**: Validated on Vercel with correct environment configuration.

## 📝 Next Steps for User
1. **Environment**: Ensure `.env.local` is populated with `DATABASE_URL` (Supabase).
2. **Restart**: Restart the dev server (`npm run dev`) to clear any caches.
3. **Test**: Manually verify critical flows (Login, Create Post, Claim Item, Chat, Handover).
