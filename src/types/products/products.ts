export interface ProductProps {
    title: string;
    description: string;
    products: Product[];
}

export interface Product {
  id: string
  name: string
  category?: string
  subCategory?: string
  slug?: string
  price: number
  discountPrice?: number
  discountPercentage?: number
  finalPrice?: number
  discount?: number
  discountAvailable?: boolean
  available: boolean
  enabled: boolean
  visible: boolean
  new?: boolean
  sale?: boolean
  featured?: boolean
  rating?: number
  tags?: string[]
  images: string[]
  description?: string
  stock?: number
  sku?: string
  createdAt: string
  updatedAt: string
  attributes?: Attributes
  filters: ProductFilters
  searchKeywords: string[]
  image?: string
}

export interface Attributes {
  color: string
  germinationRate: string
  season: string
  growthTime: string
}

export interface ProductFilters {
    type: string;
    organic: boolean;
    available?: boolean;
    priceRange?: string;
    rating?: string;
}

export interface FeaturedProductsProps {
    title: string;
    description: string;
    products: FeaturedProduct[];
}

export interface FeaturedProduct {
  "product-id": string
  name: string
  image: string
}
