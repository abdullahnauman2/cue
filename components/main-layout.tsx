"use client";

import { useState } from "react";
import {
  PanelLeft,
  CalendarDays,
  History as HistoryIcon,
  PlusSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Header } from "./header";
import { GlowingOrb } from "./ui/glowing-orb";

interface MainLayoutProps {
  children: React.ReactNode;
}

const mockHistory = [
  { id: "1", date: new Date("2024-07-28") },
  { id: "2", date: new Date("2024-07-27") },
  { id: "3", date: new Date("2024-07-26") },
  { id: "4", date: new Date("2024-07-25") },
  { id: "5", date: new Date("2024-07-24") },
];

function NavLink({
  href,
  icon: Icon,
  label,
  isCollapsed,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        {
          "bg-zinc-200/50 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-50":
            isActive,
          "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50":
            !isActive,
          "justify-center": isCollapsed,
        }
      )}
    >
      <Icon size={20} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={cn(
          "relative z-10 flex flex-col border-r border-zinc-200 bg-[#f9f9f9] transition-all duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-zinc-200 px-4 dark:border-zinc-800",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed ? (
            <>
              <Link href="/" className="flex items-center gap-3">
                <GlowingOrb />
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Aura
                </h1>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <PanelLeft
                  size={20}
                  className={cn(
                    "transition-transform duration-300",
                    !isCollapsed && "rotate-180"
                  )}
                />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <GlowingOrb />
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <NavLink
            href="/today"
            icon={CalendarDays}
            label="Today"
            isCollapsed={isCollapsed}
            isActive={pathname === "/today"}
          />
          <NavLink
            href="/closet"
            icon={PlusSquare}
            label="Update Closet"
            isCollapsed={isCollapsed}
            isActive={pathname === "/closet"}
          />

          {!isCollapsed && (
            <div className="px-3 pt-4 pb-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                History
              </h2>
            </div>
          )}

          {mockHistory.map((item) => (
            <NavLink
              key={item.id}
              href={`/history/${item.id}`}
              icon={HistoryIcon}
              label={item.date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
              isCollapsed={isCollapsed}
              isActive={pathname === `/history/${item.id}`}
            />
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}