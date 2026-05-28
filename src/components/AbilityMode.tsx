import { useCallback } from "react"
import type { GameType, Character, Ability } from "../types"
import { useGameState } from "../hooks/useGameState"
import charactersData from "../data/characters.json"
import abilitiesData from "../data/abilities.json"
import Autocomplete from "./Autocomplete"
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

  const answer = characters.find((c) => c.id === answerId)
  const ability = promptIndex >= 0 ? abilities[promptIndex] : null

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
    <div className="ability-mode">
      {ability && (
        <div className="ability-mode__card">
          <p className="ability-mode__name">Ability: "{ability.ability}"</p>
          <p className="ability-mode__description">{ability.description}</p>
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

      {wrongGuessCharacters.length > 0 && (
        <div className="ability-mode__wrong-guesses" aria-label="Wrong guesses">
          <span className="ability-mode__wrong-label">Wrong guesses:</span>
          <ul className="ability-mode__chips" role="list">
            {wrongGuessCharacters.map((c) => (
              <li key={c.id} className="ability-mode__chip">
                <img src={c.image} alt={c.name} className="ability-mode__chip-portrait" />
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "won" && answer && (
        <div className="ability-mode__victory">
          <VictoryCard character={answer} guessCount={guesses.length} />
          {type === "freeplay" && (
            <div className="ability-mode__new-game">
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
