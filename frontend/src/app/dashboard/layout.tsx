import Link from "next/link";
import { LayoutDashboard, Upload, PlayCircle, Settings, LogOut, Activity } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col justify-between hidden md:flex">
        <div className="flex flex-col">
          {/* Brand Logo */}
          <div className="h-20 flex items-center px-6 border-b border-border gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Football Intelligence
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/dashboard/upload"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Upload className="h-4 w-4" />
              Upload Match
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <PlayCircle className="h-4 w-4" />
              Analysis Sessions
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>

        {/* User Info / Sign Out */}
        <div className="p-4 border-t border-border flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">
              FC
            </div>
            <div>
              <p className="text-sm font-semibold">Demo Coach</p>
              <p className="text-xs text-muted-foreground">coach@football.ai</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-destructive text-sm font-medium hover:bg-destructive/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 border-b border-border bg-card/20 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="font-bold text-xl md:text-2xl">Tactical Workspace</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-border rounded-lg bg-card px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Live Server Connected
            </div>
          </div>
        </header>

        {/* Page children container */}
        <main className="p-6 md:p-10 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
