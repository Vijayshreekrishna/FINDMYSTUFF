export async function verifyTurnstileToken(token: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return true; // Bypass if not configured (dev mode)

    try {
        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                secret,
                response: token
            })
        });

        const data = await res.json();
        return data.success;
    } catch (e) {
        console.error("Turnstile error:", e);
        return false;
    }
}
