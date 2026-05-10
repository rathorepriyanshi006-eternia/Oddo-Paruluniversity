"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, MapPin, Calendar, Wallet, Users, ArrowRight, Check, Loader2, Search, X
} from "lucide-react";
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
  "Building your personalized day-by-day timeline...",
  "Finalizing your perfect itinerary...",
];

interface CityResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export default function GeneratorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [newTripId, setNewTripId] = useState("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  // Step 1 — Destination
  const [destination, setDestination] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<any>(null);

  // Step 2 — Details
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState("");

  // Step 3 — Preferences
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Loading animation
  useEffect(() => {
    if (generating) {
      const interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [generating]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // City search with Photon API (Komoot, free, no key)
  const searchCities = (query: string) => {
    setCityQuery(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setCityResults([]); setShowDropdown(false); return; }

    debounceRef.current = setTimeout(async () => {
      setCityLoading(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&layer=city`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        const cities: CityResult[] = (data.features || [])
          .filter((f: any) => f.properties?.name)
          .map((f: any) => ({
            name: f.properties.name,
            country: f.properties.country || "",
            state: f.properties.state || "",
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
          }));
        setCityResults(cities);
        setShowDropdown(cities.length > 0);
      } catch (err) {
        console.error("City search failed:", err);
      } finally {
        setCityLoading(false);
      }
    }, 350);
  };

  const selectCity = (city: CityResult) => {
    const label = `${city.name}, ${city.country}`;
    setDestination(label);
    setCityQuery(label);
    setShowDropdown(false);
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const validateStep = () => {
    if (step === 0) {
      if (!destination) { toast.error("Please select a destination."); return false; }
    }
    if (step === 1) {
      if (!startDate) { toast.error("Please pick a start date."); return false; }
      if (!endDate) { toast.error("Please pick an end date."); return false; }
      if (new Date(endDate) <= new Date(startDate)) { toast.error("End date must be after start date."); return false; }
      if (!budget) { toast.error("Please enter your budget."); return false; }
      if (!travelers || Number(travelers) < 1) { toast.error("Please enter the number of travelers."); return false; }
    }
    if (step === 2) {
      if (selectedStyles.length === 0) { toast.error("Please select at least one travel style."); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < steps.length - 1) setStep(step + 1);
    else handleGenerate();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    toast("Generating your itinerary...", { description: "Our AI is crafting the perfect trip for you." });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const minDelay = new Promise((resolve) => setTimeout(resolve, 4000));

    try {
      const req = fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          budget: Number(budget),
          startDate,
          endDate,
          travelers: Number(travelers),
          days,
          travelStyles: selectedStyles,
          notes,
        }),
      });

      const [res] = await Promise.all([req, minDelay]);
      const data = await res.json();

      if (data.success) {
        setNewTripId(data.data.id);
        setGenerating(false);
        setCompleted(true);
        toast.success("Itinerary generated successfully!");
      } else {
        toast.error(`Failed: ${data.error || "Please try again."}`);
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
      <div className="h-[70vh] flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-white"
        >
          <Check className="w-6 h-6" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-display font-medium text-white tracking-tight"
        >
          Workspace Ready
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500"
        >
          Your intelligent itinerary for{" "}
          <span className="text-white">{destination}</span> is prepared and ready for review.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 w-full"
        >
          <Button
            onClick={() => router.push(`/builder/${newTripId}`)}
            className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium rounded-xl"
          >
            Open in Builder
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-display font-medium text-white tracking-tight mb-3">
          Plan a new trip
        </h1>
        <p className="text-zinc-500">Provide a few details and let AI handle the heavy lifting.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all ${
                step > i
                  ? "bg-white text-black"
                  : step === i
                  ? "bg-white text-black ring-2 ring-white/30 ring-offset-2 ring-offset-zinc-950"
                  : "bg-zinc-900 text-zinc-500 border border-white/5"
              }`}
            >
              {step > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-xs font-medium ${step >= i ? "text-zinc-300" : "text-zinc-600"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-8 h-px ${step > i ? "bg-white/30" : "bg-white/5"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 relative overflow-visible min-h-[400px]">
        {generating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md z-10 rounded-3xl">
            <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mb-6" />
            <div className="text-center h-10 px-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingMsgIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-sm font-medium text-zinc-400 tracking-tight"
                >
                  {loadingMessages[loadingMsgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className={generating ? "opacity-0 pointer-events-none" : ""}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Step 0 - Destination */}
              {step === 0 && (
                <div className="space-y-4 py-2">
                  <Label className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                    Where to? <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative" ref={searchRef}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 z-10" />
                    <input
                      value={cityQuery}
                      onChange={(e) => searchCities(e.target.value)}
                      placeholder="Search for a city... (e.g. Tokyo, Japan)"
                      className="w-full h-14 pl-12 pr-10 bg-background/50 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-base"
                    />
                    {cityQuery && (
                      <button
                        onClick={() => { setCityQuery(""); setDestination(""); setCityResults([]); setShowDropdown(false); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {cityLoading && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
                    )}

                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-50 top-full mt-2 w-full bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {cityResults.map((city, i) => (
                          <button
                            key={i}
                            onClick={() => selectCity(city)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors border-b border-white/5 last:border-0"
                          >
                            <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-white">{city.name}</p>
                              <p className="text-xs text-zinc-500">{[city.state, city.country].filter(Boolean).join(", ")}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {destination && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-sm text-white font-medium">{destination}</span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 1 — Details */}
              {step === 1 && (
                <div className="grid sm:grid-cols-2 gap-5 py-2">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                      Start Date <span className="text-red-400">*</span>
                    </Label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-12 px-4 bg-background/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                      End Date <span className="text-red-400">*</span>
                    </Label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      className="w-full h-12 px-4 bg-background/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20 [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                      Travelers <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-background/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                      Budget (USD) <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        min="100"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 bg-background/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="e.g. 2500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — Preferences */}
              {step === 2 && (
                <div className="space-y-5 py-2">
                  <div>
                    <Label className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3 block">
                      Travel Style <span className="text-red-400">*</span> (pick at least one)
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Relaxing", "Adventure", "Culture", "Foodie", "Nightlife", "Nature", "Romance", "Backpacker", "Luxury"].map((style) => (
                        <button
                          key={style}
                          onClick={() => toggleStyle(style)}
                          className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${
                            selectedStyles.includes(style)
                              ? "bg-white text-black border-white"
                              : "border-white/5 bg-zinc-900/50 text-zinc-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                      Additional Notes (optional)
                    </Label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-white/20 outline-none min-h-[90px] resize-none text-sm placeholder:text-zinc-600"
                      placeholder="Dietary restrictions, must-see landmarks, accessibility needs..."
                    />
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-between items-center">
                {step > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={() => setStep(step - 1)}
                    className="text-zinc-500 hover:text-white hover:bg-white/5 px-4 h-11"
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                <Button
                  onClick={handleNext}
                  className="bg-white text-black hover:bg-zinc-200 rounded-xl px-6 h-11 font-medium transition-all"
                >
                  {step === steps.length - 1 ? (
                    <>
                      Generate Itinerary <Sparkles className="w-4 h-4 ml-2 opacity-60" />
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="w-4 h-4 ml-2 opacity-60" />
                    </>
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
