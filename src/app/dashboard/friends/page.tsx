"use client";

import { Users, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FriendsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Friends</h1>
          <p className="text-zinc-400">Manage your travel companions.</p>
        </div>
        <Button className="bg-white text-indigo-950 font-bold rounded-xl">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Friend
        </Button>
      </div>

      <div className="glass-panel p-20 text-center rounded-3xl border border-white/5">
        <Users className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">You have 0 friends connected.</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          Invite your friends to Traveloop to start planning trips collaboratively in real-time.
        </p>
        <Button className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white rounded-xl">
          Copy Invite Link
        </Button>
      </div>
    </div>
  );
}
