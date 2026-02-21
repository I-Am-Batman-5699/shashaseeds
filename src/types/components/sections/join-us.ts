export interface JoinUSProps {
  title: string
  decorativeElementText: string
  description: string
  actions: Action[]
}

export interface Action {
  label: string
  href: string
  cssClass?: string
}
