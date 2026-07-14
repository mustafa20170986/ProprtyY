// app/components/dashboard/PropertyTable.tsx
"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import gsap from "gsap";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const columnHelper = createColumnHelper<any>();

// ─── status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  pending: "bg-amber-100  text-amber-700",
  sold: "bg-blue-100   text-blue-700",
  rented: "bg-purple-100 text-purple-700",
};

function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs capitalize font-medium ${
        STATUS_STYLES[value] ?? "bg-black/10 text-black/60"
      }`}
    >
      {value}
    </span>
  );
}

// ─── sort icon ────────────────────────────────────────────────────────────────
function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (sorted === "asc")
    return <ChevronUp className="w-3 h-3 inline ml-1 text-black" />;
  if (sorted === "desc")
    return <ChevronDown className="w-3 h-3 inline ml-1 text-black" />;
  return <ChevronsUpDown className="w-3 h-3 inline ml-1 text-black/30" />;
}

// ─── main component ───────────────────────────────────────────────────────────
export default function PropertyTable({
  data,
  onEdit,
  onDelete,
  onView,
}: {
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(8);

  const tableRef = useRef<HTMLDivElement>(null);
  const prevDataLen = useRef(0);

  // ── row entrance animation whenever data changes ──
  useEffect(() => {
    if (!tableRef.current || data.length === 0) return;
    if (data.length === prevDataLen.current) return;
    prevDataLen.current = data.length;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tbl-row",
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.38, stagger: 0.07, ease: "power2.out" },
      );
    }, tableRef);
    return () => ctx.revert();
  }, [data]);

  // ── columns ──
  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
        cell: (info) => (
          <div className="flex flex-col min-w-0">
            <span className="font-medium line-clamp-1 text-xs sm:text-sm">
              {info.getValue()}
            </span>
            {/* show type as sub-label */}
            {info.row.original.type && (
              <span className="text-[10px] text-black/40 capitalize mt-0.5">
                {info.row.original.type} · {info.row.original.listingType}
              </span>
            )}
          </div>
        ),
      }),

      columnHelper.accessor("location.city", {
        header: "City",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm">{info.getValue()}</span>
            {info.row.original.location?.country && (
              <span className="text-[10px] text-black/40">
                {info.row.original.location.country}
              </span>
            )}
          </div>
        ),
      }),

      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => (
          <span className="text-xs sm:text-sm font-serif">
            ${Number(info.getValue()).toLocaleString()}
          </span>
        ),
      }),

      columnHelper.accessor("area", {
        header: "Area",
        cell: (info) => (
          <span className="text-xs sm:text-sm">
            {info.getValue()
              ? `${Number(info.getValue()).toLocaleString()} ft²`
              : "—"}
          </span>
        ),
      }),

      columnHelper.accessor("bedrooms", {
        header: "Beds",
        cell: (info) => (
          <span className="text-xs sm:text-sm">{info.getValue() ?? "—"}</span>
        ),
      }),

      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge value={info.getValue()} />,
      }),

      columnHelper.accessor("views", {
        header: "Views",
        cell: (info) => (
          <span className="text-xs sm:text-sm tabular-nums">
            {Number(info.getValue() || 0).toLocaleString()}
          </span>
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5 sm:gap-1">
            {onView && (
              <button
                onClick={() => onView(row.original._id)}
                title="View"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center hover:bg-black/5 transition-colors text-black/40 hover:text-black"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(row.original._id)}
                title="Edit"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center hover:bg-black/5 transition-colors text-black/40 hover:text-black"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(row.original._id)}
                title="Delete"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center hover:bg-red-50 transition-colors text-black/40 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ),
      }),
    ],
    [onEdit, onDelete, onView],
  );

  // ── table instance ──
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  // keep pageSize in sync
  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const currentRows = table.getRowModel().rows;
  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div
      ref={tableRef}
      className="bg-white rounded-2xl sm:rounded-[2rem] border border-black/5 overflow-hidden"
    >
      {/* ── toolbar ── */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/5">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-lg sm:text-xl">Properties</h3>
          <span className="text-[10px] sm:text-xs bg-[#FAF7F2] border border-black/5 rounded-full px-2 py-0.5 text-black/50">
            {table.getFilteredRowModel().rows.length} / {data.length}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* search */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black/30" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="h-9 sm:h-10 rounded-full bg-[#FAF7F2] border border-black/5 pl-8 pr-4 text-sm w-full sm:w-[200px] focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {/* page size */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="h-9 sm:h-10 rounded-full bg-[#FAF7F2] border border-black/5 px-3 text-xs sm:text-sm focus:outline-none"
          >
            {[5, 8, 12, 20].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── desktop table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF7F2] text-black/50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className={`text-left px-4 lg:px-6 py-3 lg:py-4 font-normal uppercase text-[10px] tracking-widest whitespace-nowrap select-none ${
                      h.column.getCanSort()
                        ? "cursor-pointer hover:text-black transition-colors"
                        : ""
                    }`}
                  >
                    {h.isPlaceholder ? null : (
                      <>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && (
                          <SortIcon sorted={h.column.getIsSorted()} />
                        )}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-16 text-sm text-black/30"
                >
                  No properties match your search.
                </td>
              </tr>
            ) : (
              currentRows.map((row) => (
                <tr
                  key={row.id}
                  className="tbl-row border-t border-black/5 hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 lg:px-6 py-3 lg:py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── mobile cards ── */}
      <div className="md:hidden divide-y divide-black/5">
        {currentRows.length === 0 ? (
          <p className="text-center py-12 text-sm text-black/30">
            No properties match your search.
          </p>
        ) : (
          currentRows.map((row) => (
            <div
              key={row.id}
              className="tbl-row p-4 space-y-3 hover:bg-[#FAF7F2]/60 transition-colors"
            >
              {/* top row */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate leading-tight">
                    {row.original.title}
                  </p>
                  <p className="text-[10px] text-black/40 mt-0.5 capitalize">
                    {row.original.type} · {row.original.listingType}
                  </p>
                </div>
                <StatusBadge value={row.original.status} />
              </div>

              {/* meta row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#FAF7F2] rounded-xl p-2">
                  <p className="text-[10px] text-black/40 uppercase tracking-wide">
                    Price
                  </p>
                  <p className="text-xs font-serif mt-0.5">
                    ${Number(row.original.price || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#FAF7F2] rounded-xl p-2">
                  <p className="text-[10px] text-black/40 uppercase tracking-wide">
                    City
                  </p>
                  <p className="text-xs mt-0.5 truncate">
                    {row.original.location?.city || "—"}
                  </p>
                </div>
                <div className="bg-[#FAF7F2] rounded-xl p-2">
                  <p className="text-[10px] text-black/40 uppercase tracking-wide">
                    Views
                  </p>
                  <p className="text-xs mt-0.5">{row.original.views || 0}</p>
                </div>
              </div>

              {/* beds / area */}
              {(row.original.bedrooms || row.original.area) && (
                <div className="flex gap-3 text-[11px] text-black/50">
                  {row.original.bedrooms != null && (
                    <span>{row.original.bedrooms} beds</span>
                  )}
                  {row.original.area && (
                    <span>
                      {Number(row.original.area).toLocaleString()} ft²
                    </span>
                  )}
                </div>
              )}

              {/* actions */}
              <div className="flex gap-2 pt-1">
                {onView && (
                  <button
                    onClick={() => onView(row.original._id)}
                    className="flex-1 h-8 rounded-full bg-[#FAF7F2] text-[11px] flex items-center justify-center gap-1 hover:bg-black/5 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(row.original._id)}
                    className="flex-1 h-8 rounded-full bg-[#FAF7F2] text-[11px] flex items-center justify-center gap-1 hover:bg-black/5 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row.original._id)}
                    className="flex-1 h-8 rounded-full bg-red-50 text-red-500 text-[11px] flex items-center justify-center gap-1 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── pagination ── */}
      <div className="p-3 sm:p-4 flex flex-col xs:flex-row justify-between items-center gap-2 border-t border-black/5 bg-[#FAF7F2]/30">
        {/* info */}
        <span className="text-[10px] sm:text-xs text-black/40 order-2 xs:order-1">
          Page {pageIndex + 1} of {pageCount || 1} ·{" "}
          {table.getFilteredRowModel().rows.length} results
        </span>

        {/* controls */}
        <div className="flex items-center gap-1.5 order-1 xs:order-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="text-xs h-7 sm:h-8 w-7 sm:w-8 p-0 rounded-full"
          >
            «
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs h-7 sm:h-8 px-3 rounded-full"
          >
            Prev
          </Button>

          {/* page number pills */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
              // sliding window
              let start = Math.max(0, pageIndex - 2);
              if (pageCount - start < 5) start = Math.max(0, pageCount - 5);
              const p = start + i;
              if (p >= pageCount) return null;
              return (
                <button
                  key={p}
                  onClick={() => table.setPageIndex(p)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs transition-colors ${
                    p === pageIndex
                      ? "bg-black text-white"
                      : "hover:bg-black/5 text-black/50"
                  }`}
                >
                  {p + 1}
                </button>
              );
            })}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs h-7 sm:h-8 px-3 rounded-full"
          >
            Next
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="text-xs h-7 sm:h-8 w-7 sm:w-8 p-0 rounded-full"
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
}
