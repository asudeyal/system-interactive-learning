interface ActivityProgressProps {
  current: number
  total: number
}

export function ActivityProgress({ current, total }: ActivityProgressProps) {
  const percent = Math.max(0, Math.min(100, (current / total) * 100))
  return (
    <div className="activity-progress" aria-label={`${current} / ${total} tamamlandı`}>
      <div style={{ width: `${percent}%` }} />
    </div>
  )
}
