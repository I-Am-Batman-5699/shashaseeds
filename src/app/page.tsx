"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Mail, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* main */}
      <main className="flex-1">
        {/* Hero Section with Product Showcase */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-amber-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Grow Your Garden with Premium Seeds</h1>
              <p className="text-muted-foreground md:text-xl max-w-[800px]">
                Discover our selection of high-quality, organic seeds for your garden. From vegetables to flowers, we
                have everything you need.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="bg-green-600 hover:bg-green-700">Explore Collection</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>

            {/* Featured Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredSeeds.map((seed) => (
                <Card key={seed.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-square relative">
                    <Image 
                      src={seed.image || "/placeholder.svg"} 
                      alt={seed.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{seed.name}</h3>
                        <p className="text-sm text-muted-foreground">{seed.category}</p>
                      </div>
                      <span className="font-bold text-green-600">${seed.price}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold">Why Choose Our Seeds?</h2>
              <p className="text-muted-foreground mt-2 max-w-[700px] mx-auto">
                We take pride in offering the highest quality seeds for your garden
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">100% Organic</h3>
                <p className="text-muted-foreground">
                  All our seeds are certified organic, grown without harmful pesticides or chemicals.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">High Germination Rate</h3>
                <p className="text-muted-foreground">
                  Our seeds are tested to ensure excellent germination rates and healthy plants.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-green-100 p-3 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Locally Sourced</h3>
                <p className="text-muted-foreground">
                  We work with local farmers to provide seeds that are adapted to your region.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 md:py-20 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold">What Our Customers Say</h2>
              <p className="text-muted-foreground mt-2 max-w-[700px] mx-auto">
                Don&apos;t just take our word for it - hear from our satisfied customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="italic mb-4">&ldquo;{testimonial.comment}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-green-100">
                        <Image
                          src={`/placeholder.svg?height=40&width=40&text=${testimonial.name.charAt(0)}`}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-green-600 via-green-700 to-yellow-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Start Growing?</h2>
            <p className="max-w-[600px] mx-auto mb-6 opacity-90">
              Join thousands of satisfied gardeners and start your garden journey with our premium seeds today.
            </p>
            <Button className="bg-white text-green-600 hover:bg-gray-100">Shop Our Collection</Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-green-900 via-green-800 to-yellow-900 text-gray-200">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold text-white">Shashank Seeds</span>
              </div>
              <p className="text-gray-400 mb-4">Providing premium quality seeds for your garden since 2010.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-white">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Vegetable Seeds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Flower Seeds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Herb Seeds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Fruit Seeds
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    Organic Seeds
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-white">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-400">123 Garden Street, Green City, GC 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400">(123) 456-7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400">info@shashankseeds.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Shashank Seeds. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Sample data for featured seeds
const featuredSeeds = [
  {
    id: 1,
    name: "SHB-76",
    description: "Hybrid Bajra Seeds",
    category: "Seeds",
    price: 4.99,
    image: "/products/SHB-76.jpg",
  },
  {
    id: 2,
    name: "Sunflower Seeds",
    description: "Bright and cheerful sunflower seeds.",
    category: "Flowers",
    price: 3.49,
    image: "/placeholder.svg?height=300&width=300&text=Sunflower",
  },
  {
    id: 3,
    name: "Basil Seeds",
    description: "Aromatic basil seeds for culinary use.",
    category: "Herbs",
    price: 2.99,
    image: "/placeholder.svg?height=300&width=300&text=Basil",
  },
  {
    id: 4,
    name: "Carrot Seeds",
    description: "Crunchy and sweet carrot seeds.",
    category: "Vegetables",
    price: 3.29,
    image: "/placeholder.svg?height=300&width=300&text=Carrot",
  },
  {
    id: 5,
    name: "Carrot Seeds",
    description: "Crunchy and sweet carrot seeds.",
    category: "Vegetables",
    price: 3.29,
    image: "/placeholder.svg?height=300&width=300&text=Carrot",
  },
]

// Sample data for testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    location: "California",
    rating: 5,
    comment:
      "The tomato seeds I purchased grew into the most productive plants I've ever had. Will definitely buy again!",
  },
  {
    name: "Michael Brown",
    location: "Oregon",
    rating: 5,
    comment: "I'm amazed at how quickly the seeds germinated. The flowers are beautiful and exactly as described.",
  },
  {
    name: "Emily Davis",
    location: "Texas",
    rating: 4,
    comment: "Great quality seeds and excellent customer service. My herb garden is thriving thanks to Shashank Seeds.",
  },
]