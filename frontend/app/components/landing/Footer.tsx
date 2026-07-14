export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/10 py-16 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div><h4 className="font-serif text-2xl">PropertyX</h4><p className="text-black/60 mt-3 max-w-[300px] text-sm leading-relaxed">Luxury real estate platform. Curated, verified, extraordinary. Built for those who demand more.</p></div>
        <div className="flex gap-16 text-sm">
          <div><p className="font-semibold mb-4">Explore</p><ul className="space-y-2 text-black/60"><li>Feed</li><li>Agencies</li><li>Agents</li></ul></div>
          <div><p className="font-semibold mb-4">Company</p><ul className="space-y-2 text-black/60"><li>About</li><li>Careers</li><li>Contact</li></ul></div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-black/5 flex justify-between text-xs text-black/40">
        <span>© 2026 PropertyX, Inc.</span><span>Crafted with GSAP + Next.js</span>
      </div>
    </footer>
  );
}
