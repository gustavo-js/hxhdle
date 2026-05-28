import type { ClassicGuessResult, Character, AgeMatchResult, MatchResult } from "../types"
import "./GuessRow.css"

interface GuessRowProps {
  result: ClassicGuessResult
  character: Character
  isNew?: boolean
}

interface ColumnDef {
  key: keyof ClassicGuessResult
  label: string
  getValue: (c: Character) => string
  getResult: (r: ClassicGuessResult) => MatchResult | AgeMatchResult
}

export const COLUMNS: ColumnDef[] = [
  {
    key: "gender",
    label: "Gender",
    getValue: (c) => c.gender,
    getResult: (r) => r.gender,
  },
  {
    key: "origin",
    label: "Origin",
    getValue: (c) => c.origin,
    getResult: (r) => r.origin,
  },
  {
    key: "affiliation",
    label: "Affil.",
    getValue: (c) => c.affiliation.join(" / "),
    getResult: (r) => r.affiliation,
  },
  {
    key: "nenType",
    label: "Nen",
    getValue: (c) => c.nenType.join(" / "),
    getResult: (r) => r.nenType,
  },
  {
    key: "status",
    label: "Status",
    getValue: (c) => c.status,
    getResult: (r) => r.status,
  },
  {
    key: "ageRange",
    label: "Age",
    getValue: (c) => c.ageRange,
    getResult: (r) => r.ageRange,
  },
  {
    key: "hunterLicense",
    label: "License",
    getValue: (c) => (c.hunterLicense ? "Yes" : "No"),
    getResult: (r) => r.hunterLicense,
  },
]

function resultToClassName(result: MatchResult | AgeMatchResult): string {
  if (result === "correct") return "guess-cell--correct"
  if (result === "wrong") return "guess-cell--wrong"
  return "guess-cell--partial"
}

function getArrow(result: AgeMatchResult): string | null {
  if (result === "partial-higher") return "↑"
  if (result === "partial-lower") return "↓"
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
          src={character.image}
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
        const arrow = col.key === "ageRange" ? getArrow(matchResult as AgeMatchResult) : null
        const cellClass = `guess-cell ${resultToClassName(matchResult)}${isNew ? " guess-cell--new" : ""}`

        return (
          <div
            key={col.key}
            className={cellClass}
            role="gridcell"
            aria-label={`${col.label}: ${value} — ${matchResult}`}
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
