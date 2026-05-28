import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ResetModal from './ResetModal'

describe('ResetModal', () => {
  const onClose = vi.fn()
  const onConfirm = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
    onConfirm.mockClear()
  })

  it('renders title and body text', () => {
    render(<ResetModal onClose={onClose} onConfirm={onConfirm} />)
    expect(screen.getByText('Reset all progress?')).toBeInTheDocument()
    expect(screen.getByText(/today's daily challenges/i)).toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', () => {
    render(<ResetModal onClose={onClose} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledOnce()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when Reset is clicked', () => {
    render(<ResetModal onClose={onClose} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<ResetModal onClose={onClose} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByTestId('reset-modal-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not close when the modal card itself is clicked', () => {
    render(<ResetModal onClose={onClose} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', () => {
    render(<ResetModal onClose={onClose} onConfirm={onConfirm} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
