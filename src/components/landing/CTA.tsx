"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden border border-white/10"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 mix-blend-overlay animate-shimmer" style={{ animationDuration: '8s' }} />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-white">
              Ready to pack your bags?
            </h2>
            <p className="text-xl text-zinc-300 mb-10">
              Join thousands of modern travelers who are planning their trips faster, smarter, and cheaper with Traveloop AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="h-14 px-8 bg-white text-indigo-950 hover:bg-zinc-200 transition-colors text-lg font-bold rounded-2xl w-full sm:w-auto">
                <Plane className="w-5 h-5 mr-2" />
                Start Planning for Free
              </Button>
            </div>
            <p className="mt-6 text-sm text-zinc-500">No credit card required. Generate your first itinerary in seconds.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
