import { useState, useEffect, useRef } from 'react'
import type { GameType } from '../types'

interface StreakState {
  current: number  // live consecutive first-try wins
  frozen: number   // last broken streak, shown in grey state
}

const INITIAL: StreakState = { current: 0, frozen: 0 }

function load(mode: string): StreakState {
  try {
    const raw = localStorage.getItem(`hxhdle-streak-${mode}`)
    if (raw) {
      const p = JSON.parse(raw) as Partial<StreakState>
      return { current: p.current ?? 0, frozen: p.frozen ?? 0 }
    }
  } catch { /* ignore */ }
  return INITIAL
}

function persist(mode: string, state: StreakState): void {
  try { localStorage.setItem(`hxhdle-streak-${mode}`, JSON.stringify(state)) } catch { /* ignore */ }
}

export function useStreak(
  mode: string,
  type: GameType,
  answerId: string,
  status: 'playing' | 'won',
  guessCount: number
): { display: number; broken: boolean } {
  const [state, setState] = useState<StreakState>(() =>
    type === 'freeplay' ? load(mode) : INITIAL
  )

  const brokenRef = useRef(false)
  const prevAnswerRef = useRef(answerId)
  const prevStatusRef = useRef(status)

  // New game started: reset the broken flag
  useEffect(() => {
    if (answerId !== prevAnswerRef.current) {
      prevAnswerRef.current = answerId
      brokenRef.current = false
    }
  }, [answerId])

  // First wrong guess this game: freeze the current streak immediately
  useEffect(() => {
    if (type !== 'freeplay') return
    if (status === 'playing' && guessCount > 0 && !brokenRef.current) {
      brokenRef.current = true
      setState(s => {
        const next: StreakState = { current: 0, frozen: s.current > 0 ? s.current : s.frozen }
        persist(mode, next)
        return next
      })
    }
  }, [status, guessCount, type, mode])

  // First-try win: increment streak
  useEffect(() => {
    if (type !== 'freeplay') return
    const prev = prevStatusRef.current
    prevStatusRef.current = status
    if (prev !== 'won' && status === 'won' && !brokenRef.current) {
      setState(s => {
        const next: StreakState = { current: s.current + 1, frozen: s.frozen }
        persist(mode, next)
        return next
      })
    }
  }, [status, type, mode])

  if (type !== 'freeplay') return { display: 0, broken: false }

  const display = state.current > 0 ? state.current : state.frozen
  const broken = state.current === 0 && state.frozen > 0
  return { display, broken }
}
