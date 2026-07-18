// app/components/dashboard/StatsCards.tsx
"use client";
import { Wallet, TrendingUp, Home, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StatsCards({ stats }: { stats: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 125000).toLocaleString()}`,
      icon: Wallet,
      trend: "+12%",
    },
    {
      label: "Avg Commission",
      value: `${stats?.avgCommission || 5.2}%`,
      icon: TrendingUp,
      trend: "+0.8%",
    },
    {
      label: "Properties",
      value: stats?.totalProperties || 18,
      icon: Home,
      trend: "+3",
    },
    {
      label: "Inquiries",
      value: stats?.totalInquiries || 42,
      icon: Users,
      trend: "+7",
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.4)",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [stats]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {cards.map((c, i) => (
        <div
          key={i}
          className="stat-card bg-white rounded-2xl sm:rounded-[1.8rem] p-4 sm:p-5 lg:p-6 border border-black/5 hover:shadow-lg transition-shadow opacity-0"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black text-white grid place-items-center shrink-0">
              <c.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-xs bg-[#C5A880]/20 text-[#8A6D4A] rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 whitespace-nowrap">
              {c.trend}
            </span>
          </div>
          <p className="mt-3 sm:mt-6 text-[10px] sm:text-sm text-black/50 tracking-widest uppercase leading-tight">
            {c.label}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-serif mt-1 truncate">
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
