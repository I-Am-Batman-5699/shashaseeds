export interface BannerItem {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    href: string;
}

export interface BannerCarouselProps {
    items: BannerItem[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    className?: string;
    height?: string;
    showLoadinIndicator?: boolean;
}

export interface BannerCarouselWrapperProps {
  BannerItems: BannerItem[];
}