"use client";

import { motion, Variants } from "framer-motion";
import { Focus, GitCommit, Map, Network, Brain, FileText } from "lucide-react";

const features = [
  {
    title: "Player Detection",
    description: "State-of-the-art computer vision using YOLOv11 isolates bounding boxes for every player on the pitch.",
    icon: Focus,
    color: "from-emerald-500/20 to-teal-500/5",
    border: "group-hover:border-emerald-500/40",
  },
  {
    title: "Player Tracking",
    description: "ByteTrack integrates visual markers over time, preserving player trajectories and distance covered.",
    icon: GitCommit,
    color: "from-green-500/20 to-emerald-500/5",
    border: "group-hover:border-green-500/40",
  },
  {
    title: "Tactical Heatmaps",
    description: "Generate spatial control maps and occupancy ratios to evaluate team positioning structures.",
    icon: Map,
    color: "from-teal-500/20 to-emerald-500/5",
    border: "group-hover:border-teal-500/40",
  },
  {
    title: "Pass Network",
    description: "Extract passing nodes, connection frequencies, and playmakers driving the game forward.",
    icon: Network,
    color: "from-emerald-600/20 to-teal-600/5",
    border: "group-hover:border-emerald-600/40",
  },
  {
    title: "AI Coach (RAG)",
    description: "Converse with an AI coach that reviews match vectors directly against classic playbooks.",
    icon: Brain,
    color: "from-green-600/20 to-emerald-600/5",
    border: "group-hover:border-green-600/40",
  },
  {
    title: "Match Reports",
    description: "Compile and export automated tactical summaries and PDF reviews for staff and players.",
    icon: FileText,
    color: "from-teal-600/20 to-emerald-600/5",
    border: "group-hover:border-teal-600/40",
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-card/10">
      {/* Decorative Blur blob */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Features</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Core AI Tactical Capabilities
          </h3>
          <p className="text-muted-foreground text-base sm:text-lg">
            A comprehensive suite of intelligence tools designed for professional analysis.
          </p>
        </div>

        {/* Features Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group border border-border/50 rounded-2xl p-8 bg-gradient-to-br ${feature.color} backdrop-blur-sm relative overflow-hidden transition-all duration-300 ${feature.border}`}
              >
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                {/* Icon Container */}
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-primary mb-6 border border-emerald-500/20 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title & Desc */}
                <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
