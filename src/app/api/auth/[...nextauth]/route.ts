import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await dbConnect();

                try {
                    // Explicitly select password since it's hidden by default in model
                    const user = await User.findOne({ email: credentials.email }).select("+password");

                    if (!user) {
                        return null;
                    }

                    if (!user.password) {
                        return null;
                    }

                    const isMatch = await bcrypt.compare(credentials.password, user.password);

                    if (!isMatch) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
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
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
            }

            // If logging in with Google, fetch the MongoDB ID
            if (account?.provider === "google" && token.email) {
                await dbConnect();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    // @ts-ignore
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            // Attach user ID from DB to session if needed
            if (session.user) {
                // @ts-ignore
                session.user.id = token.id;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
