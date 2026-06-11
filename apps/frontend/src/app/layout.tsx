import Link from "next/link";
import { Activity, LayoutDashboard } from "lucide-react";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-primary">
            <Activity className="h-5 w-5" />
            <span>AgentReplay</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
              <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link href="/" className="transition-colors hover:text-foreground/80 flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link href="/playground" className="transition-colors hover:text-foreground/80 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Playground
                  </Link>
              </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-8 max-w-[1600px]">
        {children}
      </main>
        <Toaster />
        </div>
      </body>
    </html>
  );
}
