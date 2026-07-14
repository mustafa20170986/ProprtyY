"use client";
import { useEffect, useState } from "react";
import { fetchProperty, createInquiry } from "@/app/lib/api";
import { Button } from "@/app/components/ui/button";
import { MapPin, Bed, Bath, Maximize2, Heart, Share2, Calendar, Mail } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const [property, setProperty] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(()=> {
    const id = params.id as string;
    fetchProperty(id).then(setProperty).catch(()=> setProperty(mock));
  }, [params.id]);

  const handleAction = async (type: 'interested' | 'tour') => {
    if(!user || !property) return alert('Please sign in');
    try {
      await createInquiry({
        propertyId: property._id,
        buyerId: property.owner?._id || 'mock-buyer',
        sellerId: property.owner?._id || 'mock-owner',
        type,
        email: user.primaryEmailAddress?.emailAddress,
        phone: '',
        message: type==='interested' ? 'I am interested' : 'I want to book a tour',
      });
      alert(`${type} sent! Owner will contact you via email: ${user.primaryEmailAddress?.emailAddress}`);
    } catch (e) { alert('Inquiry saved (mock)'); }
  };

  if(!property) return <div className="min-h-screen grid place-items-center"><div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-black/5 px-4 md:px-8 h-[64px] flex items-center justify-between">
        <Link href="/feed" className="font-serif text-xl">PropertyX</Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon"><Heart className="w-5 h-5"/></Button>
          <Button variant="ghost" size="icon"><Share2 className="w-5 h-5"/></Button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="space-y-6">
          <div className="relative h-[520px] rounded-[2.5rem] overflow-hidden">
            <img src={property.images?.[activeImg] || property.images?.[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 flex gap-2">
              {property.images?.slice(0,4).map((img:string,i:number)=>(
                <button key={i} onClick={()=>setActiveImg(i)} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 ${activeImg===i?'border-white':'border-white/30'}`}><img src={img} className="w-full h-full object-cover" /></button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-start">
              <div><h1 className="font-serif text-4xl leading-tight">{property.title}</h1><p className="flex items-center gap-2 text-black/60 mt-2"><MapPin className="w-4 h-4"/>{property.location?.address}, {property.location?.city}</p></div>
              <p className="text-3xl font-serif">${property.price?.toLocaleString()}</p>
            </div>
            <div className="flex gap-6 mt-6 py-6 border-y border-black/5">
              <span className="flex gap-2 items-center"><Bed className="w-5 h-5"/> {property.bedrooms} Beds</span>
              <span className="flex gap-2 items-center"><Bath className="w-5 h-5"/> {property.bathrooms} Baths</span>
              <span className="flex gap-2 items-center"><Maximize2 className="w-5 h-5"/> {property.area} sqft</span>
            </div>
            <p className="mt-6 leading-relaxed text-black/70">{property.description || mock.description}</p>
            <div className="mt-8 flex flex-wrap gap-2">{(property.amenities || ['Pool','Gym','Garden','Garage']).map((a:string)=><span key={a} className="px-4 py-2 rounded-full bg-white border border-black/5 text-sm">{a}</span>)}</div>
          </div>
        </div>

        {/* Sidebar inquiry */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-black/5 sticky top-24">
            <h3 className="font-serif text-2xl">Interested in this property?</h3>
            <p className="text-sm text-black/60 mt-2">Contact owner directly. Your email & phone will be shared.</p>
            <div className="mt-6 space-y-3">
              <Button onClick={()=>handleAction('interested')} variant="luxe" className="w-full h-12 rounded-full">I'm Interested</Button>
              <Button onClick={()=>handleAction('tour')} variant="outline" className="w-full h-12 rounded-full"><Calendar className="w-4 h-4 mr-2"/>Book a Tour</Button>
            </div>
            <div className="mt-8 pt-6 border-t border-black/5">
              <p className="text-xs uppercase tracking-widest text-black/40">Listed by</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-12 h-12 rounded-full bg-black text-white grid place-items-center font-serif">JD</div>
                <div><p className="font-medium">{property.owner?.name || 'John Doe - Seller'}</p><a href={`mailto:${property.owner?.email || 'owner@propertyx.com'}`} className="text-sm text-black/60 hover:text-black flex items-center gap-1"><Mail className="w-3 h-3"/>{property.owner?.email || 'owner@propertyx.com'}</a></div>
              </div>
            </div>
          </div>

          {/* Map mini */}
          <div className="bg-white rounded-[2rem] p-4 border border-black/5 h-[240px] overflow-hidden">
            <img src={`https://maps.googleapis.com/maps/api/staticmap?center=${property.coordinates?.lat || 25.2048},${property.coordinates?.lng || 55.2708}&zoom=13&size=600x300&markers=color:black|${property.coordinates?.lat || 25.2048},${property.coordinates?.lng || 55.2708}&key=demo`} alt="map" className="w-full h-full object-cover rounded-[1.2rem]" onError={(e)=> (e.currentTarget.src='https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600')} />
          </div>
        </div>
      </div>
    </main>
  );
}

const mock = {
  _id: '1', title: 'Seacliff Modern Villa with Private Beach', price: 8500000, bedrooms:5, bathrooms:6, area:6200,
  location:{ address:'123 Ocean Dr', city:'Malibu', country:'USA' }, coordinates:{ lat:34.0259, lng:-118.7798 },
  images:['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c','https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
  description: 'A breathtaking modern villa perched above the Pacific. Floor-to-ceiling glass, infinity pool, private beach access. Designed by award-winning architects. Smart home, wine cellar, 5 en-suite bedrooms.',
  amenities:['Pool','Beach Access','Smart Home','Gym','Cinema'], owner:{ name:'James Agent', email:'james@propertyx.com' }
};
