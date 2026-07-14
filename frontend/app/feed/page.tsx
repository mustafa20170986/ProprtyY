"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchProperties, saveToggle } from "@/app/lib/api";
import PropertyCard from "@/app/components/property/PropertyCard";
import PropertyFilters from "@/app/components/property/PropertyFilters";
import MapView from "@/app/components/property/MapView";
import CompareBar from "@/app/components/property/CompareBar";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Building2, LayoutDashboard } from "lucide-react";

export default function FeedPage() {
  const { user } = useUser();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const load = async (filters:any={}) => {
    setLoading(true);
    try {
      const res = await fetchProperties(filters);
      setProperties(res.data || res || []);
    } catch (e) {
      // fallback mock data for demo
      setProperties(mockProps);
    }
    setLoading(false);
  };

  useEffect(()=>{ load(); }, []);

  const handleSave = async (id:string) => {
    if(!user) return;
    try { await saveToggle(user.id, id); } catch {}
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-[72px] flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2"><div className="w-9 h-9 rounded-full bg-black text-white grid place-items-center font-serif font-bold">P</div><span className="font-serif text-xl">PropertyX</span></Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={()=>setShowMap(!showMap)}>{showMap ? "List View" : "Map View"}</Button>
            <Link href="/dashboard"><Button variant="outline" size="sm"><LayoutDashboard className="w-4 h-4 mr-2" />Dashboard</Button></Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8">
        <div className="flex justify-between items-end">
          <div><h1 className="font-serif text-4xl md:text-5xl leading-[0.9]">Discover<br/>your next <span className="italic text-[#C5A880]">investment</span></h1><p className="text-black/60 mt-3 max-w-[500px]">Advanced filters, live map, verified owners. Save, compare, and book tours instantly.</p></div>
          <p className="hidden md:block text-sm text-black/40">{properties.length} properties found</p>
        </div>

        <PropertyFilters onSearch={load} />

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8">
          <div>
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">{[...Array(6)].map((_,i)=><div key={i} className="h-[360px] bg-white rounded-[1.8rem] animate-pulse border border-black/5" />)}</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {properties.map(p=><PropertyCard key={p._id || p.id} property={p} onSave={handleSave} />)}
              </div>
            )}
          </div>
          <div className={`${showMap ? 'block' : 'hidden lg:block'}`}>
            <MapView properties={properties} />
          </div>
        </div>
      </div>

      <CompareBar />
    </main>
  );
}

const mockProps = [
  { _id: '1', title: 'Seacliff Modern Villa', price: 8500000, bedrooms: 5, bathrooms: 6, area: 6200, location: { city: 'Malibu', country: 'USA' }, coordinates: { lat: 34.0259, lng: -118.7798 }, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'], listingType: 'sale', featured: true, status: 'available', views: 234 },
  { _id: '2', title: 'Skyline Penthouse', price: 6200000, bedrooms: 3, bathrooms: 4, area: 3400, location: { city: 'Manhattan', country: 'USA' }, coordinates: { lat: 40.758, lng: -73.9855 }, images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'], listingType: 'sale', status: 'available', views: 412 },
  { _id: '3', title: 'Desert Oasis Estate', price: 4500000, bedrooms: 4, bathrooms: 5, area: 4800, location: { city: 'Dubai', country: 'UAE' }, coordinates: { lat: 25.2048, lng: 55.2708 }, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'], listingType: 'sale', status: 'available', views: 189 },
  { _id: '4', title: 'Forest Retreat Cabin', price: 1200000, bedrooms: 3, bathrooms: 2, area: 2100, location: { city: 'Aspen', country: 'USA' }, coordinates: { lat: 39.1911, lng: -106.8175 }, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'], listingType: 'sale', status: 'available', views: 98 },
  { _id: '5', title: 'Beachfront Apartment', price: 3200000, bedrooms: 2, bathrooms: 3, area: 1800, location: { city: 'Bali', country: 'Indonesia' }, coordinates: { lat: -8.6508, lng: 115.1553 }, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'], listingType: 'rent', status: 'available', views: 342 },
  { _id: '6', title: 'Historic Townhouse', price: 2800000, bedrooms: 4, bathrooms: 3, area: 2900, location: { city: 'London', country: 'UK' }, coordinates: { lat: 51.5072, lng: -0.1276 }, images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'], listingType: 'sale', status: 'available', views: 156 },
];
