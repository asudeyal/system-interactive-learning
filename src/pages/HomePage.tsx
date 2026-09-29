import { AppShell } from '../components/AppShell'
import { ArrowRight, Presentation, Smartphone } from 'lucide-react'

export function HomePage() {
  return (
    <AppShell>
      <section className="hero-panel">
        <span className="eyebrow">Canlı sınıf etkileşim platformu</span>
        <h1>Sistem Analizi ve Tasarımı dersini birlikte çalıştır.</h1>
        <p>Öğretmen tek bir oturum açar. Öğrenciler kodla katılır; aktif interaction değiştikçe telefon ekranları otomatik olarak değişir.</p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => (window.location.href = '/teacher')}>
            <Presentation size={18} /> Öğretmen paneli <ArrowRight size={18} />
          </button>
          <button className="secondary-button" type="button" onClick={() => (window.location.href = '/join')}>
            <Smartphone size={18} /> Öğrenci olarak katıl
          </button>
        </div>
      </section>

      <section className="feature-grid">
        <article><strong>1</strong><h3>Session oluştur</h3><p>Hoca sınıf için tek oturum kodu üretir.</p></article>
        <article><strong>2</strong><h3>Interaction başlat</h3><p>Dersin uygun noktasında istediği modülü aktive eder.</p></article>
        <article><strong>3</strong><h3>Canlı sonuç</h3><p>Puan ve sınıf performansı ortak panelde toplanır.</p></article>
      </section>
    </AppShell>
  )
}
