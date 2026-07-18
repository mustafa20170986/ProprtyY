"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, Heart, Layers2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Dynamically import the map to completely avoid Next.js server-side compilation crashes
const PropertyMap = dynamic(
  () => import("@/components/PropertyMap"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400 font-light">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-500">Initializing Spatial Systems...</span>
        </div>
      </div>
    )
  }
);

// High-end sample structural payload matching your Mongoose Schema
const SAMPLE_PROPERTIES = [
  {
    _id: "prop_1",
    title: "The Obsidian Penthouse",
    price: 4850000,
    address: "Downtown Skyway, Metro Delta",
    bedrooms: 3,
    bathrooms: 3.5,
    areaSqFt: 3400,
    propertyType: "penthouse",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600"],
    location: { coordinates: [-73.935242, 40.73061] } // [Lng, Lat]
  },
  {
    _id: "prop_2",
    title: "Glass Pavilion Villa",
    price: 8200000,
    address: "Aura Ridge, High Hills",
    bedrooms: 5,
    bathrooms: 6,
    areaSqFt: 6200,
    propertyType: "villa",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"],
    location: { coordinates: [-73.945242, 40.74061] }
  }
];

export default function PropertyFeed() {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [type, setType] = useState("all");

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
        
        {/* Left Side: Filter Panels & Property Cards Stream */}
        <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
          
          {/* Elite Search Bar & Filters */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search global assets by signature, street, address..."
                className="pl-11 pr-4 bg-slate-950 border-slate-800 text-white placeholder-slate-500 rounded-full h-11"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded-full px-3 outline-none focus:border-amber-500"
              >
                <option value="all">All Portfolios</option>
                <option value="penthouse">Penthouse</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
              </select>
              <Input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-10 text-xs bg-slate-950 border-slate-800 text-white rounded-full"
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-10 text-xs bg-slate-950 border-slate-800 text-white rounded-full"
              />
            </div>
          </div>

          {/* Core Properties Scroll Area */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {SAMPLE_PROPERTIES.map((property) => (
              <div 
                key={property._id} 
                className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:border-slate-800 transition-all group"
              >
                <div className="sm:w-48 h-40 relative bg-slate-800 overflow-hidden shrink-0">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-medium tracking-tight text-white line-clamp-1">{property.title}</h3>
                      <span className="text-sm font-semibold text-amber-500">${property.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{property.address}</p>
                    <div className="flex gap-4 text-xs text-slate-400 mt-4 font-light">
                      <span>{property.bedrooms} Beds</span>
                      <span>{property.bathrooms} Baths</span>
                      <span>{property.areaSqFt} Sq Ft</span>
                    </div>
                  </div>

                  {/* Operational Controls */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-900/60">
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-light text-slate-400 hover:text-white rounded-full gap-1">
                      <Layers2 className="w-3.5 h-3.5" /> Compare
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-light text-slate-400 hover:text-white rounded-full gap-1">
                      <Heart className="w-3.5 h-3.5" /> Save
                    </Button>
                    <Button className="h-8 text-xs font-medium bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full ml-auto px-4">
                      Book Tour
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Fixed Boundary Map Dashboard */}
        <div className="lg:col-span-5 h-full rounded-2xl overflow-hidden border border-slate-900 shadow-2xl relative">
          <PropertyMap items={SAMPLE_PROPERTIES} />
        </div>

      </div>
    </div>
  );
}
