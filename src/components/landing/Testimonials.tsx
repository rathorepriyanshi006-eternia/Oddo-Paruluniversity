"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Solo Backpacker",
    image: "https://i.pravatar.cc/150?img=47",
    content: "Traveloop AI saved me literally hours of planning. The AI suggested a hidden cafe in Paris I never would have found otherwise. Unbelievable experience."
  },
  {
    name: "David & Emma",
    role: "Honeymooners",
    image: "https://i.pravatar.cc/150?img=68",
    content: "We used it to plan our honeymoon in Japan. The budget tracking was spot on, and collaborating on the itinerary made the build-up to the trip so exciting."
  },
  {
    name: "Marcus Chen",
    role: "Digital Nomad",
    image: "https://i.pravatar.cc/150?img=11",
    content: "The best travel app out there. Period. It feels like having a premium travel agent in your pocket. The route optimization is magic."
  }
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">
            Loved by <span className="text-cyan-400">travelers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-panel p-8 rounded-3xl border border-white/10"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-lg text-zinc-300 mb-8 italic">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-sm text-zinc-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
