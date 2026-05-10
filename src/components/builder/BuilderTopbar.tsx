"use client";

import Link from "next/link";
import { PlaneTakeoff, Share, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export function BuilderTopbar() {
  const params = useParams();
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await fetch(`/api/trips/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setTrip(data.data);
        }
      } catch (e) {
        // fail silently for topbar
      }
    }
    fetchTrip();
  }, [params.id]);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-background z-40">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="h-6 w-px bg-white/10 mx-2" />
        <div>
          <h1 className="font-bold text-white text-sm md:text-base">
            {trip ? trip.title : "Loading..."}
          </h1>
          <p className="text-xs text-zinc-500">
            {trip ? `${new Date(trip.startDate).toLocaleDateString()} • ${trip.collaborators || 1} Travelers` : "..."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex -space-x-2 mr-4">
          {[1, 2].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800 overflow-hidden relative z-10 hover:z-20 transition-transform hover:scale-110">
              <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-background bg-white/10 flex items-center justify-center text-xs text-white relative z-0 hover:z-20 cursor-pointer hover:bg-white/20 transition-all">
            <Users className="w-3 h-3" />
          </div>
        </div>
        <Button 
          variant="outline" 
          className="hidden sm:flex border-white/10 text-white hover:bg-white/10 h-9"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard", { description: "Anyone with this link can view the trip."});
          }}
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button 
          className="bg-white text-indigo-950 hover:bg-zinc-200 transition-colors h-9 font-semibold"
          onClick={() => {
            toast.success("Trip Published!", { description: "Your trip is now public and visible on your profile."});
          }}
        >
          Publish
        </Button>
      </div>
    </header>
  );
}
