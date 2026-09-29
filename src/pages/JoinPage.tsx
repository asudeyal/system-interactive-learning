import { FormEvent, useState } from 'react'
import { AppShell } from '../components/AppShell'

export function JoinPage() {
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!code.trim() || !nickname.trim()) return
    window.location.href = `/student?session=${encodeURIComponent(code.trim())}&name=${encodeURIComponent(nickname.trim())}`
  }

  return (
    <AppShell compact>
      <section className="join-card">
        <span className="eyebrow">Öğrenci girişi</span>
        <h1>Session'a katıl</h1>
        <p>Öğretmenin ekranda gösterdiği kodu ve grup adını gir.</p>
        <form onSubmit={submit}>
          <label>Session kodu<input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g,''))} placeholder="482731"/></label>
          <label>Grup / nickname<input maxLength={24} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Grup A"/></label>
          <button className="primary-button full" type="submit">Session'a katıl</button>
        </form>
      </section>
    </AppShell>
  )
}
