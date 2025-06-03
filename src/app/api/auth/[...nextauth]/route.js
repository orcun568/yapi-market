import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // rolü ekliyoruz
          phoneNumber: user.phoneNumber,
        };
      },
    }),
  ],
  callbacks: {
  async session({ session, token, user }) {
    if (token) {
      session.user.id = token.sub;  // token.sub genelde user id olur
      session.user.role = token.role;
      session.user.phoneNumber = token.phoneNumber;
    }
    return session;
  },
  async jwt({ token, user }) {
  if (user) {
    token.role = user.role;
    token.phoneNumber = user.phoneNumber;
    token.sub = user.id;
    token.email = user.email; // eğer yoksa ekle
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: token.email },
  });

  if (dbUser) {
    token.phoneNumber = dbUser.phoneNumber;
  }

  return token;
}

},

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
