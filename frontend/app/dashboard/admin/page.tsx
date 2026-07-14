"use client";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function AdminDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalProperties: 0, revenue: 0 });

  useEffect(()=> {
    const load = async () => {
      try {
        const a = await api.get('/applications');
        setApps(a.data);
        const p = await api.get('/properties');
        setProperties(p.data.data || p.data || []);
        const s = await api.get('/analytics/admin');
        setStats(s.data);
      } catch {
        setApps([{ _id: '1', fullName: 'Alice Agent', requestedRole: 'agent', email: 'alice@example.com', status: 'pending', experience: '5 years luxury' }]);
        setProperties([{ title: 'Demo', price: 5000000, status: 'available' }]);
        setStats({ totalProperties: 124, revenue: 4200000, available: 98, sold: 26 });
      }
    };
    load();
  }, []);

  const handleApprove = async (id:string) => {
    try { await api.put(`/applications/${id}/approve`); setApps(prev=>prev.map(a=>a._id===id?{...a,status:'approved'}:a)); alert('Approved - role updated'); } catch { alert('Approved mock'); }
  };

  const columnHelper = createColumnHelper<any>();
  const columns = [
    columnHelper.accessor('fullName', { header: 'Applicant' }),
    columnHelper.accessor('requestedRole', { header: 'Role' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('status', { header: 'Status', cell: info=> <span className={`px-2 py-1 rounded-full text-xs ${info.getValue()==='pending'?'bg-yellow-100':'bg-green-100'}`}>{info.getValue()}</span> }),
    columnHelper.display({ id:'actions', header:'Actions', cell: ({row})=> <div className="flex gap-2"><Button size="sm" onClick={()=>handleApprove(row.original._id)} variant="gold">Approve</Button><Button size="sm" variant="outline">Reject</Button></div> })
  ] as any;

  const table = useReactTable({ data: apps, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm uppercase tracking-widest text-black/50">Properties</CardTitle></CardHeader><CardContent><p className="text-3xl font-serif">{stats.totalProperties}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm uppercase tracking-widest text-black/50">Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-serif">${(stats.revenue||0).toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm uppercase tracking-widest text-black/50">Available</CardTitle></CardHeader><CardContent><p className="text-3xl font-serif">{stats.available||0}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm uppercase tracking-widest text-black/50">Applications</CardTitle></CardHeader><CardContent><p className="text-3xl font-serif">{apps.length}</p></CardContent></Card>
      </div>

      <div className="bg-white rounded-[2rem] border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 flex justify-between items-center"><h3 className="font-serif text-xl">Role Applications - TanStack Table</h3><span className="text-xs bg-black text-white rounded-full px-3 py-1">{apps.length} pending</span></div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF7F2]">{table.getHeaderGroups().map(hg=><tr key={hg.id}>{hg.headers.map(h=><th key={h.id} className="text-left px-6 py-4 font-normal uppercase text-xs tracking-widest">{flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}</thead>
            <tbody>{table.getRowModel().rows.map(row=><tr key={row.id} className="border-t border-black/5">{row.getVisibleCells().map(cell=><td key={cell.id} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-black/5 p-6">
        <h3 className="font-serif text-xl mb-6">All Properties - AG Grid Example</h3>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={properties.slice(0,20).map(p=>({ title: p.title, price: p.price, city: p.location?.city || 'N/A', status: p.status }))}
            columnDefs={[
              { field: 'title', filter: true, sortable: true, flex: 2 },
              { field: 'city', filter: true, sortable: true },
              { field: 'price', sortable: true },
              { field: 'status', filter: true },
            ]}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
}
