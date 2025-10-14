"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Particles from "@/components/particles";
import { useEffect, useState } from "react";
import ProductList from "@/components/Products";
import AboutUs from "@/components/About";

export interface RootAppData {
  appData: AppData
}

export interface AppData {
  appName: string
  appDescription: string
  siteName: string
  keywords: string[]
  slogan: string
  pages: string[]
  sideNav: string[]
  url: string
  logo: string
  copy: string
  address: string
  mobile: string
  email: string
  instagram: string
}

export default function Home() {
  const bg = "";
  const [appData, setAppData] = useState<AppData | null>(null);

  const getContent = async () => {
    try {
      const response = await fetch("/models/appContentTexts.json", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error in Footer getContent:', error);
      throw error;
    }
  };

  const fetchData = async () => {
    if (!appData) {
      try {
        const oData = await getContent();
        setAppData(oData.appData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Particles className="absolute inset-0 z-10 animate-fade-in py-0 mt-0" quantity={600} />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-black from-30% to-blue-800 to-100% text-white">
        <Navbar />
        <main className="flex flex-col gap-[10px] row-start-2 items-center">
          <ProductList/>
          <AboutUs/>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center self-end w-full mt-auto bottom-0">
          <div className="w-full h-px animate-glow md:block animate-pulse bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
          <Footer classNameProp={`${bg}`}></Footer>
        </footer>
      </div>
    </>
  );
}
