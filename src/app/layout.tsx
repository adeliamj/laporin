import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>
          <Navbar />
          <main className="w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}