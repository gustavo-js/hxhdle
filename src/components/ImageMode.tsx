import { useCallback } from "react"
import type { GameType, Character } from "../types"
import { useGameState } from "../hooks/useGameState"
import { useStreak } from "../hooks/useStreak"
import charactersData from "../data/characters.json"
import Autocomplete from "./Autocomplete"
import StreakBadge from "./StreakBadge"
import VictoryCard from "./VictoryCard"
import "./ImageMode.css"

interface ImageModeProps {
  type: GameType
}

const characters = charactersData as Character[]

export default function ImageMode({ type }: ImageModeProps) {
  const { answerId, guesses, status, submitGuess, reset } =
    useGameState("image", type)

  const { display: streakDisplay, broken: streakBroken } =
    useStreak("image", type, answerId, status, guesses.length)

  const answer = characters.find((c) => c.id === answerId)

  const blur = status === "won" ? 0 : 20 / (1 + guesses.length * 0.4)
  const grayscale = status === "won" ? 0 : 100

  const wrongGuesses = status === "won" ? guesses.slice(0, -1) : guesses

  const wrongGuessCharacters = wrongGuesses
    .map((id) => characters.find((c) => c.id === id))
    .filter((c): c is Character => c !== undefined)

  // Freeze the winning character at the moment of winning so that reset()
  // can't flash a new answerId into the VictoryCard before it unmounts.
  const winningCharId = status === "won" && guesses.length > 0
    ? guesses[guesses.length - 1]
    : null
  const winningChar = winningCharId
    ? characters.find((c) => c.id === winningCharId)
    : undefined

  const handleSelect = useCallback(
    (character: Character) => {
      submitGuess(character.id)
    },
    [submitGuess]
  )

  return (
    <div className="image-mode">
      {type === "freeplay" && (
        <StreakBadge display={streakDisplay} broken={streakBroken} />
      )}

      <div className="image-mode__portrait-container">
        {answer && (
          <img
            key={answerId}
            src={answer.image}
            alt="Mystery character"
            className="image-mode__portrait"
            // CSS custom properties drive the filter declared in the stylesheet.
            // The filter rule is evaluated by the CSS engine at paint time, so
            // the image is never rendered without the filter applied.
            style={{
              "--portrait-blur": `${blur}px`,
              "--portrait-grayscale": `${grayscale}%`,
            } as React.CSSProperties}
            width={300}
            height={300}
          />
        )}
      </div>

      <div className="image-mode__input-area">
        <Autocomplete
          characters={characters}
          excludeIds={guesses}
          onSelect={handleSelect}
          placeholder="Who is this character?"
          disabled={status === "won"}
          hidePortraits
        />
      </div>

      {status === "won" && winningChar && (
        <div className="image-mode__victory">
          <VictoryCard
            character={winningChar}
            guessCount={guesses.length}
            onNewGame={type === "freeplay" ? reset : undefined}
          />
        </div>
      )}

      {wrongGuessCharacters.length > 0 && (
        <div className="image-mode__wrong-guesses" aria-label="Wrong guesses">
          <span className="image-mode__wrong-label">Wrong guesses:</span>
          <ul className="image-mode__chips" role="list">
            {wrongGuessCharacters.map((c) => (
              <li key={c.id} className="image-mode__chip">
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
