"use client";
export default function Stats() {
  return (
    <section className="mx-4 md:mx-8 rounded-[2.5rem] luxury-gradient text-white p-10 md:p-16">
      <div className="grid md:grid-cols-4 gap-10 max-w-[1400px] mx-auto">
        <div className="md:col-span-2">
          <h3 className="font-serif text-4xl md:text-5xl leading-tight">We don't just<br/>sell houses.<br/><span className="text-[#C5A880] italic">We craft legacy.</span></h3>
        </div>
        <div className="space-y-3"><p className="text-5xl font-serif">40+</p><p className="text-white/50 text-sm leading-relaxed">Countries with verified PropertyX agents and premium inventory ready to view today.</p></div>
        <div className="space-y-3"><p className="text-5xl font-serif">$4.2B</p><p className="text-white/50 text-sm">Total transaction volume closed via platform in last 12 months.</p></div>
      </div>
    </section>
  );
}
