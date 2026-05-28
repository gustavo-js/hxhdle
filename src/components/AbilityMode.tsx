import { useCallback, useState, useEffect } from "react"
import type { GameType, Character, Ability } from "../types"
import { useGameState } from "../hooks/useGameState"
import { useStreak } from "../hooks/useStreak"
import { assetUrl } from "../utils/assetUrl"
import charactersData from "../data/characters.json"
import abilitiesData from "../data/abilities.json"
import Autocomplete from "./Autocomplete"
import StreakBadge from "./StreakBadge"
import VictoryCard from "./VictoryCard"
import "./AbilityMode.css"

interface AbilityModeProps {
  type: GameType
}

const characters = charactersData as Character[]
const abilities = abilitiesData as Ability[]

export default function AbilityMode({ type }: AbilityModeProps) {
  const { answerId, promptIndex, guesses, status, submitGuess, reset } =
    useGameState("ability", type)

  const { display: streakDisplay, broken: streakBroken } =
    useStreak("ability", type, answerId, status, guesses.length)

  const [descriptionRevealed, setDescriptionRevealed] = useState(false)

  useEffect(() => {
    setDescriptionRevealed(false)
  }, [answerId])

  const answer = characters.find((c) => c.id === answerId)
  const ability = promptIndex >= 0 ? abilities[promptIndex] : null

  const wrongGuesses = status === "won"
    ? guesses.slice(0, -1)
    : guesses

  const winningCharId = status === "won" && guesses.length > 0
    ? guesses[guesses.length - 1]
    : null
  const winningChar = winningCharId
    ? characters.find((c) => c.id === winningCharId)
    : undefined

  const canRevealDescription = wrongGuesses.length >= 5
  const showDescription = descriptionRevealed || status === "won"

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
    <div className="ability-mode">
      {type === "freeplay" && (
        <StreakBadge display={streakDisplay} broken={streakBroken} />
      )}

      {ability && (
        <div className="ability-mode__card">
          <p className="ability-mode__name">Ability: "{ability.ability}"</p>

          {showDescription && (
            <p className="ability-mode__description">{ability.description}</p>
          )}

          {!showDescription && canRevealDescription && (
            <button
              type="button"
              className="ability-mode__hint-btn"
              onClick={() => setDescriptionRevealed(true)}
            >
              Reveal description
            </button>
          )}

          {!showDescription && !canRevealDescription && (
            <p className="ability-mode__hint-locked">
              Description available after {5 - wrongGuesses.length} more wrong guess{5 - wrongGuesses.length === 1 ? "" : "es"}
            </p>
          )}

          {status === "won" && answer && (
            <footer className="ability-mode__character">— {answer.name}</footer>
          )}
        </div>
      )}

      <div className="ability-mode__input-area">
        <Autocomplete
          characters={characters}
          excludeIds={guesses}
          onSelect={handleSelect}
          placeholder="Who uses this ability?"
          disabled={status === "won"}
        />
      </div>

      {status === "won" && winningChar && (
        <div className="ability-mode__victory">
          <VictoryCard
            character={winningChar}
            guessCount={guesses.length}
            onNewGame={type === "freeplay" ? reset : undefined}
          />
        </div>
      )}

      {wrongGuessCharacters.length > 0 && (
        <div className="ability-mode__wrong-guesses" aria-label="Wrong guesses">
          <span className="ability-mode__wrong-label">Wrong guesses:</span>
          <ul className="ability-mode__chips" role="list">
            {wrongGuessCharacters.map((c) => (
              <li key={c.id} className="ability-mode__chip">
                <img src={assetUrl(c.image)} alt={c.name} className="ability-mode__chip-portrait" />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
