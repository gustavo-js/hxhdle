import { useCallback } from "react"
import type { GameType, Character } from "../types"
import { useGameState } from "../hooks/useGameState"
import charactersData from "../data/characters.json"
import Autocomplete from "./Autocomplete"
import VictoryCard from "./VictoryCard"
import "./ImageMode.css"

interface ImageModeProps {
  type: GameType
}

const characters = charactersData as Character[]

export default function ImageMode({ type }: ImageModeProps) {
  const { answerId, guesses, status, submitGuess, reset } =
    useGameState("image", type)

  const answer = characters.find((c) => c.id === answerId)

  const blur = status === "won" ? 0 : 20 / (1 + guesses.length * 0.4)

  const wrongGuesses = status === "won" ? guesses.slice(0, -1) : guesses

  const wrongGuessCharacters = wrongGuesses
    .map((id) => characters.find((c) => c.id === id))
    .filter((c): c is Character => c !== undefined)

  const handleSelect = useCallback(
    (character: Character) => {
      submitGuess(character.id)
    },
    [submitGuess]
  )

  return (
    <div className="image-mode">
      <div className="image-mode__portrait-container">
        {answer && (
          <img
            src={answer.image}
            alt="Mystery character"
            className="image-mode__portrait"
            style={{ filter: `blur(${blur}px)`, transition: "filter 0.5s ease" }}
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
        />
      </div>

      {wrongGuessCharacters.length > 0 && (
        <div className="image-mode__wrong-guesses" aria-label="Wrong guesses">
          <span className="image-mode__wrong-label">Wrong guesses:</span>
          <ul className="image-mode__chips" role="list">
            {wrongGuessCharacters.map((c) => (
              <li key={c.id} className="image-mode__chip">
                <img
                  src={c.image}
                  alt={c.name}
                  className="image-mode__chip-portrait"
                />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "won" && answer && (
        <div className="image-mode__victory">
          <VictoryCard character={answer} guessCount={guesses.length} />
          {type === "freeplay" && (
            <div className="image-mode__new-game">
              <button type="button" onClick={reset}>
                New Game
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
