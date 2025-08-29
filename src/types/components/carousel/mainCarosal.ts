export interface FeaturedItems {
    products: CarouselItem[];
    title: string;
    description: string;
}

export interface CarouselItemDisplay {
    id: string;
    image: string;
    title: string;
    href: string;
}

export interface CarouselItem {
    "product-id": string;
    image: string;
    name: string;
    href: string;
}

export interface HorizontalCarouselProps {
    items: CarouselItemDisplay[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    className?: string;
}