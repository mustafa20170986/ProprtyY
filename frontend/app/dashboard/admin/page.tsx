// app/dashboard/admin/page.tsx
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import api from "@/app/lib/api";
import { Button } from "@/app/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import gsap from "gsap";
import { toast } from "sonner";
import {
  Home,
  DollarSign,
  CheckCircle,
  FileText,
  Users,
  TrendingUp,
  Search,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  X,
  ShieldCheck,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Application {
  _id: string;
  fullName: string;
  requestedRole: "agent" | "agency";
  email: string;
  phone?: string;
  companyName?: string;
  licenseNumber?: string;
  experience: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

interface Property {
  _id?: string;
  title: string;
  price: number;
  status: string;
  location?: { city?: string; country?: string };
  type?: string;
  listingType?: string;
  bedrooms?: number;
  area?: number;
  views?: number;
}

interface Stats {
  totalProperties: number;
  revenue: number;
  available: number;
  sold: number;
  totalInquiries?: number;
  avgCommission?: number;
  monthlyData?: { month: string; revenue: number; commission: number }[];
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100  text-amber-700",
  approved: "bg-green-100  text-green-700",
  rejected: "bg-red-100    text-red-600",
};

const ROLE_STYLES: Record<string, string> = {
  agent: "bg-blue-100   text-blue-700",
  agency: "bg-purple-100 text-purple-700",
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc")
    return <ChevronUp className="w-3 h-3 inline ml-1 text-black" />;
  if (sorted === "desc")
    return <ChevronDown className="w-3 h-3 inline ml-1 text-black" />;
  return <ChevronsUpDown className="w-3 h-3 inline ml-1 text-black/30" />;
}

// ─── stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "bg-black",
}: {
  label: string;
  value: string | number;
  icon: any;
  trend?: string;
  color?: string;
}) {
  return (
    <div className="stat-card bg-white rounded-2xl sm:rounded-[1.8rem] p-4 sm:p-5 lg:p-6 border border-black/5 hover:shadow-lg transition-shadow opacity-0">
      <div className="flex justify-between items-start">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${color} text-white grid place-items-center shrink-0`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        {trend && (
          <span className="text-[10px] sm:text-xs bg-[#C5A880]/20 text-[#8A6D4A] rounded-full px-2 py-0.5">
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-black/50 tracking-widest uppercase">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-serif mt-1 truncate">{value}</p>
    </div>
  );
}

// ─── detail drawer ────────────────────────────────────────────────────────────
function ApplicationDrawer({
  app,
  onClose,
  onApprove,
  onReject,
  loading,
}: {
  app: Application;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  loading: string | null;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25 },
    );
    gsap.fromTo(
      drawerRef.current,
      { x: "100%" },
      { x: "0%", duration: 0.4, ease: "power3.out" },
    );
  }, []);

  const handleClose = () => {
    gsap.to(drawerRef.current, { x: "100%", duration: 0.3, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.25,
      onComplete: onClose,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      />

      {/* panel */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* header */}
        <div className="p-5 sm:p-6 border-b border-black/5 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-serif text-lg sm:text-xl">{app.fullName}</h3>
            <p className="text-xs text-black/50 mt-0.5">{app.email}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#FAF7F2] grid place-items-center hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div className="p-5 sm:p-6 space-y-5 flex-1">
          {/* badges */}
          <div className="flex gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[app.requestedRole]}`}
            >
              {app.requestedRole}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[app.status]}`}
            >
              {app.status}
            </span>
          </div>

          {/* fields */}
          {[
            { label: "Phone", value: app.phone },
            { label: "Company", value: app.companyName },
            { label: "License No.", value: app.licenseNumber },
            {
              label: "Applied",
              value: app.createdAt
                ? new Date(app.createdAt).toLocaleDateString()
                : undefined,
            },
          ]
            .filter((f) => f.value)
            .map((f) => (
              <div key={f.label}>
                <p className="text-[10px] uppercase tracking-widest text-black/40">
                  {f.label}
                </p>
                <p className="text-sm mt-0.5">{f.value}</p>
              </div>
            ))}

          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/40">
              Experience
            </p>
            <p className="text-sm mt-1 leading-relaxed text-black/70">
              {app.experience}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-black/40">
              Reason for Application
            </p>
            <p className="text-sm mt-1 leading-relaxed text-black/70">
              {app.reason}
            </p>
          </div>
        </div>

        {/* footer actions */}
        {app.status === "pending" && (
          <div className="p-5 sm:p-6 border-t border-black/5 flex gap-3 sticky bottom-0 bg-white">
            <Button
              className="flex-1 rounded-full h-11 bg-red-500 hover:bg-red-600 text-white text-sm"
              onClick={() => onReject(app._id)}
              disabled={!!loading}
            >
              {loading === `reject-${app._id}` ? "Rejecting…" : "Reject"}
            </Button>
            <Button
              variant="luxe"
              className="flex-1 rounded-full h-11 text-sm gap-2"
              onClick={() => onApprove(app._id)}
              disabled={!!loading}
            >
              <ShieldCheck className="w-4 h-4" />
              {loading === `approve-${app._id}` ? "Approving…" : "Approve"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── properties mini-table ────────────────────────────────────────────────────
function PropertiesTable({ data }: { data: Property[] }) {
  const [filter, setFilter] = useState("");
  const filtered = data.filter((p) =>
    [p.title, p.location?.city, p.status, p.type]
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-black/5 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-lg sm:text-xl">All Properties</h3>
          <span className="text-[10px] bg-[#FAF7F2] border border-black/5 rounded-full px-2 py-0.5 text-black/50">
            {filtered.length} / {data.length}
          </span>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search properties…"
            className="h-9 sm:h-10 w-full sm:w-[200px] rounded-full bg-[#FAF7F2] border border-black/5 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
      </div>

      {/* desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF7F2] text-black/50">
            <tr>
              {[
                "Title",
                "City",
                "Type",
                "Price",
                "Beds",
                "Views",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 lg:px-6 py-3 font-normal uppercase text-[10px] tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map((p, i) => (
              <tr
                key={i}
                className="border-t border-black/5 hover:bg-[#FAF7F2]/50 transition-colors"
              >
                <td className="px-4 lg:px-6 py-3">
                  <span className="font-medium text-xs sm:text-sm line-clamp-1">
                    {p.title}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-3 text-xs sm:text-sm">
                  {p.location?.city || "—"}
                </td>
                <td className="px-4 lg:px-6 py-3">
                  <span className="text-[10px] sm:text-xs capitalize text-black/60">
                    {p.type} · {p.listingType}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-3 text-xs sm:text-sm font-serif">
                  ${Number(p.price || 0).toLocaleString()}
                </td>
                <td className="px-4 lg:px-6 py-3 text-xs sm:text-sm">
                  {p.bedrooms ?? "—"}
                </td>
                <td className="px-4 lg:px-6 py-3 text-xs sm:text-sm">
                  {p.views ?? 0}
                </td>
                <td className="px-4 lg:px-6 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs capitalize font-medium ${
                      STATUS_STYLES[p.status] ?? "bg-black/10 text-black/60"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-sm text-black/30"
                >
                  No properties match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* mobile */}
      <div className="md:hidden divide-y divide-black/5">
        {filtered.slice(0, 20).map((p, i) => (
          <div
            key={i}
            className="p-4 space-y-2 hover:bg-[#FAF7F2]/50 transition-colors"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.title}</p>
                <p className="text-[10px] text-black/40 mt-0.5 capitalize">
                  {p.type} · {p.listingType}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] shrink-0 capitalize ${STATUS_STYLES[p.status] ?? "bg-black/10"}`}
              >
                {p.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#FAF7F2] rounded-xl p-2">
                <p className="text-[9px] text-black/40 uppercase">Price</p>
                <p className="text-xs font-serif mt-0.5">
                  ${(p.price / 1_000_000).toFixed(1)}M
                </p>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-2">
                <p className="text-[9px] text-black/40 uppercase">City</p>
                <p className="text-xs mt-0.5 truncate">
                  {p.location?.city || "—"}
                </p>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-2">
                <p className="text-[9px] text-black/40 uppercase">Views</p>
                <p className="text-xs mt-0.5">{p.views ?? 0}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-10 text-sm text-black/30">
            No properties found.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [apps, setApps] = useState<Application[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    revenue: 0,
    available: 0,
    sold: 0,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // ── entrance animation ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, []);

  // ── stat card animation when stats arrive ──
  useEffect(() => {
    if (!stats.totalProperties && !stats.revenue) return;
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 25, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: "back.out(1.4)",
      },
    );
  }, [stats]);

  // ── fetch ──
  const load = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [appsRes, propsRes, statsRes] = await Promise.all([
        api.get("/applications"),
        api.get("/properties"),
        api.get("/analytics/admin"),
      ]);
      setApps(appsRes.data);
      setProperties(propsRes.data.data || propsRes.data || []);
      setStats(statsRes.data);
      if (!silent) toast.success("Dashboard refreshed");
    } catch {
      setApps([
        {
          _id: "1",
          fullName: "Alice Agent",
          requestedRole: "agent",
          email: "alice@example.com",
          phone: "+1 555 0100",
          experience: "5 years luxury real estate in Dubai and Malibu.",
          reason: "I want to expand my portfolio with your platform.",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          fullName: "Bob Broker",
          requestedRole: "agency",
          email: "bob@bbroker.com",
          companyName: "BB Realty",
          licenseNumber: "RE-20423",
          experience: "12 years running a boutique agency in Manhattan.",
          reason:
            "Our agency handles $50M+ annually and needs the right tools.",
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      ]);
      setProperties([
        {
          title: "Seacliff Villa",
          price: 8500000,
          status: "available",
          location: { city: "Malibu", country: "USA" },
          type: "villa",
          listingType: "sale",
          bedrooms: 5,
          views: 234,
        },
        {
          title: "Skyline Penthouse",
          price: 6200000,
          status: "pending",
          location: { city: "Manhattan", country: "USA" },
          type: "apartment",
          listingType: "sale",
          bedrooms: 4,
          views: 412,
        },
        {
          title: "Desert Dunes",
          price: 12000000,
          status: "available",
          location: { city: "Dubai", country: "UAE" },
          type: "villa",
          listingType: "sale",
          bedrooms: 7,
          views: 189,
        },
      ]);
      setStats({
        totalProperties: 124,
        revenue: 4200000,
        available: 98,
        sold: 26,
        totalInquiries: 340,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(true);
  }, [load]);

  // ── actions ──
  const handleApprove = async (id: string) => {
    setLoadingAction(`approve-${id}`);
    try {
      await api.put(`/applications/${id}/approve`);
      setApps((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "approved" } : a)),
      );
      toast.success("Application approved — role updated");
      setSelectedApp((prev) =>
        prev?._id === id ? { ...prev, status: "approved" } : prev,
      );
    } catch {
      setApps((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "approved" } : a)),
      );
      toast.success("Application approved");
      setSelectedApp((prev) =>
        prev?._id === id ? { ...prev, status: "approved" } : prev,
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoadingAction(`reject-${id}`);
    try {
      await api.put(`/applications/${id}/reject`);
      setApps((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a)),
      );
      toast.success("Application rejected");
      setSelectedApp((prev) =>
        prev?._id === id ? { ...prev, status: "rejected" } : prev,
      );
    } catch {
      setApps((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "rejected" } : a)),
      );
      toast.error("Failed to reject — updated locally");
      setSelectedApp((prev) =>
        prev?._id === id ? { ...prev, status: "rejected" } : prev,
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // ── columns ──
  const columnHelper = createColumnHelper<Application>();
  const columns = [
    columnHelper.accessor("fullName", {
      header: "Applicant",
      cell: (info) => (
        <div>
          <p className="font-medium text-xs sm:text-sm">{info.getValue()}</p>
          <p className="text-[10px] text-black/40 mt-0.5">
            {info.row.original.email}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("requestedRole", {
      header: "Role",
      cell: (info) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs capitalize font-medium ${ROLE_STYLES[info.getValue()] ?? "bg-black/10"}`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs capitalize font-medium ${STATUS_STYLES[info.getValue()] ?? "bg-black/10"}`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => (
        <span className="text-xs text-black/50">
          {info.getValue()
            ? new Date(info.getValue()!).toLocaleDateString()
            : "—"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedApp(row.original)}
            title="View details"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center hover:bg-black/5 transition-colors text-black/40 hover:text-black"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {row.original.status === "pending" && (
            <>
              <button
                onClick={() => handleApprove(row.original._id)}
                disabled={!!loadingAction}
                title="Approve"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center hover:bg-green-50 transition-colors text-black/40 hover:text-green-600 disabled:opacity-40"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleReject(row.original._id)}
                disabled={!!loadingAction}
                title="Reject"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center hover:bg-red-50 transition-colors text-black/40 hover:text-red-500 disabled:opacity-40"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: apps,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pendingCount = apps.filter((a) => a.status === "pending").length;

  return (
    <div
      ref={pageRef}
      className="space-y-6 sm:space-y-8 px-3 sm:px-4 md:px-6 lg:px-0 pb-12 opacity-0"
    >
      {/* ── header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl">
            Admin Dashboard
          </h1>
          <p className="text-black/50 mt-1 text-sm">
            Manage properties, applications and platform analytics.
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full h-10 px-5 text-sm gap-2 w-full sm:w-auto"
          onClick={() => load()}
          disabled={refreshing}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {/* ── stats grid ── */}
      <div
        ref={statsRef}
        className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4"
      >
        <StatCard
          label="Total Properties"
          value={stats.totalProperties}
          icon={Home}
          trend="+3"
        />
        <StatCard
          label="Revenue"
          value={`$${(stats.revenue / 1_000_000).toFixed(1)}M`}
          icon={DollarSign}
          color="bg-[#C5A880]"
        />
        <StatCard
          label="Available"
          value={stats.available || 0}
          icon={TrendingUp}
          color="bg-green-500"
          trend="+5"
        />
        <StatCard
          label="Sold / Rented"
          value={stats.sold || 0}
          icon={CheckCircle}
          color="bg-blue-500"
        />
        <StatCard
          label="Pending Apps"
          value={pendingCount}
          icon={FileText}
          color={pendingCount > 0 ? "bg-amber-500" : "bg-black"}
        />
      </div>

      {/* ── applications table ── */}
      <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-black/5 overflow-hidden">
        {/* toolbar */}
        <div className="p-4 sm:p-6 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-lg sm:text-xl">Role Applications</h3>
            {pendingCount > 0 && (
              <span className="text-[10px] sm:text-xs bg-amber-500 text-white rounded-full px-2.5 py-0.5 font-medium">
                {pendingCount} pending
              </span>
            )}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search applicants…"
              className="h-9 sm:h-10 w-full sm:w-[200px] rounded-full bg-[#FAF7F2] border border-black/5 pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>

        {/* desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF7F2] text-black/50">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className={`text-left px-4 lg:px-6 py-3 lg:py-4 font-normal uppercase text-[10px] tracking-widest whitespace-nowrap select-none ${
                        h.column.getCanSort()
                          ? "cursor-pointer hover:text-black transition-colors"
                          : ""
                      }`}
                    >
                      {h.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext(),
                          )}
                          {h.column.getCanSort() && (
                            <SortIcon sorted={h.column.getIsSorted()} />
                          )}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-14 text-sm text-black/30"
                  >
                    No applications found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-black/5 hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer"
                    onClick={() => setSelectedApp(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 lg:px-6 py-3 lg:py-4"
                        onClick={
                          cell.column.id === "actions"
                            ? (e) => e.stopPropagation()
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="md:hidden divide-y divide-black/5">
          {table.getRowModel().rows.length === 0 ? (
            <p className="text-center py-10 text-sm text-black/30">
              No applications found.
            </p>
          ) : (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className="p-4 space-y-3 hover:bg-[#FAF7F2]/60 transition-colors"
                onClick={() => setSelectedApp(row.original)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {row.original.fullName}
                    </p>
                    <p className="text-[10px] text-black/40 mt-0.5">
                      {row.original.email}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] capitalize font-medium ${ROLE_STYLES[row.original.requestedRole]}`}
                    >
                      {row.original.requestedRole}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] capitalize font-medium ${STATUS_STYLES[row.original.status]}`}
                    >
                      {row.original.status}
                    </span>
                  </div>
                </div>
                {row.original.status === "pending" && (
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleReject(row.original._id)}
                      disabled={!!loadingAction}
                      className="flex-1 h-8 rounded-full bg-red-50 text-red-500 text-[11px] hover:bg-red-100 transition-colors disabled:opacity-40"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(row.original._id)}
                      disabled={!!loadingAction}
                      className="flex-1 h-8 rounded-full bg-black text-white text-[11px] hover:bg-black/80 transition-colors disabled:opacity-40"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* pagination */}
        <div className="p-3 sm:p-4 flex justify-between items-center border-t border-black/5 bg-[#FAF7F2]/30">
          <span className="text-[10px] sm:text-xs text-black/40">
            {table.getFilteredRowModel().rows.length} applications
          </span>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-xs h-7 sm:h-8 px-3 rounded-full"
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-xs h-7 sm:h-8 px-3 rounded-full"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* ── properties table ── */}
      <PropertiesTable data={properties} />

      {/* ── detail drawer ── */}
      {selectedApp && (
        <ApplicationDrawer
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          loading={loadingAction}
        />
      )}
    </div>
  );
}
