import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from './useGameState'
import characters from '../data/characters.json'
import quotes from '../data/quotes.json'
import abilities from '../data/abilities.json'

beforeEach(() => localStorage.clear())

describe('useGameState - classic daily', () => {
  it('initializes with empty guesses and playing status', () => {
    const { result } = renderHook(() => useGameState('classic', 'daily'))
    expect(result.current.guesses).toEqual([])
    expect(result.current.status).toBe('playing')
    expect(result.current.promptIndex).toBe(-1)
    expect(characters.map(c => c.id)).toContain(result.current.answerId)
  })

  it('adds a guess on submitGuess', () => {
    const { result } = renderHook(() => useGameState('classic', 'daily'))
    act(() => { result.current.submitGuess('gon-freecss') })
    expect(result.current.guesses).toEqual(['gon-freecss'])
  })

  it('sets status to won when correct answer is guessed', () => {
    const { result } = renderHook(() => useGameState('classic', 'daily'))
    const answerId = result.current.answerId
    act(() => { result.current.submitGuess(answerId) })
    expect(result.current.status).toBe('won')
  })

  it('does not add duplicate guesses', () => {
    const { result } = renderHook(() => useGameState('classic', 'daily'))
    act(() => { result.current.submitGuess('gon-freecss') })
    act(() => { result.current.submitGuess('gon-freecss') })
    expect(result.current.guesses).toHaveLength(1)
  })

  it('persists state to localStorage', () => {
    const { result } = renderHook(() => useGameState('classic', 'daily'))
    act(() => { result.current.submitGuess('killua-zoldyck') })
    const day = Math.floor(Date.now() / 86400000)
    const stored = JSON.parse(localStorage.getItem(`hxhdle-classic-daily-${day}`)!)
    expect(stored.guesses).toContain('killua-zoldyck')
  })
})

describe('useGameState - quote daily', () => {
  it('sets promptIndex to a valid quotes index', () => {
    const { result } = renderHook(() => useGameState('quote', 'daily'))
    expect(result.current.promptIndex).toBeGreaterThanOrEqual(0)
    expect(result.current.promptIndex).toBeLessThan(quotes.length)
  })
})

describe('useGameState - ability daily', () => {
  it('sets promptIndex to a valid abilities index', () => {
    const { result } = renderHook(() => useGameState('ability', 'daily'))
    expect(result.current.promptIndex).toBeGreaterThanOrEqual(0)
    expect(result.current.promptIndex).toBeLessThan(abilities.length)
  })
})

describe('useGameState - freeplay reset', () => {
  it('clears guesses and picks new answer after reset', () => {
    const { result } = renderHook(() => useGameState('classic', 'freeplay'))
    act(() => { result.current.submitGuess('gon-freecss') })
    act(() => { result.current.reset() })
    expect(result.current.guesses).toEqual([])
    expect(result.current.status).toBe('playing')
  })
})
