"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Calendar, MapPin, ArrowUpRight, Wallet, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back, Marcus</h1>
          <p className="text-zinc-400">You have {trips.length} upcoming trips. Where to next?</p>
        </div>
        <Link href="/dashboard/generator">
          <Button className="bg-white text-indigo-950 hover:bg-zinc-200 transition-colors rounded-xl font-semibold shadow-lg shadow-white/5">
            <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
            AI Trip Generator
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Trips</p>
                  <p className="text-2xl font-bold text-white">{loading ? <Loader2 className="w-4 h-4 animate-spin"/> : trips.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Wallet className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Avg Budget</p>
                  <p className="text-2xl font-bold text-white">$1.2k</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                  <Clock className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Days Traveled</p>
                  <p className="text-2xl font-bold text-white">45</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Upcoming Journeys</h2>
              <Link href="/dashboard/trips">
                <Button variant="link" className="text-cyan-400 p-0">View all <ArrowUpRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
            ) : trips.length === 0 ? (
              <div className="glass-panel p-10 text-center rounded-2xl border border-white/5">
                <p className="text-zinc-400 mb-4">No trips planned yet.</p>
                <Link href="/dashboard/generator">
                  <Button className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white border-0">
                    Create your first trip
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip, idx) => (
                  <Link key={trip.id} href={`/builder/${trip.id}`} className="block">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center group cursor-pointer hover:border-white/20 transition-all"
                    >
                      <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden relative bg-zinc-800">
                        {trip.image && <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{trip.title}</h3>
                          <div className="flex -space-x-2">
                            {[...Array(trip.collaborators || 1)].map((_, i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-zinc-800 overflow-hidden">
                                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="User" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400 mb-3">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(trip.startDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1 text-amber-400"><Clock className="w-4 h-4" /> {trip.daysLeft} days left</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={trip.progress || 0} className="h-2 bg-white/10" />
                          <span className="text-xs text-zinc-500 font-medium">{trip.progress || 0}% Planned</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Recommendations & Trending */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900/40 to-background border-indigo-500/20 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-white">AI Insights</h2>
              </div>
              <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                Based on your saved "Swiss Alps Ski Trip", flight prices from JFK are dropping for early December. Book within the next 48 hours to save estimated $150.
              </p>
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5 transition-colors">
                View Flight Deals
              </Button>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-bold text-white mb-4">Trending Destinations</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=400" },
                { name: "Reykjavik", image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=400" },
                { name: "Patagonia", image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&q=80&w=400" },
                { name: "Kyoto", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400" }
              ].map((dest, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer">
                  <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-medium text-sm">{dest.name}</p>
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
