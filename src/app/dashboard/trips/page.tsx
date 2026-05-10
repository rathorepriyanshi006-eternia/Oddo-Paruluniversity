"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Loader2, Clock, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyTripsPage() {
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
          <h1 className="text-3xl font-display font-bold text-white mb-2">My Trips</h1>
          <p className="text-zinc-400">Manage all your past and upcoming journeys.</p>
        </div>
        <Link href="/dashboard/generator">
          <Button className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/25">
            <Map className="w-4 h-4 mr-2" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 text-cyan-400 animate-spin" /></div>
      ) : trips.length === 0 ? (
        <div className="glass-panel p-20 text-center rounded-3xl border border-white/5">
          <p className="text-zinc-400 mb-6 text-lg">You don't have any trips yet.</p>
          <Link href="/dashboard/generator">
            <Button className="bg-white text-indigo-950 font-bold h-14 px-8 rounded-xl">
              Start Planning
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, idx) => (
            <Link key={trip.id} href={`/builder/${trip.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel rounded-3xl overflow-hidden group hover:border-white/20 transition-all border border-white/5"
              >
                <div className="h-48 relative bg-zinc-800">
                  {trip.image && <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-xl text-white group-hover:text-cyan-400 transition-colors">{trip.title}</h3>
                    <p className="text-sm text-zinc-300 flex items-center gap-1"><MapPin className="w-3 h-3" /> {trip.destination}</p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(trip.startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 text-amber-400"><Clock className="w-4 h-4" /> {trip.daysLeft} days left</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-500 font-medium">
                      <span>Planning Progress</span>
                      <span>{trip.progress || 0}%</span>
                    </div>
                    <Progress value={trip.progress || 0} className="h-2 bg-white/10" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
