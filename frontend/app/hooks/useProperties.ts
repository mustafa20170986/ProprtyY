"use client";
import { useEffect, useState } from "react";
import { fetchProperties } from "@/app/lib/api";

export function useProperties(filters:any={}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    setLoading(true);
    fetchProperties(filters).then(r=>setData(r.data||r)).catch(()=>{}).finally(()=>setLoading(false));
  }, [JSON.stringify(filters)]);

  return { data, loading };
}
