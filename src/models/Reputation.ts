import { Schema, model, models, type Document, type Model, Types } from 'mongoose';

export interface IReputation extends Document {
    user: Types.ObjectId;
    score: number;
    successfulHandoffs: number;
    rejectedClaims: number;
    badges: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ReputationSchema = new Schema<IReputation>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        score: { type: Number, default: 100 },
        successfulHandoffs: { type: Number, default: 0 },
        rejectedClaims: { type: Number, default: 0 },
        badges: [{ type: String }],
    },
    { timestamps: true }
);

const Reputation = (models.Reputation as Model<IReputation>) || model<IReputation>('Reputation', ReputationSchema);

export default Reputation;
