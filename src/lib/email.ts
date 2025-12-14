import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not found. Skipping email send.");
        return;
    }

    try {
        await resend.emails.send({
            from: 'FindMyStuff <onboarding@resend.dev>', // Use default testing domain or configured domain
            to: email,
            subject: 'Verify your Claim',
            html: `<p>Your verification code is: <strong>${code}</strong></p>`
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
}
