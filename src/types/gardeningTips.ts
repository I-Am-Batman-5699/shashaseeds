export interface GardeningTips {
    hero: Hero
    tips: Tip[]
    outro: Outro
}

export interface Hero {
    tag: string
    titleMain: string
    titleAccent: string
    description: string
}

export interface Tip {
    id: string
    title: string
    desc: string
    iconName: string
}

export interface Outro {
  titlePrefix: string
  stateActive: string
  stateIdle: string
  btnAction: string
  btnLoading: string
  btnSuccess: string
}