"use client";
import { Button } from "../ui/button";
import { Building2, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 mix-blend-difference">
      <div className="glass !bg-white/10 !backdrop-blur-xl border-white/10 mx-4 md:mx-8 mt-4 rounded-full px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="w-9 h-9 rounded-full bg-white text-black grid place-items-center font-serif font-bold">P</div>
          <span className="font-serif text-xl tracking-tight">PropertyX</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-white/80 text-sm">
          <a href="#properties" className="hover:text-white">Properties</a>
          <a href="#agencies" className="hover:text-white">Agencies</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in"><Button variant="ghost" size="sm" className="text-white hover:bg-white/10">Sign In</Button></Link>
          <Link href="/sign-in"><Button variant="gold" size="sm">Get Started</Button></Link>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={()=>setOpen(!open)}><Menu/></Button>
      </div>
      {open && (
        <div className="md:hidden mx-4 mt-2 glass rounded-[1.5rem] p-4 flex flex-col gap-2 bg-white">
          <Link href="/sign-in" className="py-2">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
