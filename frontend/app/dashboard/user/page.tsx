"use client";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function UserDashboard() {
  const { user } = useUser();
  return (
    <div className="space-y-8 max-w-[900px]">
      <h1 className="font-serif text-4xl">User Dashboard</h1>
      <p className="text-black/60">Basic profile, nothing fancy - name, address and essentials.</p>

      <Card>
        <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs uppercase tracking-widest">Name</label><Input defaultValue={user?.fullName || ''} /></div>
            <div><label className="text-xs uppercase tracking-widest">Email</label><Input defaultValue={user?.primaryEmailAddress?.emailAddress || ''} disabled /></div>
            <div><label className="text-xs uppercase tracking-widest">Phone</label><Input placeholder="+1..." /></div>
            <div><label className="text-xs uppercase tracking-widest">City</label><Input placeholder="Dubai" /></div>
            <div className="md:col-span-2"><label className="text-xs uppercase tracking-widest">Address</label><Input placeholder="123 Estate Street" /></div>
          </div>
          <Button variant="luxe" className="rounded-full">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Saved Properties</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-black/60">You can view saved properties in feed. Integration with /saved API ready.</p></CardContent>
      </Card>
    </div>
  );
}
