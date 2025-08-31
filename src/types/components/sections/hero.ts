export interface THeroContent {
  title: Array<string | Title>
  subtitle: string
  primaryButton: PrimaryButton
  secondaryButton: SecondaryButton
  image: Image,
  backgroundPattern: BackgroundPattern
}

export interface Title {
  text: string
  highlight: boolean
}

export interface PrimaryButton {
  text: string
  link: string
}

export interface SecondaryButton {
  text: string
  link: string
}

export interface Image {
  src: string
  alt: string
  width: number
  height: number
}

export interface BackgroundPattern {
  src: string
  alt: string
  width: number
  height: number
  showPattern: boolean
}