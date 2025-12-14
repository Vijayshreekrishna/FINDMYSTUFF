import { describe, it, expect } from 'vitest';
import { calculateClaimScore, getClaimBand } from '@/lib/claimScore';

describe('Claim Scoring Logic', () => {
    it('should calculate high score for serial match', () => {
        const score = calculateClaimScore({ serialMatch: true });
        expect(score).toBeGreaterThan(50);
    });

    it('should penalize spammy behavior', () => {
        const score = calculateClaimScore({ recentClaimsCount: 10 });
        expect(score).toBeLessThan(0);
    });

    it('should verify auto_approve band', () => {
        const band = getClaimBand(90);
        expect(band).toBe('auto_approve');
    });

    it('should verify auto_reject band', () => {
        const band = getClaimBand(-30);
        expect(band).toBe('auto_reject');
    });
});
