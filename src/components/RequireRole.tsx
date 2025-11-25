"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function RequireRole({
  role,
  children,
}: {
  role: "admin" | "user";
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role;
      if (userRole !== role) {
        router.push("/dashboard"); // lempar ke dashboard umum
      }
    }
  }, [status, session, role, router]);

  if (status === "loading") return <p>Loading...</p>;
  return <>{children}</>;
}
