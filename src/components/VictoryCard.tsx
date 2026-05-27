import type { Character } from "../types"
import "./VictoryCard.css"

interface VictoryCardProps {
  character: Character
  guessCount: number
  mode: "classic" | "quote" | "ability" | "image"
  onPlayAgain?: () => void
  onShare?: () => void
}

const MODE_LABELS: Record<VictoryCardProps["mode"], string> = {
  classic: "Classic",
  quote: "Quote",
  ability: "Ability",
  image: "Image",
}

export default function VictoryCard({
  character,
  guessCount,
  mode,
  onPlayAgain,
  onShare,
}: VictoryCardProps) {
  const guessLabel = guessCount === 1 ? "guess" : "guesses"

  return (
    <div className="victory-card" role="region" aria-label="Victory">
      <p className="victory-card__mode-label">{MODE_LABELS[mode]} Mode</p>

      <h2 className="victory-card__heading">You got it!</h2>

      <img
        src={character.image}
        alt={character.name}
        className="victory-card__portrait"
        width={120}
        height={120}
      />

      <p className="victory-card__name">{character.name}</p>

      <p className="victory-card__stat">
        <span className="victory-card__stat-number">{guessCount}</span>
        <span className="victory-card__stat-unit">&nbsp;{guessLabel}</span>
      </p>

      <div className="victory-card__actions">
        {onShare && (
          <button
            className="victory-card__btn victory-card__btn--share"
            onClick={onShare}
            aria-label="Share result"
          >
            Share
          </button>
        )}
        {onPlayAgain && (
          <button
            className="victory-card__btn victory-card__btn--play-again"
            onClick={onPlayAgain}
            aria-label="Play again"
          >
            Play again
          </button>
        )}
      </div>
    </div>
  )
}
