"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Calendar, MapPin, ArrowUpRight, Wallet, Clock, Loader2, Plane, Navigation, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch("/api/trips");
        const json = await res.json();
        if (json.success) {
          setTrips(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  return (
    <div className="space-y-10 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section with Linear-like clean typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight mb-2">Welcome back.</h1>
          <p className="text-zinc-400 text-lg">You have {trips.length} upcoming journeys planned.</p>
        </div>
        <Link href="/dashboard/generator">
          <Button className="bg-white text-zinc-950 hover:bg-zinc-200 transition-colors h-11 px-6 rounded-lg font-medium shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Trip Generator
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Upcoming */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Minimalist Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-zinc-900/50 border-white/5 shadow-none rounded-2xl">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                  <Plane className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">Total Trips</p>
                  <p className="text-3xl font-semibold text-white tracking-tight">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mt-2 text-zinc-500" /> : trips.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 shadow-none rounded-2xl">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                  <Wallet className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">Avg Budget</p>
                  <p className="text-3xl font-semibold text-white tracking-tight">$1.2k</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-white/5 shadow-none rounded-2xl">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                  <Clock className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 mb-1">Days Traveled</p>
                  <p className="text-3xl font-semibold text-white tracking-tight">45</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white tracking-tight">Upcoming Journeys</h2>
              <Link href="/dashboard/trips">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/5">
                  View all
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="h-40 flex items-center justify-center border border-white/5 rounded-2xl bg-zinc-900/20">
                <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
              </div>
            ) : trips.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-zinc-900/20 border-dashed">
                <p className="text-zinc-500 mb-4">No trips planned yet.</p>
                <Link href="/dashboard/generator">
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    Plan your first trip
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-3">
                {trips.map((trip, idx) => (
                  <Link key={trip.id} href={`/builder/${trip.id}`} className="block group">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-white/10 transition-all rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 border border-white/5 relative shrink-0">
                          {trip.image && <img src={trip.image} alt={trip.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-lg tracking-tight mb-1">{trip.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(trip.startDate).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span className="flex items-center gap-1.5"><Navigation className="w-3.5 h-3.5" /> {trip.destination}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{trip.daysLeft} days left</p>
                          <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${trip.progress || 0}%` }} />
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Insights */}
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-2xl border border-white/5 bg-zinc-900/40 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-zinc-400" />
              <h2 className="font-medium text-white tracking-tight">AI Insights</h2>
            </div>
            <div className="space-y-4">
              <div className="pb-4 border-b border-white/5">
                <Badge variant="secondary" className="mb-2 bg-zinc-800 text-zinc-300 font-normal hover:bg-zinc-800">Price Drop</Badge>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Flights to Tokyo are historically low for your selected dates. Booking now could save you ~$150.
                </p>
              </div>
              <div>
                <Badge variant="secondary" className="mb-2 bg-zinc-800 text-zinc-300 font-normal hover:bg-zinc-800">Weather Alert</Badge>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Expect light rain in Paris next week. Consider moving your Louvre visit to Tuesday afternoon.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">Trending Curations</h2>
            <div className="grid gap-3">
              {[
                { name: "Kyoto Zen Gardens", type: "Culture", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400" },
                { name: "Patagonia Trails", type: "Adventure", image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&q=80&w=400" },
              ].map((dest, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden h-24 cursor-pointer border border-white/5">
                  <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-medium text-sm tracking-tight">{dest.name}</p>
                    <p className="text-xs text-zinc-400">{dest.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
