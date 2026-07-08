import Link from "next/link";
import { PlayCircle, PlusCircle, Video, TrendingUp, Cpu, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const recentSessions = [
    {
      id: "match_session_1",
      title: "Arsenal vs Chelsea - Build-up Sequence",
      date: "July 08, 2026",
      duration: "12m 45s",
      status: "analyzed",
      score: "85%",
    },
    {
      id: "match_session_2",
      title: "Real Madrid vs Barcelona - Counter Transition",
      date: "July 07, 2026",
      duration: "4m 12s",
      status: "processing",
      score: "Pending",
    },
  ];

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
        {/* Metric 1 */}
        <div className="border border-border rounded-xl p-6 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Videos Processed</p>
            <p className="text-3xl font-bold">14</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-primary">
            <Video className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border border-border rounded-xl p-6 bg-card flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Possession</p>
            <p className="text-3xl font-bold">58.2%</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Metric 3 */}
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
        
        <div className="grid grid-cols-1 gap-4">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="border border-border rounded-xl p-5 bg-card/60 hover:bg-card transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base hover:text-primary transition-colors">
                    {session.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>Uploaded: {session.date}</span>
                    <span>•</span>
                    <span>Length: {session.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      session.status === "analyzed" ? "bg-primary animate-pulse" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-xs font-medium capitalize">{session.status}</span>
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
      </div>
    </div>
  );
}
