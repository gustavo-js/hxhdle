import { describe, it, expect } from 'vitest'
import { exactMatch, setMatch, ageDirection, ageMatch, arcDirection, arcMatch } from './comparison'

describe('exactMatch', () => {
  it('returns correct for equal strings', () => {
    expect(exactMatch('Male', 'Male')).toBe('correct')
  })
  it('returns wrong for different strings', () => {
    expect(exactMatch('Male', 'Female')).toBe('wrong')
  })
  it('returns correct for equal booleans', () => {
    expect(exactMatch(true, true)).toBe('correct')
  })
  it('returns wrong for different booleans', () => {
    expect(exactMatch(true, false)).toBe('wrong')
  })
})

describe('setMatch', () => {
  it('returns correct for identical single-value sets', () => {
    expect(setMatch(['Hunters Association'], ['Hunters Association'])).toBe('correct')
  })
  it('returns correct for identical multi-value sets regardless of order', () => {
    expect(setMatch(['Zodiacs', 'Hunters Association'], ['Hunters Association', 'Zodiacs'])).toBe('correct')
  })
  it('returns partial for overlapping sets', () => {
    expect(setMatch(['Zodiacs', 'Hunters Association'], ['Hunters Association'])).toBe('partial')
  })
  it('returns wrong for no overlap', () => {
    expect(setMatch(['Phantom Troupe'], ['Hunters Association'])).toBe('wrong')
  })
})

describe('ageMatch', () => {
  it('returns correct for same age range', () => {
    expect(ageMatch('Teen', 'Teen')).toBe('correct')
  })
  it('returns wrong when answer is older than guess', () => {
    expect(ageMatch('Teen', 'Adult')).toBe('wrong')
  })
  it('returns wrong when answer is younger than guess', () => {
    expect(ageMatch('Adult', 'Teen')).toBe('wrong')
  })
})

describe('ageDirection', () => {
  it('returns null for same age range', () => {
    expect(ageDirection('Teen', 'Teen')).toBeNull()
  })
  it('returns higher when answer is older than guess', () => {
    expect(ageDirection('Teen', 'Adult')).toBe('higher')
  })
  it('returns lower when answer is younger than guess', () => {
    expect(ageDirection('Adult', 'Teen')).toBe('lower')
  })
})

describe('arcMatch', () => {
  it('returns correct for same debut arc', () => {
    expect(arcMatch('Hunter Exam Arc', 'Hunter Exam Arc')).toBe('correct')
  })
  it('returns wrong for different debut arcs', () => {
    expect(arcMatch('Hunter Exam Arc', 'Yorknew City Arc')).toBe('wrong')
  })
})

describe('arcDirection', () => {
  it('returns null for same debut arc', () => {
    expect(arcDirection('Hunter Exam Arc', 'Hunter Exam Arc')).toBeNull()
  })
  it('returns later when answer debuts later than guess', () => {
    expect(arcDirection('Hunter Exam Arc', 'Yorknew City Arc')).toBe('later')
  })
  it('returns earlier when answer debuts earlier than guess', () => {
    expect(arcDirection('Yorknew City Arc', 'Hunter Exam Arc')).toBe('earlier')
  })
})
