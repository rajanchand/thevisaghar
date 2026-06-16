
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";

// Login rate limit: 5 attempts per 15 minutes
const LOGIN_RATE_LIMIT = { interval: 15 * 60_000, maxRequests: 5 };

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Rate limit login attempts by email
        const { success: rateLimitOk } = rateLimit(
          `login:${credentials.email}`,
          LOGIN_RATE_LIMIT
        );
        if (!rateLimitOk) {
          // Log the rate-limited attempt
          await logAudit({
            action: "LOGIN_RATE_LIMITED",
            entity: "User",
            details: { email: credentials.email },
          });
          throw new Error("Too many login attempts. Please try again in 15 minutes.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (user.status === "DEACTIVATED") {
          throw new Error("Your account has been deactivated");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Update lastLogin timestamp asynchronously
        prisma.user
          .update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          })
          .catch((err) => console.error("[NextAuth] Failed to update lastLogin:", err));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "ADMIN" | "EDITOR" | "VIEWER",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
