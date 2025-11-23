import mongoose, { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Electronics, Pets, etc.
    type: { type: String, enum: ['lost', 'found'], required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String },
    },
    images: [{ type: String }], // URLs from Cloudinary
    status: {
        type: String,
        enum: ['reported', 'in_progress', 'claimed', 'resolved'],
        default: 'reported',
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Post = models.Post || model('Post', PostSchema);

export default Post;
