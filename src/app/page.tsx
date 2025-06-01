"use client";
import Footer from "@/components/footer";
import ImageCard from "@/components/ImageCard";
import Navbar from "@/components/navbar";
import Particles from "@/components/particles";
import { useEffect, useState } from "react";

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
      <Particles className="absolute inset-0 z-10 animate-fade-in py-0 mt-0" quantity={400} />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-r from-black from-30% to-blue-800 to-100%">
        <Navbar />
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="justify-center items-center w-full">
            
            <ImageCard imageUrl="/products/SHB-76.jpg" altText="Seeds for a bountiful harvest" title="Hybrid Millet seeds"></ImageCard>
          </div>
          <div className="">
            <section className="w-full max-w-4xl sm:p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-center text-green-300">
                  Meet the Owner
                </h2>
                <p className="text-xl text-center">
                  Owner: K. S. Choudhary
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-4 text-center text-green-300">
                  About Shashank Seeds
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-center opacity-90">
                  {appData?.appDescription}
                </p>
              </div>
            </section>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center self-end w-full mt-auto bottom-0">
          <Footer classNameProp={`${bg}`}></Footer>
        </footer>
      </div>
    </>
  );
}
