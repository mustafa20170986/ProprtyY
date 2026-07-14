"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  companyName: z.string().optional(),
  licenseNumber: z.string().optional(),
  experience: z.string().min(10),
  reason: z.string().min(20),
  requestedRole: z.enum(["agent","agency"]),
});

export default function RoleApplicationForm({ onSubmit, defaultEmail }: { onSubmit: (d:any)=>Promise<void>, defaultEmail?: string }) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: defaultEmail, requestedRole: "agent" as const },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-[2rem] p-8 border border-black/5">
      <h3 className="font-serif text-2xl">Apply for Elevated Access</h3>
      <p className="text-sm text-black/60">Become an Agent or Agency. Admin will review your application within 24h.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="text-xs uppercase">Requested Role</label><select {...register("requestedRole")} className="h-12 w-full rounded-full bg-[#FAF7F2] border px-4"><option value="agent">Agent</option><option value="agency">Agency / Developer</option></select></div>
        <Input {...register("fullName")} placeholder="Full Name" />
        <Input {...register("email")} placeholder="Email" />
        <Input {...register("phone")} placeholder="Phone" />
        <Input {...register("companyName")} placeholder="Company Name (for agency)" />
        <Input {...register("licenseNumber")} placeholder="License Number" />
        <div className="md:col-span-2"><textarea {...register("experience")} placeholder="Your experience (at least 10 chars)" className="w-full rounded-2xl border p-4 bg-[#FAF7F2] min-h-[90px]" /></div>
        <div className="md:col-span-2"><textarea {...register("reason")} placeholder="Why should we approve you? (20 chars+)" className="w-full rounded-2xl border p-4 bg-[#FAF7F2] min-h-[110px]" /></div>
      </div>
      <Button disabled={isSubmitting} type="submit" variant="luxe" className="w-full rounded-full h-12">{isSubmitting ? "Submitting..." : "Submit Application"}</Button>
    </form>
  );
}
