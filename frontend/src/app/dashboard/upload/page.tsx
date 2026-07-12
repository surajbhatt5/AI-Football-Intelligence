"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert, Play, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import UploadZone, { UploadedVideoMetadata } from "@/components/dashboard/upload-zone";

export default function UploadPage() {
  const router = useRouter();
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideoMetadata | null>(null);
  
  // Analysis trigger states
  const [analysisState, setAnalysisState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Live video extraction progress states
  const [progressPercent, setProgressPercent] = useState(0);
  const [framesProcessed, setFramesProcessed] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [procFps, setProcFps] = useState(0);
  const [procRes, setProcRes] = useState("");
  const [pipelineStage, setPipelineStage] = useState("");

  const handleUploadSuccess = (metadata: UploadedVideoMetadata) => {
    setUploadedVideo(metadata);
  };

  const startAnalysis = async () => {
    if (!uploadedVideo) return;

    setAnalysisState("processing");
    setErrorMsg("");
    setProgressPercent(0);
    setFramesProcessed(0);
    setPipelineStage("extraction");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${apiUrl}/analysis/${uploadedVideo.video_id}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const pollInterval = setInterval(async () => {
          try {
            const statsRes = await fetch(`${apiUrl}/analysis/${uploadedVideo.video_id}/stats`);
            if (statsRes.ok) {
              const statsData = await statsRes.json();
              
              setProgressPercent(statsData.percentage || 0);
              setFramesProcessed(statsData.frames_processed || 0);
              setTotalFrames(statsData.total_frames || 0);
              setProcFps(statsData.fps || 0);
              setProcRes(statsData.resolution || "");
              setPipelineStage(statsData.stage || "");

              if (statsData.status === "completed") {
                clearInterval(pollInterval);
                setAnalysisState("success");
                setTimeout(() => {
                  router.push("/dashboard");
                }, 1500);
              } else if (statsData.status === "failed") {
                clearInterval(pollInterval);
                setAnalysisState("error");
                setErrorMsg(statsData.error || "Frame extraction task failed on processing server.");
              }
            } else {
              clearInterval(pollInterval);
              setAnalysisState("error");
              setErrorMsg("Failed to query frame extraction statistics.");
            }
          } catch (err) {
            clearInterval(pollInterval);
            setAnalysisState("error");
            setErrorMsg("Connection to extraction server lost during analysis.");
          }
        }, 800);
      } else {
        const data = await response.json().catch(() => ({}));
        setAnalysisState("error");
        setErrorMsg(data.detail || `Analysis server returned status: ${response.statusText || response.status}`);
      }
    } catch (err) {
      setAnalysisState("error");
      setErrorMsg("Failed to connect to the tactical analysis backend.");
    }
  };

  const getVideoTypeName = (type: string) => {
    switch (type) {
      case "full_match": return "Full Match / Tactical Segment";
      case "free_kick": return "Free Kick Ingestion Focus";
      case "penalty": return "Penalty Kick Ingestion Focus";
      case "corner": return "Corner Ingestion Focus";
      case "training": return "Training Drills Ingestion Focus";
      default: return "Custom Ingestion Focus";
    }
  };

  return (
    <div className="space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight">Upload Match Footage</h2>
          <p className="text-muted-foreground mt-1">
            Ingest full length match reels. MP4, MOV, and AVI formats are supported.
          </p>
        </div>

        {/* Upload Ingest Zone */}
        <UploadZone onUploadSuccess={handleUploadSuccess} />

        {/* Post-Upload Process Trigger Block */}
        {uploadedVideo && (
          <div className={`border p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
            uploadedVideo.analysisReady 
              ? "border-primary/20 bg-emerald-500/5" 
              : "border-destructive/20 bg-destructive/5"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                uploadedVideo.analysisReady 
                  ? "bg-primary/20 text-primary" 
                  : "bg-destructive/25 text-destructive"
              }`}>
                {uploadedVideo.analysisReady ? <Sparkles className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground">
                  {uploadedVideo.analysisReady 
                    ? `Scene Classified: ${uploadedVideo.scene}` 
                    : "Tactical Scene Verification Failed"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {uploadedVideo.analysisReady 
                    ? `Confidence Score: ${Math.round(uploadedVideo.confidence * 100)}% • ${getVideoTypeName(uploadedVideo.video_type)}` 
                    : "Footage validation criteria unmet"}
                </p>
              </div>
            </div>

            {uploadedVideo.analysisReady ? (
              <>
                {analysisState === "idle" && (
                  <button
                    type="button"
                    onClick={startAnalysis}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/95 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Initialize Tactical Analysis
                  </button>
                )}

                {analysisState === "processing" && (
                  <div className="space-y-4 bg-muted/40 border border-border/80 p-5 rounded-xl animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        {pipelineStage === "detection" 
                          ? "Step 2/2: YOLOv8 Player Detection..." 
                          : "Step 1/2: Extracting video frames..."}
                      </span>
                      <span className="text-primary font-mono text-sm">{progressPercent}%</span>
                    </div>
                    
                    {/* Glowing progress bar */}
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden relative border border-border/40">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.35)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground mt-2 border-t border-border/40 pt-3">
                      <div className="flex justify-between">
                        <span>{pipelineStage === "detection" ? "Frames Analyzed:" : "Frames Extracted:"}</span>
                        <span className="font-semibold text-foreground">{framesProcessed} / {totalFrames}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frame Rate:</span>
                        <span className="font-semibold text-foreground">{procFps} FPS</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span>Video Resolution:</span>
                        <span className="font-semibold text-foreground">{procRes}</span>
                      </div>
                    </div>
                  </div>
                )}

                {analysisState === "success" && (
                  <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-sm font-semibold animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="h-5 w-5 shrink-0 animate-bounce" />
                    Analysis and player detection completed successfully! Ingesting match...
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-destructive bg-destructive/5 border border-destructive/20 p-4 rounded-xl text-sm font-semibold">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Scene Category: {uploadedVideo.scene}</p>
                    <p className="text-xs leading-relaxed font-normal text-muted-foreground">
                      {uploadedVideo.error_detail || "The uploaded video is not a supported football tactical sequence."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-muted text-muted-foreground border border-border px-6 text-sm font-semibold cursor-not-allowed"
                >
                  Analyze Match Disabled
                </button>
              </div>
            )}

            {analysisState === "error" && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-3 text-destructive bg-destructive/5 border border-destructive/20 p-4 rounded-xl text-sm font-semibold">
                  <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Extraction Pipeline Error</p>
                    <p className="text-xs leading-relaxed font-normal text-muted-foreground">{errorMsg}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={startAnalysis}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all"
                >
                  Retry Ingestion
                </button>
              </div>
            )}
          </div>
        )}

        {/* Warning card info */}
        <div className="border border-border/80 rounded-xl p-4 bg-muted/40 flex gap-3 text-xs text-muted-foreground items-start">
          <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Processing duration warning</p>
            <p className="leading-relaxed">
              YOLO model scanning and tracking algorithms run frame by frame. Average analytics processing takes roughly 0.5x match length duration to complete pipeline tracking calculations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
