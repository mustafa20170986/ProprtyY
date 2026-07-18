"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  User,
  Building2,
  Users,
  Shield,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/user", label: "My Profile", icon: User },
  { href: "/dashboard/agent", label: "Agent", icon: Users },
  { href: "/dashboard/agency", label: "Agency", icon: Building2 },
  { href: "/dashboard/admin", label: "Admin", icon: Shield },
];

function SidebarContent({
  pathname,
  onNavigate,
  onClose,
  onSignOut,
}: {
  pathname: string;
  onNavigate?: () => void;
  onClose?: () => void;
  onSignOut?: () => void;
}) {
  return (
    <>
      <div className="h-[72px] px-8 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black text-white grid place-items-center font-serif font-bold">
            P
          </div>
          <span className="font-serif text-lg">PropertyX</span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden w-10 h-10 rounded-full hover:bg-black/5 grid place-items-center"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm transition ${
                active ? "bg-black text-white" : "hover:bg-black/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-black/5 space-y-1">
        <Link
          href="/feed"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-full text-sm hover:bg-black/5"
        >
          <Home className="w-4 h-4" />
          Back to Feed
        </Link>

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm hover:bg-black/5 text-black/60 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut } = useClerk();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[280px] border-r border-black/5 bg-white flex-col sticky top-0 h-screen">
        <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile/Tablet overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Mobile/Tablet sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[280px] bg-white border-r border-black/5 flex flex-col transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          onNavigate={() => setIsSidebarOpen(false)}
          onClose={() => setIsSidebarOpen(false)}
          onSignOut={handleSignOut}
        />
      </aside>

      <div className="flex-1 min-w-0">
        {/* Mobile/Tablet header */}
        <header className="lg:hidden h-[64px] bg-white border-b border-black/5 px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={isSidebarOpen}
              className="w-10 h-10 rounded-full hover:bg-black/5 grid place-items-center"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-serif">PropertyX Dashboard</span>
          </div>

          <Link href="/feed" className="text-sm underline">
            Feed
          </Link>
        </header>

        <main className="p-4 md:p-8 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
