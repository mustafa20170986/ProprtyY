"use client";

import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Property Feed", href: "/feed" },
    { label: "User Dash", href: "/dashboard/user" },
    { label: "Agent Dash", href: "/dashboard/agent" },
    { label: "Agency Dash", href: "/dashboard/agency" },
    { label: "Admin Dash", href: "/dashboard/admin" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 mix-blend-difference">
      {/* Desktop & Main Floating Bar */}
      <div className="glass !bg-white/10 !backdrop-blur-xl border-white/10 mx-4 md:mx-8 mt-4 rounded-full px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="w-9 h-9 rounded-full bg-white text-black grid place-items-center font-serif font-bold">P</div>
          <span className="font-serif text-xl tracking-tight">PropertyX</span>
        </Link>

        {/* Dynamic Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-white/80 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="gold" size="sm" className="rounded-full">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-white hover:bg-white/10 rounded-full" 
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Luxury Mobile Dropdown Overlay */}
      {open && (
        <div className="lg:hidden mx-4 mt-2 glass !bg-black/90 !backdrop-blur-2xl border border-white/10 rounded-[1.5rem] p-5 flex flex-col gap-3 text-white transition-all duration-300">
          <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
            <span className="text-xs uppercase tracking-widest text-white/40 font-semibold px-2 mb-1">Navigation</span>
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setOpen(false)}
                className="py-2 px-2 hover:bg-white/5 rounded-lg text-white/80 hover:text-white text-sm transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-2 pt-1">
            <Link href="/sign-in" onClick={() => setOpen(false)} className="w-full">
              <Button variant="gold" size="sm" className="w-full rounded-xl">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in" onClick={() => setOpen(false)} className="w-full">
              <Button variant="ghost" size="sm" className="w-full text-white hover:bg-white/10 rounded-xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}