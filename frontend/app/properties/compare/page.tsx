"use client";
import { useCompareStore } from "@/app/store/compareStore";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function ComparePage() {
  const { ids, clear } = useCompareStore();
  const [props, setProps] = useState<any[]>([]);

  useEffect(()=> {
    if(ids.length===0) return;
    // try backend, fallback mock
    api.post('/properties/compare', { ids }).then(r=>setProps(r.data)).catch(()=>setProps(mock.filter(m=>ids.includes(m._id))));
  }, [ids]);

  if(ids.length===0) return <div className="min-h-screen grid place-items-center bg-[#FAF7F2]"><div className="text-center"><p className="font-serif text-2xl">No properties selected</p><Link href="/feed" className="mt-4 inline-block underline">Go to feed</Link></div></div>;

  const fields = ['price','bedrooms','bathrooms','area','location.city','type'];

  return (
    <main className="min-h-screen bg-[#FAF7F2] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-8"><h1 className="font-serif text-4xl">Compare Properties</h1><Button variant="outline" onClick={clear}>Clear All</Button></div>
        <div className="grid md:grid-cols-3 gap-6">
          {props.map(p=>(
            <div key={p._id} className="bg-white rounded-[2rem] overflow-hidden border border-black/5">
              <img src={p.images?.[0]} className="h-[240px] w-full object-cover" alt="" />
              <div className="p-6">
                <h3 className="font-serif text-xl">{p.title}</h3>
                <p className="text-black/60 text-sm mt-1">{p.location?.city}</p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-black/50">Price</span><span className="font-medium">${p.price?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-black/50">Beds</span><span>{p.bedrooms}</span></div>
                  <div className="flex justify-between"><span className="text-black/50">Baths</span><span>{p.bathrooms}</span></div>
                  <div className="flex justify-between"><span className="text-black/50">Area</span><span>{p.area} sqft</span></div>
                  <div className="flex justify-between"><span className="text-black/50">Type</span><span className="capitalize">{p.type}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const mock = [
  { _id: '1', title: 'Seacliff Villa', price:8500000, bedrooms:5, bathrooms:6, area:6200, type:'villa', location:{ city:'Malibu' }, images:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'] },
  { _id: '2', title: 'Skyline Penthouse', price:6200000, bedrooms:3, bathrooms:4, area:3400, type:'apartment', location:{ city:'Manhattan' }, images:['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'] },
  { _id: '3', title: 'Desert Oasis', price:4500000, bedrooms:4, bathrooms:5, area:4800, type:'villa', location:{ city:'Dubai' }, images:['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'] },
];
