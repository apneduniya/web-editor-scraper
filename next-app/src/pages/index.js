/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`relative flex flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/bg_light.png')] bg-left-bottom bg-no-repeat z-10 bg-contain" />
    </main>
  );
}
