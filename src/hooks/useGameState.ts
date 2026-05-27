import { useState, useEffect, useCallback } from 'react'
import type { Mode, GameType, GameState } from '../types'
import characters from '../data/characters.json'
import quotes from '../data/quotes.json'
import abilities from '../data/abilities.json'
import { getDailyItem, getRandomItem } from '../utils/daily'

function makeKey(mode: Mode, type: GameType): string {
  if (type === 'daily') {
    const day = Math.floor(Date.now() / 86400000)
    return `hxhdle-${mode}-daily-${day}`
  }
  return `hxhdle-${mode}-freeplay`
}

function initState(mode: Mode, type: GameType): GameState {
  const key = makeKey(mode, type)
  const stored = localStorage.getItem(key)
  if (stored) return JSON.parse(stored) as GameState

  let answerId: string
  let promptIndex = -1

  if (mode === 'classic' || mode === 'image') {
    const char = type === 'daily' ? getDailyItem(characters) : getRandomItem(characters)
    answerId = char.id
  } else if (mode === 'quote') {
    const indices = quotes.map((_, i) => i)
    promptIndex = type === 'daily' ? getDailyItem(indices) : getRandomItem(indices)
    answerId = quotes[promptIndex].characterId
  } else {
    const indices = abilities.map((_, i) => i)
    promptIndex = type === 'daily' ? getDailyItem(indices) : getRandomItem(indices)
    answerId = abilities[promptIndex].characterId
  }

  return { answerId, promptIndex, guesses: [], status: 'playing' }
}

export function useGameState(mode: Mode, type: GameType) {
  const [state, setState] = useState<GameState>(() => initState(mode, type))

  useEffect(() => {
    localStorage.setItem(makeKey(mode, type), JSON.stringify(state))
  }, [state, mode, type])

  const submitGuess = useCallback((characterId: string) => {
    setState(prev => {
      if (prev.status === 'won') return prev
      if (prev.guesses.includes(characterId)) return prev
      const guesses = [...prev.guesses, characterId]
      const status = characterId === prev.answerId ? 'won' : 'playing'
      return { ...prev, guesses, status }
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(makeKey(mode, type))
    setState(initState(mode, type))
  }, [mode, type])

  return { ...state, submitGuess, reset }
}
