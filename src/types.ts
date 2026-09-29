export type ActivityId =
  | 'system-anatomy'
  | 'relationship-network'
  | 'system-boundary'
  | 'system-flow'

export type SessionStatus = 'waiting' | 'active' | 'results'

export interface ActivityDefinition {
  id: ActivityId
  title: string
  shortTitle: string
  description: string
  recommendedAfter: string
  maxScore: number
  accent: string
}

export interface DemoStudent {
  id: string
  nickname: string
  score: number
}
