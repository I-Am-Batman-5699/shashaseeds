export interface ProductProps {
  title: string
  description: string
  products: Product[]
}

export interface Product {
  id: string
  name: string
  category: string
  subCategory: string
  slug: string
  price: number
  discount: number
  available: boolean
  enabled: boolean
  visible: boolean
  new: boolean
  sale: boolean
  featured: boolean
  rating: number
  tags: string[]
  images: string[]
  description: string
  stock: number
  sku: string
  createdAt: string
  updatedAt: string
  attributes: Attributes
  filters: Filters
  searchKeywords: string[]
}

export interface Attributes {
  color: string
  germinationRate: string
  season: string
  growthTime: string
}

export interface Filters {
  priceRange: string
  type: string
  organic: boolean
}
