// src/app/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Layout, Menu, X, ShieldCheck, Check } from "lucide-react";
import HeroNetworkVisualization from "../components/landing/HeroNetworkVisualization";
import FutureOfWork from "../components/landing/FutureOfWork";
import RealProblem from "../components/landing/RealProblem";
import WhyAicooExists from "../components/landing/WhyAicooExists";
import WhyOpenRelay from "../components/landing/WhyOpenRelay";
import DashboardPreview from "../components/landing/DashboardPreview";
import AicooPowersEverything from "../components/landing/AicooPowersEverything";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import TechStack from "../components/landing/TechStack";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  const isManualScroll = useRef(false);
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Fallback boundaries for top and bottom of page
      if (isManualScroll.current) return;
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollPos < 50) {
        setActiveSection("#home");
      } else if (scrollPos + windowHeight >= docHeight - 50) {
        setActiveSection("#live-demo");
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Scroll Spy using IntersectionObserver
    const sectionIds = ["home", "problem", "how-it-works", "why-aicoo", "technology", "live-demo"];
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observerOptions = {
      root: null,
      rootMargin: "-95px 0px -60% 0px", // focus on area just below header offset
      threshold: [0, 0.1, 0.2]
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScroll.current) return;

      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        // Find the active entry closest to the top of our viewport focus area
        const activeEntry = visibleEntries.reduce((prev, curr) => {
          return Math.abs(curr.boundingClientRect.top - 100) < Math.abs(prev.boundingClientRect.top - 100) ? curr : prev;
        });
        setActiveSection(`#${activeEntry.target.id}`);
      }
    }, observerOptions);

    elements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      elements.forEach(el => observer.unobserve(el));
      if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    };
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#problem", label: "Problem" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#why-aicoo", label: "Why Aicoo" },
    { href: "#technology", label: "Technology" },
    { href: "#live-demo", label: "Live Demo" }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(id);
    
    // Set scroll lock to prevent Scroll Spy active state flickering during smooth scroll
    isManualScroll.current = true;
    if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);
    manualScrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 850);

    if (id === "#" || id === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      const offset = 90; // Navbar height
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
      {/* LANDING STICKY BLUR NAVBAR */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-cream/85 backdrop-blur-xl border-b border-charcoal/10 shadow-xs py-3.5" : "bg-cream border-b border-charcoal/5 py-4"
      } px-6 lg:px-12 flex items-center justify-between max-w-[1400px] mx-auto w-full`}>
        {/* Brand */}
        <Link href="#" onClick={(e) => handleScrollTo(e, "#")} className="flex items-center gap-2.5 select-none group">
          <div className="bg-charcoal text-yellow p-2 rounded-xl border border-charcoal/20 transition-all group-hover:scale-105 group-hover:shadow-md">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-yellow"
            >
              <circle cx="12" cy="5" r="2" fill="currentColor" />
              <circle cx="5" cy="12" r="2" fill="currentColor" />
              <circle cx="19" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="19" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="3" fill="currentColor" className="animate-pulse" />
              <line x1="12" y1="7" x2="12" y2="9" />
              <line x1="12" y1="15" x2="12" y2="17" />
              <line x1="7" y1="12" x2="9" y2="12" />
              <line x1="15" y1="12" x2="17" y2="12" />
              <line x1="12" y1="5" x2="5" y2="12" strokeDasharray="2 2" strokeWidth="1.5" className="opacity-60" />
              <line x1="12" y1="5" x2="19" y2="12" strokeDasharray="2 2" strokeWidth="1.5" className="opacity-60" />
              <line x1="5" y1="12" x2="12" y2="19" strokeDasharray="2 2" strokeWidth="1.5" className="opacity-60" />
              <line x1="19" y1="12" x2="12" y2="19" strokeDasharray="2 2" strokeWidth="1.5" className="opacity-60" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-extrabold uppercase tracking-wider text-charcoal leading-none">OpenRelay</span>
            <span className="text-[10px] uppercase tracking-widest text-charcoal/50 font-semibold mt-1">Powered by Aicoo Protocol</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-charcoal/5 p-1.5 rounded-full border border-charcoal/5">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`relative px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                  isActive 
                    ? "bg-cream text-charcoal font-bold shadow-xs border border-charcoal/10" 
                    : "text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action CTA & Mobile trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/network"
            className="btn-enterprise flex items-center gap-2 px-5 py-2.5 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-bold uppercase tracking-wider transition-all shadow-md border border-charcoal"
          >
            <Layout className="w-4 h-4 text-yellow" />
            <span>Launch OpenRelay</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5 rounded-xl transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[73px] bg-cream/95 backdrop-blur-2xl border-b border-charcoal/10 shadow-xl z-40 p-6 flex flex-col gap-3 animate-in slide-in-from-top-5 duration-200 lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="py-3 text-xs font-bold uppercase tracking-wider text-charcoal/70 border-b border-charcoal/5 last:border-b-0 hover:text-charcoal flex items-center justify-between"
            >
              <span>{link.label}</span>
              <ArrowRight className="w-4 h-4 text-charcoal/30" />
            </a>
          ))}
        </div>
      )}

      {/* HERO SECTION */}
      <section id="home" className="relative w-full py-12 lg:py-20 px-6 lg:px-12 grid-bg radial-glow-hero min-h-[88vh] flex items-center">
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-18 items-center">
          
          {/* Left Column (45%) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Enterprise Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow/15 border border-yellow/30 text-yellow-dark">
              <span className="w-2 h-2 rounded-full bg-yellow-dark animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">
                THE COMMUNICATION LAYER FOR AI AGENTS
              </span>
            </div>
            
            {/* Headline: Inter ExtraBold with Instrument Serif accent */}
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-charcoal leading-[1.08]">
              Coordinate AI Agents <br />
              <span className="font-serif italic font-normal text-yellow-dark lowercase tracking-normal capitalize text-4xl sm:text-5xl lg:text-6xl">
                Across Organizations.
              </span>
            </h1>
            
            {/* Description */}
            <div className="text-sm sm:text-base text-charcoal/70 font-normal leading-relaxed">
              <p>
                Modern marketplaces depend on multiple independent organizations working together. OpenRelay demonstrates how AI agents securely communicate, route requests, share permissioned context and coordinate through Aicoo.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                "Secure Identity Routing",
                "Permissioned Context Sharing",
                "Cross Organization Communication"
              ].map((pill, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-charcoal/10 shadow-2xs text-xs font-semibold text-charcoal hover:border-charcoal/30 transition-all"
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{pill}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-3">
              <Link
                href="/network"
                className="btn-enterprise flex items-center justify-center gap-2.5 px-8 py-4 bg-charcoal hover:bg-charcoal/90 text-cream font-bold uppercase text-xs tracking-wider transition-all shadow-lg group border border-charcoal"
              >
                <span>Launch OpenRelay</span>
                <ArrowRight className="w-4 h-4 text-yellow transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#problem"
                onClick={(e) => handleScrollTo(e, "#problem")}
                className="btn-enterprise flex items-center justify-center gap-2 px-7 py-4 bg-white border border-charcoal/15 hover:border-charcoal/30 text-charcoal font-bold uppercase text-xs tracking-wider transition-all shadow-xs"
              >
                <span>See How It Works</span>
              </a>
            </div>
          </div>

          {/* Right Column Visualization (55%) */}
          <div className="lg:col-span-7 w-full flex justify-center items-center">
            <HeroNetworkVisualization />
          </div>

        </div>
      </section>

      {/* STORYTELLING SECTIONS */}
      {/* 2. PROBLEM */}
      <RealProblem />
      <FutureOfWork />

      {/* 3. HOW IT WORKS */}
      <WhyOpenRelay />
      <AicooPowersEverything />
      <DashboardPreview />

      {/* 4. WHY AICOO */}
      <WhyAicooExists />

      {/* 5. TECHNOLOGY */}
      <ArchitectureSection />
      <TechStack />

      {/* FINAL MESSAGE SECTION */}
      <section id="live-demo" className="py-28 lg:py-36 bg-charcoal text-cream border-t border-white/10 grid-bg-dark relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center space-y-10 relative z-10">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-cream leading-tight max-w-4xl mx-auto">
            Without Aicoo, companies have AI agents. <br />
            <span className="font-serif italic font-normal text-yellow lowercase capitalize">With Aicoo, companies have coordinated organizations.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed max-w-2xl mx-auto">
            OpenRelay demonstrates one real-world application of that future. OpenRelay is the coordination engine, and Aicoo is the communication infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/network"
              className="btn-enterprise flex items-center justify-center gap-2.5 px-9 py-4.5 bg-yellow hover:bg-yellow-dark text-charcoal font-bold uppercase text-xs tracking-wider transition-all shadow-xl border border-yellow-dark"
            >
              <span>Launch OpenRelay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/network"
              className="btn-enterprise flex items-center justify-center gap-2 px-8 py-4.5 bg-white/10 hover:bg-white/20 text-cream font-bold uppercase text-xs tracking-wider transition-all border border-white/15 backdrop-blur-md"
            >
              <span>Open Interactive Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal text-cream border-t border-white/10 py-12 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/10 text-yellow p-2 rounded-xl border border-white/10">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-sans text-xs uppercase font-extrabold tracking-wider text-cream">OpenRelay OS</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50 font-medium uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Enterprise Nervous System</span>
          </div>
          <div className="text-xs text-white/40 font-mono">
            &copy; {new Date().getFullYear()} Aicoo Inc. Hackathon Submission.
          </div>
        </div>
      </footer>
    </div>
  );
}
