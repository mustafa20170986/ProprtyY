// app/components/forms/PropertyForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["apartment", "house", "villa", "land", "commercial"]),
  listingType: z.enum(["sale", "rent"]),
  price: z.coerce.number().min(1, "Price is required"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().min(1, "Area is required"),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipCode: z.string(),
  }),
  coordinates: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
  amenities: z.string().optional(),
  images: z.string().min(10, "At least one image URL is required"),
  commissionPercent: z.coerce.number().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PropertyForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      type: "villa",
      listingType: "sale",
      location: {
        address: "",
        city: "Dubai",
        state: "Dubai",
        country: "UAE",
        zipCode: "00000",
      },
      coordinates: { lat: 25.2048, lng: 55.2708 },
    },
  });

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".prop-field",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.2,
        },
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  // Show validation errors via toast
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      toast.error(
        `Please fix ${errorKeys.length} field${errorKeys.length > 1 ? "s" : ""}`,
      );
    }
  }, [errors]);

  const submit = async (data: FormData) => {
    const payload = {
      ...data,
      amenities:
        data.amenities
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [],
      tags:
        data.tags
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [],
      images: data.images.split(",").map((s) => s.trim()),
    };
    try {
      await onSubmit(payload);
      toast.success("Property saved successfully!");
    } catch {
      toast.error("Failed to save property");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(submit)}
      className="space-y-5 sm:space-y-6 bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 lg:p-8 border border-black/5"
    >
      <div className="prop-field opacity-0">
        <h3 className="font-serif text-xl sm:text-2xl">Property Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="prop-field opacity-0 sm:col-span-2">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Title
          </label>
          <Input
            {...register("title")}
            placeholder="Oceanfront Villa with Private Beach"
            className="h-10 sm:h-12"
          />
          {errors.title && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="prop-field opacity-0 sm:col-span-2">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Description
          </label>
          <textarea
            {...register("description")}
            className="w-full min-h-[90px] sm:min-h-[120px] rounded-xl sm:rounded-2xl border border-black/10 p-3 sm:p-4 bg-[#FAF7F2] text-sm resize-none"
            placeholder="Luxurious description..."
          />
          {errors.description && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Type
          </label>
          <select
            {...register("type")}
            className="h-10 sm:h-12 w-full rounded-full bg-[#FAF7F2] border border-black/5 px-3 sm:px-4 text-sm"
          >
            <option value="villa">Villa</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Listing Type
          </label>
          <select
            {...register("listingType")}
            className="h-10 sm:h-12 w-full rounded-full bg-[#FAF7F2] border border-black/5 px-3 sm:px-4 text-sm"
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Price
          </label>
          <Input
            {...register("price")}
            type="number"
            placeholder="Price"
            className="h-10 sm:h-12"
          />
          {errors.price && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Area (sqft)
          </label>
          <Input
            {...register("area")}
            type="number"
            placeholder="Area sqft"
            className="h-10 sm:h-12"
          />
        </div>

        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Bedrooms
          </label>
          <Input
            {...register("bedrooms")}
            type="number"
            placeholder="Bedrooms"
            className="h-10 sm:h-12"
          />
        </div>

        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Bathrooms
          </label>
          <Input
            {...register("bathrooms")}
            type="number"
            placeholder="Bathrooms"
            className="h-10 sm:h-12"
          />
        </div>
      </div>

      {/* Location section */}
      <div className="prop-field opacity-0">
        <h4 className="font-serif text-base sm:text-lg mb-3">Location</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="prop-field opacity-0 sm:col-span-2">
          <Input
            {...register("location.address")}
            placeholder="Address"
            className="h-10 sm:h-12"
          />
        </div>
        <div className="prop-field opacity-0">
          <Input
            {...register("location.city")}
            placeholder="City"
            className="h-10 sm:h-12"
          />
        </div>
        <div className="prop-field opacity-0">
          <Input
            {...register("location.state")}
            placeholder="State"
            className="h-10 sm:h-12"
          />
        </div>
        <div className="prop-field opacity-0">
          <Input
            {...register("location.country")}
            placeholder="Country"
            className="h-10 sm:h-12"
          />
        </div>
        <div className="prop-field opacity-0">
          <Input
            {...register("location.zipCode")}
            placeholder="Zip Code"
            className="h-10 sm:h-12"
          />
        </div>
        <div className="prop-field opacity-0">
          <Input
            {...register("coordinates.lat")}
            type="number"
            step="any"
            placeholder="Latitude"
            className="h-10 sm:h-12"
          />
        </div>
        <div className="prop-field opacity-0">
          <Input
            {...register("coordinates.lng")}
            type="number"
            step="any"
            placeholder="Longitude"
            className="h-10 sm:h-12"
          />
        </div>
      </div>

      {/* Additional fields */}
      <div className="space-y-3 sm:space-y-4">
        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Amenities
          </label>
          <Input
            {...register("amenities")}
            placeholder="Amenities comma separated (Pool, Gym, Garden)"
            className="h-10 sm:h-12"
          />
        </div>
        <div className="prop-field opacity-0">
          <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
            Images
          </label>
          <Input
            {...register("images")}
            placeholder="Image URLs comma separated (https://...)"
            className="h-10 sm:h-12"
          />
          {errors.images && (
            <p className="text-red-500 text-[10px] mt-1">
              {errors.images.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="prop-field opacity-0">
            <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
              Commission %
            </label>
            <Input
              {...register("commissionPercent")}
              type="number"
              placeholder="Commission %"
              className="h-10 sm:h-12"
            />
          </div>
          <div className="prop-field opacity-0">
            <label className="text-[10px] sm:text-xs uppercase tracking-widest text-black/50 mb-1 block">
              Tags
            </label>
            <Input
              {...register("tags")}
              placeholder="Tags comma separated"
              className="h-10 sm:h-12"
            />
          </div>
        </div>
      </div>

      <div className="prop-field opacity-0">
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="luxe"
          className="w-full h-11 sm:h-14 rounded-full text-sm sm:text-base"
        >
          {isSubmitting ? "Saving..." : "Save Property"}
        </Button>
      </div>
    </form>
  );
}
