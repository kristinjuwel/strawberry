"use client";

import { Button } from "@/components/ui/button";
import { FileChartColumnIncreasing } from "lucide-react";
import { useRouter } from "next/navigation";

export function SeeCurrentReadingButton() {
  const router = useRouter();
  return (
    <Button
      className="w-full md:w-auto md:mx-18 text-white mt-10 text-lg bg-rose-500 rounded-xl text-center justify-center items-center p-4 h-12 hover:bg-rose-800 hover:shadow-lg hover:cursor-pointer transition-all duration-300 ease-in-out"
      onClick={() => router.push("/")}
    >
      <span className="flex flex-row gap-2 ">
        <FileChartColumnIncreasing
          className="text-white font-bold text-center size-6 mt-0.5"
          strokeWidth={2.5}
        />
        <p>See Current Reading</p>
      </span>
    </Button>
  );
}
