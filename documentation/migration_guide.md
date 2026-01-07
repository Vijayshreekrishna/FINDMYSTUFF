# Master Migration Plan: MongoDB to Supabase

This plan outlines the specific steps to migrate your "FindMyStuff" project to Supabase, utilizing your existing keys for auxiliary services (Resend, Upstash, etc.) which **do not need to change**.

## Phase 1: Supabase Setup

1.  Create a Project on [Supabase](https://supabase.com).
2.  Go to **Project Settings > Database** and copy the **Connection String (URI)**. Use the "Transaction Pooler" (port 6543) version if possible.
3.  Add this to your `.env.local` as `DATABASE_URL`.

## Phase 2: Schema Deployment (Prisma)

1.  **Install Prisma**:
    ```bash
    npm install prisma @prisma/client @auth/prisma-adapter
    npx prisma init
    ```
2.  **Define Schema**:
    Overwrite `prisma/schema.prisma` with the content below. This correctly maps your MongoDB models (`User`, `Post`, `Claim`, `ChatThread`) into PostgreSQL tables.

    ```prisma
    // prisma/schema.prisma
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }

    // --- NextAuth Models ---
    model Account {
      id                 String  @id @default(cuid())
      userId             String
      type               String
      provider           String
      providerAccountId  String
      refresh_token      String? @db.Text
      access_token       String? @db.Text
      expires_at         Int?
      token_type         String?
      scope              String?
      id_token           String? @db.Text
      session_state      String?
      user User @relation(fields: [userId], references: [id], onDelete: Cascade)
      @@unique([provider, providerAccountId])
    }

    model Session {
      id           String   @id @default(cuid())
      sessionToken String   @unique
      userId       String
      expires      DateTime
      user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    }

    model User {
      id            String    @id @default(cuid())
      name          String?
      email         String?   @unique
      emailVerified DateTime?
      image         String?
      role          String    @default("user")
      accounts      Account[]
      sessions      Session[]
      
      // App Relations
      posts         Post[]
      claims        Claim[]
      foundThreads  ChatThread[] @relation("FinderThreads")
      claimThreads  ChatThread[] @relation("ClaimantThreads")
      messages      Message[]
      reputation    Reputation?
    }

    // --- App Models ---
    model Post {
      id             String   @id @default(cuid())
      userId         String
      title          String
      description    String
      category       String
      type           String
      status         String   @default("reported")
      lat            Float
      lng            Float
      address        String?
      images         String[]
      sensitiveAreas Json?
      createdAt      DateTime @default(now())
      updatedAt      DateTime @updatedAt
      user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
      claims         Claim[]
    }

    model Claim {
      id                 String   @id @default(cuid())
      postId             String
      claimantId         String
      status             String   @default("pending")
      score              Int      @default(0)
      answers            Json?
      evidenceImage      String?
      expiresAt          DateTime
      createdAt          DateTime @default(now())
      updatedAt          DateTime @updatedAt
      post               Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
      claimant           User     @relation(fields: [claimantId], references: [id], onDelete: Cascade)
      thread             ChatThread?
    }

    model ChatThread {
      id              String    @id @default(cuid())
      claimId         String    @unique
      finderId        String
      claimantId      String
      maskedHandleMap Json
      isClosed        Boolean   @default(false)
      messages        Message[]
      createdAt       DateTime  @default(now())
      updatedAt       DateTime  @updatedAt
      claim           Claim     @relation(fields: [claimId], references: [id], onDelete: Cascade)
      finder          User      @relation("FinderThreads", fields: [finderId], references: [id])
      claimant        User      @relation("ClaimantThreads", fields: [claimantId], references: [id])
    }

    model Message {
      id        String   @id @default(cuid())
      threadId  String
      senderId  String
      content   String
      createdAt DateTime @default(now())
      thread    ChatThread @relation(fields: [threadId], references: [id], onDelete: Cascade)
      sender    User       @relation(fields: [senderId], references: [id])
    }
    
    model Reputation {
      userId             String   @id
      score              Int      @default(100)
      successfulHandoffs Int      @default(0)
      user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    }
    ```

3.  **Push Changes**:
    ```bash
    npx prisma db push
    ```

## Phase 3: Data Migration Script

Since you have an existing MongoDB Atlas Database, you can run this script to copy data to Supabase.
**Save this as `scripts/migrate_data.js`**:

```javascript
// scripts/migrate_data.js
const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

// 1. Setup Connections
const MONGO_URI = process.env.MONGODB_URI; // Used from your .env.local
const prisma = new PrismaClient();

// 2. Define Minimal Mongoose Models for Reading
const userSchema = new mongoose.Schema({ name: String, email: String, image: String, role: String });
const postSchema = new mongoose.Schema({ title: String, description: String, category: String, type: String, status: String, location: Object, images: [String], sensitiveAreas: Array, user: mongoose.Types.ObjectId }, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// 3. Migration Logic
async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  // --- Users ---
  console.log('Migrating Users...');
  const mongoUsers = await User.find();
  const userIdMap = {}; // Map Mongo _id -> Postgres CUID

  for (const u of mongoUsers) {
    const newUser = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role || 'user'
      }
    });
    userIdMap[u._id.toString()] = newUser.id;
  }
  console.log(`Migrated ${mongoUsers.length} users.`);

  // --- Posts ---
  console.log('Migrating Posts...');
  const mongoPosts = await Post.find();
  
  for (const p of mongoPosts) {
    const newUserId = userIdMap[p.user.toString()];
    if (!newUserId) {
      console.warn(`Skipping post ${p._id} because user ${p.user} was not found.`);
      continue;
    }

    await prisma.post.create({
      data: {
        userId: newUserId,
        title: p.title,
        description: p.description,
        category: p.category,
        type: p.type,
        status: p.status || 'reported',
        lat: p.location?.lat || 0,
        lng: p.location?.lng || 0,
        address: p.location?.address || '',
        images: p.images || [],
        sensitiveAreas: p.sensitiveAreas || [],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }
    });
  }
  console.log(`Migrated ${mongoPosts.length} posts.`);

  // ... (Add similar blocks for Claims/Threads if you have existing data)

  console.log('Done!');
  process.exit(0);
}

migrate().catch(e => {
  console.error(e);
  process.exit(1);
});
```

**Run it:**
```bash
node scripts/migrate_data.js
```
