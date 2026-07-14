"use client";
import { useMemo, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { Button } from "../ui/button";

const columnHelper = createColumnHelper<any>();

export default function PropertyTable({ data, onEdit, onDelete }: { data:any[]; onEdit?: (id:string)=>void; onDelete?: (id:string)=>void }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(()=>[
    columnHelper.accessor('title', { header: 'Title', cell: info => <span className="font-medium line-clamp-1">{info.getValue()}</span> }),
    columnHelper.accessor('location.city', { header: 'City' }),
    columnHelper.accessor('price', { header: 'Price', cell: info => `$${Number(info.getValue()).toLocaleString()}` }),
    columnHelper.accessor('status', { header: 'Status', cell: info => <span className={`px-3 py-1 rounded-full text-xs ${info.getValue()==='available'?'bg-green-100 text-green-700':'bg-black/10'}`}>{info.getValue()}</span> }),
    columnHelper.accessor('views', { header: 'Views' }),
    columnHelper.display({ id: 'actions', header: 'Actions', cell: ({row})=>(
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={()=>onEdit?.(row.original._id)}>Edit</Button>
        <Button size="sm" variant="ghost" onClick={()=>onDelete?.(row.original._id)} className="text-red-500">Delete</Button>
      </div>
    )})
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-[2rem] border border-black/5 overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-black/5">
        <h3 className="font-serif text-xl">My Properties ({data.length})</h3>
        <input value={globalFilter} onChange={e=>setGlobalFilter(e.target.value)} placeholder="Filter..." className="h-10 rounded-full bg-[#FAF7F2] border border-black/5 px-4 text-sm w-[200px]" />
      </div>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF7F2] text-black/50">
            {table.getHeaderGroups().map(hg=><tr key={hg.id}>{hg.headers.map(h=><th key={h.id} className="text-left px-6 py-4 font-normal uppercase text-xs tracking-widest">{h.isPlaceholder?null:flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row=><tr key={row.id} className="border-t border-black/5 hover:bg-[#FAF7F2]/50">{row.getVisibleCells().map(cell=><td key={cell.id} className="px-6 py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <div className="p-4 flex justify-between items-center border-t border-black/5">
        <span className="text-xs text-black/50">Page {table.getState().pagination.pageIndex+1} of {table.getPageCount()}</span>
        <div className="flex gap-2"><Button size="sm" variant="outline" onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button><Button size="sm" variant="outline" onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button></div>
      </div>
    </div>
  );
}
