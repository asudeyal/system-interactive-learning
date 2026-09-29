import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { activities } from '../data/activities'
import type { ActivityId } from '../types'
import {
  createDemoSession,
  participantTotal,
  setDemoActiveActivity,
  subscribeDemoSession,
  type DemoSession,
} from '../lib/demoSession'
import { Copy, Play, Users, Trophy, Square, Radio, QrCode } from 'lucide-react'

export function TeacherPage() {
  const [session, setSession] = useState<DemoSession | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!session?.code) return
    return subscribeDemoSession(session.code, setSession)
  }, [session?.code])

  const rankedParticipants = useMemo(
    () =>
      [...(session?.participants ?? [])].sort(
        (a, b) => participantTotal(b) - participantTotal(a),
      ),
    [session],
  )

  const totalScore = rankedParticipants.reduce(
    (total, participant) => total + participantTotal(participant),
    0,
  )

  const createSession = () => setSession(createDemoSession())

  const setActive = (activity: ActivityId | null) => {
    if (!session) return
    const updated = setDemoActiveActivity(session.code, activity)
    if (updated) setSession(updated)
  }

  const copyCode = async () => {
    if (!session) return
    try {
      await navigator.clipboard.writeText(session.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <AppShell>
      <section className="page-heading teacher-heading">
        <div>
          <span className="eyebrow">Öğretmen paneli</span>
          <h1>Canlı ders kontrolü</h1>
          <p>
            Tek session, dört farklı interaction. Öğrenciler bir kez katılır; sen hangi
            etkinliği açarsan ekranları otomatik olarak ona geçer.
          </p>
        </div>
        {!session ? (
          <button className="primary-button large" type="button" onClick={createSession}>
            <Radio size={19} /> Yeni session oluştur
          </button>
        ) : (
          <div className="session-cluster">
            <div className="session-code">
              <div>
                <small>SESSION KODU</small>
                <strong>{session.code}</strong>
              </div>
              <button type="button" title="Kodu kopyala" onClick={copyCode}>
                <Copy size={17} />
              </button>
            </div>
            <span className="copy-feedback">{copied ? 'Kopyalandı' : 'Öğrenciler /join ekranından katılır'}</span>
          </div>
        )}
      </section>

      {!session ? (
        <section className="teacher-empty">
          <div className="empty-orbit">
            <div className="orbit-core"><Play size={28} /></div>
            <span className="orbit-dot one" />
            <span className="orbit-dot two" />
            <span className="orbit-dot three" />
          </div>
          <h2>Ders henüz başlamadı.</h2>
          <p>Session oluşturduğunda kontrol paneli, katılımcılar ve interaction akışı açılacak.</p>
        </section>
      ) : (
        <>
          <section className="session-banner">
            <div className="session-qr-placeholder"><QrCode size={48} /></div>
            <div>
              <span className="eyebrow">Öğrenci katılımı</span>
              <h2>/join • kod {session.code}</h2>
              <p>Şimdilik aynı bilgisayardaki farklı sekmeler arasında canlı çalışır. Supabase bağlantısından sonra telefonlardan da aynı şekilde çalışacak.</p>
            </div>
            <div className="live-dot"><span /> CANLI DEMO</div>
          </section>

          <section className="teacher-stats">
            <div><Users /><span><strong>{session.participants.length}</strong> bağlı katılımcı</span></div>
            <div><Play /><span><strong>{session.activeActivity ? 'Aktif' : 'Bekliyor'}</strong> interaction</span></div>
            <div><Trophy /><span><strong>{totalScore}</strong> toplam puan</span></div>
          </section>

          <section className="section-block">
            <div className="section-title">
              <div><span className="eyebrow">Ders akışı</span><h2>Interaction'lar</h2></div>
              {session.activeActivity && (
                <button className="secondary-button" type="button" onClick={() => setActive(null)}>
                  <Square size={16} /> Interaction'ı kapat
                </button>
              )}
            </div>

            <div className="activity-grid">
              {activities.map((activity, index) => {
                const isActive = session.activeActivity === activity.id
                return (
                  <article
                    className={isActive ? 'activity-tile active' : 'activity-tile'}
                    key={activity.id}
                    style={{ '--activity-accent': activity.accent } as React.CSSProperties}
                  >
                    <div className="activity-tile-top">
                      <div className="activity-number">{String(index + 1).padStart(2, '0')}</div>
                      {isActive && <span className="active-badge"><span /> CANLI</span>}
                    </div>
                    <span className="recommended">{activity.recommendedAfter}</span>
                    <h3>{activity.title}</h3>
                    <p>{activity.description}</p>
                    <div className="tile-footer">
                      <span>{activity.maxScore} puan</span>
                      <button type="button" onClick={() => setActive(activity.id)}>
                        {isActive ? 'Yayında' : 'Başlat'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="section-block">
            <div className="section-title">
              <div><span className="eyebrow">Canlı sıralama</span><h2>Leaderboard</h2></div>
              <span className="muted">En yüksek toplam puan üstte.</span>
            </div>
            <div className="leaderboard">
              {rankedParticipants.length === 0 ? (
                <div className="leader-empty">Henüz katılan yok. Öğrenci sekmesinden session koduyla katılabilirsin.</div>
              ) : (
                rankedParticipants.map((participant, index) => (
                  <div className="leader-row" key={participant.id}>
                    <span className={index < 3 ? `rank rank-${index + 1}` : 'rank'}>{index + 1}</span>
                    <div className="leader-name"><strong>{participant.nickname}</strong><small>{Object.keys(participant.scores).length}/4 interaction tamamlandı</small></div>
                    <span>{participantTotal(participant)} puan</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </AppShell>
  )
}
