"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

const schema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.enum(["apartment","house","villa","land","commercial"]),
  listingType: z.enum(["sale","rent"]),
  price: z.coerce.number().min(1),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().min(1),
  location: z.object({ address: z.string(), city: z.string(), state: z.string(), country: z.string(), zipCode: z.string() }),
  coordinates: z.object({ lat: z.coerce.number(), lng: z.coerce.number() }),
  amenities: z.string().optional(),
  images: z.string().min(10),
  commissionPercent: z.coerce.number().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function PropertyForm({ onSubmit, initialData }: { onSubmit: (data:any)=>Promise<void>, initialData?: any }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      type: "villa",
      listingType: "sale",
      location: { address:"", city:"Dubai", state:"Dubai", country:"UAE", zipCode:"00000" },
      coordinates: { lat: 25.2048, lng: 55.2708 },
    }
  });

  const submit = async (data: FormData) => {
    const payload = {
      ...data,
      amenities: data.amenities?.split(',').map(s=>s.trim()).filter(Boolean) || [],
      tags: data.tags?.split(',').map(s=>s.trim()).filter(Boolean) || [],
      images: data.images.split(',').map(s=>s.trim()),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 bg-white rounded-[2rem] p-8 border border-black/5">
      <h3 className="font-serif text-2xl">Property Details</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-black/50">Title</label>
          <Input {...register("title")} placeholder="Oceanfront Villa with Private Beach" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest">Description</label>
          <textarea {...register("description")} className="w-full min-h-[120px] rounded-2xl border border-black/10 p-4 bg-[#FAF7F2] text-sm" placeholder="Luxurious description..." />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest">Type</label>
          <select {...register("type")} className="h-12 w-full rounded-full bg-[#FAF7F2] border border-black/5 px-4 text-sm">
            <option value="villa">Villa</option><option value="apartment">Apartment</option><option value="house">House</option><option value="land">Land</option><option value="commercial">Commercial</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest">Listing Type</label>
          <select {...register("listingType")} className="h-12 w-full rounded-full bg-[#FAF7F2] border border-black/5 px-4 text-sm">
            <option value="sale">Sale</option><option value="rent">Rent</option>
          </select>
        </div>
        <Input {...register("price")} type="number" placeholder="Price" />
        <Input {...register("area")} type="number" placeholder="Area sqft" />
        <Input {...register("bedrooms")} type="number" placeholder="Bedrooms" />
        <Input {...register("bathrooms")} type="number" placeholder="Bathrooms" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input {...register("location.address")} placeholder="Address" />
        <Input {...register("location.city")} placeholder="City" />
        <Input {...register("location.state")} placeholder="State" />
        <Input {...register("location.country")} placeholder="Country" />
        <Input {...register("coordinates.lat")} type="number" step="any" placeholder="Latitude" />
        <Input {...register("coordinates.lng")} type="number" step="any" placeholder="Longitude" />
      </div>

      <Input {...register("amenities")} placeholder="Amenities comma separated (Pool, Gym, Garden)" />
      <Input {...register("images")} placeholder="Image URLs comma separated (https://...)" />
      <Input {...register("commissionPercent")} type="number" placeholder="Commission %" />
      <Input {...register("tags")} placeholder="Tags comma separated" />

      <Button type="submit" disabled={isSubmitting} variant="luxe" className="w-full h-14 rounded-full text-base">
        {isSubmitting ? "Saving..." : "Save Property"}
      </Button>
    </form>
  );
}
