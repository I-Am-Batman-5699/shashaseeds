// types/navigation.ts

export interface NavigationSubItem {
    id: string;
    label: string;
    href: string;
    color?: string; 
    enabled?: boolean;
    visible?: boolean;
}

export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon?: string; 
    children?: NavigationSubItem[];
    svgIcon?: string; 
    color?: string; 
    enabled?: boolean;
    visible?: boolean;
    showChildren?: boolean; 
}

export interface CompanyInfo {
    name: string;
    logo: string;
    logoAlt: string;
    tagline?: string;
    description?: string;
}

export interface ActionButton {
    id: string;
    label: string;
    variant: 'default' | 'outline' | 'ghost';
    className?: string;
    href?: string;
    onClick?: string; 
    icon?: string; 
    enabled: boolean;
    visible: boolean;
}

export interface SocialLink {
    id: string;
    name: string;
    href: string;
    icon: string; 
}

export interface ContactInfo {
    address: string;
    phone: string;
    email: string;
}

export interface FooterSection {
    id: string;
    title: string;
    links: Array<{
        id: string;
        label: string;
        href: string;
    }>;
}