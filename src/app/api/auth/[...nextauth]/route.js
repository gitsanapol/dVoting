import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from 'bcryptjs';

const authOptions = {
    providers: [
        CredentialsProvider({
          name: 'credentials',
          credentials: {},
          async authorize(credentials, req) {

            // *Fake data for test
            // const user = {id: '1'};
            // return user;

            const { email, password } = credentials;
            try{
                await connectMongoDB();
                const user = await User.findOne({email});

                if(!user) {
                    return null;
                }

                const passwordMatch = bcrypt.compare(password, user.password);
                if(!passwordMatch){
                    return null;
                }

                return user;
            }catch(error){
                console.log("error", error);
            }
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