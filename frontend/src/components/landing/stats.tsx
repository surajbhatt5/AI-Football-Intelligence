"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItemProps {
  targetValue: number;
  label: string;
  suffix: string;
  prefix?: string;
  isSpecial?: boolean;
}

function StatCard({ targetValue, label, suffix, prefix = "", isSpecial = false }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      if (isSpecial) {
        // Special animation for 24/7
        let current = 0;
        const interval = setInterval(() => {
          current += 1;
          if (current >= 24) {
            setCount(24);
            clearInterval(interval);
          } else {
            setCount(current);
          }
        }, 50);
        return () => clearInterval(interval);
      } else {
        let start = 0;
        const end = targetValue;
        const duration = 1200; // ms
        const increment = Math.max(Math.ceil(end / (duration / 30)), 1);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 30);

        return () => clearInterval(timer);
      }
    }
  }, [isInView, targetValue, isSpecial]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border border-border/40 bg-card/30 backdrop-blur-md rounded-2xl p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
    >
      {/* Background glow hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <h4 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-primary mb-3 bg-gradient-to-b from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
        {prefix}
        {isSpecial ? `${count}/7` : `${count}${suffix}`}
      </h4>
      <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
        {label}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section className="py-24 relative overflow-hidden border-y border-border/40 bg-card/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            targetValue={100} 
            label="Matches Analyzed" 
            suffix="+" 
          />
          <StatCard 
            targetValue={99} 
            label="Detection Accuracy" 
            suffix="%" 
          />
          <StatCard 
            targetValue={6} 
            label="Core AI Modules" 
            suffix="" 
          />
          <StatCard 
            targetValue={24} 
            label="AI Coach Support" 
            suffix="" 
            isSpecial={true} 
          />
        </div>
      </div>
    </section>
  );
}
