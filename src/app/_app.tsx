/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function App({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
