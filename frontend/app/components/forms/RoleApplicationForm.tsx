// app/components/forms/RoleApplicationForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  companyName: z.string().optional(),
  licenseNumber: z.string().optional(),
  experience: z.string().min(10, "At least 10 characters required"),
  reason: z.string().min(20, "At least 20 characters required"),
  requestedRole: z.enum(["agent", "agency"]),
});

type FormValues = z.infer<typeof schema>;

export default function RoleApplicationForm({
  onSubmit,
  defaultEmail,
}: {
  onSubmit: (d: FormValues) => Promise<void>;
  defaultEmail?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: defaultEmail || "",
      phone: "",
      companyName: "",
      licenseNumber: "",
      experience: "",
      reason: "",
      requestedRole: "agent",
    },
  });

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".form-field",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.3,
        },
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleFormSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Show validation errors via toast
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstError = errors[errorKeys[0] as keyof typeof errors];
      if (firstError && "message" in firstError) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 sm:space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="form-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Requested Role
          </label>
          <select
            {...register("requestedRole")}
            className="h-10 sm:h-12 w-full rounded-full bg-[#FAF7F2] border border-black/5 px-3 sm:px-4 text-sm"
          >
            <option value="agent">Agent</option>
            <option value="agency">Agency / Developer</option>
          </select>
        </div>
        
        <div className="form-field opacity-0">
          <Input
            {...register("fullName")}
            placeholder="Full Name"
            className="h-10 sm:h-12"
          />
          {errors.fullName && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="form-field opacity-0">
          <Input
            {...register("email")}
            placeholder="Email"
            className="h-10 sm:h-12"
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="form-field opacity-0">
          <Input
            {...register("phone")}
            placeholder="Phone"
            className="h-10 sm:h-12"
          />
          {errors.phone && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="form-field opacity-0">
          <Input
            {...register("companyName")}
            placeholder="Company Name (for agency)"
            className="h-10 sm:h-12"
          />
        </div>

        <div className="form-field opacity-0">
          <Input
            {...register("licenseNumber")}
            placeholder="License Number"
            className="h-10 sm:h-12"
          />
        </div>

        <div className="form-field opacity-0 sm:col-span-2">
          <textarea
            {...register("experience")}
            placeholder="Your experience (at least 10 chars)"
            className="w-full rounded-xl sm:rounded-2xl border border-black/5 p-3 sm:p-4 bg-[#FAF7F2] min-h-[70px] sm:min-h-[90px] text-sm resize-none"
          />
          {errors.experience && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.experience.message}
            </p>
          )}
        </div>

        <div className="form-field opacity-0 sm:col-span-2">
          <textarea
            {...register("reason")}
            placeholder="Why should we approve you? (20 chars+)"
            className="w-full rounded-xl sm:rounded-2xl border border-black/5 p-3 sm:p-4 bg-[#FAF7F2] min-h-[80px] sm:min-h-[110px] text-sm resize-none"
          />
          {errors.reason && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.reason.message}
            </p>
          )}
        </div>
      </div>

      <div className="form-field opacity-0">
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="luxe"
          className="w-full rounded-full h-10 sm:h-12 text-sm"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
