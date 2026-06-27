// src/components/ProcurementPortal.tsx
"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS, CATEGORIES, Product } from "../lib/products";
import { SCENARIOS, Scenario } from "../lib/scenarios";
import { Search, Filter, ShoppingBag, Truck, Check, AlertTriangle, ShieldCheck } from "lucide-react";

interface ProcurementPortalProps {
  onSelectScenario: (scenario: Scenario, params: { qty: number; dest: string; priority: string }) => void;
}

export default function ProcurementPortal({ onSelectScenario }: ProcurementPortalProps) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [selectedProd, setSelectedProd] = useState<Product>(PRODUCTS[0]);
  const [quantity, setQuantity] = useState(100);
  const [destination, setDestination] = useState("Munich Facility");
  const [priority, setPriority] = useState("Standard Ground");

  // Instant search & filter
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat ? p.category === selectedCat : true;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat]);

  const totalValue = selectedProd ? selectedProd.price * quantity : 0;
  const isHighValue = totalValue >= 1000000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProd) return;

    // Automatically route to target scenario based on business logic
    let scenarioId = "multi-supplier-procurement"; // Default scenario 1

    if (isHighValue) {
      scenarioId = "high-value-procurement"; // Scenario 2 (Human approval triggers because price > $1M)
    } else if (selectedProd.id === "solar" || selectedProd.category === "Renewable Energy") {
      scenarioId = "supplier-outage-recovery"; // Scenario 3 (WOW moment outage recovery)
    } else if (priority === "Immediate Priority Dispatch") {
      scenarioId = "supplier-outage-recovery";
    }

    const baseScenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];

    // Build custom scenario overlay with user inputs
    const customizedScenario: Scenario = {
      ...baseScenario,
      name: `${baseScenario.name} (${selectedProd.name})`,
      steps: baseScenario.steps.map((step, idx) => {
        if (idx === 0) {
          return {
            ...step,
            action: `Customer Agent submits requisition for ${quantity.toLocaleString()} units of ${selectedProd.name} bound for ${destination}.`,
            narration: `Customer places requisition for ${quantity.toLocaleString()} items (Priority: ${priority}, Destination: ${destination}).`,
            dialogue: `Submitting requisition: ${quantity.toLocaleString()} units of ${selectedProd.name} bound for ${destination}.`,
            badge: "Order Logged"
          };
        }
        return step;
      })
    };

    onSelectScenario(customizedScenario, { qty: quantity, dest: destination, priority });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto">
      {/* Product Catalog Grid (8 Columns) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Search and Category header */}
        <div className="bg-cream border border-charcoal/10 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search raw materials, electronics, medical hardware..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-xs text-charcoal font-bold focus:outline-none focus:border-yellow"
              />
            </div>
            <button 
              onClick={() => { setSearch(""); setSelectedCat(null); }}
              className="px-4 py-2.5 bg-charcoal/5 hover:bg-charcoal/10 border border-charcoal/10 rounded-xl text-xs font-syne font-bold uppercase text-charcoal transition-all"
            >
              Clear
            </button>
          </div>

          {/* Categories Horizontal scroller */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            <button
              onClick={() => setSelectedCat(null)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-syne font-bold uppercase border shrink-0 transition-all ${
                !selectedCat 
                  ? "bg-charcoal text-cream border-charcoal" 
                  : "bg-white text-charcoal/70 border-charcoal/10 hover:border-charcoal/20"
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-[10px] font-syne font-bold uppercase border shrink-0 transition-all ${
                  selectedCat === cat 
                    ? "bg-charcoal text-cream border-charcoal" 
                    : "bg-white text-charcoal/70 border-charcoal/10 hover:border-charcoal/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
          {filteredProducts.map(prod => {
            const isSel = selectedProd?.id === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProd(prod)}
                className={`p-4 bg-white border rounded-2xl cursor-pointer transition-all flex flex-col justify-between min-h-[140px] shadow-sm hover:translate-y-[-1px] ${
                  isSel 
                    ? "border-yellow-dark bg-yellow/5 ring-1 ring-yellow-dark/20" 
                    : "border-charcoal/10 hover:border-charcoal/25"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[8px] font-syne font-bold uppercase bg-charcoal/5 px-2 py-0.5 rounded text-charcoal/60">
                      {prod.category}
                    </span>
                    <span className={`text-[8px] font-syne font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                      prod.status === "In Stock" || prod.status === "Available from Multiple Suppliers"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow/20 text-yellow-dark border-yellow/30"
                    }`}>
                      {prod.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-syne font-extrabold uppercase text-charcoal">{prod.name}</h4>
                </div>

                <div className="flex justify-between items-end border-t border-charcoal/5 pt-3 mt-4">
                  <div className="space-y-0.5">
                    <div className="text-[8px] font-syne uppercase text-charcoal/40 font-bold">Est. market price</div>
                    <div className="text-xs font-mono font-bold text-charcoal">${prod.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-[8px] font-syne uppercase text-charcoal/40 font-bold">Transit Time</div>
                    <div className="text-[10px] font-bold text-charcoal/70">{prod.deliveryTime}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requisition Sidebar (4 Columns) */}
      <div className="lg:col-span-4 bg-cream border border-charcoal/10 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-1.5 border-b border-charcoal/10 pb-4">
          <span className="text-[9px] font-syne uppercase tracking-wider text-yellow-dark bg-yellow/10 px-2 py-0.5 rounded font-bold">
            B2B Requisition
          </span>
          <h3 className="font-syne text-xs uppercase font-extrabold text-charcoal">Procurement Details</h3>
        </div>

        {/* Selected Product Summary */}
        <div className="p-4 bg-white border border-charcoal/5 rounded-xl space-y-2.5">
          <div className="text-[9px] font-syne uppercase text-charcoal/40 font-bold">Sourcing Item</div>
          <h4 className="text-xs font-syne font-extrabold uppercase text-charcoal">{selectedProd.name}</h4>
          <div className="flex justify-between items-center text-[10px] border-t border-charcoal/5 pt-2 mt-1">
            <span className="font-semibold text-charcoal/60">Suppliers Connected:</span>
            <span className="font-bold text-charcoal">{selectedProd.suppliers} COOs</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quantity Selector */}
          <div className="space-y-1">
            <label className="text-[9px] font-syne uppercase font-bold text-charcoal/50">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 bg-white border border-charcoal/10 rounded-xl text-xs font-bold focus:outline-none focus:border-yellow-dark"
            />
          </div>

          {/* Delivery Location */}
          <div className="space-y-1">
            <label className="text-[9px] font-syne uppercase font-bold text-charcoal/50">Delivery Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-charcoal/10 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option>Munich Facility</option>
              <option>Chicago Hub</option>
              <option>Tokyo Harbor</option>
            </select>
          </div>

          {/* Delivery Priority */}
          <div className="space-y-1">
            <label className="text-[9px] font-syne uppercase font-bold text-charcoal/50">Priority Class</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-charcoal/10 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option>Standard Ground</option>
              <option>Express Air Freight</option>
              <option>Immediate Priority Dispatch</option>
            </select>
          </div>

          {/* Procurement Summary Surcharge Value */}
          <div className="p-4 bg-charcoal text-cream rounded-xl space-y-3.5 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-cream/70">Requisition Value:</span>
              <span className="font-mono font-bold">${totalValue.toLocaleString()}</span>
            </div>
            
            {isHighValue && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-lg flex gap-2 text-red-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <p className="text-[9px] leading-relaxed font-semibold">
                  Exceeds autonomous limit ($1M). Triggers human Eisenhower sign-off briefing.
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-yellow hover:bg-yellow-dark text-charcoal border border-yellow-dark rounded-xl font-syne font-bold uppercase text-xs transition-all shadow-sm"
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span>Submit Requisition Request</span>
          </button>
        </form>
      </div>
    </div>
  );
}
