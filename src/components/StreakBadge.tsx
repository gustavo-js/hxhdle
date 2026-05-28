import './StreakBadge.css'

interface StreakBadgeProps {
  display: number
  broken: boolean
}

export default function StreakBadge({ display, broken }: StreakBadgeProps) {
  const isIce = display === 0
  const className = [
    'streak-badge',
    isIce ? 'streak-badge--ice' : '',
    broken ? 'streak-badge--broken' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={className}
      aria-label={`Freeplay streak: ${display}`}
      data-tooltip="First-try wins in a row"
    >
      <span className="streak-badge__icon" aria-hidden="true">
        {isIce ? '❄️' : '🔥'}
      </span>
      <span className="streak-badge__count" key={display}>{display}</span>
    </div>
  )
}
