import { Wallet, TrendingUp, Home, Users, DollarSign } from "lucide-react";

export default function StatsCards({ stats }: { stats: any }) {
  const cards = [
    { label: "Total Revenue", value: `$${(stats?.totalRevenue || 125000).toLocaleString()}`, icon: Wallet, trend: "+12%" },
    { label: "Avg Commission", value: `${stats?.avgCommission || 5.2}%`, icon: TrendingUp, trend: "+0.8%" },
    { label: "Properties", value: stats?.totalProperties || 18, icon: Home, trend: "+3" },
    { label: "Inquiries", value: stats?.totalInquiries || 42, icon: Users, trend: "+7" },
  ];
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {cards.map((c,i)=>(
        <div key={i} className="bg-white rounded-[1.8rem] p-6 border border-black/5 hover:shadow-lg transition">
          <div className="flex justify-between items-start"><div className="w-10 h-10 rounded-full bg-black text-white grid place-items-center"><c.icon className="w-5 h-5"/></div><span className="text-xs bg-[#C5A880]/20 text-[#8A6D4A] rounded-full px-2 py-1">{c.trend}</span></div>
          <p className="mt-6 text-sm text-black/50 tracking-widest uppercase">{c.label}</p>
          <p className="text-3xl font-serif mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
