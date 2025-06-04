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
          <div className="justify-center items-center w-full border-2 p-4">
            <ImageCard imageUrl="/products/SHB-76.jpg" altText="Seeds for a bountiful harvest" title="Hybrid Millet seeds"></ImageCard>
          </div>
          <div className="mt-4">
            <section className="w-full max-w-4xl sm:p-2 border-amber-50 border-2" >
              <div className="px-4 py-4 sm:p-4 flex flex-col items-start justify-start">
                <div className="items-start justify-self-start mb-1">
                  <h2 className="text-3xl font-bold mb-1 text-center text-green-300">
                    About Us
                  </h2>
                </div>
                <div className="items-start justify-self-start">
                  <p className="text-base sm:text-lg leading-relaxed opacity-90">
                    {appData?.appDescription}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 sm:p-4 flex flex-col items-start justify-start">
                <div className="items-start justify-self-start mb-1">
                  <h2 className="text-2xl font-bold mb-1 text-green-300">
                    Meet the Owner
                  </h2>
                </div>
                <p className="text-l text-start sm:text-lg leading-relaxed opacity-90">
                  Owner & Director: <span className="font-black">K. S. Choudhary</span>
                </p>
                <p>
                  Shashank Seeds is a family-owned business. Our founder, K. S. Choudhary, has dedicated his life to providing high-quality seeds to farmers across India. His passion for agriculture and commitment to excellence have been the driving force behind our success.
                </p>
              </div>
            </section>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center self-end w-full mt-auto bottom-0">
          <div className="w-full h-px animate-glow md:block animate-pulse bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
          <Footer classNameProp={`${bg}`}></Footer>
        </footer>
      </div>
    </>
  );
}
