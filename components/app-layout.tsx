"use client";

import { MainLayout } from "./main-layout";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
} 