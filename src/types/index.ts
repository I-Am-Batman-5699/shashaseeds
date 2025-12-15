// types/index.ts

export interface NavigationSubItem {
    id: string;
    label: string;
    href: string;
    color?: string; // For mobile menu colored dots
    enabled?: boolean; // For future use
    visible?: boolean; // For future use
}

export interface NavigationItem {
    id: string;
    label: string;
    href: string;
    icon?: string; // SVG path string
    children?: NavigationSubItem[];
    svgIcon?: string; // SVG path string for dropdown indicator
    color?: string; // For mobile menu colored dots
    enabled?: boolean; // For future use
    visible?: boolean; // For future use
    showChildren?: boolean; // Whether to show children in dropdown
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
    onClick?: string; // Action type
    icon?: string; // SVG path string
    enabled: boolean;
    visible: boolean;
}

export interface SocialLink {
    id: string;
    name: string;
    href: string;
    icon: string; // SVG path string
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

export interface CSSProperties extends React.CSSProperties {
    /**
     * Allows for CSS variables to be passed to the style prop.
     * e.g., style={{ '--my-variable': 'value' }}
     */
    [key: `--${string}`]: string | number;
  }