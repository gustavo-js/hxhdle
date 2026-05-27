import { describe, it, expect } from 'vitest'
import { getDayIndex, getDailyItem, getRandomItem } from './daily'

describe('getDayIndex', () => {
  it('returns a stable non-negative integer', () => {
    const a = getDayIndex()
    const b = getDayIndex()
    expect(a).toBe(b)
    expect(Number.isInteger(a)).toBe(true)
    expect(a).toBeGreaterThanOrEqual(0)
  })
})

describe('getDailyItem', () => {
  const items = ['a', 'b', 'c']

  it('returns a deterministic item for a given day index', () => {
    expect(getDailyItem(items, 0)).toBe('a')
    expect(getDailyItem(items, 1)).toBe('b')
    expect(getDailyItem(items, 2)).toBe('c')
  })

  it('wraps around using modulo', () => {
    expect(getDailyItem(items, 3)).toBe('a')
    expect(getDailyItem(items, 4)).toBe('b')
  })
})

describe('getRandomItem', () => {
  it('returns an item that exists in the array', () => {
    const items = ['x', 'y', 'z']
    expect(items).toContain(getRandomItem(items))
  })
})
