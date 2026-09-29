import type { ActivityId } from '../types'

export interface DemoParticipant {
  id: string
  nickname: string
  scores: Partial<Record<ActivityId, number>>
  joinedAt: number
}

export interface DemoSession {
  code: string
  createdAt: number
  activeActivity: ActivityId | null
  participants: DemoParticipant[]
}

const STORAGE_PREFIX = 'systemlab-session:'
const channel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('systemlab-live')
  : null

const key = (code: string) => `${STORAGE_PREFIX}${code}`

const emit = (code: string) => {
  channel?.postMessage({ type: 'session-updated', code })
  window.dispatchEvent(new CustomEvent('systemlab-session-updated', { detail: { code } }))
}

export function createDemoSession(): DemoSession {
  let code = ''
  do {
    code = String(Math.floor(100000 + Math.random() * 900000))
  } while (localStorage.getItem(key(code)))

  const session: DemoSession = {
    code,
    createdAt: Date.now(),
    activeActivity: null,
    participants: [],
  }
  localStorage.setItem(key(code), JSON.stringify(session))
  emit(code)
  return session
}

export function getDemoSession(code: string): DemoSession | null {
  const raw = localStorage.getItem(key(code))
  if (!raw) return null
  try {
    return JSON.parse(raw) as DemoSession
  } catch {
    return null
  }
}

export function updateDemoSession(code: string, updater: (session: DemoSession) => DemoSession) {
  const current = getDemoSession(code)
  if (!current) return null
  const next = updater(current)
  localStorage.setItem(key(code), JSON.stringify(next))
  emit(code)
  return next
}

export function setDemoActiveActivity(code: string, activity: ActivityId | null) {
  return updateDemoSession(code, (session) => ({ ...session, activeActivity: activity }))
}

export function joinDemoSession(code: string, nickname: string, participantId?: string) {
  const id = participantId || crypto.randomUUID()
  const updated = updateDemoSession(code, (session) => {
    const existing = session.participants.find((participant) => participant.id === id)
    if (existing) {
      return {
        ...session,
        participants: session.participants.map((participant) =>
          participant.id === id ? { ...participant, nickname } : participant,
        ),
      }
    }

    return {
      ...session,
      participants: [
        ...session.participants,
        { id, nickname, scores: {}, joinedAt: Date.now() },
      ],
    }
  })

  return updated ? { session: updated, participantId: id } : null
}

export function submitDemoScore(
  code: string,
  participantId: string,
  activity: ActivityId,
  score: number,
) {
  return updateDemoSession(code, (session) => ({
    ...session,
    participants: session.participants.map((participant) =>
      participant.id === participantId
        ? {
            ...participant,
            scores: {
              ...participant.scores,
              [activity]: Math.max(participant.scores[activity] ?? 0, score),
            },
          }
        : participant,
    ),
  }))
}

export function participantTotal(participant: DemoParticipant) {
  return Object.values(participant.scores).reduce((total, score) => total + (score ?? 0), 0)
}

export function subscribeDemoSession(code: string, callback: (session: DemoSession | null) => void) {
  const refresh = () => callback(getDemoSession(code))
  const customListener = (event: Event) => {
    const detail = (event as CustomEvent<{ code: string }>).detail
    if (detail?.code === code) refresh()
  }
  const storageListener = (event: StorageEvent) => {
    if (event.key === key(code)) refresh()
  }
  const channelListener = (event: MessageEvent<{ type: string; code: string }>) => {
    if (event.data?.type === 'session-updated' && event.data.code === code) refresh()
  }

  window.addEventListener('systemlab-session-updated', customListener)
  window.addEventListener('storage', storageListener)
  channel?.addEventListener('message', channelListener)
  refresh()

  return () => {
    window.removeEventListener('systemlab-session-updated', customListener)
    window.removeEventListener('storage', storageListener)
    channel?.removeEventListener('message', channelListener)
  }
}
