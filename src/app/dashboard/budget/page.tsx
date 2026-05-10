"use client";

import { Wallet, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BudgetPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Budget Overview</h1>
          <p className="text-zinc-400">Track and optimize your travel spending across all trips.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-64">
             <Wallet className="w-12 h-12 text-zinc-600 mb-4" />
             <h3 className="text-xl font-bold text-white mb-2">Total Spent</h3>
             <p className="text-3xl font-bold text-cyan-400">$6,500</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-64">
             <PieChart className="w-12 h-12 text-zinc-600 mb-4" />
             <h3 className="text-xl font-bold text-white mb-2">Detailed Analytics</h3>
             <p className="text-sm text-zinc-400">Advanced budget breakdown coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
