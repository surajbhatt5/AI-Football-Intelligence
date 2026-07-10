"use client";

import { motion, Variants } from "framer-motion";
import { ArrowDown, Upload, Cpu, BarChart2, Lightbulb } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Upload Match",
    description: "Ingest standard HD footage (MP4, MKV, AVI) directly into the dashboard. We support full match videos up to 500MB.",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI Processing",
    description: "Our pipelines run YOLOv11 and ByteTrack models frame-by-frame to extract coordinates, speeds, and team shapes.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Interactive Dashboard",
    description: "Explore advanced statistics, passing networks, control heatmaps, and possession ratios in a modern layout.",
    icon: BarChart2,
  },
  {
    step: "04",
    title: "AI Tactical Insights",
    description: "Converse with our RAG-powered Coach to analyze weaknesses, coordinate spacing, and optimize formations.",
    icon: Lightbulb,
  },
];

export default function HowItWorks() {
  const lineVariants: Variants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Workflow</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How It Works
          </h3>
          <p className="text-muted-foreground text-base sm:text-lg">
            A simple, end-to-end process from raw match files to professional coaching tactics.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative">
          
          {/* Vertical Connecting Line (Desktop) */}
          <motion.div 
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-emerald-500/50 to-border origin-top transform -translate-x-1/2 hidden md:block"
          />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center justify-between gap-8 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-[42%] bg-card/40 border border-border/50 rounded-2xl p-8 backdrop-blur-sm relative hover:border-primary/20 transition-all duration-300">
                    <span className="absolute -top-4 left-6 text-xs font-bold text-primary bg-background px-3 py-1 border border-primary/20 rounded-full shadow-md shadow-emerald-500/5">
                      Step {step.step}
                    </span>
                    <h4 className="text-xl font-bold mt-2 mb-3">{step.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>

                  {/* Icon Node */}
                  <div className="h-14 w-14 rounded-full bg-background border-2 border-emerald-500 flex items-center justify-center text-primary z-20 shadow-[0_0_15px_rgba(16,185,129,0.15)] shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Spacer Column (Desktop) */}
                  <div className="w-[42%] hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
