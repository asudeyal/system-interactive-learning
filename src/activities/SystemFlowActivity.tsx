import { useMemo, useState } from 'react'

const correctOrder = ['Tasarım', 'Üretim', 'Satış', 'Teslim', 'Servis']

export function SystemFlowActivity() {
  const [order, setOrder] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const remaining = useMemo(() => correctOrder.filter((item) => !order.includes(item)), [order])
  const correctCount = order.filter((item, index) => item === correctOrder[index]).length
  const score = Math.round((correctCount / correctOrder.length) * 150)

  return (
    <section className="activity-card">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 4</span>
          <h2>Sistemi Kur ve Çalıştır</h2>
          <p>Alt sistemleri süreç sırasına yerleştir. Sonraki sürümde akış tokenı bu yol üzerinde hareket edecek.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/150` : '150 puan'}</span>
      </div>

      <div className="flow-builder">
        <span className="flow-end">TEDARİKÇİ</span>
        {order.map((item, index) => (
          <button
            type="button"
            className="flow-step"
            key={item}
            disabled={submitted}
            onClick={() => setOrder((current) => current.filter((_, itemIndex) => itemIndex !== index))}
          >
            {index + 1}. {item}
          </button>
        ))}
        <span className="flow-end">MÜŞTERİ</span>
      </div>

      <div className="choice-grid">
        {remaining.map((item) => (
          <button type="button" className="concept-chip" key={item} onClick={() => setOrder((current) => [...current, item])}>
            + {item}
          </button>
        ))}
      </div>

      <button className="primary-button full" type="button" disabled={submitted || order.length !== correctOrder.length} onClick={() => setSubmitted(true)}>
        Sistemi çalıştır
      </button>
    </section>
  )
}
