import { describe, it, expect } from 'vitest'
import { exactMatch, setMatch, ageMatch } from './comparison'

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
  it('returns partial-higher when answer is older than guess', () => {
    expect(ageMatch('Teen', 'Adult')).toBe('partial-higher')
  })
  it('returns partial-lower when answer is younger than guess', () => {
    expect(ageMatch('Adult', 'Teen')).toBe('partial-lower')
  })
})
