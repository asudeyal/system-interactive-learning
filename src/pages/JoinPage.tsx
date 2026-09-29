import { FormEvent, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { getDemoSession } from '../lib/demoSession'
import { ArrowRight, Hash, UsersRound } from 'lucide-react'

export function JoinPage() {
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setError('')
    const cleanCode = code.trim()
    const cleanName = nickname.trim()

    if (cleanCode.length !== 6) {
      setError('6 haneli session kodunu gir.')
      return
    }
    if (cleanName.length < 2) {
      setError('Grup veya nickname en az 2 karakter olmalı.')
      return
    }
    if (!getDemoSession(cleanCode)) {
      setError('Bu tarayıcıda açık bir demo session bulunamadı. Önce öğretmen panelinden session oluştur.')
      return
    }

    window.location.href = `/student?session=${encodeURIComponent(cleanCode)}&name=${encodeURIComponent(cleanName)}`
  }

  return (
    <AppShell compact>
      <section className="join-layout">
        <div className="join-visual">
          <div className="join-signal">
            <span className="signal-ring ring-1" />
            <span className="signal-ring ring-2" />
            <span className="signal-ring ring-3" />
            <div className="signal-core"><UsersRound size={34} /></div>
          </div>
          <span className="eyebrow">SystemLab Live</span>
          <h2>Tek kodla derse bağlan.</h2>
          <p>Interaction değiştiğinde sayfayı yenilemeden yeni etkinlik ekranına geçeceksin.</p>
        </div>

        <section className="join-card">
          <span className="eyebrow">Öğrenci girişi</span>
          <h1>Session'a katıl</h1>
          <p>Öğretmenin ekranda gösterdiği 6 haneli kodu ve grup adını gir.</p>
          <form onSubmit={submit}>
            <label>
              <span><Hash size={15} /> Session kodu</span>
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                placeholder="482731"
                autoFocus
              />
            </label>
            <label>
              <span><UsersRound size={15} /> Grup / nickname</span>
              <input
                maxLength={24}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="Grup A"
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button full large" type="submit">
              Session'a katıl <ArrowRight size={18} />
            </button>
          </form>
        </section>
      </section>
    </AppShell>
  )
}
