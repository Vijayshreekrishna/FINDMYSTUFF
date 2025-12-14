import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IChatThread extends Document {
    claim: Schema.Types.ObjectId;
    finder: Schema.Types.ObjectId;
    claimant: Schema.Types.ObjectId;
    isClosed: boolean;
    allowLinks: boolean;
    maskedHandleMap: Map<string, string>; // userId -> maskedHandle
    autoCloseAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ChatThreadSchema = new Schema<IChatThread>(
    {
        claim: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, unique: true },
        finder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        claimant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isClosed: { type: Boolean, default: false },
        allowLinks: { type: Boolean, default: false },
        maskedHandleMap: {
            type: Map,
            of: String,
            required: true,
        },
        autoCloseAt: { type: Date },
    },
    { timestamps: true }
);

ChatThreadSchema.index({ autoCloseAt: 1 }, { expireAfterSeconds: 0 });

const ChatThread = (models.ChatThread as Model<IChatThread>) || model<IChatThread>('ChatThread', ChatThreadSchema);

export default ChatThread;
