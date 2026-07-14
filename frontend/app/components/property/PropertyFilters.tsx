"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, SlidersHorizontal, Map, X } from "lucide-react";

export default function PropertyFilters({ onSearch }: { onSearch: (filters: any) => void }) {
  const [filters, setFilters] = useState({ search: '', city: '', minPrice: '', maxPrice: '', type: '', bedrooms: '' });
  const [showAdv, setShowAdv] = useState(false);

  const apply = () => onSearch(filters);
  const clear = () => { const empty = { search: '', city: '', minPrice: '', maxPrice: '', type: '', bedrooms: '' }; setFilters(empty); onSearch(empty); };

  return (
    <div className="glass rounded-[2rem] p-6 border border-black/5 shadow-sm sticky top-24 z-20 bg-white/80 backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" />
          <Input placeholder="Search by title, address, luxury villa..." className="pl-12 h-12 rounded-full bg-[#FAF7F2] border-black/5" value={filters.search} onChange={e=>setFilters({...filters, search:e.target.value})} />
        </div>
        <Input placeholder="City (e.g. Dubai)" className="lg:w-[180px] bg-[#FAF7F2]" value={filters.city} onChange={e=>setFilters({...filters, city:e.target.value})} />
        <Button onClick={apply} variant="luxe" className="rounded-full h-12 px-8">Search</Button>
        <Button variant="ghost" onClick={()=>setShowAdv(!showAdv)} className="rounded-full"><SlidersHorizontal className="w-4 h-4 mr-2" />Filters</Button>
      </div>
      {showAdv && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4 pt-6 border-t border-black/5 animate-fade-in">
          <select className="h-12 rounded-full bg-[#FAF7F2] border border-black/5 px-4 text-sm" value={filters.type} onChange={e=>setFilters({...filters, type:e.target.value})}>
            <option value="">All Types</option><option value="villa">Villa</option><option value="apartment">Apartment</option><option value="house">House</option><option value="commercial">Commercial</option>
          </select>
          <Input placeholder="Min Price" type="number" value={filters.minPrice} onChange={e=>setFilters({...filters, minPrice:e.target.value})} className="bg-[#FAF7F2]" />
          <Input placeholder="Max Price" type="number" value={filters.maxPrice} onChange={e=>setFilters({...filters, maxPrice:e.target.value})} className="bg-[#FAF7F2]" />
          <select className="h-12 rounded-full bg-[#FAF7F2] border border-black/5 px-4 text-sm" value={filters.bedrooms} onChange={e=>setFilters({...filters, bedrooms:e.target.value})}>
            <option value="">Beds</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option>
          </select>
          <Button variant="outline" onClick={clear} className="rounded-full"><X className="w-4 h-4 mr-2" />Clear</Button>
        </div>
      )}
    </div>
  );
}
