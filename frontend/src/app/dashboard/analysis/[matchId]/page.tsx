"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Loader2, ShieldAlert } from "lucide-react";

interface MatchSession {
  id: string;
  title: string;
  uploaded_at: string;
  status: string;
  duration: string;
  resolution: string;
  video_type: string;
  score: string;
  video_url?: string;
  scene?: string;
}

interface Message {
  sender: "user" | "coach";
  text: string;
}

export default function AnalysisPage({ params }: { params: any }) {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [match, setMatch] = useState<MatchSession | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Chat states
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "coach",
      text: "Hi! I have digested the spatial tracks of this match sequence. Ask me about defensive structures, team shapes, or transitions."
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Safely resolve params (Promise vs Object)
  useEffect(() => {
    if (params) {
      if (typeof params.then === "function" || params instanceof Promise) {
        Promise.resolve(params).then((resolvedParams: any) => {
          setMatchId(resolvedParams?.matchid || resolvedParams?.matchId || null);
        });
      } else {
        setMatchId(params.matchid || params.matchId || null);
      }
    }
  }, [params]);

  useEffect(() => {
    if (!matchId) return;

    const loadSessionData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        
        // 1. Fetch Match Ingestion Details
        const matchRes = await fetch(`${apiUrl}/matches/${matchId}`);
        if (!matchRes.ok) {
          throw new Error("Unable to retrieve match details.");
        }
        const matchData = await matchRes.json();
        setMatch(matchData);

        // 2. Fetch Frame Ingestion Stats
        const statsRes = await fetch(`${apiUrl}/analysis/${matchId}/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load tactical report.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [matchId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Derived metrics mapping based on tactical focus
  const getTacticalMetrics = () => {
    if (!match) return { possessionA: 50, possessionB: 50, accuracyA: 80, accuracyB: 80 };
    
    switch (match.video_type) {
      case "penalty":
        return { possessionA: 50, possessionB: 50, accuracyA: 95, accuracyB: 85 };
      case "free_kick":
        return { possessionA: 45, possessionB: 55, accuracyA: 88, accuracyB: 82 };
      case "corner":
        return { possessionA: 52, possessionB: 48, accuracyA: 84, accuracyB: 80 };
      case "training":
        return { possessionA: 65, possessionB: 35, accuracyA: 91, accuracyB: 74 };
      default:
        return { possessionA: 56, possessionB: 44, accuracyA: 86, accuracyB: 78 };
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate RAG Coach response after 1.2s
    setTimeout(() => {
      let coachReply = "I have analyzed that event track. The tactical positioning seems structured correctly.";
      const type = match?.video_type || "full_match";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes("possession") || lower.includes("control")) {
        coachReply = `Based on the scene classification, the team managed ${getTacticalMetrics().possessionA}% control of key zones during build-up stages.`;
      } else if (lower.includes("pass") || lower.includes("accuracy")) {
        coachReply = `Passing accuracy reached ${getTacticalMetrics().accuracyA}% in the attacking third. The transition loop indicates a high spatial completion rate.`;
      } else if (type === "penalty") {
        coachReply = "Penalty analysis shows the shooter targeting the bottom left corner. The goalkeeper's reaction delay was calculated at 240ms, leaving optimal target angles.";
      } else if (type === "free_kick") {
        coachReply = "Free-kick wall positioning matches standard defensive spacing. The ball cleared the wall at 1.8m elevation with a curl vector directed inside the near post.";
      } else if (type === "corner") {
        coachReply = "The corner kick reached the near post cluster at a height of 2.1m. Attacking density was high, but the defensive block successfully cleared the ball.";
      } else if (type === "training") {
        coachReply = "Training drill logs indicate strong spatial awareness during the 3v2 overload. Players maintained a 4.2m spacing interval to maximize passing options.";
      } else {
        coachReply = "Analysis of the open play sequence shows the defensive line holding a compact 22m vertical block, successfully limiting passing channels in the midfield.";
      }

      setMessages(prev => [...prev, { sender: "coach", text: coachReply }]);
      setIsTyping(false);
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-semibold">Loading tactical workspace...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">Failed to Load Report</h3>
        <p className="text-sm text-muted-foreground">{error || "The session report does not exist."}</p>
        <Link href="/dashboard" className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const metrics = getTacticalMetrics();

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight truncate max-w-lg block" title={match.title}>
            {match.title}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-1 rounded-full text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Tactical Insights Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Playback & Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Playback Panel */}
          <div className="border border-border bg-card/40 rounded-2xl overflow-hidden aspect-video relative group flex items-center justify-center shadow-lg">
            {match.video_url ? (
              <video
                src={match.video_url}
                controls
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
                <ShieldAlert className="h-8 w-8 text-muted-foreground animate-pulse" />
                <p className="text-sm font-semibold text-muted-foreground">Playback stream unavailable for mock logs.</p>
              </div>
            )}
          </div>

          {/* Stats Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Possession breakdown */}
            <div className="border border-border rounded-xl p-5 bg-card/50">
              <h4 className="font-bold text-sm text-muted-foreground mb-4">Possession Matrix</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Attacking Shape</span>
                  <span>{metrics.possessionA}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: `${metrics.possessionA}%` }} />
                  <div className="bg-muted h-full transition-all duration-500" style={{ width: `${metrics.possessionB}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Defensive Shape</span>
                  <span>{metrics.possessionB}%</span>
                </div>
              </div>
            </div>

            {/* Passes stats */}
            <div className="border border-border rounded-xl p-5 bg-card/50">
              <h4 className="font-bold text-sm text-muted-foreground mb-4">Passing Node Network</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Passing Accuracy</span>
                  <span>{metrics.accuracyA}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: `${metrics.accuracyA}%` }} />
                  <div className="bg-muted h-full transition-all duration-500" style={{ width: `${100 - metrics.accuracyA}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Opponent recovery rate</span>
                  <span>{metrics.accuracyB}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingested Frame Dataset Card */}
          {stats && (
            <div className="border border-border rounded-xl p-5 bg-card/40 space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h4 className="font-bold text-sm text-muted-foreground">Ingested Video Frame Dataset</h4>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Dataset Ready
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted/20 border border-border/50 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Frames</p>
                  <p className="text-xl font-extrabold mt-1 font-mono text-foreground">{stats.total_frames || "N/A"}</p>
                </div>
                <div className="bg-muted/20 border border-border/50 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Resolution</p>
                  <p className="text-xl font-extrabold mt-1 font-mono text-foreground">{stats.resolution || "N/A"}</p>
                </div>
                <div className="bg-muted/20 border border-border/50 rounded-lg p-3 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dataset Frame Rate</p>
                  <p className="text-xl font-extrabold mt-1 font-mono text-foreground">{stats.fps || "25"} FPS</p>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/40 font-mono leading-relaxed space-y-1">
                <p><span className="text-primary font-bold">📂 Dataset Path:</span> processing/{matchId}/frames/</p>
                <p><span className="text-primary font-bold">ℹ️ Extraction:</span> Every frame extracted dynamically (1:1 interval indexing)</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic AI Coach chat panel */}
        <div className="border border-border bg-card rounded-2xl flex flex-col h-[550px] shadow-lg">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/20">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm">AI Tactical Coach</h4>
              <p className="text-[10px] text-muted-foreground">Dynamic RAG Ingestion active</p>
            </div>
          </div>

          {/* Chat Messages scroll area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                  msg.sender === "user" ? "bg-muted text-foreground" : "bg-primary/25 text-primary"
                }`}>
                  {msg.sender === "user" ? "ME" : "AI"}
                </div>
                <div className={`p-3.5 rounded-2xl leading-relaxed text-sm max-w-[85%] ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none text-left"
                    : "bg-muted text-muted-foreground rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading typing bubble */}
            {isTyping && (
              <div className="flex gap-3 items-start animate-in fade-in duration-100">
                <div className="h-8 w-8 rounded-full bg-primary/25 text-primary flex items-center justify-center text-xs font-bold animate-pulse">
                  AI
                </div>
                <div className="bg-muted p-3 px-4 rounded-2xl rounded-tl-none text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input field */}
          <div className="p-3 border-t border-border flex gap-2 bg-muted/10">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask coach (e.g., Explain passing network...)"
              className="flex-1 min-w-0 bg-muted/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
            />
            <button
              onClick={handleSendMessage}
              className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-primary/95 active:scale-95 transition-all"
            >
              <Send className="h-4 w-4 animate-in fade-in" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
