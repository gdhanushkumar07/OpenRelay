// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Layout, Menu, X, ShieldCheck } from "lucide-react";
import FutureOfWork from "../components/landing/FutureOfWork";
import RealProblem from "../components/landing/RealProblem";
import WhyAicooExists from "../components/landing/WhyAicooExists";
import WhyAgentMesh from "../components/landing/WhyAgentMesh";
import DashboardPreview from "../components/landing/DashboardPreview";
import AicooPowersEverything from "../components/landing/AicooPowersEverything";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import TechStack from "../components/landing/TechStack";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#problem", label: "Problem" },
    { href: "#agents", label: "Agents" },
    { href: "#architecture", label: "Architecture" },
    { href: "#technology", label: "Technology" },
    { href: "#demo-preview", label: "Demo" }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      const offset = 80; // Navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex-1 bg-cream flex flex-col min-h-screen">
      {/* LANDING SCROLL NAVBAR */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur border-b border-charcoal/10 shadow-sm" : "bg-cream border-b border-charcoal/5"
      } px-6 py-4 flex items-center justify-between`}>
        {/* Brand */}
        <Link href="#" onClick={(e) => handleScrollTo(e, "#")} className="flex items-center gap-2 select-none group">
          <div className="bg-charcoal text-yellow p-1.5 rounded-lg border border-charcoal transition-all group-hover:scale-105">
            <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '15s' }} />
          </div>
          <div className="flex flex-col">
            <span className="font-syne text-sm font-bold uppercase tracking-wider text-charcoal leading-none">VendorFlow</span>
            <span className="text-[9px] uppercase tracking-widest text-charcoal/50 font-bold mt-0.5">by Aicoo Protocol</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="px-3 py-1.5 rounded-lg text-xs font-syne font-bold uppercase text-charcoal/60 hover:text-charcoal border border-transparent hover:border-charcoal/10 hover:bg-charcoal/5 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTA & Mobile trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/network"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-charcoal border border-charcoal text-cream hover:bg-charcoal/90 rounded-lg text-xs font-syne font-bold uppercase transition-all shadow-sm"
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-cream border-b border-charcoal/10 shadow-lg z-40 p-5 flex flex-col gap-3 animate-in slide-in-from-top-5 duration-200 lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="py-2.5 text-xs font-syne font-bold uppercase text-charcoal/70 border-b border-charcoal/5 last:border-b-0 hover:text-charcoal"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* HERO SECTION */}
      <section className="flex-1 p-8 md:p-16 flex flex-col md:flex-row border-collapse items-center min-h-[85vh] grid-bg">
        <div className="flex-1 max-w-2xl space-y-6 md:pr-8 py-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2.5 py-0.5 rounded border border-yellow/20 inline-block font-bold">
              S-01 / B2B Coordination Platform
            </span>
          </div>
          
          <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-charcoal leading-[1.1]">
            The Coordination Layer <br />
            <span className="text-yellow-dark bg-yellow/10 px-4 py-1 rounded-2xl border border-yellow/20 inline-block mt-2.5 text-2xl sm:text-3xl md:text-4xl">
              For AI Organizations.
            </span>
          </h1>
          
          <div className="text-sm text-charcoal/70 font-medium leading-relaxed space-y-2">
            <p className="font-bold text-charcoal">
              VendorFlow is a B2B operations coordination platform. While AgentMesh powers the underlying coordination engine, Aicoo enables secure communication, routing, and permissioned context sharing between AI agents belonging to different organizations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/network"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-charcoal hover:bg-charcoal/90 text-cream rounded-xl font-syne font-bold uppercase text-xs transition-all shadow-md group border border-charcoal"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4 text-yellow transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#problem"
              onClick={(e) => handleScrollTo(e, "#problem")}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-charcoal/10 hover:border-charcoal/30 text-charcoal rounded-xl font-syne font-bold uppercase text-xs transition-all shadow-sm"
            >
              <span>Explore the Problem</span>
            </a>
          </div>
        </div>

        {/* Right side representation */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <div className="border border-charcoal/10 bg-cream p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-sm relative rotate-1">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">Active Topology</span>
              <span className="text-[8px] font-mono bg-charcoal/5 px-2 py-0.5 rounded font-bold text-charcoal/40">v1.0.0</span>
            </div>
            <div className="h-24 bg-cream-dark/30 rounded-xl border border-charcoal/5 flex items-center justify-center">
              <Globe className="w-12 h-12 text-charcoal/10 animate-spin" style={{ animationDuration: '30s' }} />
            </div>
            <p className="text-[10px] text-charcoal/60 leading-relaxed font-semibold text-center">
              Aicoo Protocol synchronizes Procurement, Finance, Insurance, Warehouse, Shipping, and Supplier Agent nodes.
            </p>
          </div>
        </div>
      </section>

      {/* STORYTELLING SECTIONS */}
      <FutureOfWork />
      <RealProblem />
      <WhyAicooExists />
      <WhyAgentMesh />
      <DashboardPreview />
      <AicooPowersEverything />
      <ArchitectureSection />
      <TechStack />

      {/* FINAL MESSAGE SECTION */}
      <section className="py-20 bg-charcoal text-cream border-t border-white/5 grid-bg-dark relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-cream leading-tight">
            Without Aicoo, companies have AI agents. <br />
            <span className="text-yellow">With Aicoo, companies have coordinated organizations.</span>
          </h2>
          <p className="text-xs text-white/60 font-semibold leading-relaxed max-w-xl mx-auto">
            VendorFlow demonstrates one real-world application of that future. AgentMesh is the coordination engine, and Aicoo is the communication infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/network"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow hover:bg-yellow-dark text-charcoal rounded-xl font-syne font-bold uppercase text-xs transition-all shadow-md border border-yellow-dark"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/network"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-cream rounded-xl font-syne font-bold uppercase text-xs transition-all border border-white/10"
            >
              <span>Open Interactive Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal text-cream border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 text-yellow p-1.5 rounded-lg border border-white/5">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-syne text-xs uppercase font-bold tracking-wider text-cream">VendorFlow OS</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/40 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Secure Enterprise Nervous System</span>
          </div>
          <div className="text-[10px] text-white/30 font-semibold font-mono">
            &copy; {new Date().getFullYear()} Aicoo Inc. Hackathon Submission.
          </div>
        </div>
      </footer>
    </div>
  );
}
