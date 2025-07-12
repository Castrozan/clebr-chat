"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold">AI Chat</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </Link>

            <Link href="/config">
              <Button
                variant={pathname === "/config" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Config
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
