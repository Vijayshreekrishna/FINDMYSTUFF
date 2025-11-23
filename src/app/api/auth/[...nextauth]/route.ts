import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const { name, email, image } = user;
                try {
                    await dbConnect();
                    const userExists = await User.findOne({ email });
                    if (!userExists) {
                        await User.create({ name, email, image });
                    }
                    return true;
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }
            return true;
        },
        async session({ session }) {
            // Attach user ID from DB to session if needed
            if (session.user?.email) {
                await dbConnect();
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser) {
                    // @ts-ignore
                    session.user.id = dbUser._id.toString();
                    // @ts-ignore
                    session.user.role = dbUser.role;
                }
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
