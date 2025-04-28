"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Droplet, FileClock, Thermometer } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDateTime(new Date());
      const timer = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  const formatDateTime = (date: Date | null) => {
    if (!date) return { date: "", time: "" };

    return {
      date: date.toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      time: date
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
        .replace(/AM|PM/, (match) => (match === "AM" ? " A.M." : " P.M.")),
    };
  };

  const { date, time } = formatDateTime(currentDateTime);
  return (
    <Card className="w-screen h-full min-h-screen max-w-screen max-h-screen overflow-auto rounded-none border-none shadow-lg p-0 gap-0 bg-rose-50">
      <CardHeader className="bg-rose-200 p-6 md:p-10 text-white flex h-full flex-row items-center justify-center">
        <h4 className="lg:text-7xl md:text-6xl text-5xl text-center font-extrabold text-rose-800">
          STRAWBERRY ENVIRONMENT
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
        <div className="md:flex md:flex-row justify-center ">
          <Image
            className="mx-0 mb-4 md:size-2/5 md:-ml-10 md:z-10 hidden md:flex"
            src="/center.png"
            alt="Strawberry"
            width={500}
            height={500}
          />
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row w-full pt-8 md:pt-20 gap-4 md:gap-6 items-center justify-center">
              <Card className="p-0 w-64 md:w-80 overflow-hidden shadow-lg h-44 md:h-56 border-none bg-white">
                <CardHeader className="bg-amber-100 h-14 md:h-18 p-4 text-white items-center justify-center">
                  <div className="flex items-center justify-between">
                    <Thermometer
                      className="text-rose-700 font-bold text"
                      strokeWidth={2.5}
                      size={35}
                    />
                    <p className="md:text-4xl text-3xl text-rose-700">
                      Temperature
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="md:text-8xl text-7xl text-center tracking-tighter text-rose-700">
                    28.9&nbsp;&deg;C
                  </p>
                </CardContent>
              </Card>
              <Card className="p-0 w-64 md:w-80 overflow-hidden shadow-lg h-44 md:h-56 border-none bg-white">
                <CardHeader className="bg-amber-100 h-14 md:h-18 p-4 text-white items-center justify-center">
                  <div className="flex items-center justify-between">
                    <Droplet
                      className="text-rose-700 font-bold text fill-rose-700"
                      strokeWidth={2.5}
                      size={35}
                    />
                    <p className="md:text-4xl text-3xl text-rose-700">
                      Humidity
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="md:text-8xl text-7xl text-center tracking-tighter text-rose-700">
                    60%
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col md:gap-16">
              <span className="flex md:flex-row flex-col text-lg md:text-2xl lg:text-3xl p-2 w-full text-rose-600 md:tracking-wide justify-start items-center">
                <p className="hidden md:flex">
                  Last Updated at {date}&nbsp;- {time}
                </p>
                <p className="flex md:hidden">Last Updated at:</p>
                <p className="flex md:hidden md:right-20 text-end">
                  {date} - {time}
                </p>
              </span>
              <div className="flex md:justify-end justify-center">
                <Button
                  className="text-white text-xl md:text-2xl bg-rose-500 rounded-xl text-center justify-center items-center p-4 h-12 md:h-16 hover:bg-rose-800 hover:shadow-lg  hover:cursor-pointer transition-all duration-300 ease-in-out"
                  onClick={() => router.push("/history")}
                >
                  <span className="flex flex-row gap-2">
                    <FileClock
                      className="text-white font-bold text-center md:size-8 size-6 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <p>See Previous Readings</p>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
