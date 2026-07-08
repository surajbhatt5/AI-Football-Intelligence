import Link from "next/link";
import { ArrowLeft, MessageSquare, Play, Send, Sparkles, User, Users } from "lucide-react";

export default function AnalysisPage({ params }: { params: { matchId: string } }) {
  // Mock data representing match data
  const matchInfo = {
    title: params.matchId === "match_session_1" 
      ? "Arsenal vs Chelsea - Build-up Sequence" 
      : "Real Madrid vs Barcelona - Counter Transition",
    possessionA: 58,
    possessionB: 42,
    passingAccuracyA: 85,
    passingAccuracyB: 79,
  };

  return (
    <div className="space-y-8">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Link>
        <div className="flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-1 rounded-full text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Tactical Insights Ready
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Video & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mock Video Player */}
          <div className="border border-border bg-card/40 rounded-2xl overflow-hidden aspect-video relative group flex items-center justify-center">
            {/* Visual background placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-background to-background" />
            
            {/* Simulated pitch overlays */}
            <div className="absolute inset-x-0 bottom-4 px-6 flex justify-between text-xs text-muted-foreground pointer-events-none">
              <span>YOLOv11 Bounding Boxes Active</span>
              <span>ByteTrack Active (10 Hz)</span>
            </div>

            <button className="h-16 w-16 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-10">
              <Play className="h-8 w-8 fill-current ml-1" />
            </button>
          </div>

          {/* Stats Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Possession breakdown */}
            <div className="border border-border rounded-xl p-5 bg-card/50">
              <h4 className="font-bold text-sm text-muted-foreground mb-4">Possession Matrix</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Home Team</span>
                  <span>{matchInfo.possessionA}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: `${matchInfo.possessionA}%` }} />
                  <div className="bg-muted h-full" style={{ width: `${matchInfo.possessionB}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Chelsea</span>
                  <span>{matchInfo.possessionB}%</span>
                </div>
              </div>
            </div>

            {/* Passes stats */}
            <div className="border border-border rounded-xl p-5 bg-card/50">
              <h4 className="font-bold text-sm text-muted-foreground mb-4">Passing Node Networks</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Accuracy</span>
                  <span>{matchInfo.passingAccuracyA}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: `${matchInfo.passingAccuracyA}%` }} />
                  <div className="bg-muted h-full" style={{ width: `${100 - matchInfo.passingAccuracyA}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Chelsea accuracy</span>
                  <span>{matchInfo.passingAccuracyB}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: AI RAG Coach Box */}
        <div className="border border-border bg-card rounded-2xl flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">AI Tactical Coach</h4>
              <p className="text-xs text-muted-foreground">Gemini RAG playbooks connected</p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
            {/* Coach welcome */}
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-primary/25 flex items-center justify-center text-primary text-xs shrink-0">
                AI
              </div>
              <div className="bg-muted p-3.5 rounded-2xl rounded-tl-none leading-relaxed text-muted-foreground">
                Hi! I have digested the spatial tracks of this match sequence. Ask me about defense structures, counter attacks, or player positions.
              </div>
            </div>
          </div>

          {/* Chat Input footer */}
          <div className="p-4 border-t border-border flex gap-2">
            <input
              type="text"
              placeholder="Ask coach (e.g., Explain passing loops...)"
              className="flex-1 min-w-0 bg-muted/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
            />
            <button className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-primary/95 transition-all">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
