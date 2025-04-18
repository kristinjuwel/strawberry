import type { Metadata } from "next";
import { Concert_One } from "next/font/google";
import "./globals.css";

const concert = Concert_One({
  variable: "--font-concert-one",
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Strawberry Environment Monitoring",
  description: "Temperature and Humidity Monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${concert.variable}`}>{children}</body>
    </html>
  );
}
