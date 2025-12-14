import { Schema, model, models, type Document, type Model, Types } from "mongoose";

export interface IMessage extends Document {
    thread: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    attachments?: { url: string; type: string; size?: number }[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        thread: { type: Schema.Types.ObjectId, ref: "ChatThread", required: true },
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        attachments: [
            {
                url: String,
                type: String,
                size: Number
            }
        ],
    },
    { timestamps: true }
);

const Message: Model<IMessage> =
    (models.Message as Model<IMessage>) ||
    model<IMessage>("Message", MessageSchema);

export default Message;
