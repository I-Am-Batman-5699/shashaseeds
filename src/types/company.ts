export interface Company {
    companyInfo: CompanyInfo
    contactInfo: ContactInfo
    socialLinks: SocialLink[]
}

export interface CompanyInfo {
    name: string
    logo: string
    logoAlt: string
    tagline: string
    description: string
    email: string
}

export interface ContactInfo {
    address: string
    phone: string
    email: string
}

export interface SocialLink {
    id: string
    name: string
    href: string
    visible: boolean
    enabled: boolean
    icon: string
}