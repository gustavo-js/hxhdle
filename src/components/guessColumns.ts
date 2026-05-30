import type { AgeDirection, ArcDirection, Character, ClassicGuessResult, MatchResult } from "../types"

export interface ColumnDef {
  key: keyof ClassicGuessResult
  label: string
  getValue: (c: Character) => string
  getResult: (r: ClassicGuessResult) => MatchResult
  getDirection?: (r: ClassicGuessResult) => AgeDirection | ArcDirection
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
    getDirection: (r) => r.ageRangeDirection,
  },
  {
    key: "hunterLicense",
    label: "License",
    getValue: (c) => (c.hunterLicense ? "Yes" : "No"),
    getResult: (r) => r.hunterLicense,
  },
  {
    key: "debutArc",
    label: "Debut Arc",
    getValue: (c) => c.debutArc,
    getResult: (r) => r.debutArc,
    getDirection: (r) => r.debutArcDirection,
  },
]
