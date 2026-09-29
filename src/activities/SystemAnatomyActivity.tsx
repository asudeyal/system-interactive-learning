import { useMemo, useState } from 'react'
import { ActivityProgress } from '../components/ActivityProgress'
import { GripVertical, RotateCcw, Send } from 'lucide-react'

const labels = ['Amaç', 'Bileşenler', 'İlişkiler', 'Sistem Sınırı', 'Çevre', 'Arayüz', 'Girdi', 'Çıktı'] as const
type Label = (typeof labels)[number]
type Zone = 'purpose' | 'components' | 'relations' | 'boundary' | 'environment' | 'interface' | 'input' | 'output'

const correct: Record<Zone, Label> = {
  purpose: 'Amaç',
  components: 'Bileşenler',
  relations: 'İlişkiler',
  boundary: 'Sistem Sınırı',
  environment: 'Çevre',
  interface: 'Arayüz',
  input: 'Girdi',
  output: 'Çıktı',
}

const zoneNames: Record<Zone, string> = {
  purpose: 'A',
  components: 'B',
  relations: 'C',
  boundary: 'D',
  environment: 'E',
  interface: 'F',
  input: 'G',
  output: 'H',
}

export function SystemAnatomyActivity({ onComplete }: { onComplete?: (score: number) => void }) {
  const [placements, setPlacements] = useState<Partial<Record<Zone, Label>>>({})
  const [selected, setSelected] = useState<Label | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const placedLabels = Object.values(placements)
  const remaining = labels.filter((label) => !placedLabels.includes(label))
  const correctCount = (Object.keys(correct) as Zone[]).filter((zone) => placements[zone] === correct[zone]).length
  const score = Math.round((correctCount / labels.length) * 100)

  const place = (zone: Zone, label: Label) => {
    if (submitted) return
    setPlacements((current) => {
      const next = { ...current }
      ;(Object.keys(next) as Zone[]).forEach((key) => {
        if (next[key] === label) delete next[key]
      })
      next[zone] = label
      return next
    })
    setSelected(null)
  }

  const drop = (zone: Zone, event: React.DragEvent) => {
    event.preventDefault()
    const label = event.dataTransfer.getData('text/plain') as Label
    if (labels.includes(label)) place(zone, label)
  }

  const zoneClass = (zone: Zone) => {
    const value = placements[zone]
    if (!submitted || !value) return 'anatomy-zone'
    return value === correct[zone] ? 'anatomy-zone zone-correct' : 'anatomy-zone zone-wrong'
  }

  const submit = () => {
    setSubmitted(true)
    onComplete?.(score)
  }

  const reset = () => {
    setPlacements({})
    setSelected(null)
    setSubmitted(false)
  }

  const zone = (id: Zone, className = '') => (
    <button
      type="button"
      className={`${zoneClass(id)} ${className}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => drop(id, event)}
      onClick={() => selected && place(id, selected)}
      disabled={submitted}
      aria-label={`${zoneNames[id]} bölgesi`}
    >
      <span className="zone-letter">{zoneNames[id]}</span>
      <strong>{placements[id] ?? 'Buraya yerleştir'}</strong>
      {submitted && placements[id] !== correct[id] && <small>Doğru: {correct[id]}</small>}
    </button>
  )

  return (
    <section className="activity-card activity-blue">
      <div className="activity-heading">
        <div>
          <span className="eyebrow">Interaction 1 • Sistem Modelleme</span>
          <h2>Sistemin Anatomisini Kur</h2>
          <p>Kavram kartlarını diyagramdaki doğru bölgelere sürükle. Telefonda kartı seçip hedef bölgeye dokunabilirsin.</p>
        </div>
        <span className="score-pill">{submitted ? `${score}/100` : '100 puan'}</span>
      </div>

      <ActivityProgress current={placedLabels.length} total={labels.length} />

      <div className="anatomy-workspace">
        <div className="anatomy-canvas">
          {zone('environment', 'zone-environment')}
          <div className="anatomy-system">
            {zone('boundary', 'zone-boundary')}
            {zone('purpose', 'zone-purpose')}
            <div className="anatomy-components">
              {zone('components', 'zone-components')}
              <div className="relation-line"><span>↔</span></div>
              {zone('relations', 'zone-relations')}
            </div>
          </div>
          <div className="anatomy-arrow left-arrow"><span>→</span>{zone('input', 'zone-flow')}</div>
          <div className="anatomy-arrow right-arrow">{zone('output', 'zone-flow')}<span>→</span></div>
          <div className="interface-line">{zone('interface', 'zone-interface')}</div>
        </div>

        <aside className="concept-palette">
          <div className="palette-head"><strong>Kavram kartları</strong><span>{remaining.length} kaldı</span></div>
          <div className="palette-grid">
            {remaining.map((label) => (
              <button
                type="button"
                draggable={!submitted}
                key={label}
                className={selected === label ? 'drag-card selected' : 'drag-card'}
                onDragStart={(event) => event.dataTransfer.setData('text/plain', label)}
                onClick={() => setSelected((current) => (current === label ? null : label))}
              >
                <GripVertical size={16} /> {label}
              </button>
            ))}
          </div>
          {selected && <div className="tap-hint">“{selected}” seçildi. Şimdi diyagramdaki hedef bölgeye dokun.</div>}
        </aside>
      </div>

      <div className="activity-actions">
        <button className="secondary-button" type="button" onClick={reset}><RotateCcw size={16}/> Sıfırla</button>
        <button className="primary-button" type="button" disabled={placedLabels.length !== labels.length || submitted} onClick={submit}>
          <Send size={16}/> Cevabı gönder
        </button>
      </div>

      {submitted && (
        <div className={score >= 75 ? 'result-box success' : 'result-box warning'}>
          <strong>{correctCount} / {labels.length} doğru yerleştirme</strong>
          <span>{score} puan • Hatalı bölgelerde doğru kavram gösterildi.</span>
        </div>
      )}
    </section>
  )
}
