import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input"; // Assuming an Input component exists
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true }, // Initial sorting by timestamp (latest to oldest)
  ]);
  const [pageIndex, setPageIndex] = useState(0); // Pagination state

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination: { pageIndex, pageSize: 5 }, // Add pagination state
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newPageIndex =
        typeof updater === "function"
          ? updater({
              pageIndex,
              pageSize: 0,
            }).pageIndex
          : updater.pageIndex;
      setPageIndex(newPageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(data.length / 5),
  });
  const handleDownload = async () => {
    const res = await fetch(
      "https://api.thingspeak.com/channels/2950820/feeds.json?api_key=KRYD2ECPMRNY1HM7&results=8000"
    );
    if (!res.ok) {
      console.error("Download failed");
      return;
    }

    const json = await res.json();
    const feeds = json.feeds;

    let prevTemp: string | null = null;
    let prevHum: string | null = null;

    interface Feed {
      created_at: string;
      field1?: string;
      field2?: string;
      [key: string]: unknown;
    }

    const filteredRows = feeds
      .map((feed: Feed) => {
        const temp = feed.field1 ? parseFloat(feed.field1).toFixed(2) : null;
        const hum = feed.field2 ? parseFloat(feed.field2).toFixed(2) : null;

        if (temp !== null && hum !== null) {
          if (temp !== prevTemp || hum !== prevHum) {
            prevTemp = temp;
            prevHum = hum;
            return [new Date(feed.created_at).toISOString(), temp, hum].join(
              ","
            );
          }
        }
        return null;
      })
      .filter((row: null) => row !== null); // Remove nulls

    const csvHeader = "Timestamp,Temperature (°C),Humidity (%)\n";
    const csvContent = csvHeader + filteredRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "complete_history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="rounded-lg">
      <div className="py-4 text-2xl border-none md:flex-row flex flex-col md:justify-between">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="md:w-80 bg-white border-none text-xl shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-opacity-50"
        />
        <Button
          onClick={handleDownload}
          className="bg-rose-600 text-white px-6 py-3 rounded-lg shadow hover:bg-rose-800 transition-all mt-4 md:mt-0"
        >
          Download All Data (CSV)
        </Button>
      </div>
      <Table className="rounded-lg overflow-hidden">
        <TableHeader className="bg-rose-200 p-2">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-rose-600 text-center text-rose-900"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-l-2 border-r-2 border-rose-600 text-center text-rose-900">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-center md:justify-end items-center gap-2 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-2 text-rose-700 text-md hover:cursor-pointer hover:bg-rose-200 transition-all duration-200 ease-in-out"
        >
          &lt; Previous
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
            (page, idx, arr) => {
              const current = table.getState().pagination.pageIndex;
              if (
                page === 0 ||
                page === arr.length - 1 ||
                Math.abs(page - current) <= 1
              ) {
                return (
                  <Button
                    key={page}
                    type="button"
                    variant={page === current ? "outline" : "ghost"}
                    size="sm"
                    className={
                      page === current
                        ? "bg-rose-800 border-rose-700 text-white"
                        : "text-rose-700 hover:cursor-pointer hover:bg-rose-200 transition-all duration-200 ease-in-out"
                    }
                    onClick={() => table.setPageIndex(page)}
                    tabIndex={page === current ? -1 : 0}
                  >
                    {page + 1}
                  </Button>
                );
              }
              if (
                (page === current - 2 && page > 1) ||
                (page === current + 2 && page < arr.length - 2)
              ) {
                return (
                  <span
                    key={page}
                    className="px-2 select-none text-rose-400"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    ...
                  </span>
                );
              }
              return null;
            }
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-2 text-rose-700 text-md hover:cursor-pointer hover:bg-rose-200 transition-all duration-200 ease-in-out"
        >
          Next &gt;
        </Button>
      </div>
    </div>
  );
}
