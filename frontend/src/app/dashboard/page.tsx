"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlayCircle, PlusCircle, Video, TrendingUp, Cpu, BarChart3, Loader2 } from "lucide-react";

interface MatchSession {
  id: string;
  title: string;
  uploaded_at: string;
  status: string;
  duration: string;
  resolution: string;
  video_type: string;
  score: string;
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<MatchSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${apiUrl}/matches`);
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        } else {
          setError("Failed to load match tactical sessions.");
        }
      } catch (err) {
        setError("Unable to connect to intelligence ingestion API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const getVideoTypeLabel = (type: string) => {
    switch (type) {
      case "full_match": return "Full Match Focus";
      case "free_kick": return "Free Kick Focus";
      case "penalty": return "Penalty Kick Focus";
      case "corner": return "Corner Ingestion";
      case "training": return "Training Practice";
      default: return "Tactical Analysis";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Match Intelligence Overview</h2>
          <p className="text-muted-foreground mt-1">
            Analyze, track, and optimize tactical structures.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="h-4 w-4" />
          Upload New Video
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border rounded-xl p-6 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Videos Processed</p>
            <p className="text-3xl font-bold">{isLoading ? "..." : sessions.length}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-primary">
            <Video className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border rounded-xl p-6 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Possession</p>
            <p className="text-3xl font-bold">58.2%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="border border-border rounded-xl p-6 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI Tactical Queries</p>
            <p className="text-3xl font-bold">124</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-primary">
            <Cpu className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Active Matches Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">Recent Tactical Analysis</h3>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-2xl bg-card/25 gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-semibold">Loading tactical sessions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/25 text-sm text-destructive font-semibold">
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/25 text-sm text-muted-foreground">
            No match footage sessions ingested yet. Click &quot;Upload New Video&quot; to begin.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border border-border rounded-xl p-5 bg-card/60 hover:bg-card transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <Video className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-base hover:text-primary transition-colors truncate block" title={session.title}>
                      {session.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1 font-semibold">
                      <span>Uploaded: {formatDate(session.uploaded_at)}</span>
                      <span>•</span>
                      <span>Length: {session.duration}</span>
                      <span>•</span>
                      <span className="text-primary">{getVideoTypeLabel(session.video_type)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        session.status === "analyzed" ? "bg-primary animate-pulse" : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-xs font-semibold capitalize">{session.status}</span>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-semibold">Tactic Score</p>
                    <p className="font-bold text-sm">{session.score}</p>
                  </div>

                  <Link
                    href={`/dashboard/analysis/${session.id}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-muted px-4 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <PlayCircle className="h-4 w-4" />
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
