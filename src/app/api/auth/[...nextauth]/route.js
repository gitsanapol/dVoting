import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectMongoDB } from "../../../../../lib/mongodb";
import { connectSQL } from "../../../../../lib/tidb";
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
                // await connectMongoDB();
                const pool = await connectSQL(); 
                const promisePool = pool.promise();
                
                // const user = await User.findOne({email});
                const [rows] = await promisePool.query(
                  `SELECT * FROM student WHERE email = ?`, 
                  [email]
                );
                // Extract the user object from the rows
                const user = rows[0] || null; // Get the first result or null if no results found
                // const user = { studentID: rows[0].studentID, email: rows[0].email } || null;

                if(!user) {
                    return null;
                }

                const passwordMatch = bcrypt.compare(password, user.password);
                if(!passwordMatch){
                    return null;
                }
                console.log(user)
                return user;
            }catch(error){
                console.log("error", error);
            }
          }
        })
      ],
      // Customize the session to include studentID in the session object
      callbacks: {
        async session({ session, token }) {
          // Attach studentID from token to session user
          if (token?.studentID) {
            session.user.studentID = token.studentID;
          }
          return session;
        },
        async jwt({ token, user }) {
          // First login, user object will be available
          if (user) {
            token.studentID = user.studentID;
          }
          return token;
        }
      },
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