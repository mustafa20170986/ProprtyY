// app/dashboard/page.tsx
"use client";
import { useUser } from "@clerk/nextjs";
import StatsCards from "@/app/components/dashboard/StatsCards";
import RevenueChart from "@/app/components/dashboard/RevenueChart";
import PropertyTable from "@/app/components/dashboard/PropertyTable";
import { useEffect, useState, useRef } from "react";
import api from "@/app/lib/api";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import RoleApplicationForm from "@/app/components/forms/RoleApplicationForm";
import { applyForRole } from "@/app/lib/api";
import gsap from "gsap";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useUser();
  const [props, setProps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // ── header entrance ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // ── animate sections once data arrives ──
  useEffect(() => {
    if (!stats) return;
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
      gsap.fromTo(
        gridRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: "power3.out" },
      );
    }, pageRef);
    return () => ctx.revert();
  }, [stats]);

  // ── data fetch ──
  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, propertiesRes] = await Promise.all([
          api.get("/analytics/admin"),
          api.get("/properties"),
        ]);
        setStats(analyticsRes.data);
        setProps(propertiesRes.data.data || []);
        toast.success("Dashboard loaded");
      } catch {
        setStats({
          totalRevenue: 125000,
          avgCommission: 5.2,
          totalProperties: 12,
          totalInquiries: 34,
          monthlyData: [
            { month: "Jan", revenue: 12000, commission: 2000 },
            { month: "Feb", revenue: 19000, commission: 3000 },
            { month: "Mar", revenue: 15000, commission: 2500 },
            { month: "Apr", revenue: 25000, commission: 4000 },
            { month: "May", revenue: 22000, commission: 3500 },
            { month: "Jun", revenue: 30000, commission: 5000 },
          ],
        });
        setProps([
          {
            _id: "1",
            title: "Seacliff Villa",
            location: { city: "Malibu" },
            price: 8500000,
            status: "available",
            views: 234,
          },
          {
            _id: "2",
            title: "Skyline Penthouse",
            location: { city: "Manhattan" },
            price: 6200000,
            status: "pending",
            views: 412,
          },
        ]);
      }
    };
    load();
  }, []);

  // ── role application ──
  const handleRoleApply = async (data: any) => {
    try {
      await applyForRole({ ...data, userId: user?.id, email: data.email });
      toast.success("Application submitted! Admin will review shortly.");
    } catch {
      toast.error("Failed to submit application. Please try again.");
    }
  };

  return (
    <div
      ref={pageRef}
      className="space-y-6 sm:space-y-8 px-3 sm:px-4 md:px-6 lg:px-0 pb-10"
    >
      {/* ── Header ── */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
      >
        <div className="w-full sm:w-auto">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-tight">
            Welcome back, {user?.firstName || "User"}
          </h1>
          <p className="text-black/60 mt-1 sm:mt-2 text-sm sm:text-base">
            Here&apos;s what&apos;s happening with your estates today.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href="/dashboard/user" className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              className="rounded-full w-full sm:w-auto text-sm"
            >
              Profile
            </Button>
          </Link>
          <Link href="/feed" className="flex-1 sm:flex-none">
            <Button
              variant="luxe"
              className="rounded-full w-full sm:w-auto text-sm"
            >
              Browse Feed
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsCards stats={stats} />

      {/* ── Chart + Role Application ── */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 sm:gap-6 opacity-0"
      >
        <RevenueChart data={stats?.monthlyData} />
        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 border border-black/5">
          <h3 className="font-serif text-lg sm:text-xl">
            Apply for Agent / Agency
          </h3>
          <p className="text-xs sm:text-sm text-black/60 mt-2">
            Unlock advanced commission dashboard, team management.
          </p>
          <div className="mt-4 sm:mt-6">
            <RoleApplicationForm
              onSubmit={handleRoleApply}
              defaultEmail={user?.primaryEmailAddress?.emailAddress || ""}
            />
          </div>
        </div>
      </div>

      {/* ── Property Table ── */}
      <div ref={tableRef} className="opacity-0">
        <PropertyTable data={props} />
      </div>
    </div>
  );
}
