"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, Calendar, Users } from "lucide-react";
import { useState, useEffect } from "react";

const TYPING_TEXTS = [
  "Plan a 7-day trip to Tokyo under $2000...",
  "Backpacking through Europe for 2 weeks...",
  "A relaxing weekend getaway in Bali...",
  "Food tour in Mexico City for 4 days..."
];

export function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentFullText = TYPING_TEXTS[currentTextIndex];

    if (isTyping) {
      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentTextIndex]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 w-full h-full bg-background z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-zinc-300">AI-Powered Travel Planning</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Plan smarter. <br />
            <span className="gradient-text">Travel together.</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-zinc-400 mb-8 max-w-xl">
            Experience the future of travel. Let our AI craft your perfect itinerary, manage budgets, and invite friends to collaborate in real-time.
          </p>

          <div className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-xl shadow-2xl relative overflow-hidden">
             {/* Shimmer effect */}
            <div className="absolute inset-0 z-0 animate-shimmer opacity-20 pointer-events-none" />
            
            <div className="flex-1 relative z-10 flex items-center bg-background/50 rounded-xl px-4 py-3 border border-white/5">
              <Sparkles className="w-5 h-5 text-indigo-400 mr-3" />
              <span className="text-zinc-300 truncate w-full flex items-center">
                {displayText}
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-0.5 h-5 bg-cyan-400 ml-1 inline-block"
                />
              </span>
            </div>
            <Button className="z-10 h-12 px-8 bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white rounded-xl font-medium shadow-lg hover:shadow-cyan-500/25 transition-all">
              Generate Trip
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-6 text-sm text-zinc-500">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <p>Join <strong className="text-zinc-300">10,000+</strong> travelers planning smarter.</p>
          </div>
        </motion.div>

        {/* Right Content - Visual Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <div className="relative w-full max-w-md aspect-[4/5] glass-panel rounded-3xl p-6 flex flex-col overflow-hidden group">
            {/* Map Placeholder BG */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            
            <div className="relative z-10 flex-1 flex flex-col justify-end">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl mb-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Kyoto, Japan</h3>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30">AI Generated</span>
                </div>
                <div className="flex gap-4 text-xs text-zinc-300">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 7 Days</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" /> 2 People</div>
                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 14 Stops</div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Day 1: Temples & Tea</p>
                  <p className="text-xs text-zinc-400">Optimized route for least walking</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-20 glass-panel p-3 rounded-xl flex items-center gap-3 shadow-2xl"
          >
             <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <span className="text-green-400 font-bold">$</span>
             </div>
             <div>
               <p className="text-xs text-zinc-400">Budget Optimized</p>
               <p className="text-sm font-bold text-white">Saved $240</p>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
