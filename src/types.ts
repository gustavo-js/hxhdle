export type DebutArc =
  | "Hunter Exam Arc"
  | "Zoldyck Family Arc"
  | "Heavens Arena Arc"
  | "Yorknew City Arc"
  | "Greed Island Arc"
  | "Chimera Ant Arc"
  | "13th Hunter Chairman Election Arc"

export type Gender = "Male" | "Female" | "Unknown"
export type NenType =
  | "Enhancer"
  | "Transmuter"
  | "Emitter"
  | "Conjurer"
  | "Manipulator"
  | "Specialist"
  | "Unknown"
  | "None"
export type Status = "Alive" | "Deceased" | "Unknown"
export type AgeRange = "Child" | "Teen" | "Adult" | "Elder"
export type Mode = "classic" | "quote" | "ability" | "image"
export type GameType = "daily" | "freeplay"
export type MatchResult = "correct" | "partial" | "wrong"
export type AgeMatchResult = "correct" | "partial-higher" | "partial-lower" | "wrong"
export type ArcMatchResult = "correct" | "partial-earlier" | "partial-later"

export interface Character {
  id: string
  name: string
  gender: Gender
  origin: string
  affiliation: string[]
  nenType: NenType[]
  status: Status
  ageRange: AgeRange
  hunterLicense: boolean
  debutArc: DebutArc
  image: string
}

export interface Quote {
  characterId: string
  quote: string
}

export interface Ability {
  characterId: string
  ability: string
  description: string
}

export interface ClassicGuessResult {
  characterId: string
  gender: MatchResult
  origin: MatchResult
  affiliation: MatchResult
  nenType: MatchResult
  status: MatchResult
  ageRange: AgeMatchResult
  hunterLicense: MatchResult
  debutArc: ArcMatchResult
}

export interface GameState {
  answerId: string
  promptIndex: number
  guesses: string[]
  status: "playing" | "won"
}
