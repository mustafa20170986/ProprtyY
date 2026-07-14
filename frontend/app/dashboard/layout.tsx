"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Building2, Users, Shield, Home, LogOut } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/user", label: "My Profile", icon: User },
  { href: "/dashboard/agent", label: "Agent", icon: Users },
  { href: "/dashboard/agency", label: "Agency", icon: Building2 },
  { href: "/dashboard/admin", label: "Admin", icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      <aside className="w-[280px] border-r border-black/5 bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="h-[72px] px-8 flex items-center gap-2 border-b border-black/5">
          <div className="w-8 h-8 rounded-full bg-black text-white grid place-items-center font-serif font-bold">P</div>
          <span className="font-serif text-lg">PropertyX</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(item=>{
            const active = pathname===item.href;
            return <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm transition ${active ? 'bg-black text-white' : 'hover:bg-black/5'}`}><item.icon className="w-4 h-4" />{item.label}</Link>
          })}
        </nav>
        <div className="p-4 border-t border-black/5">
          <Link href="/feed" className="flex items-center gap-3 px-4 py-3 rounded-full text-sm hover:bg-black/5"><Home className="w-4 h-4" />Back to Feed</Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-full text-sm hover:bg-black/5 text-black/60"><LogOut className="w-4 h-4" />Home</Link>
        </div>
      </aside>
      <div className="flex-1">
        <header className="lg:hidden h-[64px] bg-white border-b border-black/5 px-4 flex items-center justify-between sticky top-0 z-20">
          <span className="font-serif">PropertyX Dashboard</span>
          <Link href="/feed" className="text-sm underline">Feed</Link>
        </header>
        <main className="p-4 md:p-8 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
