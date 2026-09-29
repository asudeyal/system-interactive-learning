import { useState } from 'react'
import { ActivityProgress } from '../components/ActivityProgress'
import { Activity, CheckCircle2, Send } from 'lucide-react'

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

export function RelationshipNetworkActivity({ onComplete }: { onComplete?: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [simulating, setSimulating] = useState(false)

  const correctCount = relations.reduce(
    (total, relation, index) => total + (answers[index] === relation[2] ? 1 : 0),
    0,
  )
  const score = Math.round((correctCount / relations.length) * 120)

  const submit = () => {
    setSubmitted(true)
    onComplete?.(score)
  }

  const simulate = () => {
    setSimulating(true)
    window.setTimeout(() => setSimulating(false), 2600)
  }

  return (
    <section className="activity-card activity-purple">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 2 • Nedensel Ağ</span>
          <h2>İlişki Ağını Kur ve Çalıştır</h2>
          <p>Bir değişkendeki artış diğerini aynı yönde etkiliyorsa +, ters yönde etkiliyorsa − seç.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/120` : '120 puan'}</span>
      </div>

      <ActivityProgress current={Object.keys(answers).length} total={relations.length} />

      <div className={simulating ? 'network-stage simulating' : 'network-stage'}>
        <div className="network-pulse" />
        <div className="network-node node-marketing">Pazarlama</div>
        <div className="network-node node-price">Fiyat</div>
        <div className="network-node node-demand">Talep</div>
        <div className="network-node node-orders">Siparişler</div>
        <div className="network-node node-sales">Satışlar</div>
        <div className="network-node node-revenue">Gelir</div>
        <div className="network-caption"><Activity size={16}/> Talep artışı sistemi nasıl dolaşıyor?</div>
      </div>

      <div className="relation-list">
        {relations.map(([from, to, sign], index) => (
          <div className="relation-row" key={`${from}-${to}`}>
            <div className="relation-path"><span>{from}</span><b>→</b><span>{to}</span></div>
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
            {submitted && (
              <span className={answers[index] === sign ? 'relation-result correct' : 'relation-result wrong'}>
                {answers[index] === sign ? <CheckCircle2 size={16}/> : `Doğru: ${sign}`}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="activity-actions">
        <button className="secondary-button" type="button" disabled={!submitted || simulating} onClick={simulate}>
          <Activity size={16}/> Talep +%20 simüle et
        </button>
        <button className="primary-button" type="button" disabled={submitted || Object.keys(answers).length !== relations.length} onClick={submit}>
          <Send size={16}/> Ağı değerlendir
        </button>
      </div>
    </section>
  )
}
