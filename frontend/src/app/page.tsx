import Link from "next/link";
import { Activity, Play, Brain, Target, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary animate-pulse" />
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Antigravity Football AI
          </span>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch Platform
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-32 px-6 lg:px-12 max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Next-Gen Tactical Intelligence Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-6">
            Transform Match Footage Into{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Tactical Victory
            </span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Upload match reels to automatically extract player movements, trace passing routes, calculate space occupancy, and get coached by an advanced LLM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Analysis
            </Link>
            <Link
              href="/dashboard/upload"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 text-base font-semibold transition-all hover:bg-muted hover:text-foreground hover:scale-[1.02] active:scale-[0.98]"
            >
              Upload Match Video
            </Link>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 border-t border-border bg-card/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="text-3xl font-bold text-center mb-16">Platform Core Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="border border-border rounded-xl p-8 bg-card/40 hover:border-primary/30 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Play className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Player Tracking & YOLOv11</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time detection models capture coordinates, velocities, and distance covered per player during matching sequences.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="border border-border rounded-xl p-8 bg-card/40 hover:border-primary/30 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Coach & Playbooks RAG</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discuss strategies with an AI Coach that references your actual match analytics coupled with professional football manuals.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="border border-border rounded-xl p-8 bg-card/40 hover:border-primary/30 transition-all hover:-translate-y-1">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Possession & Heatmaps</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Extract spatial distributions of each team and map pass network nodes to identify key playmakers and gaps.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center bg-card/30 text-sm text-muted-foreground gap-4">
        <p>© 2026 Antigravity Football AI. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/docs/architecture" className="hover:text-foreground">Architecture</Link>
          <Link href="/docs/API" className="hover:text-foreground">API Docs</Link>
        </div>
      </footer>
    </div>
  );
}
