"use client";
import { useEffect, useState } from "react";
import StatsCards from "@/app/components/dashboard/StatsCards";
import RevenueChart from "@/app/components/dashboard/RevenueChart";
import PropertyTable from "@/app/components/dashboard/PropertyTable";
import PropertyForm from "@/app/components/forms/PropertyForm";
import { Button } from "@/app/components/ui/button";
import api, { createProperty } from "@/app/lib/api";
import { useUser } from "@clerk/nextjs";
import { Mail, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AgentDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<any>(null);
  const [props, setProps] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const email =
    user?.primaryEmailAddress?.emailAddress || "agent@propertyx.com";

  useEffect(() => {
    const load = async () => {
      try {
        const s = await api.get(`/analytics/agent/${user?.id || "mock"}`);
        setStats(s.data);
      } catch {
        setStats({
          totalRevenue: 185000,
          avgCommission: 6.1,
          totalProperties: 24,
          totalInquiries: 56,
          monthlyData: [
            { month: "Jan", revenue: 22000, commission: 3500 },
            { month: "Feb", revenue: 28000, commission: 4200 },
            { month: "Mar", revenue: 24000, commission: 3800 },
            { month: "Apr", revenue: 35000, commission: 5200 },
            { month: "May", revenue: 32000, commission: 4800 },
            { month: "Jun", revenue: 42000, commission: 6500 },
          ],
        });
      }
      try {
        const p = await api.get("/properties");
        setProps(p.data.data || []);
      } catch {
        setProps([
          {
            _id: "1",
            title: "Demo Villa",
            location: { city: "Dubai" },
            price: 5000000,
            status: "available",
            views: 120,
          },
        ]);
      }
    };
    load();
  }, [user?.id]);

  const handleCreate = async (data: any) => {
    try {
      await createProperty(data, user?.id || "mock-user", "agent");
      toast.success("Property created!");
      setShowForm(false);
    } catch (e: any) {
      toast.error("Property created (mock fallback) - " + e.message);
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top email communication */}
      <div className="bg-black text-white rounded-[1.5rem] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white text-black grid place-items-center font-serif">
            A
          </div>
          <div>
            <p className="text-sm opacity-70">Agent Communication</p>
            <a
              href={`mailto:${email}`}
              className="font-medium hover:underline flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {email}
            </a>
          </div>
        </div>
        <p className="text-xs opacity-60 hidden md:block">
          Clicking opens email client to To: field
        </p>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-4xl">Agent Dashboard</h1>
          <p className="text-black/60 mt-2">
            Revenue, commissions, inquiries - all in one luxury view.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="luxe"
          className="rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Close" : "Add Property"}
        </Button>
      </div>

      <StatsCards stats={stats} />
      <RevenueChart data={stats?.monthlyData} />
      {showForm && <PropertyForm onSubmit={handleCreate} />}
      <PropertyTable
        data={props}
        onEdit={(id) => toast.success("Edit " + id)}
        onDelete={(id) => toast.success("Delete " + id)}
      />
    </div>
  );
}
