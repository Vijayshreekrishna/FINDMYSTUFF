const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

// 1. Setup Connections
const MONGO_URI = process.env.MONGODB_URI;
const prisma = new PrismaClient();

// 2. Define Minimal Mongoose Models for Reading (Matching your current schema)
const userSchema = new mongoose.Schema({ name: String, email: String, image: String, role: String });
const postSchema = new mongoose.Schema({
    title: String, description: String, category: String, type: String, status: String,
    location: Object, images: [String], sensitiveAreas: Array, user: mongoose.Types.ObjectId
}, { timestamps: true });
const claimSchema = new mongoose.Schema({
    post: mongoose.Types.ObjectId, claimant: mongoose.Types.ObjectId, status: String,
    verificationStatus: String, score: Number, answers: Object, evidenceImage: String,
    handoffCodeHash: String, verification: Object, expiresAt: Date
}, { timestamps: true });
const threadSchema = new mongoose.Schema({
    claim: mongoose.Types.ObjectId, finder: mongoose.Types.ObjectId, claimant: mongoose.Types.ObjectId,
    maskedHandleMap: Object, isClosed: Boolean, allowLinks: Boolean, allowAttachments: Boolean, autoCloseAt: Date
}, { timestamps: true });
const messageSchema = new mongoose.Schema({
    thread: mongoose.Types.ObjectId, sender: mongoose.Types.ObjectId, content: String, attachments: Array
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Claim = mongoose.model('Claim', claimSchema);
const ChatThread = mongoose.model('ChatThread', threadSchema);
const Message = mongoose.model('Message', messageSchema);

// 3. Migration Logic
async function migrate() {
    if (!MONGO_URI) { console.error("MONGODB_URI missing"); process.exit(1); }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // --- Users ---
    console.log('Migrating Users...');
    const mongoUsers = await User.find();
    const userIdMap = {}; // Map Mongo _id -> Postgres CUID

    for (const u of mongoUsers) {
        // Upsert by email to avoid duplicates if re-running
        if (!u.email) continue;
        const newUser = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
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
    const postIdMap = {};

    for (const p of mongoPosts) {
        const newUserId = userIdMap[p.user.toString()];
        if (!newUserId) continue;

        try {
            const newPost = await prisma.post.create({
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
            postIdMap[p._id.toString()] = newPost.id;
        } catch (e) {
            console.error(`Failed to migrate post ${p._id}:`, e.message);
        }
    }

    // --- Claims ---
    console.log('Migrating Claims...');
    const mongoClaims = await Claim.find();
    const claimIdMap = {};

    for (const c of mongoClaims) {
        const newPostId = postIdMap[c.post.toString()];
        const newClaimantId = userIdMap[c.claimant.toString()];

        if (!newPostId || !newClaimantId) continue;

        const newClaim = await prisma.claim.create({
            data: {
                postId: newPostId,
                claimantId: newClaimantId,
                status: c.status || 'pending',
                verificationStatus: c.verificationStatus || 'unverified',
                score: c.score || 0,
                answers: c.answers || {},
                evidenceImage: c.evidenceImage,
                handoffCodeHash: c.handoffCodeHash,
                verificationData: c.verification,
                expiresAt: c.expiresAt || new Date(Date.now() + 86400000),
                createdAt: c.createdAt,
                updatedAt: c.updatedAt
            }
        });
        claimIdMap[c._id.toString()] = newClaim.id;
    }

    // --- Threads ---
    console.log('Migrating Threads...');
    const mongoThreads = await ChatThread.find();
    const threadIdMap = {};

    for (const t of mongoThreads) {
        const newClaimId = claimIdMap[t.claim.toString()];
        const newFinderId = userIdMap[t.finder.toString()];
        const newClaimantId = userIdMap[t.claimant.toString()];

        if (!newClaimId || !newFinderId || !newClaimantId) continue;

        const newThread = await prisma.chatThread.create({
            data: {
                claimId: newClaimId,
                finderId: newFinderId,
                claimantId: newClaimantId,
                maskedHandleMap: t.maskedHandleMap || {},
                isClosed: t.isClosed || false,
                allowLinks: t.allowLinks || false,
                allowAttachments: t.allowAttachments || false,
                autoCloseAt: t.autoCloseAt,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt
            }
        });
        threadIdMap[t._id.toString()] = newThread.id;
    }

    // --- Messages ---
    console.log('Migrating Messages...');
    const mongoMessages = await Message.find();

    for (const m of mongoMessages) {
        const newThreadId = threadIdMap[m.thread.toString()];
        const newSenderId = userIdMap[m.sender.toString()];

        if (!newThreadId || !newSenderId) continue;

        await prisma.message.create({
            data: {
                threadId: newThreadId,
                senderId: newSenderId,
                content: m.content,
                attachments: m.attachments,
                createdAt: m.createdAt
            }
        });
    }

    console.log('Done!');
    process.exit(0);
}

migrate().catch(e => {
    console.error(e);
    process.exit(1);
});
