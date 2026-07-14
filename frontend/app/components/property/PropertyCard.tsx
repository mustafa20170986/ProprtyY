"use client";
import { Heart, MapPin, Bed, Bath, Maximize2, GitCompare } from "lucide-react";
import { formatPrice } from "@/app/lib/utils";
import { useCompareStore } from "@/app/store/compareStore";
import Link from "next/link";

export default function PropertyCard({ property, onSave }: { property: any; onSave?: (id: string) => void }) {
  const { add, ids } = useCompareStore();
  const isComparing = ids.includes(property._id);

  return (
    <div className="group bg-white rounded-[1.8rem] overflow-hidden border border-black/5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-500">
      <div className="relative h-[280px] overflow-hidden">
        <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'} alt={property.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s]" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white rounded-full px-3 py-1 text-[11px] font-semibold tracking-widest uppercase shadow">{property.listingType}</span>
          {property.featured && <span className="bg-[#C5A880] text-black rounded-full px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">Featured</span>}
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => onSave?.(property._id)} className="w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white shadow">
            <Heart className="w-4 h-4" />
          </button>
          <button onClick={() => add(property._id)} className={`w-9 h-9 rounded-full grid place-items-center shadow backdrop-blur transition ${isComparing ? 'bg-black text-white' : 'bg-white/90 hover:bg-white'}`}>
            <GitCompare className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <Link href={`/properties/${property._id}`} className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-serif text-xl leading-tight line-clamp-1">{property.title}</h3>
          <p className="text-white/70 text-xs flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{property.location?.city}, {property.location?.country || 'USA'}</p>
        </Link>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-serif font-medium">{formatPrice(property.price)}</p>
          {property.pricePerSqft && <span className="text-xs text-black/50">${property.pricePerSqft}/sqft</span>}
        </div>
        <div className="mt-4 flex gap-4 text-sm text-black/60 border-t border-black/5 pt-4">
          <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" />{property.area} sqft</span>
        </div>
      </div>
    </div>
  );
}
