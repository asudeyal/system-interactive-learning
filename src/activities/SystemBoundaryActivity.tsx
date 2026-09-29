import { useState } from 'react'
import { ActivityProgress } from '../components/ActivityProgress'
import { Factory, Globe2, Hand, Send } from 'lucide-react'

const items = [
  ['Üretim hattı', 'inside'],
  ['Çalışanlar', 'inside'],
  ['Makinalar', 'inside'],
  ['Tedarikçi', 'influenceable'],
  ['Müşteri', 'environment'],
  ['Rakipler', 'environment'],
  ['Faiz oranı', 'environment'],
  ['Yasal düzenlemeler', 'environment'],
  ['Teknoloji', 'influenceable'],
] as const

type Bucket = 'inside' | 'influenceable' | 'environment'

export function SystemBoundaryActivity({ onComplete }: { onComplete?: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, Bucket>>({})
  const [submitted, setSubmitted] = useState(false)

  const correctCount = items.filter(([label, bucket]) => answers[label] === bucket).length
  const score = Math.round((correctCount / items.length) * 100)

  const submit = () => {
    setSubmitted(true)
    onComplete?.(score)
  }

  return (
    <section className="activity-card activity-green">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 3 • Sınır Kararı</span>
          <h2>Sistem Sınırını Belirle</h2>
          <p>Her unsuru üretim sisteminin içine, etkilenebilir çevreye veya dış çevreye yerleştir.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/100` : '100 puan'}</span>
      </div>

      <ActivityProgress current={Object.keys(answers).length} total={items.length} />

      <div className="boundary-landscape">
        <div className="boundary-ring outer-ring">
          <span className="ring-label"><Globe2 size={15}/> DIŞ ÇEVRE</span>
          <div className="boundary-ring influence-ring">
            <span className="ring-label"><Hand size={15}/> ETKİLENEBİLİR ÇEVRE</span>
            <div className="boundary-ring inner-ring">
              <span className="ring-label"><Factory size={15}/> ÜRETİM SİSTEMİ</span>
              <div className="factory-core">ÜRETİM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="boundary-table">
        {items.map(([label, correctBucket]) => (
          <div className="boundary-row" key={label}>
            <strong>{label}</strong>
            <div className="bucket-buttons">
              {([
                ['inside', 'Sistem'],
                ['influenceable', 'Etkilenebilir'],
                ['environment', 'Çevre'],
              ] as [Bucket, string][]).map(([bucket, text]) => (
                <button
                  type="button"
                  key={bucket}
                  disabled={submitted}
                  className={answers[label] === bucket ? `bucket selected ${bucket}` : 'bucket'}
                  onClick={() => setAnswers((current) => ({ ...current, [label]: bucket }))}
                >
                  {text}
                </button>
              ))}
            </div>
            {submitted && answers[label] !== correctBucket && <small>Doğru: {correctBucket === 'inside' ? 'Sistem' : correctBucket === 'influenceable' ? 'Etkilenebilir' : 'Çevre'}</small>}
          </div>
        ))}
      </div>

      <div className="activity-actions">
        <span className="muted">Amaç değişirse sistem sınırı da değişebilir.</span>
        <button className="primary-button" type="button" disabled={submitted || Object.keys(answers).length !== items.length} onClick={submit}>
          <Send size={16}/> Sınırı değerlendir
        </button>
      </div>
    </section>
  )
}
