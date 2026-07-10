"use client";

import Link from "next/link";
import { Activity, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-md pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Activity className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Football AI
            </span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
            Next-gen computer vision and tactical reasoning platforms to elevate match analysis and team optimization.
          </p>
        </div>

        {/* Product links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Product</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard Overview
              </Link>
            </li>
            <li>
              <Link href="/dashboard/upload" className="hover:text-primary transition-colors">
                Match Ingestion
              </Link>
            </li>
            <li>
              <a href="#features" className="hover:text-primary transition-colors">
                AI Tracking Modules
              </a>
            </li>
          </ul>
        </div>

        {/* Resources links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Resources</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>
              <Link href="/docs/API" className="hover:text-primary transition-colors">
                API Docs
              </Link>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>

        {/* Connect links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">Connect</h4>
          <div className="flex gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact@football.ai"
              className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              aria-label="Email Contact"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Divider */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border/20 flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
        <p>© 2026 Football AI Platform. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/docs/architecture" className="hover:text-foreground transition-colors">
            Architecture
          </Link>
          <Link href="/docs/API" className="hover:text-foreground transition-colors">
            API Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
