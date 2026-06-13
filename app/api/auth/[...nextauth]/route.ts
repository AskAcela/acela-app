import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Account from "@/models/Account";

const handler = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                await connectDB();

                if (!account) {
                    return false;
                }

                const provider = account?.provider!;
                const providerAccountId = account?.providerAccountId!;

                const existingAccount =
                    await Account.findOne({
                        provider,
                        providerAccountId,
                    });

                if (existingAccount) return true;

                let dbUser = await User.findOne({
                    email: user.email,
                });

                if (!dbUser) {
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        username: profile?.login,
                    });
                }

                await Account.create({
                    userId: dbUser._id,
                    provider,
                    providerAccountId,
                });

                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        },
        async jwt({ token }) {

            await connectDB();

            const dbUser = await User.findOne({
                email: token.email,
            });

            if (dbUser) {
                token.userId = dbUser._id.toString();
                token.role = dbUser.role;
            }

            return token;
        },

        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.userId as string;
                session.user.role = token.role as string;
            }

            return session;
        }
    },
});

export const { GET, POST } = handler.handlers;