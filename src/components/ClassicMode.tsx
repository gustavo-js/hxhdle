import { useCallback } from "react"
import type { GameType, ClassicGuessResult } from "../types"
import { useGameState } from "../hooks/useGameState"
import { exactMatch, setMatch, ageMatch } from "../utils/comparison"
import charactersData from "../data/characters.json"
import type { Character } from "../types"
import Autocomplete from "./Autocomplete"
import GuessRow, { COLUMNS } from "./GuessRow"
import VictoryCard from "./VictoryCard"
import "./ClassicMode.css"

interface ClassicModeProps {
  type: GameType
}

const characters = charactersData as Character[]


function buildResult(guessed: Character, answer: Character): ClassicGuessResult {
  return {
    characterId: guessed.id,
    gender: exactMatch(guessed.gender, answer.gender),
    origin: exactMatch(guessed.origin, answer.origin),
    affiliation: setMatch(guessed.affiliation, answer.affiliation),
    nenType: setMatch(guessed.nenType, answer.nenType),
    status: exactMatch(guessed.status, answer.status),
    ageRange: ageMatch(guessed.ageRange, answer.ageRange),
    hunterLicense: exactMatch(guessed.hunterLicense, answer.hunterLicense),
  }
}

export default function ClassicMode({ type }: ClassicModeProps) {
  const { answerId, guesses, status, submitGuess, reset } = useGameState("classic", type)

  const answer = characters.find((c) => c.id === answerId)

  const handleSelect = useCallback(
    (character: Character) => {
      submitGuess(character.id)
    },
    [submitGuess]
  )

  // Render rows in reverse order (newest first)
  const rows = [...guesses].reverse().map((guessId) => {
    const guessed = characters.find((c) => c.id === guessId)
    if (!guessed || !answer) return null
    const result = buildResult(guessed, answer)
    return <GuessRow key={guessId} result={result} character={guessed} />
  })

  const hasGuesses = guesses.length > 0

  return (
    <div className="classic-mode">
      <div className="classic-mode__input-area">
        <Autocomplete
          characters={characters}
          excludeIds={guesses}
          onSelect={handleSelect}
          placeholder="Search for a character…"
          disabled={status === "won"}
        />
      </div>

      {hasGuesses && (
        <div className="classic-mode__guesses" role="grid" aria-label="Guess history">
          <div role="row" className="classic-mode__headers">
            <div role="columnheader" className="classic-mode__header-cell" aria-label="Character" />
            {COLUMNS.map((col) => (
              <div key={col.key} role="columnheader" className="classic-mode__header-cell">
                {col.label}
              </div>
            ))}
          </div>
          {rows}
        </div>
      )}

      {status === "won" && answer && (
        <div className="classic-mode__victory">
          <VictoryCard character={answer} guessCount={guesses.length} />
          {type === "freeplay" && (
            <div className="classic-mode__new-game">
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
