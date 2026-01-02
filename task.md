# Task: Migrate FindMyStuff to Supabase

- [x] **Setup & Configuration**
  - [x] Analyze project structure and requirements
  - [x] Create migration plan and guide
  - [x] Create Prisma schema
  - [x] Create data migration script
  - [x] Update `.env.local` with Supabase credentials
  - [x] Install Prisma and database dependencies

- [x] **Database Migration**
  - [x] Downgrade to Prisma 6 (Fix validation error)
  - [x] Push schema to Supabase (`prisma db push`)
  - [x] Execute data migration script (`node scripts/migrate_data.js`)

- [x] **Codebase Updates**
  - [x] Update Schema to add `password` field
  - [x] Update NextAuth Logic (`api/auth`)
  - [x] Refactor API routes (`api/posts`, `api/threads`, `api/claims`, `api/user`, `api/notifications`)
  - [x] Refactor Frontend & Cron (`page.tsx`, `feed/[id]`, `profile`, `api/cron`)
  - [x] Cleanup Mongoose (`models`, `db.ts`)
  - [x] Verify functionality (Build success)

- [x] **Deployment**
  - [x] Push to GitHub
  - [x] Configure Vercel Env Vars (User Notified)
  - [x] Final Sync (Docs updated)

- [x] **Documentation**
  - [x] Create Master Migration Report (`MIGRATION_REPORT.md`)
  - [x] Create Project Analysis (`ANALYSIS_REPORT.md`)

- [x] **Bug Fixes**
  - [x] Fix "Post Create" error (Stale session)
  - [x] Fix Google Login (Fixed Adapter Version)
  - [x] Instrumented Debug Logs (Pushed to Vercel)
  - [x] Fix Vercel Build Error (`pgbouncer=true`)
  - [x] Fix Missing "GotMyStuff" Section (Visible Empty State)

- [ ] **Missing Features (Identified in Analysis)**
  - [x] **Reputation UI**: Show karma/score on Profile page.
  - [ ] **Notifications**: Add Notification Bell/Page.
  - [x] **Chat Moderation**: Enforce `allowLinks` in `MaskedChat`.
  - [ ] **Privacy**: Implement `sensitiveAreas` logic in Post Form.
