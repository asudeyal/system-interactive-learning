import { useState } from 'react'
import { AppShell } from '../components/AppShell'
import { activities } from '../data/activities'
import type { ActivityId } from '../types'
import { SystemAnatomyActivity } from '../activities/SystemAnatomyActivity'
import { RelationshipNetworkActivity } from '../activities/RelationshipNetworkActivity'
import { SystemBoundaryActivity } from '../activities/SystemBoundaryActivity'
import { SystemFlowActivity } from '../activities/SystemFlowActivity'

const renderActivity = (id: ActivityId) => {
  switch (id) {
    case 'system-anatomy': return <SystemAnatomyActivity />
    case 'relationship-network': return <RelationshipNetworkActivity />
    case 'system-boundary': return <SystemBoundaryActivity />
    case 'system-flow': return <SystemFlowActivity />
  }
}

export function StudentPage() {
  const params = new URLSearchParams(window.location.search)
  const name = params.get('name') || 'Öğrenci'
  const session = params.get('session') || '482731'
  const [active, setActive] = useState<ActivityId | null>(null)

  return (
    <AppShell compact>
      <section className="student-meta">
        <div><small>SESSION</small><strong>{session}</strong></div>
        <div><small>KATILIMCI</small><strong>{name}</strong></div>
      </section>

      {!active ? (
        <section className="waiting-card">
          <div className="pulse-dot" />
          <span className="eyebrow">Bağlandın</span>
          <h1>Öğretmenin interaction başlatmasını bekliyoruz.</h1>
          <p>Gerçek sürümde bu ekran Supabase Realtime üzerinden otomatik değişecek.</p>
          <div className="demo-picker">
            <span>Şimdilik test etmek için:</span>
            {activities.map((activity) => <button type="button" key={activity.id} onClick={() => setActive(activity.id)}>{activity.shortTitle}</button>)}
          </div>
        </section>
      ) : (
        <>
          <button className="back-link" type="button" onClick={() => setActive(null)}>← Bekleme ekranına dön</button>
          {renderActivity(active)}
        </>
      )}
    </AppShell>
  )
}
