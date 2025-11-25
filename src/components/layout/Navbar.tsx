"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isLoggedIn = status === "authenticated";
  const role = (session?.user as any)?.role;

  const menuItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`
        px-4 py-2 rounded-8 text-normal-medium transition
        ${
          pathname === href
            ? "bg-white text-blue-100"      // ACTIVE (clicked)
            : "text-white hover:bg-blue-40" // DEFAULT (not clicked)
        }
      `}
    >
      {label}
    </Link>
  );

  return (
    <nav className="w-full bg-[#08172e] shadow-sm px-24 py-12 flex justify-between items-center sticky top-0 z-50">
      
      {/* Brand */}
      <Link href="/" className="text-heading-5 font-bold text-white/90">
        Laporin
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-6">
        {!isLoggedIn && (
          <>
            {menuItem("/register", "Register")}
            {menuItem("/login", "Login")}
          </>
        )}

        {isLoggedIn && (
          <>
            {menuItem("/dashboard", "Dashboard")}

            {role === "admin" && menuItem("/admin", "Admin Panel")}

            <button
              onClick={() => signOut()}
              className="px-8 py-4 rounded-10 bg-blue-80 text-white hover:bg-blue-60 transition text-normal-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
