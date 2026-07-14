"use client";
import { useState } from "react";
import StatsCards from "@/app/components/dashboard/StatsCards";
import RevenueChart from "@/app/components/dashboard/RevenueChart";
import PropertyTable from "@/app/components/dashboard/PropertyTable";
import { Button } from "@/app/components/ui/button";
import { Users, Building2, MailPlus } from "lucide-react";

export default function AgencyDashboard() {
  const [stats] = useState({ totalRevenue: 542000, avgCommission: 7.4, totalProperties: 68, totalInquiries: 142, monthlyData: [{ month: 'Jan', revenue: 45000, commission: 8000 }, { month: 'Feb', revenue: 62000, commission: 11000 }, { month: 'Mar', revenue: 58000, commission: 9500 }, { month: 'Apr', revenue: 78000, commission: 14000 }, { month: 'May', revenue: 85000, commission: 15500 }, { month: 'Jun', revenue: 102000, commission: 19000 }] });
  const [team] = useState([{ name: 'Sarah Agent', revenue: 120000, email: 'sarah@agency.com' }, { name: 'Mike Closer', revenue: 95000, email: 'mike@agency.com' }]);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-black to-[#2A2118] text-white rounded-[2rem] p-8 flex flex-col md:flex-row justify-between gap-6">
        <div><h1 className="font-serif text-4xl">Agency Command Center</h1><p className="text-white/60 mt-2 max-w-[500px]">Manage team, track combined revenue, handle enterprise clients. Identical to agent plus team controls.</p>
        <div className="mt-4 flex gap-3"><Button variant="gold" size="sm" className="rounded-full"><Building2 className="w-4 h-4 mr-2"/>Elite Agency</Button><a href="mailto:agency@propertyx.com"><Button variant="outline" size="sm" className="!border-white/20 !text-white rounded-full"><MailPlus className="w-4 h-4 mr-2"/>agency@propertyx.com</Button></a></div>
        </div>
        <div className="glass !bg-white/10 rounded-[1.5rem] p-6 min-w-[260px]">
          <p className="text-sm text-white/60 uppercase tracking-widest">Team Performance</p>
          <div className="mt-4 space-y-3">{team.map(m=><div key={m.name} className="flex justify-between text-sm"><span>{m.name}</span><span className="text-[#C5A880]">${(m.revenue/1000).toFixed(0)}k</span></div>)}</div>
        </div>
      </div>

      <StatsCards stats={stats} />
      <RevenueChart data={stats.monthlyData} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><PropertyTable data={[{ _id:'1', title:'Burj View Tower - Bulk', location:{ city:'Dubai' }, price: 25000000, status:'available', views: 892 }, { _id:'2', title:'Agency Portfolio Villa', location:{ city:'London' }, price: 12000000, status:'available', views: 432 }]} /></div>
        <div className="bg-white rounded-[2rem] p-6 border border-black/5 h-fit">
          <h3 className="font-serif text-xl flex items-center gap-2"><Users className="w-5 h-5"/>Team Agents</h3>
          <div className="mt-6 space-y-4">
            {team.map(member=>(
              <div key={member.email} className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-black/5">
                <div><p className="font-medium text-sm">{member.name}</p><a href={`mailto:${member.email}`} className="text-xs text-black/60 hover:underline">{member.email}</a></div>
                <span className="text-xs bg-black text-white rounded-full px-3 py-1">${(member.revenue/1000).toFixed(0)}k rev</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 rounded-full">+ Invite Agent</Button>
        </div>
      </div>
    </div>
  );
}
