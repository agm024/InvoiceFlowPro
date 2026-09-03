import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/utils/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { company: true }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.companyId,
            isSuperAdmin: user.isSuperAdmin
          }
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
        if (!dbUser) {
          const cookieStore = await require('next/headers').cookies()
          const isSignUp = cookieStore.get('isSignUp')?.value === 'true'
          
          if (!isSignUp) {
            // Deny access if they don't exist in our DB and they are trying to sign in
            return "/sign-in?error=AccessDenied"
          }
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      // If no companyId in token, we need to check DB (might be newly created during onboarding)
      if (!token.companyId && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.id = dbUser.id
          token.companyId = dbUser.companyId
          token.isSuperAdmin = dbUser.isSuperAdmin
          token.role = dbUser.role
        }
      }

      // Initial sign in
      if (user) {
        let dbUser = null;
        if (account?.provider === "google" && user.email) {
           dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        } else {
           dbUser = user as any; // From CredentialsProvider
        }
        
        if (dbUser) {
          token.id = dbUser.id
          token.companyId = dbUser.companyId
          token.isSuperAdmin = dbUser.isSuperAdmin
          token.role = dbUser.role
        } else if (account?.provider === "google") {
          // New user signing up via Google
          token.email = user.email;
          token.name = user.name;
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).companyId = token.companyId
        ;(session.user as any).isSuperAdmin = token.isSuperAdmin
        ;(session.user as any).role = token.role
      }
      return session
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-local-dev-only",
})
