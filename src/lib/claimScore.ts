interface ScoreFactors {
    serialMatch?: boolean;
    imageMatchConfidence?: number; // 0-100
    keywordMatchCount?: number;
    lastSeenWithinHour?: boolean;
    emailVerified?: boolean;
    recentClaimsCount?: number;
    challengeCorrect?: boolean;
    distanceKm?: number;
}

export function calculateClaimScore(factors: ScoreFactors): number {
    let score = 0;

    // High confidence factors
    if (factors.serialMatch) score += 60;

    // Keyword matches (capped at 30)
    if (factors.keywordMatchCount) {
        score += Math.min(factors.keywordMatchCount * 10, 30);
    }

    // Time proximity
    if (factors.lastSeenWithinHour) score += 10;

    // Verification
    if (factors.emailVerified) score += 10;

    // Challenge
    if (factors.challengeCorrect) score += 15;

    // Location (if very close, e.g. < 1km)
    if (factors.distanceKm !== undefined && factors.distanceKm < 1) {
        score += 20;
    }

    // Negative factors
    if (factors.recentClaimsCount && factors.recentClaimsCount > 5) {
        score -= 60; // Potential spam
    }

    return score;
}

export function getClaimBand(score: number): 'auto_approve' | 'manual_review' | 'auto_reject' {
    if (score >= 80) return 'auto_approve';
    if (score <= -20) return 'auto_reject';
    return 'manual_review';
}
