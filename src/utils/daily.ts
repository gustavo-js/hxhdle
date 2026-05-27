export function getDayIndex(): number {
  return Math.floor(Date.now() / 86400000)
}

export function getDailyItem<T>(items: T[], dayIndex?: number): T {
  const day = dayIndex ?? getDayIndex()
  return items[day % items.length]
}

export function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
