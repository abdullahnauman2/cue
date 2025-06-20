"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "./main-layout";

const authRoutes = ["/auth/sign-in", "/auth/sign-up", "/auth/callback"];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (authRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
} 