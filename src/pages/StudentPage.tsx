import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import type { ActivityId } from '../types'
import {
  joinDemoSession,
  submitDemoScore,
  subscribeDemoSession,
  type DemoSession,
} from '../lib/demoSession'
import { getActivity } from '../data/activities'
import { SystemAnatomyActivity } from '../activities/SystemAnatomyActivity'
import { RelationshipNetworkActivity } from '../activities/RelationshipNetworkActivity'
import { SystemBoundaryActivity } from '../activities/SystemBoundaryActivity'
import { SystemFlowActivity } from '../activities/SystemFlowActivity'
import { LoaderCircle, Radio } from 'lucide-react'

const renderActivity = (id: ActivityId, onComplete: (score: number) => void) => {
  switch (id) {
    case 'system-anatomy': return <SystemAnatomyActivity onComplete={onComplete} />
    case 'relationship-network': return <RelationshipNetworkActivity onComplete={onComplete} />
    case 'system-boundary': return <SystemBoundaryActivity onComplete={onComplete} />
    case 'system-flow': return <SystemFlowActivity onComplete={onComplete} />
  }
}

export function StudentPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const name = params.get('name') || 'Öğrenci'
  const code = params.get('session') || ''
  const [session, setSession] = useState<DemoSession | null>(null)
  const [participantId, setParticipantId] = useState('')
  const [joinError, setJoinError] = useState('')

  useEffect(() => {
    const storedId = sessionStorage.getItem(`systemlab-participant:${code}`) || undefined
    const joined = joinDemoSession(code, name, storedId)
    if (!joined) {
      setJoinError('Session bulunamadı veya kapatılmış olabilir.')
      return
    }

    setParticipantId(joined.participantId)
    sessionStorage.setItem(`systemlab-participant:${code}`, joined.participantId)
    setSession(joined.session)
    return subscribeDemoSession(code, setSession)
  }, [code, name])

  const activeDefinition = getActivity(session?.activeActivity)

  const complete = (score: number) => {
    if (!session?.activeActivity || !participantId) return
    submitDemoScore(code, participantId, session.activeActivity, score)
  }

  if (joinError) {
    return (
      <AppShell compact>
        <section className="waiting-card error-state">
          <h1>Session'a bağlanamadık.</h1>
          <p>{joinError}</p>
          <button className="primary-button" type="button" onClick={() => (window.location.href = '/join')}>Tekrar dene</button>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell compact>
      <section className="student-meta">
        <div><small>SESSION</small><strong>{code || '—'}</strong></div>
        <div className="student-live"><Radio size={15} /><span>CANLI</span></div>
        <div><small>KATILIMCI</small><strong>{name}</strong></div>
      </section>

      {!session ? (
        <section className="waiting-card">
          <LoaderCircle className="spin" size={34} />
          <h1>Session'a bağlanılıyor…</h1>
        </section>
      ) : !session.activeActivity ? (
        <section className="waiting-card">
          <div className="pulse-stage">
            <span className="pulse-wave wave-one" />
            <span className="pulse-wave wave-two" />
            <div className="pulse-core"><Radio size={26} /></div>
          </div>
          <span className="eyebrow">Bağlandın</span>
          <h1>Hazırsın. Öğretmenin interaction başlatmasını bekliyoruz.</h1>
          <p>Bu ekran açık kalsın. Öğretmen yeni etkinliği başlattığında otomatik geçiş yapacak.</p>
        </section>
      ) : (
        <>
          <section className="student-activity-bar">
            <div>
              <span className="eyebrow">Şu an yayında</span>
              <strong>{activeDefinition?.title}</strong>
            </div>
            <span>{activeDefinition?.maxScore} puan</span>
          </section>
          {renderActivity(session.activeActivity, complete)}
        </>
      )}
    </AppShell>
  )
}
