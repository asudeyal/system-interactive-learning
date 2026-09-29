import { useMemo, useState } from 'react'
import { ActivityProgress } from '../components/ActivityProgress'
import { Play, RotateCcw, Truck, PackageCheck } from 'lucide-react'

const correctOrder = ['Tasarım', 'Üretim', 'Satış', 'Teslim', 'Servis']

export function SystemFlowActivity({ onComplete }: { onComplete?: (score: number) => void }) {
  const [order, setOrder] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [running, setRunning] = useState(false)

  const remaining = useMemo(() => correctOrder.filter((item) => !order.includes(item)), [order])
  const correctCount = order.filter((item, index) => item === correctOrder[index]).length
  const score = Math.round((correctCount / correctOrder.length) * 150)

  const submit = () => {
    setSubmitted(true)
    onComplete?.(score)
    if (correctCount === correctOrder.length) {
      setRunning(true)
      window.setTimeout(() => setRunning(false), 4200)
    }
  }

  const reset = () => {
    setOrder([])
    setSubmitted(false)
    setRunning(false)
  }

  return (
    <section className="activity-card activity-orange">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 4 • Sistem Akışı</span>
          <h2>Sistemi Kur ve Çalıştır</h2>
          <p>Alt sistemleri sıraya koy. Doğru model kurulduğunda müşteri siparişinin sistem boyunca hareketini izle.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/150` : '150 puan'}</span>
      </div>

      <ActivityProgress current={order.length} total={correctOrder.length} />

      <div className="flow-stage">
        <div className="flow-track">
          <div className="flow-terminal"><Truck size={20}/><span>Tedarikçi</span></div>
          {correctOrder.map((_, index) => (
            <div className="flow-slot" key={index}>
              <span>{index + 1}</span>
              <strong>{order[index] ?? 'Alt sistem'}</strong>
              {order[index] && !submitted && (
                <button type="button" onClick={() => setOrder((current) => current.filter((_, i) => i !== index))}>×</button>
              )}
              {submitted && <small className={order[index] === correctOrder[index] ? 'correct' : 'wrong'}>{order[index] === correctOrder[index] ? 'doğru' : correctOrder[index]}</small>}
            </div>
          ))}
          <div className="flow-terminal"><PackageCheck size={20}/><span>Müşteri</span></div>
          {running && <div className="flow-token" aria-label="Sipariş akışı">●</div>}
        </div>
      </div>

      <div className="flow-palette">
        {remaining.map((item) => (
          <button type="button" className="drag-card" key={item} disabled={submitted} onClick={() => setOrder((current) => [...current, item])}>
            + {item}
          </button>
        ))}
      </div>

      <div className="activity-actions">
        <button className="secondary-button" type="button" onClick={reset}><RotateCcw size={16}/> Sıfırla</button>
        <button className="primary-button" type="button" disabled={submitted || order.length !== correctOrder.length} onClick={submit}>
          <Play size={16}/> Sistemi çalıştır
        </button>
      </div>

      {submitted && (
        <div className={correctCount === correctOrder.length ? 'result-box success' : 'result-box warning'}>
          <strong>{correctCount === correctOrder.length ? 'Akış başarıyla tamamlandı.' : 'Sistem akışı kesintiye uğradı.'}</strong>
          <span>{score} puan • {correctCount}/{correctOrder.length} alt sistem doğru konumda.</span>
        </div>
      )}
    </section>
  )
}
