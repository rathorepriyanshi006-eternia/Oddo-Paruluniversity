"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlaneTakeoff, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300">
              <PlaneTakeoff className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              TRAVELOOP<span className="text-cyan-400">.AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10">
              Log in
            </Button>
            <Button className="bg-white text-indigo-950 hover:bg-zinc-200 transition-colors font-medium">
              Start Planning
            </Button>
          </div>

          <button 
            className="md:hidden text-zinc-300 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 px-4 pt-2 pb-6 space-y-4"
        >
          <Link href="#features" className="block text-base font-medium text-zinc-300 py-2">Features</Link>
          <Link href="#how-it-works" className="block text-base font-medium text-zinc-300 py-2">How it Works</Link>
          <Link href="#pricing" className="block text-base font-medium text-zinc-300 py-2">Pricing</Link>
          <div className="pt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
              Log in
            </Button>
            <Button className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white border-0">
              Start Planning
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
