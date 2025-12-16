import { Schema, model, models, type Document, type Model, Types } from 'mongoose';

export interface IClaim extends Document {
    post: Types.ObjectId;
    claimant: Types.ObjectId;
    status: 'pending' | 'awaiting_verification' | 'approved' | 'rejected' | 'expired' | 'completed';
    verificationStatus: 'unverified' | 'email_verified' | 'fully_verified';
    score: number;
    answers: Record<string, any>;
    evidenceImage?: string;
    handoffCodeHash?: string;
    fingerprint?: string;

    // Stage 3: Verification
    claimerProof?: {
        imageUrl: string;
        note?: string;
        submittedAt?: Date;
    };
    verification?: {
        reviewedBy?: Types.ObjectId;
        decision?: 'approved' | 'rejected';
        decidedAt?: Date;
        reason?: string;
    };

    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ClaimSchema = new Schema<IClaim>(
    {
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        claimant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['pending', 'awaiting_verification', 'approved', 'rejected', 'expired', 'completed'],
            default: 'pending',
        },
        verificationStatus: {
            type: String,
            enum: ['unverified', 'email_verified', 'fully_verified'],
            default: 'unverified',
        },
        score: { type: Number, default: 0 },
        answers: { type: Map, of: Schema.Types.Mixed, default: {} },
        evidenceImage: { type: String },
        handoffCodeHash: { type: String },
        fingerprint: { type: String },

        claimerProof: {
            imageUrl: { type: String },
            note: { type: String },
            submittedAt: { type: Date }
        },
        verification: {
            reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            decision: { type: String, enum: ['approved', 'rejected'] },
            decidedAt: { type: Date },
            reason: { type: String }
        },

        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

// Prevent duplicate claims for same post by same user
ClaimSchema.index({ post: 1, claimant: 1 }, { unique: true });
// TTL index for expiration
ClaimSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Claim = (models.Claim as Model<IClaim>) || model<IClaim>('Claim', ClaimSchema);

export default Claim;
