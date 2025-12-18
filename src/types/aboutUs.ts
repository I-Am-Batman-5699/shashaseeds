export interface AboutUs {
  owner: Owner
  benefits: Benefit[]
  testimonials: Testimonial[]
  mission: Mission
  story: Story
  missionVision: MissionVision
  team: Team[]
}

export interface Owner {
  name: string
  title: string
  bio: string
  image: string
  credentials: string[]
  vision: string
}

export interface Benefit {
  id: number
  title: string
  icon: string
  description: string
}

export interface Testimonial {
  id: number
  user: string
  title: string
  content: string
  source: string
}

export interface Mission {
  title: string
  description: string
}

export interface Story {
  title: string
  content: string
  milestones: string[]
}

export interface MissionVision {
  mission: Mission2
  vision: Vision
}

export interface Mission2 {
  title: string
  text: string
}

export interface Vision {
  title: string
  text: string
}

export interface Team {
  name: string
  role: string
  image: string
}
