"use client"

import MainCarousel from "@/components/carousel/main-carousel";
import Banner from "@/components/banner/featured-banner";
import HeroSection from "@/sections/hero";
import HeroSectionNormal from "@/sections/hero2";
import BenefitsSection from "@/sections/benefits";
import TestimonialsSection from "@/sections/testimonials";
import JoinUsSection from "@/sections/join-us";

export default function LandingPage() {

  const showBanner = false; 

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-900 dark:to-slate-950 rounded-2xl shadow-xl">

      <HeroSection />

      {/* banner offers and news */}
      <Banner />

      {/* normal hero section */}
      {
        showBanner && (
          <HeroSectionNormal />
        )
      }
      <BenefitsSection/>

      {/* join and contact */}
      <JoinUsSection/>

      <TestimonialsSection/>

      <MainCarousel />
    </div>
  )
}
