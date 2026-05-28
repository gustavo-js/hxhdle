import { useCallback } from "react"
import type { GameType, Character } from "../types"
import { useGameState } from "../hooks/useGameState"
import { useStreak } from "../hooks/useStreak"
import { assetUrl } from "../utils/assetUrl"
import charactersData from "../data/characters.json"
import quotesData from "../data/quotes.json"
import Autocomplete from "./Autocomplete"
import StreakBadge from "./StreakBadge"
import VictoryCard from "./VictoryCard"
import "./QuoteMode.css"

interface QuoteModeProps {
  type: GameType
}

const characters = charactersData as Character[]

export default function QuoteMode({ type }: QuoteModeProps) {
  const { answerId, promptIndex, guesses, status, submitGuess, reset } =
    useGameState("quote", type)

  const { display: streakDisplay, broken: streakBroken } =
    useStreak("quote", type, answerId, status, guesses.length)

  const answer = characters.find((c) => c.id === answerId)
  const quote = promptIndex >= 0 ? quotesData[promptIndex] : null

  const wrongGuesses = status === "won"
    ? guesses.slice(0, -1)
    : guesses

  const wrongGuessCharacters = wrongGuesses
    .map((id) => characters.find((c) => c.id === id))
    .filter((c): c is Character => c !== undefined)

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
    <div className="quote-mode">
      {type === "freeplay" && (
        <StreakBadge display={streakDisplay} broken={streakBroken} />
      )}

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

      {status === "won" && winningChar && (
        <div className="quote-mode__victory">
          <VictoryCard
            character={winningChar}
            guessCount={guesses.length}
            onNewGame={type === "freeplay" ? reset : undefined}
          />
        </div>
      )}

      {wrongGuessCharacters.length > 0 && (
        <div className="quote-mode__wrong-guesses" aria-label="Wrong guesses">
          <span className="quote-mode__wrong-label">Wrong guesses:</span>
          <ul className="quote-mode__chips" role="list">
            {wrongGuessCharacters.map((c) => (
              <li key={c.id} className="quote-mode__chip">
                <img src={assetUrl(c.image)} alt={c.name} className="quote-mode__chip-portrait" />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
