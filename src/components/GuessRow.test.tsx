import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Character, ClassicGuessResult } from '../types'
import GuessRow from './GuessRow'

const character: Character = {
  id: 'gon-freecss',
  name: 'Gon Freecss',
  gender: 'Male',
  origin: 'Whale Island',
  affiliation: ['Hunters Association'],
  nenType: ['Enhancer'],
  status: 'Alive',
  ageRange: 'Teen',
  hunterLicense: true,
  debutArc: 'Yorknew City Arc',
  image: '/images/characters/gon-freecss.webp',
}

const result: ClassicGuessResult = {
  characterId: character.id,
  gender: 'correct',
  origin: 'wrong',
  affiliation: 'partial',
  nenType: 'wrong',
  status: 'correct',
  ageRange: 'wrong',
  ageRangeDirection: 'higher',
  hunterLicense: 'correct',
  debutArc: 'wrong',
  debutArcDirection: 'earlier',
}

describe('GuessRow', () => {
  it('renders age and debut arc mismatches as wrong while keeping direction arrows', () => {
    render(<GuessRow character={character} result={result} />)

    const ageCell = screen.getByRole('gridcell', { name: /Age: Teen.*wrong higher/ })
    const debutArcCell = screen.getByRole('gridcell', {
      name: /Debut Arc: Yorknew City Arc.*wrong earlier/,
    })

    expect(ageCell).toHaveClass('guess-cell--wrong')
    expect(ageCell).toHaveTextContent('↑')
    expect(debutArcCell).toHaveClass('guess-cell--wrong')
    expect(debutArcCell).toHaveTextContent('↓')
  })
})
