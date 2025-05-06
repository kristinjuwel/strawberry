"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Environment, columns } from "./columns";
import { DataTable } from "./data-table";
import Image from "next/image";
import { SeeCurrentReadingButton } from "./button";
import { useEffect, useState } from "react";

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

export default function HistoryPage() {
  const [data, setData] = useState<Environment[]>([]);

  // Define Feed type at the top-level so it's accessible in both useEffect and handleDownload
  type Feed = {
    created_at: string;
    field1?: string;
    field2?: string;
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://api.thingspeak.com/channels/2950820/feeds.json?api_key=KRYD2ECPMRNY1HM7&results=1000"
      );
      if (!res.ok) {
        console.error("Failed to fetch data");
        return;
      }

      const json = await res.json();
      const feeds = json.feeds;

      const filtered: Environment[] = [];
      let prevTemp: string | null = null;
      let prevHum: string | null = null;

      feeds.forEach((feed: Feed) => {
        const temp = feed.field1 ? parseFloat(feed.field1).toFixed(2) : null;
        const hum = feed.field2 ? parseFloat(feed.field2).toFixed(2) : null;

        if (temp !== null && hum !== null) {
          if (temp !== prevTemp || hum !== prevHum) {
            filtered.push({
              id: (filtered.length + 1).toString(),
              timestamp: formatTimestamp(feed.created_at),
              temperature: `${temp}°C`,
              humidity: `${hum}%`,
            });
            prevTemp = temp;
            prevHum = hum;
          }
        }
      });

      setData(filtered);
    }

    fetchData();
  }, []);

  return (
    <Card className="w-screen h-full min-h-screen max-w-screen max-h-screen overflow-auto rounded-none border-none shadow-lg p-0 gap-0 bg-rose-50">
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
        <div className="flex flex-col md:flex-row justify-between items-center px-4 mt-4">
          <SeeCurrentReadingButton />
        </div>
      </CardContent>
    </Card>
  );
}
