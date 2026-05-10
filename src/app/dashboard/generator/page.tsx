"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Wallet, Users, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const steps = ["Destination", "Details", "Preferences"];
const loadingMessages = [
  "Analyzing millions of routes, reviews, and prices...",
  "Finding the best hidden gems in your destination...",
  "Optimizing travel routes to save you time...",
  "Calculating budget and cost-saving alternatives...",
  "Finalizing your perfect itinerary..."
];

export default function GeneratorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [newTripId, setNewTripId] = useState("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  
  // Form State
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    if (generating) {
      const interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [generating]);

  const handleNext = () => {
    if (step === 0 && !destination) {
      toast.error("Please enter a destination to continue.");
      return;
    }
    if (step < steps.length - 1) setStep(step + 1);
    else handleGenerate();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    toast("Generating your itinerary...", {
      description: "Our AI is crafting the perfect trip for you.",
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />
    });
    
    // Artificial delay to make it feel like AI is doing heavy work (4 seconds minimum)
    const minDelay = new Promise(resolve => setTimeout(resolve, 4000));
    
    try {
      const req = fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          budget: Number(budget) || 2000
        })
      });

      const [res] = await Promise.all([req, minDelay]);
      const data = await res.json();
      
      if (data.success) {
        setNewTripId(data.data.id);
        setGenerating(false);
        setCompleted(true);
        toast.success("Itinerary generated successfully!");
      } else {
        toast.error("Failed to generate itinerary. Please try again.");
        setGenerating(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during generation.");
      setGenerating(false);
    }
  };

  if (completed) {
    return (
      <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-6 pt-20">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 text-green-400"
        >
          <Check className="w-10 h-10" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-display font-bold text-white"
        >
          Your Itinerary is Ready!
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-zinc-400"
        >
          We've crafted a perfect trip to <strong className="text-white">{destination || "your destination"}</strong> within your budget.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={() => router.push(`/builder/${newTripId}`)} className="mt-4 h-14 px-8 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white hover:from-indigo-600 hover:to-cyan-500 rounded-xl text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all">
            Open in Builder
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">AI Trip Generator</h1>
        <p className="text-zinc-400">Tell us what you want, and let our AI do the heavy lifting.</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-12">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-500 ${step >= i ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-zinc-700 text-zinc-500'}`}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className={`w-12 h-px transition-colors duration-500 ${step > i ? 'bg-cyan-500' : 'bg-zinc-700'}`} />}
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden min-h-[400px]">
        {generating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center py-20 space-y-8 bg-background/50 backdrop-blur-sm z-10">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-500/20 rounded-full border-t-cyan-400 animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div className="text-center h-16">
              <h3 className="text-xl font-bold text-white mb-2">Crafting your perfect trip...</h3>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={loadingMsgIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-zinc-400"
                >
                  {loadingMessages[loadingMsgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        ) : null}

        <div className={generating ? "opacity-0 pointer-events-none" : ""}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {step === 0 && (
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <Label className="text-zinc-300 text-lg">Where do you want to go?</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-cyan-400 transition-colors" />
                      <Input 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="h-16 pl-14 bg-white/5 border-white/10 text-white text-lg rounded-2xl focus-visible:ring-cyan-500" 
                        placeholder="e.g. Tokyo, Japan or Paris, France" 
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNext();
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid sm:grid-cols-2 gap-6 py-4">
                  <div className="space-y-3">
                    <Label className="text-zinc-300">Dates</Label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-cyan-400 transition-colors" />
                      <Input type="date" className="h-14 pl-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-cyan-500 [color-scheme:dark]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-zinc-300">Travelers</Label>
                    <div className="relative group">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-cyan-400 transition-colors" />
                      <Input type="number" className="h-14 pl-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-cyan-500" placeholder="2" defaultValue="2" />
                    </div>
                  </div>
                  <div className="space-y-3 sm:col-span-2">
                    <Label className="text-zinc-300">Budget (Total)</Label>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-cyan-400 transition-colors" />
                      <Input 
                        type="number" 
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="h-14 pl-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-cyan-500" 
                        placeholder="e.g. 3000" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 py-4">
                  <Label className="text-zinc-300 mb-2 block">Travel Style</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Relaxing", "Adventure", "Culture", "Food & Drink", "Nightlife", "Nature"].map((style, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-500/10 transition-all text-zinc-300 hover:text-white font-medium active:scale-95">
                        {style}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 pt-4">
                    <Label className="text-zinc-300">Any specific requirements?</Label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none min-h-[100px] resize-none" placeholder="e.g. Vegetarian food, avoid crowded places, must see Eiffel Tower..."></textarea>
                  </div>
                </div>
              )}

              <div className="pt-8 flex justify-between items-center border-t border-white/10">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-zinc-400 hover:text-white">Back</Button>
                ) : (
                  <div />
                )}
                <Button onClick={handleNext} disabled={step === 0 && !destination} className="bg-white text-indigo-950 hover:bg-zinc-200 rounded-xl px-8 h-12 font-bold disabled:opacity-50 transition-all">
                  {step === steps.length - 1 ? (
                    <>Generate With AI <Sparkles className="w-4 h-4 ml-2" /></>
                  ) : (
                    <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
