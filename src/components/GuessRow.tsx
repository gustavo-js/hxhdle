import type { AgeDirection, ArcDirection, ClassicGuessResult, Character, MatchResult } from "../types"
import { assetUrl } from "../utils/assetUrl"
import { COLUMNS } from "./guessColumns"
import "./GuessRow.css"

interface GuessRowProps {
  result: ClassicGuessResult
  character: Character
  isNew?: boolean
}

function resultToClassName(result: MatchResult): string {
  if (result === "correct") return "guess-cell--correct"
  if (result === "wrong") return "guess-cell--wrong"
  return "guess-cell--partial"
}

function getArrow(direction: AgeDirection | ArcDirection | undefined): string | null {
  if (direction === "higher" || direction === "later") return "↑"
  if (direction === "lower" || direction === "earlier") return "↓"
  return null
}

export default function GuessRow({ result, character, isNew }: GuessRowProps) {
  return (
    <div className="guess-row" role="row">
      <div
        className="guess-row__portrait"
        role="gridcell"
        aria-label={`Character: ${character.name}`}
      >
        <img
          src={assetUrl(character.image)}
          alt={character.name}
          className="guess-row__portrait-img"
        />
        <span className="guess-row__name" aria-hidden="true">
          {character.name}
        </span>
      </div>

      {COLUMNS.map((col, index) => {
        const matchResult = col.getResult(result)
        const value = col.getValue(character)
        const direction = col.getDirection?.(result)
        const arrow = getArrow(direction)
        const cellClass = `guess-cell ${resultToClassName(matchResult)}${isNew ? " guess-cell--new" : ""}`

        return (
          <div
            key={col.key}
            className={cellClass}
            role="gridcell"
            aria-label={`${col.label}: ${value} — ${matchResult}${direction ? ` ${direction}` : ""}`}
            style={isNew ? ({ "--col-index": index } as React.CSSProperties) : undefined}
          >
            <div className="guess-cell__content">
              <span className="guess-cell__value">{value}</span>
              {arrow && <span className="guess-cell__arrow">{arrow}</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
