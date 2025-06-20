import { cn } from "@/lib/utils";

export function GlowingOrb() {
  return (
    <div
      className={cn(
        "h-5 w-5 rounded-full",
        "bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700",
        "animate-pulse-slow"
      )}
    />
  );
} 