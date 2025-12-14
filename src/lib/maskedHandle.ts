export function generateMaskedHandle(userId: string): string {
    const buffer = Buffer.from(userId);
    const base64 = buffer.toString('base64url');
    // Take first 4 chars of base64url encoded ID
    const shortId = base64.substring(0, 4);
    return `u_${shortId}`;
}
