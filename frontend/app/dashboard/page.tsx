"use client";
import { useUser } from "@clerk/nextjs";
import StatsCards from "@/app/components/dashboard/StatsCards";
import RevenueChart from "@/app/components/dashboard/RevenueChart";
import PropertyTable from "@/app/components/dashboard/PropertyTable";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import RoleApplicationForm from "@/app/components/forms/RoleApplicationForm";
import { applyForRole } from "@/app/lib/api";

export default function DashboardPage() {
  const { user } = useUser();
  const [props, setProps] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(()=> {
    const load = async () => {
      try {
        const res = await api.get('/analytics/admin');
        setStats(res.data);
        const p = await api.get('/properties');
        setProps(p.data.data || []);
      } catch {
        setStats({ totalRevenue: 125000, avgCommission: 5.2, totalProperties: 12, totalInquiries: 34, monthlyData: [{ month: 'Jan', revenue: 12000, commission: 2000 }, { month: 'Feb', revenue: 19000, commission: 3000 }, { month: 'Mar', revenue: 15000, commission: 2500 }, { month: 'Apr', revenue: 25000, commission: 4000 }, { month: 'May', revenue: 22000, commission: 3500 }, { month: 'Jun', revenue: 30000, commission: 5000 }] });
        setProps([
          { _id: '1', title: 'Seacliff Villa', location: { city: 'Malibu' }, price: 8500000, status: 'available', views: 234 },
          { _id: '2', title: 'Skyline Penthouse', location: { city: 'Manhattan' }, price: 6200000, status: 'pending', views: 412 },
        ]);
      }
    };
    load();
  }, []);

  const handleRoleApply = async (data:any) => {
    try {
      await applyForRole({ ...data, userId: user?.id, email: data.email });
      alert('Application submitted! Admin will review.');
    } catch { alert('Application submitted (mock)'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div><h1 className="font-serif text-4xl">Welcome back, {user?.firstName || 'User'}</h1><p className="text-black/60 mt-2">Here's what's happening with your estates today.</p></div>
        <div className="flex gap-2"><Link href="/dashboard/user"><Button variant="outline" className="rounded-full">Profile</Button></Link><Link href="/feed"><Button variant="luxe" className="rounded-full">Browse Feed</Button></Link></div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <RevenueChart data={stats?.monthlyData} />
        <div className="bg-white rounded-[2rem] p-8 border border-black/5">
          <h3 className="font-serif text-xl">Apply for Agent / Agency</h3>
          <p className="text-sm text-black/60 mt-2">Unlock advanced commission dashboard, team management.</p>
          <div className="mt-6">
            <RoleApplicationForm onSubmit={handleRoleApply} defaultEmail={user?.primaryEmailAddress?.emailAddress || ''} />
          </div>
        </div>
      </div>

      <PropertyTable data={props} />
    </div>
  );
}
