import { useCallback } from "react"
import type { GameType, Character } from "../types"
import { useGameState } from "../hooks/useGameState"
import charactersData from "../data/characters.json"
import quotesData from "../data/quotes.json"
import Autocomplete from "./Autocomplete"
import VictoryCard from "./VictoryCard"
import "./QuoteMode.css"

interface QuoteModeProps {
  type: GameType
}

const characters = charactersData as Character[]

export default function QuoteMode({ type }: QuoteModeProps) {
  const { answerId, promptIndex, guesses, status, submitGuess, reset } =
    useGameState("quote", type)

  const answer = characters.find((c) => c.id === answerId)
  const quote = promptIndex >= 0 ? quotesData[promptIndex] : null

  const wrongGuesses = status === "won"
    ? guesses.slice(0, -1)
    : guesses

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
    <div className="quote-mode">
      {quote && (
        <blockquote className="quote-mode__card">
          <p className="quote-mode__text">"{quote.quote}"</p>
          {status === "won" && answer && (
            <footer className="quote-mode__speaker">— {answer.name}</footer>
          )}
        </blockquote>
      )}

      <div className="quote-mode__input-area">
        <Autocomplete
          characters={characters}
          excludeIds={guesses}
          onSelect={handleSelect}
          placeholder="Who said this?"
          disabled={status === "won"}
        />
      </div>

      {wrongGuessCharacters.length > 0 && (
        <div className="quote-mode__wrong-guesses" aria-label="Wrong guesses">
          <span className="quote-mode__wrong-label">Wrong guesses:</span>
          <ul className="quote-mode__chips" role="list">
            {wrongGuessCharacters.map((c) => (
              <li key={c.id} className="quote-mode__chip">
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "won" && answer && (
        <div className="quote-mode__victory">
          <VictoryCard character={answer} guessCount={guesses.length} />
          {type === "freeplay" && (
            <div className="quote-mode__new-game">
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
