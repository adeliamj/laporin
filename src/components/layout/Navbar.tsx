/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, UserPlus, LogIn } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isLoggedIn = status === "authenticated";
  const role = (session?.user as any)?.role;

  const menuItem = (href: string, label: string, icon?: React.ReactNode) => {
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        className={`
          group relative px-4 py-2 rounded-lg font-medium transition-all duration-200
          flex items-center gap-2
          ${
            isActive
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : "text-white/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
          }
        `}
      >
        {icon && <span className={isActive ? "text-blue-400" : "text-white/60 group-hover:text-white/80"}>{icon}</span>}
        {label}
        {isActive && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-400 rounded-t-full"></div>
        )}
      </Link>
    );
  };

  return (
    <nav className="w-full h-20 bg-[#08172e] backdrop-blur-xl shadow-lg sticky top-0 z-[100] mb-0">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-white transition-all">
            Laporin
          </span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-3">
          {!isLoggedIn && (
            <>
              {menuItem("/register", "Register", <UserPlus className="w-4 h-4" />)}
              {menuItem("/login", "Login", <LogIn className="w-4 h-4" />)}
            </>
          )}

          {isLoggedIn && (
            <>
              {menuItem("/", "Dashboard", <LayoutDashboard className="w-4 h-4" />)}

              {/* User Info */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10 ml-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                  <p className="text-xs text-white/50 capitalize">{role}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => signOut()}
                className="group px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}