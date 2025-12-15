"use client"

import MainCarousel from "@/components/carousel/main-carousel";
import Banner from "@/components/banner/featured-banner";
import HeroSection from "@/sections/hero";
import HeroSectionNormal from "@/sections/hero2";
import BenefitsSection from "@/sections/benefits";
import TestimonialsSection from "@/sections/testimonials";
import JoinUsSection from "@/sections/join-us";

export default function LandingPage() {


  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl">
      <JoinUsSection/>
      <TestimonialsSection/>
      <BenefitsSection/>

      <Banner />
      <MainCarousel />
      <HeroSection />
      <HeroSectionNormal />
    </div>
  )
}
