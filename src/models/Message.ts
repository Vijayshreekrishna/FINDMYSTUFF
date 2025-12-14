import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IMessage extends Document {
    thread: Schema.Types.ObjectId;
    sender: Schema.Types.ObjectId;
    content: string;
    hasAttachment: boolean;
    isSystemMessage: boolean;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        thread: { type: Schema.Types.ObjectId, ref: 'ChatThread', required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        hasAttachment: { type: Boolean, default: false },
        isSystemMessage: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for efficient retrieval by thread
MessageSchema.index({ thread: 1, createdAt: 1 });

const Message = (models.Message as Model<IMessage>) || model<IMessage>('Message', MessageSchema);

export default Message;
