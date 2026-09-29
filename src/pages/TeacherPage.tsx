import { useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { activities } from '../data/activities'
import type { ActivityId } from '../types'
import { Copy, Play, Users, Trophy } from 'lucide-react'

const demoStudents = [
  { id: '1', nickname: 'Grup A', score: 220 },
  { id: '2', nickname: 'Grup B', score: 185 },
  { id: '3', nickname: 'Grup C', score: 160 },
]

export function TeacherPage() {
  const [sessionCreated, setSessionCreated] = useState(false)
  const [active, setActive] = useState<ActivityId | null>(null)
  const sessionCode = useMemo(() => '482731', [])

  return (
    <AppShell>
      <section className="page-heading">
        <div><span className="eyebrow">Öğretmen paneli</span><h1>Canlı ders kontrolü</h1><p>Bu ekran MVP aşamasında demo verileriyle çalışıyor. Supabase bağlandığında session ve sonuçlar gerçek zamanlı olacak.</p></div>
        {!sessionCreated ? (
          <button className="primary-button" type="button" onClick={() => setSessionCreated(true)}>Yeni session oluştur</button>
        ) : (
          <div className="session-code"><small>SESSION KODU</small><strong>{sessionCode}</strong><button type="button" title="Kodu kopyala"><Copy size={17}/></button></div>
        )}
      </section>

      {sessionCreated && (
        <>
          <section className="teacher-stats">
            <div><Users/><span><strong>3</strong> bağlı grup</span></div>
            <div><Play/><span><strong>{active ? 'Aktif' : 'Bekliyor'}</strong> interaction</span></div>
            <div><Trophy/><span><strong>565</strong> toplam puan</span></div>
          </section>

          <section className="section-block">
            <div className="section-title"><div><span className="eyebrow">Ders akışı</span><h2>Interaction'lar</h2></div><span className="muted">Hoca istediği anda başlatabilir.</span></div>
            <div className="activity-grid">
              {activities.map((activity, index) => (
                <article className={active === activity.id ? 'activity-tile active' : 'activity-tile'} key={activity.id}>
                  <div className="activity-number">{String(index + 1).padStart(2,'0')}</div>
                  <span className="recommended">{activity.recommendedAfter}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <div className="tile-footer"><span>{activity.maxScore} puan</span><button type="button" onClick={() => setActive(activity.id)}>{active === activity.id ? 'Aktif' : 'Başlat'}</button></div>
                </article>
              ))}
            </div>
          </section>

          <section className="section-block">
            <div className="section-title"><div><span className="eyebrow">Canlı sıralama</span><h2>Leaderboard</h2></div></div>
            <div className="leaderboard">
              {demoStudents.map((student, index) => (
                <div className="leader-row" key={student.id}><span className="rank">{index + 1}</span><strong>{student.nickname}</strong><span>{student.score} puan</span></div>
              ))}
            </div>
          </section>
        </>
      )}
    </AppShell>
  )
}
