import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Environment, columns } from "./columns";
import { DataTable } from "./data-table";
import Image from "next/image";
import { SeeCurrentReadingButton } from "./button";

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(",", " -");
}

async function getData(): Promise<Environment[]> {
  return [
    {
      id: "1",
      timestamp: formatTimestamp("2024-03-15T09:15:00Z"),
      temperature: "22°C",
      humidity: "65%",
    },
    {
      id: "2",
      timestamp: formatTimestamp("2024-03-15T12:30:00Z"),
      temperature: "24°C",
      humidity: "62%",
    },
    {
      id: "3",
      timestamp: formatTimestamp("2024-03-15T15:45:00Z"),
      temperature: "26°C",
      humidity: "58%",
    },
    {
      id: "4",
      timestamp: formatTimestamp("2024-03-15T18:00:00Z"),
      temperature: "20°C",
      humidity: "70%",
    },
    {
      id: "5",
      timestamp: formatTimestamp("2024-03-15T21:20:00Z"),
      temperature: "18°C",
      humidity: "75%",
    },
    {
      id: "6",
      timestamp: formatTimestamp("2024-03-16T06:00:00Z"),
      temperature: "19°C",
      humidity: "72%",
    },
    {
      id: "7",
      timestamp: formatTimestamp("2024-03-16T12:45:00Z"),
      temperature: "25°C",
      humidity: "60%",
    },
  ];
}

export default async function HistoryPage() {
  const data = await getData();

  return (
    <Card className="w-screen h-full min-h-screen max-w-screen max-h-screen overflow-hidden rounded-none border-none shadow-lg p-0 gap-0 bg-rose-50">
      <CardHeader className="bg-rose-200 p-4 md:p-8 text-white flex h-full flex-row items-center justify-center">
        <Image
          className="mx-0 md:size-20 size-10"
          src="/center.png"
          alt="Strawberry"
          width={100}
          height={100}
        />
        <h4 className="lg:text-6xl md:flex hidden text-4xl text-center font-extrabold text-rose-800">
          STRAWBERRY ENVIRONMENT HISTORY
        </h4>
        <h4 className="lg:text-6xl md:text-5xl md:hidden text-4xl text-center font-extrabold text-rose-800">
          HISTORY
        </h4>
      </CardHeader>
      <CardContent
        className="bg-rose-50"
        style={{
          backgroundImage: "url('/berries.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto py-4 md:px-18">
          <DataTable columns={columns} data={data} />
        </div>
        <div className="flex justify-end">
          <SeeCurrentReadingButton />
        </div>
      </CardContent>
    </Card>
  );
}
