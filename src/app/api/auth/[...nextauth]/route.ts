import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { NextAuthOptions } from "next-auth";

export const authOptions : NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { db } = await connectToDatabase();
        const usersCollection = db.collection('doctors');
        
        const user = await usersCollection.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          return null; // User not found
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null; // Password incorrect
        }

        // Return the user object for the session
        // IMPORTANT: The session `user.id` will be the doctor's MongoDB _id
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
  // Add types for token and user here
  async jwt({ token, user }: { token: JWT; user?: User }) {
    // user object is only available on the first call after a new sign-in
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },

  // Add types for session and token here
  async session({ session, token }: { session: Session; token: JWT }) {
    if (session.user) {
      // Add the custom properties from the token to the session
      session.user.id = token.id as string;
      session.user.role = token.role as string;
    }
    return session;
  },
},
  pages: {
    signIn: '/login', // Redirect to your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };