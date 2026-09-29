import { useState } from 'react'

const items = [
  ['Üretim hattı', 'inside'],
  ['Çalışanlar', 'inside'],
  ['Makinalar', 'inside'],
  ['Tedarikçi', 'environment'],
  ['Müşteri', 'environment'],
  ['Rakipler', 'environment'],
  ['Faiz oranı', 'environment'],
  ['Yasal düzenlemeler', 'environment'],
  ['Teknoloji', 'environment'],
] as const

export function SystemBoundaryActivity() {
  const [inside, setInside] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const correct = items.filter(([label, place]) => (inside.includes(label) ? place === 'inside' : place === 'environment')).length
  const score = Math.round((correct / items.length) * 100)

  return (
    <section className="activity-card">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 3</span>
          <h2>Sistem Sınırını Belirle</h2>
          <p>Üretim sisteminin sınırları içinde olduğunu düşündüğün unsurları seç.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/100` : '100 puan'}</span>
      </div>

      <div className="boundary-board">
        <div className="boundary-zone">
          <strong>Sistem sınırının içi</strong>
          <span>{inside.length ? inside.join(' • ') : 'Henüz unsur seçilmedi'}</span>
        </div>
      </div>

      <div className="choice-grid">
        {items.map(([label]) => (
          <button
            type="button"
            key={label}
            disabled={submitted}
            className={inside.includes(label) ? 'concept-chip selected' : 'concept-chip'}
            onClick={() =>
              setInside((current) =>
                current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
              )
            }
          >
            {label}
          </button>
        ))}
      </div>

      <button className="primary-button full" type="button" disabled={submitted} onClick={() => setSubmitted(true)}>
        Sınırı değerlendir
      </button>
    </section>
  )
}
