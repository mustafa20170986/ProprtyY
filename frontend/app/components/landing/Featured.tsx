"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const props = [
  { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800", title: "Oceanfront Villa", price: "$12.5M", loc: "Beverly Hills" },
  { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800", title: "Sky Penthouse", price: "$8.2M", loc: "Manhattan" },
  { img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800", title: "Modern Estate", price: "$6.9M", loc: "Dubai" },
];

export default function Featured() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".feat-card", { y: 80, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" }
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="font-serif text-5xl md:text-7xl tracking-tight leading-[0.9]">Featured<br/><span className="italic font-light text-[#C5A880]">Estates</span></h2>
        <p className="hidden md:block max-w-[320px] text-black/60">Handpicked by our curation team. Each property verified, photographed by top artists.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {props.map((p, i) => (
          <div key={i} className="feat-card group">
            <div className="relative h-[520px] rounded-[2rem] overflow-hidden">
              <img src={p.img} className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-[1.5s]" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-white/70 text-xs tracking-widest uppercase">{p.loc}</p>
                <div className="flex justify-between items-end mt-2"><h3 className="font-serif text-2xl">{p.title}</h3><span className="font-medium">{p.price}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
