import { useMemo, useState } from 'react'

const targets = [
  ['Amaç', 'Sistemin var olma nedeni'],
  ['Bileşenler', 'Sistemi oluşturan parçalar'],
  ['İlişkiler', 'Bileşenleri birbirine bağlayan yapı'],
  ['Sistem Sınırı', 'Sistem ile çevreyi ayıran çizgi'],
  ['Çevre', 'Sınırın dışında olup sistemi etkileyen unsurlar'],
  ['Arayüz', 'Sistemler veya alt sistemler arasındaki temas noktası'],
  ['Girdi', 'Sisteme giren madde, enerji veya bilgi'],
  ['Çıktı', 'Dönüşüm sonucunda sistemden çıkan sonuç'],
] as const

export function SystemAnatomyActivity() {
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => Math.round((selected.length / targets.length) * 100), [selected])

  const toggle = (label: string) => {
    if (submitted) return
    setSelected((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  return (
    <section className="activity-card">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 1</span>
          <h2>Sistem Anatomisi</h2>
          <p>İlk prototipte kavramları seçerek ilerliyoruz. Sonraki adımda bunu gerçek drag & drop diyagrama çevireceğiz.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/100` : '100 puan'}</span>
      </div>

      <div className="anatomy-board">
        <div className="environment-label">ÇEVRE</div>
        <div className="system-box">
          <span className="boundary-tag">SİSTEM SINIRI</span>
          <div className="system-purpose">AMAÇ</div>
          <div className="component-grid">
            <div>Bileşen A</div>
            <span>↔</span>
            <div>Bileşen B</div>
          </div>
        </div>
        <span className="flow input">GİRDİ →</span>
        <span className="flow output">→ ÇIKTI</span>
      </div>

      <p className="instruction">Diyagramda yer aldığını düşündüğün temel sistem kavramlarını seç.</p>
      <div className="choice-grid">
        {targets.map(([label]) => (
          <button
            type="button"
            key={label}
            className={selected.includes(label) ? 'concept-chip selected' : 'concept-chip'}
            onClick={() => toggle(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {!submitted ? (
        <button className="primary-button full" type="button" onClick={() => setSubmitted(true)}>
          Cevabı gönder
        </button>
      ) : (
        <div className="result-box">
          <strong>Prototip tamamlandı.</strong>
          <span>Seçilen {selected.length} / {targets.length} kavram • {score} puan</span>
        </div>
      )}
    </section>
  )
}
