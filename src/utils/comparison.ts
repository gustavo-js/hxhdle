import type {
  AgeDirection,
  AgeMatchResult,
  AgeRange,
  ArcDirection,
  ArcMatchResult,
  BinaryMatchResult,
  DebutArc,
  MatchResult,
} from '../types'

const AGE_ORDER: AgeRange[] = ['Child', 'Teen', 'Adult', 'Elder']

const ARC_ORDER: DebutArc[] = [
  'Hunter Exam Arc',
  'Zoldyck Family Arc',
  'Heavens Arena Arc',
  'Yorknew City Arc',
  'Greed Island Arc',
  'Chimera Ant Arc',
  '13th Hunter Chairman Election Arc',
]

export function exactMatch(a: string | boolean, b: string | boolean): BinaryMatchResult {
  return a === b ? 'correct' : 'wrong'
}

export function setMatch(a: string[], b: string[]): MatchResult {
  const setA = new Set(a)
  const setB = new Set(b)
  if (setA.size === setB.size && [...setA].every(v => setB.has(v))) return 'correct'
  if ([...setA].some(v => setB.has(v))) return 'partial'
  return 'wrong'
}

export function ageMatch(guess: AgeRange, answer: AgeRange): AgeMatchResult {
  return exactMatch(guess, answer)
}

export function ageDirection(guess: AgeRange, answer: AgeRange): AgeDirection {
  if (guess === answer) return null
  return AGE_ORDER.indexOf(answer) > AGE_ORDER.indexOf(guess) ? 'higher' : 'lower'
}

export function arcMatch(guess: DebutArc, answer: DebutArc): ArcMatchResult {
  return exactMatch(guess, answer)
}

export function arcDirection(guess: DebutArc, answer: DebutArc): ArcDirection {
  if (guess === answer) return null
  return ARC_ORDER.indexOf(answer) < ARC_ORDER.indexOf(guess) ? 'earlier' : 'later'
}
