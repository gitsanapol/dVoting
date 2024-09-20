import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions = {
    providers: [
        CredentialsProvider({
          name: 'credentials',
          credentials: {},
          async authorize(credentials, req) {

            const user = {id: '1'};
            return user;

          }
        })
      ],
      session: {
        straegy: "jwt",
      },
      secret: process.env.NEXYAUTH_SECRET,
      pages: {
        signIn: "/login"
      }
}

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};