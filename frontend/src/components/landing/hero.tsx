"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Play, Upload, Shield } from "lucide-react";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const bgVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.15,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-background pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-emerald-500/10 via-emerald-500/0 to-transparent pointer-events-none filter blur-3xl opacity-60" />
      
      {/* Football-themed visual background using CSS/SVG */}
      <motion.div 
        variants={bgVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div className="w-[800px] h-[500px] border border-emerald-500/10 rounded-3xl relative flex items-center justify-center opacity-70">
          {/* Halfway line */}
          <div className="absolute inset-y-0 left-1/2 w-px bg-emerald-500/10" />
          {/* Center circle */}
          <div className="w-[180px] h-[180px] border border-emerald-500/10 rounded-full" />
          {/* Center spot */}
          <div className="w-2 h-2 bg-emerald-500/20 rounded-full" />
          {/* Left Goal area */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[80px] h-[220px] border-r border-y border-emerald-500/10 rounded-r-lg" />
          {/* Right Goal area */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[80px] h-[220px] border-l border-y border-emerald-500/10 rounded-l-lg" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          Tactical AI Ingestion is Live
        </motion.div>

        {/* Staggered text and CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            Transform Match Footage Into{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-500 bg-clip-text text-transparent bg-300% animate-gradient">
              Tactical Victory
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Automated player tracking, passing networks, and possession graphs. Process match reels with YOLOv11 and review strategies with an AI Tactical Coach.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4"
          >
            <Link
              href="/dashboard/upload"
              className="inline-flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-emerald-500/10 transition-all hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="h-5 w-5" />
              Upload Match
            </Link>
            <Link
              href="/dashboard/analysis/match_session_1"
              className="inline-flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/60 backdrop-blur-sm px-8 text-base font-semibold transition-all hover:bg-muted hover:text-foreground hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="h-5 w-5 fill-current" />
              View Demo
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f13_1px,transparent_1px),linear-gradient(to_bottom,#0f0f13_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />
    </section>
  );
}
