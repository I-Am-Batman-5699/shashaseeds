export interface BenefitsSectionProps {
  title: string
  subtitle: string
  benefits: Benefit[]
}

export interface Benefit {
  id: number
  icon: string
  title: string
  description: string
  iconName?: string
  visible?: boolean
}