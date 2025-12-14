import { Schema, model, models, type Document, type Model, Types } from "mongoose";

export interface IChatThread extends Document {
    claim: Types.ObjectId;              // reference to Claim
    finder: Types.ObjectId;             // user who owns the post (finder in Found-post flow)
    claimant: Types.ObjectId;           // user who is claiming
    isClosed: boolean;
    maskedHandleMap: Map<string, string>;      // userId -> masked handle
    allowLinks: boolean;                       // gate before verification
    allowAttachments: boolean;                 // gate before verification
    autoCloseAt?: Date;                        // TTL window
    createdAt: Date;
    updatedAt: Date;
}

const ChatThreadSchema = new Schema<IChatThread>(
    {
        claim: { type: Schema.Types.ObjectId, ref: "Claim", required: true },
        finder: { type: Schema.Types.ObjectId, ref: "User", required: true },
        claimant: { type: Schema.Types.ObjectId, ref: "User", required: true },
        maskedHandleMap: {
            type: Map,
            of: String,
            default: {},
            required: true,
        },
        isClosed: { type: Boolean, default: false },
        allowLinks: { type: Boolean, default: false },
        allowAttachments: { type: Boolean, default: false },
        autoCloseAt: { type: Date },
    },
    { timestamps: true }
);

// Optional TTL index for autoclose (close by cron as well):
ChatThreadSchema.index({ autoCloseAt: 1 }, { expireAfterSeconds: 0 });

const ChatThread: Model<IChatThread> =
    (models.ChatThread as Model<IChatThread>) ||
    model<IChatThread>("ChatThread", ChatThreadSchema);

export default ChatThread;
