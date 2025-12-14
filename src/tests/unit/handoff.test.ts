import { describe, it, expect } from 'vitest';
import { generateHandoffCode, hashHandoffCode, verifyHandoffCode } from '@/lib/handoff';

describe('Handoff Logic', () => {
    it('should generate a 6 digit code', () => {
        const code = generateHandoffCode();
        expect(code).toMatch(/^\d{6}$/);
    });

    it('should hash and verify correctly', async () => {
        const code = "123456";
        const hash = await hashHandoffCode(code);

        expect(hash).not.toBe(code);

        const isValid = await verifyHandoffCode(code, hash);
        expect(isValid).toBe(true);

        const isInvalid = await verifyHandoffCode("654321", hash);
        expect(isInvalid).toBe(false);
    });
});
