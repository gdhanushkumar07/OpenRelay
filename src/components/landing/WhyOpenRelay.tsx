// src/components/landing/WhyOpenRelay.tsx
"use client";

import React from "react";
import { ShoppingCart, Database, Key, CheckCircle } from "lucide-react";

export default function WhyOpenRelay() {
  const steps = [
    {
      id: "01",
      icon: ShoppingCart,
      title: "Order Checkout",
      headline: "Customer Places Purchase Request",
      desc: "Selecting products from a catalog triggers the B2B order. Marketplace agents receive the requisition and initialize the transaction."
    },
    {
      id: "02",
      icon: Database,
      title: "Stock Verification",
      headline: "Scans Supplier Inventory",
      desc: "Stock agents check availability. If the primary seller lacks inventory, OpenRelay bypasses the deficit to secure backup supplies."
    },
    {
      id: "03",
      icon: Key,
      title: "Secured Coordination",
      headline: "Aicoo Routes Permissioned Data",
      desc: "AI agents for warehousing, courier routing, payment gateways, and insurance underwriters collaborate securely in the background."
    },
    {
      id: "04",
      icon: CheckCircle,
      title: "Fulfillment Complete",
      headline: "Order Dispatched Confirmed",
      desc: "Funds are verified, shipping labels generated, and express carriers booked. The order is delivered tomorrow."
    }
  ];

  return (
    <section id="how-it-works" className="py-28 lg:py-36 bg-cream border-t border-charcoal/10 relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow/15 border border-yellow/30 text-yellow-dark text-xs font-bold uppercase tracking-wider">
            S-03 / How It Works
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-charcoal leading-none">
            Decentralized Sourcing <span className="font-serif italic font-normal text-yellow-dark lowercase capitalize">Operations</span>
          </h2>
          <p className="text-sm sm:text-base text-charcoal/70 leading-relaxed font-normal">
            OpenRelay coordinates complex procurement pipelines without manual emails, meetings, or spreadsheets.
          </p>
        </div>

        {/* 4 Large Connected Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-charcoal/10 rounded-2xl p-8 flex flex-col justify-between min-h-[300px] transition-all duration-300 hover:border-charcoal/30 hover:-translate-y-1.5 hover:shadow-xl relative group shadow-sm"
              >
                {/* Numeric Step Badge */}
                <div className="flex justify-between items-start">
                  <span className="font-sans text-xl font-extrabold text-charcoal/20 group-hover:text-yellow-dark transition-colors">
                    {step.id}
                  </span>
                  <div className="bg-charcoal/5 p-3 rounded-xl border border-charcoal/5 text-charcoal group-hover:bg-charcoal group-hover:text-yellow transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-3 mt-10">
                  <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-yellow-dark block">
                    {step.title}
                  </span>
                  <h3 className="font-sans text-sm uppercase font-extrabold text-charcoal tracking-wide">
                    {step.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
