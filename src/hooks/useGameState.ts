import { useState, useEffect, useCallback } from 'react'
import type { Mode, GameType, GameState } from '../types'
import characters from '../data/characters.json'
import quotes from '../data/quotes.json'
import abilities from '../data/abilities.json'
import { getDailyItem } from '../utils/daily'

// Per-mode session pools: tracks which items have been shown this browser session
// so freeplay never repeats until all items are exhausted, then cycles.
const sessionPool = new Map<string, Set<string>>()

function getPool(key: string): Set<string> {
  if (!sessionPool.has(key)) sessionPool.set(key, new Set())
  return sessionPool.get(key)!
}

function pickFromPool(pool: Set<string>, ids: string[]): string {
  const available = ids.filter(id => !pool.has(id))
  if (available.length === 0) {
    pool.clear()
    const chosen = ids[Math.floor(Math.random() * ids.length)]
    pool.add(chosen)
    return chosen
  }
  const chosen = available[Math.floor(Math.random() * available.length)]
  pool.add(chosen)
  return chosen
}

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

  if (stored) {
    const state = JSON.parse(stored) as GameState
    // Track the restored freeplay item so the next game won't repeat it.
    if (type === 'freeplay') {
      if (mode === 'classic' || mode === 'image') {
        getPool(`freeplay-${mode}`).add(state.answerId)
      } else if (mode === 'quote' && state.promptIndex >= 0) {
        getPool('freeplay-quote').add(String(state.promptIndex))
      } else if (mode === 'ability' && state.promptIndex >= 0) {
        getPool('freeplay-ability').add(String(state.promptIndex))
      }
    }
    return state
  }

  let answerId: string
  let promptIndex = -1

  if (mode === 'classic' || mode === 'image') {
    if (type === 'freeplay') {
      const charIds = characters.map(c => c.id)
      answerId = pickFromPool(getPool(`freeplay-${mode}`), charIds)
    } else {
      answerId = getDailyItem(characters).id
    }
  } else if (mode === 'quote') {
    const indices = quotes.map((_, i) => String(i))
    if (type === 'freeplay') {
      promptIndex = Number(pickFromPool(getPool('freeplay-quote'), indices))
    } else {
      promptIndex = getDailyItem(quotes.map((_, i) => i))
    }
    answerId = quotes[promptIndex].characterId
  } else {
    const indices = abilities.map((_, i) => String(i))
    if (type === 'freeplay') {
      promptIndex = Number(pickFromPool(getPool('freeplay-ability'), indices))
    } else {
      promptIndex = getDailyItem(abilities.map((_, i) => i))
    }
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
