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

  const handleUploadSuccess = (metadata: UploadedVideoMetadata) => {
    setUploadedVideo(metadata);
  };

  const startAnalysis = async () => {
    if (!uploadedVideo) return;

    setAnalysisState("processing");
    setErrorMsg("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const response = await fetch(`${apiUrl}/analysis/${uploadedVideo.video_id}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "ready_for_analysis") {
          setAnalysisState("success");
          // Staggered redirect to dashboard after 2 seconds to let the user see the success state
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          setAnalysisState("error");
          setErrorMsg("Ingestion engine returned unexpected status.");
        }
      } else {
        setAnalysisState("error");
        setErrorMsg(`Analysis server returned status: ${response.statusText || response.status}`);
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
                  <button
                    type="button"
                    disabled
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-primary/20 text-primary border border-primary/20 px-6 text-sm font-semibold cursor-not-allowed"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running tactical segmentation...
                  </button>
                )}

                {analysisState === "success" && (
                  <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-sm font-semibold animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    Analysis initialized successfully! Redirecting to workspace...
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
