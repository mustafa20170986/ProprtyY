import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import Featured from "./components/landing/Featured";
import Stats from "./components/landing/Stats";
import Footer from "./components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#FAF7F2]">
      <Navbar />
      <Hero />
      <Featured />
      <Stats />
      {/* CTA */}
      <section className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="rounded-[3rem] bg-[#C5A880] p-10 md:p-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="font-serif text-4xl md:text-6xl leading-[0.9]">Ready to<br/>find your<br/>sanctuary?</h2>
          <a href="/sign-in" className="bg-black text-white rounded-full px-10 py-5 text-lg hover:bg-black/90 transition">Get Started — It's Free</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
