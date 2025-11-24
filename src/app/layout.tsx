import "./globals.css";
import Providers from "./providers";
import Navbar from "@/app/components/layout/Navbar";

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
          <main className="max-w-5xl mx-auto mt-4 px-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
