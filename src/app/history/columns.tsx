"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Environment = {
  id: string;
  timestamp: string;
  temperature: string;
  humidity: string;
};

export const columns: ColumnDef<Environment>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            className="flex text-2xl text-rose-700 justify-center hover:bg-rose-300 hover:shadow-md hover:cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "desc")
            }
          >
            Timestamp
            <ArrowUpDown className="h-8 w-8" strokeWidth={3.5} />
          </Button>
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (a, b, columnId) =>
      new Date(a.getValue<string>(columnId)).getTime() -
      new Date(b.getValue<string>(columnId)).getTime(),
    filterFn: "includesString",
    meta: {
      filterVariant: "datetime",
    },
  },
  {
    accessorKey: "temperature",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="flex text-2xl text-rose-700 justify-center hover:bg-rose-300 hover:shadow-md hover:cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Temperature
            <ArrowUpDown className="h-8 w-8" strokeWidth={3.5} />
          </Button>
        </div>
      );
    },
    enableSorting: true,
    filterFn: "includesString",
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "humidity",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            className="flex text-2xl text-rose-700 justify-center hover:bg-rose-300 hover:shadow-md hover:cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Humidity
            <ArrowUpDown className="h-8 w-8" strokeWidth={3.5} />
          </Button>
        </div>
      );
    },
    enableSorting: true,
    filterFn: "includesString",
    meta: {
      filterVariant: "text",
    },
  },
];
