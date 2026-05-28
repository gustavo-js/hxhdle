import type { ClassicGuessResult, Character, AgeMatchResult, MatchResult } from "../types"
import "./GuessRow.css"

interface GuessRowProps {
  result: ClassicGuessResult
  character: Character
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
  // partial, partial-higher, partial-lower all get partial background
  return "guess-cell--partial"
}

function getArrow(result: AgeMatchResult): string | null {
  if (result === "partial-higher") return "↑"
  if (result === "partial-lower") return "↓"
  return null
}

export default function GuessRow({ result, character }: GuessRowProps) {
  return (
    <div className="guess-row" role="row">
      <div className="guess-row__portrait" role="gridcell" aria-label={`Character: ${character.name}`}>
        <img src={character.image} alt={character.name} className="guess-row__portrait-img" />
        <span className="guess-cell__label">{character.name}</span>
      </div>
      {COLUMNS.map((col) => {
        const matchResult = col.getResult(result)
        const className = `guess-cell ${resultToClassName(matchResult)}`
        const value = col.getValue(character)
        const arrow = col.key === "ageRange" ? getArrow(matchResult as AgeMatchResult) : null

        return (
          <div
            key={col.key}
            className={className}
            role="gridcell"
            aria-label={`${col.label}: ${value} — ${matchResult}`}
          >
            <span className="guess-cell__value">{value}</span>
            {arrow && <span className="guess-cell__arrow">{arrow}</span>}
            <span className="guess-cell__label">{col.label}</span>
          </div>
        )
      })}
    </div>
  )
}
