"use client";
import { useCompareStore } from "@/app/store/compareStore";
import { Button } from "../ui/button";
import { X, GitCompare } from "lucide-react";
import Link from "next/link";

export default function CompareBar() {
  const { ids, remove, clear } = useCompareStore();
  if (ids.length === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass bg-black text-white rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl border border-white/10">
      <div className="flex items-center gap-2"><GitCompare className="w-4 h-4" /><span className="text-sm font-medium">{ids.length} selected to compare</span></div>
      <div className="flex gap-2">
        {ids.map(id => <span key={id} className="w-7 h-7 rounded-full bg-white/20 grid place-items-center text-[10px] relative group">{id.slice(-3)}<button onClick={()=>remove(id)} className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black rounded-full grid place-items-center"><X className="w-3 h-3"/></button></span>)}
      </div>
      <Link href="/properties/compare"><Button variant="gold" size="sm" className="rounded-full">Compare Now</Button></Link>
      <button onClick={clear} className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20"><X className="w-4 h-4"/></button>
    </div>
  );
}
