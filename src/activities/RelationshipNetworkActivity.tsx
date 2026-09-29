import { useState } from 'react'

const relations = [
  ['Pazarlama', 'Talep', '+'],
  ['Fiyat', 'Talep', '−'],
  ['Talep', 'Siparişler', '+'],
  ['Talep', 'Satışlar', '+'],
  ['Satışlar', 'Gelir', '+'],
  ['Siparişler', 'Kapasite Baskısı', '+'],
  ['Kapasite Baskısı', 'Teslim Süresi', '+'],
  ['Teslim Süresi', 'Müşteri Memnuniyeti', '−'],
  ['Müşteri Memnuniyeti', 'Talep', '+'],
] as const

export function RelationshipNetworkActivity() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const correct = relations.reduce(
    (total, relation, index) => total + (answers[index] === relation[2] ? 1 : 0),
    0,
  )
  const score = Math.round((correct / relations.length) * 120)

  return (
    <section className="activity-card">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 2</span>
          <h2>İlişki Ağını Kur</h2>
          <p>Her ilişkinin yönünü değil, etkisinin pozitif mi negatif mi olduğunu belirle.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/120` : '120 puan'}</span>
      </div>

      <div className="relation-list">
        {relations.map(([from, to, sign], index) => (
          <div className="relation-row" key={`${from}-${to}`}>
            <span>{from}</span><b>→</b><span>{to}</span>
            <div className="sign-buttons">
              {['+', '−'].map((choice) => (
                <button
                  type="button"
                  key={choice}
                  disabled={submitted}
                  className={answers[index] === choice ? 'sign selected' : 'sign'}
                  onClick={() => setAnswers((current) => ({ ...current, [index]: choice }))}
                >
                  {choice}
                </button>
              ))}
            </div>
            {submitted && <span className={answers[index] === sign ? 'correct' : 'wrong'}>{sign}</span>}
          </div>
        ))}
      </div>

      <button className="primary-button full" type="button" disabled={submitted} onClick={() => setSubmitted(true)}>
        Ağı değerlendir
      </button>
    </section>
  )
}
