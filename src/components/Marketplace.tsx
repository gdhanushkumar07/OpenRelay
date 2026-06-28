// src/components/Marketplace.tsx
"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS, Product } from "../lib/products";
import { 
  Search, SlidersHorizontal, ArrowLeft, Star, ShoppingCart, 
  Truck, ShieldCheck, AlertTriangle, X, ChevronRight, Package 
} from "lucide-react";

interface MarketplaceProps {
  onBuyProduct: (product: Product, quantity: number) => void;
  onBack: () => void;
  customerDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    deliveryCity: string;
    customerType: string;
    preferredPayment: string;
    address: string;
  };
}

export default function Marketplace({ onBuyProduct, onBack, customerDetails }: MarketplaceProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<string>("popularity");

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(2);
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);

  // Available Categories & Brands
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  }, []);

  const brands = useMemo(() => {
    return ["All", ...Array.from(new Set(PRODUCTS.map(p => p.brand)))];
  }, []);

  const availabilities = [
    "All", "In Stock", "Low Stock", "Limited Stock", 
    "Ships Tomorrow", "Multiple Sellers", "Pre-order", 
    "Out of Stock", "Restocking Soon"
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
      const matchesAvailability = selectedAvailability === "All" || p.availability === selectedAvailability;
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesBrand && matchesAvailability && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      // Default / popularity fallback
      return b.rating - a.rating;
    });
  }, [searchQuery, selectedCategory, selectedBrand, selectedAvailability, maxPrice, sortBy]);

  // Color mapper for availability states
  const getAvailabilityTheme = (state: Product["availability"]) => {
    const themes: Record<Product["availability"], { bg: string; text: string; border: string }> = {
      "In Stock": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
      "Low Stock": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
      "Limited Stock": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
      "Ships Tomorrow": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
      "Multiple Sellers": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
      "Pre-order": { bg: "bg-yellow/20", text: "text-yellow-dark", border: "border-yellow/30" },
      "Out of Stock": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
      "Restocking Soon": { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" }
    };
    return themes[state] || { bg: "bg-charcoal/5", text: "text-charcoal/60", border: "border-charcoal/10" };
  };

  const handleOpenProduct = (p: Product) => {
    setSelectedProduct(p);
    // Auto-set quantity to 2 for Sony headphones to ensure B2B failover triggers
    setQuantity(p.id === "sony-xm6" ? 2 : 1);
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    setIsCheckoutSubmitting(true);
    setTimeout(() => {
      setIsCheckoutSubmitting(false);
      const prod = selectedProduct;
      setSelectedProduct(null);
      onBuyProduct(prod, quantity);
    }, 2800);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Checkout Transition Loader Overlay */}
      {isCheckoutSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream/98 backdrop-blur-md text-center py-20 px-6 animate-in fade-in duration-300">
          <div className="w-12 h-12 border-4 border-yellow-dark border-t-transparent rounded-full animate-spin mb-6"></div>
          <div className="space-y-3 max-w-md">
            <h3 className="font-syne text-sm uppercase font-extrabold text-charcoal tracking-wide">
              Order Submitted Successfully
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed font-semibold">
              OpenRelay is coordinating your order across B2B warehouse lanes and logistics networks.
            </p>
            <p className="text-[11px] font-syne uppercase tracking-wider text-yellow-dark font-extrabold animate-pulse pt-4">
              Opening Aicoo Coordination Control Dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-cream border border-charcoal/10 px-5 py-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 border border-charcoal/10 rounded-xl hover:bg-charcoal/5 transition-all"
            title="Back to portal selector"
          >
            <ArrowLeft className="w-4 h-4 text-charcoal" />
          </button>
          <div>
            <h3 className="font-syne text-xs uppercase font-extrabold text-charcoal">Marketplace Browser</h3>
            <p className="text-[10px] text-charcoal/50 font-semibold uppercase">Consumer View Perspective</p>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search 35+ premium items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-charcoal/10 rounded-xl bg-cream text-xs text-charcoal font-semibold focus:outline-none focus:border-charcoal transition-all"
          />
        </div>
      </div>

      {/* Personalized Greeting Status Bar */}
      {customerDetails && (
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white border border-charcoal/10 px-5 py-3.5 rounded-2xl shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow/15 border border-yellow/30 text-yellow-dark flex items-center justify-center font-bold text-sm">
              {customerDetails.firstName[0]}
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal">
                Welcome, {customerDetails.firstName} {customerDetails.lastName}
              </div>
              <div className="text-[9px] font-semibold text-charcoal/50 uppercase tracking-wider">
                Active Client Session
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center text-[10px] font-semibold text-charcoal/70">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-cream-dark/30 rounded-lg">
              <span className="text-charcoal/45 uppercase text-[8px] font-bold">Delivery to:</span>
              <span className="text-charcoal font-bold">{customerDetails.deliveryCity}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow/10 border border-yellow/20 rounded-lg text-yellow-dark font-bold">
              <span className="uppercase text-[8px]">Status:</span>
              <span>{customerDetails.customerType} Member</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-cream-dark/30 rounded-lg">
              <span className="text-charcoal/45 uppercase text-[8px] font-bold">Payment:</span>
              <span className="text-charcoal font-bold">{customerDetails.preferredPayment}</span>
            </div>
          </div>
        </div>
      )}

      {/* Storefront Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-3 bg-cream border border-charcoal/10 rounded-2xl p-5 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <h4 className="font-syne text-[10px] uppercase font-bold text-charcoal flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Catalog Filters</span>
            </h4>
            <span className="text-[9px] font-mono text-charcoal/40 font-bold">{filteredProducts.length} items</span>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[9px] font-syne uppercase text-charcoal/45 font-bold block">Category</label>
            <div className="flex flex-col gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs font-semibold px-2 py-1 rounded-lg transition-all ${
                    selectedCategory === cat 
                      ? "bg-charcoal text-cream font-bold" 
                      : "text-charcoal/70 hover:bg-charcoal/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-charcoal/10" />

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-[9px] font-syne uppercase text-charcoal/45 font-bold block">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 border border-charcoal/10 rounded-lg bg-cream text-xs font-semibold text-charcoal focus:outline-none"
            >
              {brands.map(br => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
          </div>

          <hr className="border-charcoal/10" />

          {/* Max Price Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] font-syne uppercase text-charcoal/45 font-bold">
              <span>Max Price</span>
              <span className="font-mono font-bold text-charcoal">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-charcoal cursor-pointer"
            />
          </div>

          <hr className="border-charcoal/10" />

          {/* Availability Filter */}
          <div className="space-y-2">
            <label className="text-[9px] font-syne uppercase text-charcoal/45 font-bold block">Stock Status</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full p-2 border border-charcoal/10 rounded-lg bg-cream text-xs font-semibold text-charcoal focus:outline-none"
            >
              {availabilities.map(av => (
                <option key={av} value={av}>{av}</option>
              ))}
            </select>
          </div>

          {/* Aicoo Permissions Demo Widget */}
          <hr className="border-charcoal/10" />
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-yellow-dark">
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5]" />
              <span className="text-[10px] font-syne uppercase font-bold text-charcoal">Aicoo Permissions</span>
            </div>
            
            <p className="text-[9.5px] text-charcoal/60 leading-relaxed font-semibold">
              Your identity scope is securely isolated. You can only access client-facing endpoints; private supply chain databases remain locked.
            </p>
            
            <div className="space-y-2.5 pt-1 text-[9px] font-semibold uppercase">
              {/* Permitted items */}
              <div className="space-y-1.5">
                <span className="text-[8px] text-green-700 font-bold tracking-wider block">✓ Permitted Scope</span>
                <div className="grid grid-cols-2 gap-1.5 text-[8px] text-charcoal/70">
                  <div className="flex items-center justify-center bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                    <span>Products</span>
                  </div>
                  <div className="flex items-center justify-center bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                    <span>Orders</span>
                  </div>
                  <div className="flex items-center justify-center bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                    <span>Delivery</span>
                  </div>
                  <div className="flex items-center justify-center bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200">
                    <span>Support</span>
                  </div>
                </div>
              </div>

              {/* Forbidden items */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[8px] text-red-700 font-bold tracking-wider block">✗ Isolated Context</span>
                <div className="grid grid-cols-2 gap-1.5 text-[8px] text-charcoal/40">
                  <div className="flex items-center justify-center bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                    <span>Supplier Stock</span>
                  </div>
                  <div className="flex items-center justify-center bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                    <span>Other Sellers</span>
                  </div>
                  <div className="flex items-center justify-center bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                    <span>Finance Logs</span>
                  </div>
                  <div className="flex items-center justify-center bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">
                    <span>Insurance Data</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid Section */}
        <div className="lg:col-span-9 space-y-4">
          {/* Sorting and Summary */}
          <div className="flex justify-between items-center text-xs font-semibold text-charcoal/60">
            <span>Showing {filteredProducts.length} results</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-bold text-charcoal/40 font-syne">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 border border-charcoal/10 rounded-lg bg-cream text-xs font-semibold text-charcoal focus:outline-none focus:border-charcoal"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center border border-charcoal/10 border-dashed rounded-2xl bg-cream space-y-2">
              <Package className="w-10 h-10 text-charcoal/20 mx-auto" />
              <p className="text-xs text-charcoal/50 font-bold uppercase">No matching products found</p>
              <p className="text-[10px] text-charcoal/40 font-semibold">Try adjusting category selections or price filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map(prod => {
                const theme = getAvailabilityTheme(prod.availability);
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleOpenProduct(prod)}
                    className="bg-cream border border-charcoal/10 hover:border-charcoal/20 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md cursor-pointer transition-all duration-200 group"
                  >
                    <div className="space-y-3">
                      {/* CSS-rendered placeholder image container */}
                      <div className="aspect-square bg-cream-dark/25 border border-charcoal/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                        <span className="text-[9px] font-mono text-charcoal/45 bg-cream/70 border border-charcoal/10 px-2 py-0.5 rounded absolute top-2 left-2 font-bold uppercase z-10">
                          {prod.brand}
                        </span>
                        {customerDetails && (prod.id === "sony-xm6" || prod.id === "macbook-pro-16") && (
                          <span className="text-[8px] font-syne font-extrabold uppercase bg-yellow border border-yellow-dark text-charcoal px-2 py-0.5 rounded absolute top-2 right-2 z-10 animate-pulse">
                            Ref: {customerDetails.firstName}
                          </span>
                        )}
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Title & Stats */}
                      <div className="space-y-1">
                        <h4 className="font-syne text-xs font-extrabold uppercase text-charcoal tracking-wide line-clamp-2 min-h-[32px]">
                          {prod.name}
                        </h4>
                        
                        <div className="flex items-center justify-between text-[10px] font-semibold">
                          <span className="font-mono font-bold text-charcoal">${prod.price.toFixed(2)}</span>
                          <span className="text-yellow-dark flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{prod.rating}</span>
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-charcoal/60 line-clamp-2 leading-relaxed font-semibold">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-charcoal/5 mt-4 flex items-center justify-between gap-2 flex-wrap">
                      <span className={`text-[8px] font-syne font-extrabold uppercase px-2 py-0.5 rounded border ${theme.bg} ${theme.text} ${theme.border}`}>
                        {prod.availability}
                      </span>
                      <span className="text-[8px] font-bold text-charcoal/40 uppercase truncate max-w-[120px]">
                        Seller: {prod.seller}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal Dialog */}
      {selectedProduct && (
        <div className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-cream border border-charcoal/15 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 border border-charcoal/10 rounded-full hover:bg-charcoal/5 text-charcoal transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Product Preview container */}
              <div className="md:col-span-5 flex items-center justify-center bg-cream-dark/20 border border-charcoal/5 rounded-2xl aspect-square overflow-hidden">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Meta */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-[8px] font-mono text-charcoal/45 bg-charcoal/5 px-2 py-0.5 rounded font-bold uppercase">
                    {selectedProduct.brand} • {selectedProduct.category}
                  </span>
                  <h2 className="font-syne text-sm md:text-base font-extrabold uppercase text-charcoal leading-snug mt-1.5">
                    {selectedProduct.name}
                  </h2>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-syne text-xl font-extrabold text-charcoal">${selectedProduct.price.toFixed(2)}</span>
                  <span className="text-[9px] text-yellow-dark font-extrabold flex items-center gap-0.5 border border-yellow/20 bg-yellow/5 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{selectedProduct.rating} / 5</span>
                  </span>
                </div>

                {/* Seller Warning Details */}
                <div className="space-y-1 text-[10px] font-semibold text-charcoal/70 bg-charcoal/5 p-3 rounded-xl border border-charcoal/5">
                  <div>Primary Seller: <strong className="text-charcoal">{selectedProduct.seller}</strong></div>
                  {selectedProduct.backupSeller && (
                    <div className="text-[9px] text-charcoal/50">
                      Backup Seller: <strong>{selectedProduct.backupSeller}</strong> (Failover enabled via Aicoo)
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pt-1 text-[9px] text-charcoal/45 font-bold uppercase">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Estimated Delivery: {selectedProduct.deliveryEstimate}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-charcoal/10" />

            {/* Description & Technical Specifications */}
            <div className="space-y-4 text-xs font-semibold text-charcoal">
              <div className="space-y-1">
                <h4 className="font-syne text-[9px] uppercase font-bold text-charcoal/45">Description</h4>
                <p className="text-charcoal/70 leading-relaxed font-semibold">{selectedProduct.description}</p>
              </div>

              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div className="space-y-1">
                  <h4 className="font-syne text-[9px] uppercase font-bold text-charcoal/45">Key Features</h4>
                  <ul className="list-disc pl-4 space-y-1 text-charcoal/70 font-semibold leading-relaxed">
                    {selectedProduct.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProduct.specs && (
                <div className="space-y-1">
                  <h4 className="font-syne text-[9px] uppercase font-bold text-charcoal/45">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 bg-charcoal/5 p-3 rounded-xl border border-charcoal/5 text-[10px]">
                    {Object.entries(selectedProduct.specs).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-charcoal/45 block">{key}:</span>
                        <span className="font-bold text-charcoal/80">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sourcing warning for Sony headphones */}
            {selectedProduct.id === "sony-xm6" && (
              <div className="bg-yellow/10 border border-yellow/20 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[9px] font-syne font-extrabold uppercase text-yellow-dark">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Aicoo Multi-Seller Failover Trigger Active</span>
                </div>
                <p className="text-[10px] text-charcoal/65 leading-relaxed font-semibold">
                  Alpha Sound Outlet has only <strong>1 unit left</strong>. Ordering <strong>{quantity} units</strong> will automatically trigger Aicoo's decentralized coordination protocol to secure the deficit from backup Supplier Beta.
                </p>
              </div>
            )}

            <hr className="border-charcoal/10" />

            {/* Quantity and Checkout */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-syne uppercase text-charcoal/45 font-bold">Quantity</span>
                <div className="flex items-center border border-charcoal/10 rounded-lg overflow-hidden bg-cream shadow-xs">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal text-sm font-bold border-r border-charcoal/10"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-charcoal font-syne font-bold text-xs">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal text-sm font-bold border-l border-charcoal/10"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full sm:w-auto px-10 py-3 bg-charcoal hover:bg-charcoal/90 text-cream rounded-xl font-syne font-extrabold uppercase text-[10px] tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 border border-charcoal"
              >
                <ShoppingCart className="w-4 h-4 text-yellow" />
                <span>Buy Now</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
