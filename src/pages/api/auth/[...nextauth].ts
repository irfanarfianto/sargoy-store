import { loginWithGoogle, SignIn } from "@/services/auth/services";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';

const authOptions: NextAuthOptions = {
   session: {
      strategy: 'jwt',
   },
   secret: process.env.NEXTAUTH_SECRET,
   providers: [
      Credentials({
         type: 'credentials',
         name: 'Credentials',
         credentials: {
            email: {
               label: "Email",
               type: "text",
            },
            password: {
               label: "Password",
               type: "password",
            },
         },
         async authorize(credentials :any) {
            const { email, password } = credentials as {
               email: string
               password: string
            };
            const user: any = await SignIn(email);
            if (user) {
               const passwordConfirm = await compare(password, user.password);
               if (passwordConfirm) {
                  return user
               } 
               return null;
            
            } else {
               return null;
            }
         },
      }),
      GoogleProvider({
         clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
         clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '', 
      })
   ],
  
   callbacks: {
      async jwt({ token, user, account, profile }: any) {
         if(account?.provider === "credentials") {
            token.email = user.email;
            token.fullname = user.fullname;
            token.phone = user.phone;
            token.role = user.role;
         }

         if (account?.provider === "google") {
            const data = {
               email: profile?.email,
               fullname: profile?.name,
               password: '', 
               created_at: new Date(), 
               updated_at: new Date(),
               type: 'google'
            };
            
            await loginWithGoogle(
               data,
               (data: any) => {
                  token.email = data.email
                  token.fullname = data.fullname
                  token.role = data.role
               }
            )
         }

         

         return token
      },
      async session({ session, token }: any) {
         if ('email' in token) {
            session.user.email = token.email
         }
         if ('fullname' in token) {
            session.user.fullname = token.fullname
         }
         if ('phone' in token) {
            session.user.phone = token.phone
         }
         if ('role' in token) {
            session.user.role = token.role
         }

         const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || '', { algorithm: "HS256" });
         session.accessToken = accessToken;

         return session;
      }
   },
   pages: {
      signIn: '/auth/login',
   }
}

export default NextAuth(authOptions);