"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Users, Wallet, Map, Route, Sparkles } from "lucide-react";

const features = [
  {
    title: "AI-Powered Itineraries",
    description: "Tell us your preferences, and our AI generates a day-by-day plan instantly, complete with activities, restaurants, and timing.",
    icon: <BrainCircuit className="w-6 h-6 text-indigo-400" />,
    gradient: "from-indigo-500/20 to-indigo-500/0"
  },
  {
    title: "Smart Budgeting",
    description: "Keep track of expenses effortlessly. We predict costs and suggest cheaper alternatives to stretch your budget further.",
    icon: <Wallet className="w-6 h-6 text-cyan-400" />,
    gradient: "from-cyan-500/20 to-cyan-500/0"
  },
  {
    title: "Live Collaboration",
    description: "Invite friends, vote on activities, and edit the plan together in real-time, just like Google Docs for travel.",
    icon: <Users className="w-6 h-6 text-violet-400" />,
    gradient: "from-violet-500/20 to-violet-500/0"
  },
  {
    title: "Interactive Maps",
    description: "Visualize your entire trip on a dynamic map. See travel times between stops and reorder them with a simple drag.",
    icon: <Map className="w-6 h-6 text-emerald-400" />,
    gradient: "from-emerald-500/20 to-emerald-500/0"
  },
  {
    title: "Route Optimization",
    description: "Minimize travel time. Our algorithms reorder your daily stops to ensure you spend more time exploring and less time commuting.",
    icon: <Route className="w-6 h-6 text-amber-400" />,
    gradient: "from-amber-500/20 to-amber-500/0"
  },
  {
    title: "Hidden Gems",
    description: "Go beyond the tourist traps. Discover local favorites and unique experiences curated by AI trained on local insights.",
    icon: <Sparkles className="w-6 h-6 text-pink-400" />,
    gradient: "from-pink-500/20 to-pink-500/0"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Features</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Everything you need for the <br /> <span className="gradient-text">perfect trip</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400"
          >
            We've completely reimagined travel planning. No more spreadsheets, endless tabs, or stressful coordination.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-3xl relative group overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
