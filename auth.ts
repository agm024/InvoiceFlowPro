import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/utils/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.companyId = (user as any).companyId
        token.isSuperAdmin = (user as any).isSuperAdmin
        token.role = (user as any).role
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
