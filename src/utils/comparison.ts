import type { AgeRange, AgeMatchResult, MatchResult } from '../types'

const AGE_ORDER: AgeRange[] = ['Child', 'Teen', 'Adult', 'Elder']

export function exactMatch(a: string | boolean, b: string | boolean): MatchResult {
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
  if (guess === answer) return 'correct'
  return AGE_ORDER.indexOf(answer) > AGE_ORDER.indexOf(guess)
    ? 'partial-higher'
    : 'partial-lower'
}
