/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's access token */
      name?: any;
      accessToken?: any;
      refreshToken?: any;
      statusUser?: any;
    } & DefaultUser;
  }

  /**
   * The shape of the returned object in the OAuth providers' profile callback, available in the jwt and session callbacks, or the second parameter of the session callback, when using a database.
   */
  interface User {
    name?: any;
    accessToken?: any;
    refreshToken?: any;
    statusUser?: any;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's access token */
    name?: any;
    accessToken?: any;
    refreshToken?: any;
    statusUser?: any;
  }
}
