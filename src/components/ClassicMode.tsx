import { useCallback, useState, useEffect, useRef } from "react"
import confetti from "canvas-confetti"
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

// Total flip animation duration for the last column:
// 6 columns × 800 ms stagger + 800 ms animation = 5600 ms
const CONFETTI_DELAY_MS = 5800

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
  const [lastAddedGuessId, setLastAddedGuessId] = useState<string | null>(null)
  // Track prev status so we only fire confetti/show victory on the transition TO "won",
  // not on remounts where status is already "won" (restored from localStorage).
  const prevStatusRef = useRef(status)
  const [showVictory, setShowVictory] = useState(status === "won")
  // Frozen at the moment of victory so reset() can't flash a new answerId
  // into VictoryCard while showVictory is still true (effect runs after render).
  const [victoryChar, setVictoryChar] = useState<Character | undefined>(
    () => status === "won" ? characters.find((c) => c.id === answerId) : undefined
  )

  const answer = characters.find((c) => c.id === answerId)

  const handleSelect = useCallback(
    (character: Character) => {
      submitGuess(character.id)
      setLastAddedGuessId(character.id)
    },
    [submitGuess]
  )

  useEffect(() => {
    const prev = prevStatusRef.current
    prevStatusRef.current = status

    if (status !== "won") {
      setShowVictory(false)
      setVictoryChar(undefined)
      return
    }
    // Already "won" before this render (remount with persisted state) — skip.
    if (prev === "won") return

    const timer = setTimeout(() => {
      setShowVictory(true)
      setVictoryChar(answer)
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#c9a84c", "#538d4e", "#dfc96f", "#b59f3b", "#e0e0e0"],
      })
    }, CONFETTI_DELAY_MS)
    return () => clearTimeout(timer)
  }, [status])

  const rows = [...guesses].reverse().map((guessId) => {
    const guessed = characters.find((c) => c.id === guessId)
    if (!guessed || !answer) return null
    const result = buildResult(guessed, answer)
    return (
      <GuessRow
        key={guessId}
        result={result}
        character={guessed}
        isNew={guessId === lastAddedGuessId}
      />
    )
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

      {showVictory && victoryChar && (
        <div className="classic-mode__victory">
          <VictoryCard
            character={victoryChar}
            guessCount={guesses.length}
            onNewGame={type === "freeplay" ? reset : undefined}
          />
        </div>
      )}

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
    </div>
  )
}
