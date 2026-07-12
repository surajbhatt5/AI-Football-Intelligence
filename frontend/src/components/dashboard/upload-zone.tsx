"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Video, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onUploadSuccess: (metadata: UploadedVideoMetadata) => void;
}

export interface UploadedVideoMetadata {
  video_id: string;
  filename: string;
  filepath: string;
  size: string;
  duration: string;
  resolution: string;
  video_type: string;
  valid: boolean;
  scene: string;
  confidence: number;
  analysisReady: boolean;
  error_detail: string;
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Client-side extracted metadata
  const [duration, setDuration] = useState<string>("");
  const [resolution, setResolution] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);

  // Video type for optimization focus
  const [videoType, setVideoType] = useState<"full_match" | "free_kick" | "penalty" | "corner" | "training">("full_match");

  const videoTypes = [
    { id: "full_match", name: "Full Match", icon: "⚽" },
    { id: "free_kick", name: "Free Kick", icon: "🎯" },
    { id: "penalty", name: "Penalty Kick", icon: "🥅" },
    { id: "corner", name: "Corner Kick", icon: "📐" },
    { id: "training", name: "Training / Drills", icon: "🏃" },
  ] as const;

  // Upload progress & state
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Client-side file validation & metadata extraction
  const processSelectedFile = (selectedFile: File) => {
    setErrorMsg("");
    setUploadState("idle");
    setProgress(0);
    setThumbnail(null);
    setDuration("");
    setResolution("");

    // Validate type: MP4, MOV, AVI
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf(".")).toLowerCase();
    const allowedExtensions = [".mp4", ".mov", ".avi"];
    if (!allowedExtensions.includes(ext)) {
      setErrorMsg("Unsupported file format. Only MP4, MOV, and AVI matches are allowed.");
      return;
    }

    // Limit to 500MB
    const maxSize = 500 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setErrorMsg("File size exceeds 500MB. Please choose a smaller match clip.");
      return;
    }

    setFile(selectedFile);
    setIsExtractingMetadata(true);

    // Dynamic metadata & thumbnail extraction using HTML5 hidden Video & Canvas elements
    const blobUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(blobUrl);

    const videoEl = document.createElement("video");
    videoEl.src = blobUrl;
    videoEl.preload = "metadata";
    videoEl.muted = true;
    videoEl.playsInline = true;

    videoEl.onloadedmetadata = () => {
      // Calculate duration
      const totalSeconds = videoEl.duration;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      setDuration(`${minutes}m ${seconds}s`);

      // Calculate resolution
      setResolution(`${videoEl.videoWidth}x${videoEl.videoHeight}`);

      // Seek to 1 second to capture a frame for the thumbnail
      videoEl.currentTime = Math.min(1.0, totalSeconds / 2);
    };

    videoEl.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          setThumbnail(canvas.toDataURL("image/jpeg"));
        }
      } catch (err) {
        console.error("Failed to generate client thumbnail", err);
      } finally {
        setIsExtractingMetadata(false);
        URL.revokeObjectURL(blobUrl);
      }
    };

    videoEl.onerror = () => {
      setIsExtractingMetadata(false);
      URL.revokeObjectURL(blobUrl);
    };
  };

  // Upload file to Backend
  const startUpload = () => {
    if (!file) return;

    setUploadState("uploading");
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("video_type", videoType);

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded * 100) / e.total);
        setProgress(percentage);
      }
    });

    // Handle upload completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.valid) {
            setUploadState("success");
          } else {
            setUploadState("error");
            setErrorMsg(response.error_detail || "Tactical Scene Validation failed. The video is not a supported football sequence.");
          }
          onUploadSuccess({
            video_id: response.video_id,
            filename: response.filename,
            filepath: response.filepath,
            size: response.size,
            duration: response.duration !== "0m 0s" ? response.duration : duration,
            resolution: response.resolution !== "0x0" ? response.resolution : resolution,
            video_type: response.video_type || videoType,
            valid: response.valid,
            scene: response.scene,
            confidence: response.confidence,
            analysisReady: response.analysisReady,
            error_detail: response.error_detail
          });
        } catch (err) {
          setUploadState("error");
          setErrorMsg("Received invalid response schema from ingestion backend.");
        }
      } else {
        setUploadState("error");
        try {
          const response = JSON.parse(xhr.responseText);
          setErrorMsg(response.detail || "Server failed to process match footage.");
        } catch {
          setErrorMsg(`Ingestion server returned status code: ${xhr.status}`);
        }
      }
    });

    // Handle upload errors
    xhr.addEventListener("error", () => {
      setUploadState("error");
      setErrorMsg("Network error occurred. Ensure the backend server is running.");
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    xhr.open("POST", `${apiUrl}/matches/upload`);
    xhr.send(formData);
  };

  // Cancel/reset upload
  const clearSelection = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setFile(null);
    setPreviewUrl(null);
    setDuration("");
    setResolution("");
    setThumbnail(null);
    setUploadState("idle");
    setProgress(0);
    setErrorMsg("");
    setVideoType("full_match");
  };

  const getFileSizeString = (size: number) => {
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* File Ingest Area */}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center cursor-pointer min-h-[300px] transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/40 hover:bg-card/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            accept=".mp4,.mov,.avi"
            className="hidden"
          />

          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold mb-1">Drag and drop match video here</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Or select file from your system. Supports MP4, MOV, and AVI formats up to 500MB.
          </p>
          <button
            type="button"
            className="h-10 inline-flex items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            Browse Files
          </button>
        </div>
      ) : (
        /* Preview Card */
        <div className="border border-border bg-card rounded-2xl p-6 space-y-6 relative overflow-hidden">
          
          {/* Main Info Block */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            
            {/* Thumbnail Canvas rendering */}
            <div className="w-full sm:w-[180px] aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border relative shrink-0">
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnail}
                  alt="Video thumbnail preview"
                  className="object-cover w-full h-full"
                />
              ) : isExtractingMetadata ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <Video className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            {/* Video File Specifications */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground truncate break-all" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  File Size: {getFileSizeString(file.size)}
                </p>
              </div>

              {/* Resolution and Duration pills */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
                <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                  Duration: {duration || (isExtractingMetadata ? "Calculating..." : "Unknown")}
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1">
                  Resolution: {resolution || (isExtractingMetadata ? "Calculating..." : "Unknown")}
                </span>
              </div>
            </div>

            {/* Cancel Action Button */}
            {uploadState !== "uploading" && (
              <button
                onClick={clearSelection}
                className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-muted/50 transition-colors self-start"
                title="Remove video file"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Progress Indicators & Actions */}
          <div className="pt-2 border-t border-border/60 space-y-4">
            
            {/* Video Type Segmented Controls */}
            {uploadState === "idle" && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Optimize Ingestion Focus
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {videoTypes.map((type) => {
                    const active = videoType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setVideoType(type.id)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                          active
                            ? "bg-primary/10 border-primary text-primary shadow-sm shadow-primary/5"
                            : "bg-muted/30 border-border/60 text-muted-foreground hover:bg-muted/65 hover:text-foreground"
                        }`}
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span>{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {uploadState === "idle" && (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={startUpload}
                  disabled={isExtractingMetadata}
                  className="h-10 inline-flex items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  Start Upload Ingestion
                </button>
              </div>
            )}

            {/* Ingestion Loading progress bar */}
            {uploadState === "uploading" && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    Uploading match reels to server...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success state */}
            {uploadState === "success" && (
              <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-sm font-semibold">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                Match video file uploaded successfully. Ingestion parsed metadata correctly.
              </div>
            )}

            {/* Error banner */}
            {uploadState === "error" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-destructive bg-destructive/5 border border-destructive/20 p-4 rounded-xl text-sm font-semibold">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {errorMsg}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="h-10 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    Clear File
                  </button>
                  <button
                    type="button"
                    onClick={startUpload}
                    className="h-10 inline-flex items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all"
                  >
                    Retry Ingestion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Basic Error State outside selection */}
      {errorMsg && !file && (
        <div className="flex items-center gap-3 text-destructive bg-destructive/5 border border-destructive/20 p-4 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
