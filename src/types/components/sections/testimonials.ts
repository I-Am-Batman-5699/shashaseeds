export interface TestimonialProps {
  section: Section
  testimonials: Testimonial[]
}

export interface Section {
  title: string
  description: string
  visible: boolean
}

export interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  comment: string
  image: string
  visible: boolean
  date: string
}