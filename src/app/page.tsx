import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      
      {/* Simple Footer */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <span className="font-display font-bold text-xl tracking-tight text-white">
              TRAVELOOP<span className="text-cyan-400">.AI</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 Traveloop AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
