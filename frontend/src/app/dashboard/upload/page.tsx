import Link from "next/link";
import { UploadCloud, ArrowLeft, ShieldAlert } from "lucide-react";

export default function UploadPage() {
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
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Upload Match Footage</h2>
          <p className="text-muted-foreground mt-1">
            Ingest full length match reels. MP4, MKV and AVI formats supported.
          </p>
        </div>

        {/* Upload Container Box */}
        <div className="border-2 border-dashed border-border hover:border-primary/40 transition-colors rounded-2xl p-12 bg-card/40 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold mb-1">Drag and drop match video here</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Or select file from explorer. Maximum file size allowed is 500MB.
          </p>
          <button className="h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all">
            Browse Files
          </button>
        </div>

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
