import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/connection";
dbConnect();

import UserAccount from "@/models/UserAccount";

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_SESSIONSECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt(jwtProps) {
      if (jwtProps.user) jwtProps.token.user = jwtProps.user;

      return jwtProps.token;
    },
    session(sessionProps) {
      if (sessionProps.token.user)
        sessionProps.session.user = sessionProps.token.user;

      return sessionProps.session;
    },
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email_address: {
          label: "Email Address",
          type: "email",
          placeholder: "Enter your email address",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials, req) {
        const { email_address, password } = credentials;

        // Check if user exists in your database
        try {
          const user = await UserAccount.findOne({
            email_address: email_address,
            password: password,
          });

          if (user) {
            // remove password from user object
            user.password = undefined;

            return user;
          } else {
            console.log("User not found");
          }
        } catch (err) {
          console.log(err);
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
