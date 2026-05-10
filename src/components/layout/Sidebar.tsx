"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  PlaneTakeoff, 
  LayoutDashboard, 
  Map, 
  Wallet, 
  Settings, 
  Users,
  Compass
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Trips", href: "/dashboard/trips", icon: Map },
  { name: "Discover", href: "/dashboard/discover", icon: Compass },
  { name: "Budget", href: "/dashboard/budget", icon: Wallet },
  { name: "Friends", href: "/dashboard/friends", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 hidden lg:flex flex-col bg-background/50 backdrop-blur-xl border-r border-white/10 h-full">
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300">
            <PlaneTakeoff className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            TRAVELOOP<span className="text-cyan-400">.AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive 
                  ? "bg-white/10 text-white shadow-sm border border-white/5" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-cyan-400" : ""}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="glass-panel p-4 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10" />
          <div className="relative z-10 flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-10 h-10 rounded-full border border-white/20" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Marcus Chen</p>
              <p className="text-xs text-zinc-400 truncate">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
