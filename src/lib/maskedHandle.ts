export function generateMaskedHandle(): string {
    // Generate random 4-char string (base36)
    const randomPart = Math.random().toString(36).substring(2, 6);
    return `u_${randomPart}`;
}
