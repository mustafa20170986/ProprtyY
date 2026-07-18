"use client";

import Hero from "./components/landing/Hero";
import Featured from "./components/landing/Featured";
import Stats from "./components/landing/Stats";
import Footer from "./components/landing/Footer";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "./components/landing/Navbar";

export default function LandingPage() {
  const router = useRouter();

  const { isSignedIn } = useAuth();

  const handleAction = () => {
    try {
      if (isSignedIn) {
        router.push("/dashboard");
      } else {
        router.push("sign-in");
      }
    } catch {
      router.push("sign-in");
    }
  };

  return (
    <main className="bg-[#FAF7F2]">
      <Navbar/>
      <Hero />
      <Featured />
      <Stats />
      {/* CTA */}
      <section className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="rounded-[3rem] bg-[#C5A880] p-10 md:p-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="font-serif text-4xl md:text-6xl leading-[0.9]">
            Ready to
            <br />
            find your
            <br />
            sanctuary?
          </h2>
          <a
            onClick={handleAction}
            className="bg-black text-white rounded-full px-10 py-5 text-lg hover:bg-black/90 transition"
          >
            Get Started — It's Free
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
