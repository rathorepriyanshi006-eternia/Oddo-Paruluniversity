"use client";

import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export function Topbar() {
  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-cyan-400 transition-colors" />
          <Input 
            type="text" 
            placeholder="Search trips, destinations, or friends..." 
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-cyan-500 rounded-xl transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                toast.info("Global Search", { description: "Search functionality is currently in development." });
              }
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full relative"
          onClick={() => toast("Notifications", { description: "You have no new notifications." })}
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
        </Button>
        <Link href="/dashboard/generator">
          <Button className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white border-0 hover:from-indigo-600 hover:to-cyan-500 rounded-xl hidden sm:flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4" />
            <span className="font-semibold">New Trip</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
