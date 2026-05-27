import type { Character } from "../types"
import "./VictoryCard.css"

interface VictoryCardProps {
  character: Character
  guessCount: number
}

export default function VictoryCard({
  character,
  guessCount,
}: VictoryCardProps) {
  const guessLabel = guessCount === 1 ? "guess" : "guesses"

  return (
    <div className="victory-card">
      <img
        src={character.image}
        alt={character.name}
        className="victory-card__portrait"
        width={120}
        height={120}
      />

      <p className="victory-card__name">{character.name}</p>

      <p className="victory-card__message">
        You got it in {guessCount} {guessLabel}!
      </p>
    </div>
  )
}
