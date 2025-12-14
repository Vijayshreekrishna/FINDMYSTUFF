import bcrypt from 'bcryptjs';

export function generateHandoffCode(): string {
    // Generate 6 digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashHandoffCode(code: string): Promise<string> {
    return await bcrypt.hash(code, 10);
}

export async function verifyHandoffCode(code: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(code, hash);
}
