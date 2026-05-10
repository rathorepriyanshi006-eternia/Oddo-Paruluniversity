"use client";

import { motion } from "framer-motion";
import { Compass, Sparkles } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Discover</h1>
          <p className="text-zinc-400">Find inspiration for your next adventure.</p>
        </div>
      </div>

      <div className="glass-panel p-20 text-center rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 animate-shimmer" style={{ animationDuration: '8s' }} />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 mb-6">
            <Compass className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Curated Experiences Coming Soon</h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            We are working on bringing you AI-curated travel experiences based on your unique travel style. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
