"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";
import { ArrowUpRight, Play } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { isSignedIn } = useAuth();

  const handleAction = () => {
    try {
      if (isSignedIn) {
        router.push("/dashboard");
      } else {
        router.push("/sign-in");
      }
    } catch {
      router.push("/sign-in");
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title stagger
      gsap.fromTo(
        ".hero-line",
        { y: 120, opacity: 0, skewY: 5 },
        {
          y: 0,
          opacity: 1,
          skewY: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.2,
        },
      );

      gsap.fromTo(
        ".hero-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 },
      );

      gsap.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 1,
        },
      );

      // Parallax image cards
      gsap.utils.toArray(".parallax-img").forEach((img: any, i) => {
        gsap.to(img, {
          yPercent: i % 2 === 0 ? -20 : -35,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      // Floating animation
      gsap.to(".float-1", {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".float-2", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.3,
      });
      gsap.to(".float-3", {
        y: -12,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.6,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[110vh] luxury-gradient overflow-hidden px-4 md:px-8 pt-8 pb-20"
    >
      {/* Background gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#C5A880]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Text */}
        <div ref={titleRef} className="text-white space-y-8">
          <div className="inline-flex items-center gap-2 glass !bg-white/10 rounded-full px-4 py-2 text-xs tracking-widest uppercase hero-sub">
            <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
            No.1 Luxury Real Estate Platform 2025
          </div>

          <div className="overflow-hidden">
            <h1 className="font-serif text-[12vw] lg:text-[6.5vw] leading-[0.85] tracking-[-0.04em] font-light">
              <span className="hero-line block">Find Your</span>
              <span className="hero-line block font-medium italic text-[#C5A880]">
                Dream
              </span>
              <span className="hero-line block">Estate with</span>
              <span className="hero-line block">PropertyX</span>
            </h1>
          </div>

          <p className="hero-sub max-w-[480px] text-white/60 text-[17px] leading-relaxed">
            Curated collection of 12,000+ luxury villas, penthouses and estates
            across 40 countries. Verified agents, instant tours, secure
            transactions.
          </p>

          <div className="flex flex-wrap gap-4 hero-cta">
            <div onClick={handleAction}>
              <Button size="lg" variant="gold" className="group">
                Get Started{" "}
                <ArrowUpRight className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform" />
              </Button>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="!border-white/20 !text-white hover:!bg-white hover:!text-black"
            >
              <Play className="mr-2 w-4 h-4" /> Watch Showreel
            </Button>
          </div>

          <div className="hero-cta grid grid-cols-3 gap-8 pt-8 border-t border-white/10 max-w-[420px]">
            <div>
              <p className="text-3xl font-serif">12k+</p>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                Properties
              </p>
            </div>
            <div>
              <p className="text-3xl font-serif">340+</p>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                Agencies
              </p>
            </div>
            <div>
              <p className="text-3xl font-serif">98%</p>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-1">
                Satisfaction
              </p>
            </div>
          </div>
        </div>

        {/* Right - Animated Image Stack */}
        <div ref={imagesRef} className="relative h-[700px] lg:h-[820px] w-full">
          {/* Main large card */}
          <div className="parallax-img float-1 absolute left-[5%] top-[5%] w-[62%] h-[68%] rounded-[2.5rem] overflow-hidden shadow-2xl rotate-[-3deg] z-10">
            <img
              src={images[0]}
              alt="Luxury"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 glass !bg-white/90 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="font-serif font-medium">Seacliff Villa</p>
                <p className="text-xs text-black/60">Malibu • $8.5M</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-black text-white grid place-items-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="parallax-img float-2 absolute right-[0%] top-[12%] w-[48%] h-[38%] rounded-[2rem] overflow-hidden shadow-xl rotate-[4deg] z-20">
            <img
              src={images[1]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="parallax-img float-3 absolute left-[0%] bottom-[0%] w-[50%] h-[34%] rounded-[2rem] overflow-hidden shadow-xl rotate-[2deg]">
            <img
              src={images[2]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="parallax-img absolute right-[8%] bottom-[8%] w-[44%] h-[42%] rounded-[2rem] overflow-hidden shadow-2xl rotate-[-2deg] z-30 border-[6px] border-white">
            <img
              src={images[3]}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-[11px] font-semibold tracking-widest">
              FEATURED
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#C5A880] text-black grid place-items-center font-serif text-center leading-tight text-sm font-medium rotate-[-12deg] shadow-2xl z-30 hero-cta">
            <span>
              Trusted by
              <br />
              2M+ Users
            </span>
          </div>
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 py-4 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap text-white/30 text-xs tracking-[0.3em] uppercase">
          <span>
            ★ MANHATTAN ★ DUBAI ★ LONDON ★ BALI ★ MALIBU ★ SANTORINI ★ ASPEN ★
          </span>
          <span>
            ★ MANHATTAN ★ DUBAI ★ LONDON ★ BALI ★ MALIBU ★ SANTORINI ★ ASPEN ★
          </span>
        </div>
      </div>
    </section>
  );
}
