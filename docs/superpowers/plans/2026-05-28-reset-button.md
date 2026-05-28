# Reset Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle reset icon button to the app header that opens a confirmation modal, then clears all `hxhdle-*` localStorage keys and reloads the page.

**Architecture:** A new `ResetModal` component handles the dialog UI (backdrop + card + Cancel/Reset buttons); the icon button and modal visibility state live in `App.tsx`. The reset action is a plain function that iterates `localStorage` keys and calls `window.location.reload()`.

**Tech Stack:** React 19, TypeScript, CSS custom properties (no icon library — inline SVG)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/ResetModal.tsx` | Create | Modal dialog: backdrop, title, body, Cancel/Reset buttons, Escape key handling |
| `src/components/ResetModal.css` | Create | Modal and backdrop styles |
| `src/components/ResetModal.test.tsx` | Create | Tests for modal interactions |
| `src/App.tsx` | Modify | Reset icon button, `showReset` state, `handleReset()` function |
| `src/App.css` | Modify | Reset icon button styles |

---

## Task 1: ResetModal component

**Files:**
- Create: `src/components/ResetModal.tsx`
- Create: `src/components/ResetModal.css`
- Create: `src/components/ResetModal.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/ResetModal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- ResetModal
```

Expected: 6 failures — `ResetModal` module not found.

- [ ] **Step 3: Create the component**

Create `src/components/ResetModal.tsx`:

```tsx
import { useEffect } from "react"
import "./ResetModal.css"

interface ResetModalProps {
  onClose: () => void
  onConfirm: () => void
}

export default function ResetModal({ onClose, onConfirm }: ResetModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div
      className="reset-modal__backdrop"
      data-testid="reset-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="reset-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="reset-modal-title" className="reset-modal__title">
          Reset all progress?
        </h2>
        <p className="reset-modal__body">
          This will clear every mode, including today's daily challenges. It cannot be undone.
        </p>
        <div className="reset-modal__actions">
          <button type="button" className="reset-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="reset-modal__confirm" onClick={onConfirm}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create the styles**

Create `src/components/ResetModal.css`:

```css
.reset-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal, 1000);
}

.reset-modal {
  background: linear-gradient(160deg, #1a2245 0%, var(--color-bg-secondary, #16213e) 100%);
  border: 1px solid var(--color-accent-gold, #c9a84c);
  border-radius: var(--border-radius-lg, 8px);
  padding: var(--spacing-xl, 32px) var(--spacing-lg, 24px);
  max-width: 360px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md, 16px);
}

.reset-modal__title {
  font-family: var(--font-family-display, 'Cinzel', Georgia, serif);
  font-size: var(--font-size-lg, 18px);
  font-weight: var(--font-weight-bold, 700);
  color: var(--color-accent-gold, #c9a84c);
  margin: 0;
}

.reset-modal__body {
  font-size: var(--font-size-sm, 14px);
  color: var(--color-text-secondary, #a8a8b8);
  margin: 0;
  line-height: 1.5;
}

.reset-modal__actions {
  display: flex;
  gap: var(--spacing-sm, 8px);
  justify-content: flex-end;
  margin-top: var(--spacing-xs, 4px);
}

.reset-modal__cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: none;
  color: var(--color-text-secondary, #a8a8b8);
  font-size: var(--font-size-sm, 14px);
  padding: var(--spacing-xs, 4px) var(--spacing-md, 16px);
  border-radius: var(--border-radius-md, 4px);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast);
}

.reset-modal__cancel:hover {
  background: rgba(255, 255, 255, 0.07);
  box-shadow: none;
  color: var(--color-text-primary, #e0e0e0);
  transform: none;
}

.reset-modal__confirm {
  background: transparent;
  border: 1px solid rgba(180, 60, 60, 0.5);
  box-shadow: none;
  color: #c97070;
  font-size: var(--font-size-sm, 14px);
  padding: var(--spacing-xs, 4px) var(--spacing-md, 16px);
  border-radius: var(--border-radius-md, 4px);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast),
    border-color var(--transition-fast);
}

.reset-modal__confirm:hover {
  background: rgba(180, 60, 60, 0.12);
  border-color: rgba(180, 60, 60, 0.8);
  box-shadow: none;
  color: #e08080;
  transform: none;
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npm test -- ResetModal
```

Expected: 6 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ResetModal.tsx src/components/ResetModal.css src/components/ResetModal.test.tsx
git commit -m "feat: add ResetModal confirmation dialog component"
```

---

## Task 2: Wire up reset button in App

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Add import, state, and handler to App.tsx**

In `src/App.tsx`, add the import after existing imports:

```tsx
import ResetModal from "./components/ResetModal"
```

Inside `App()`, add after the existing `useState` calls:

```tsx
const [showReset, setShowReset] = useState(false)

function handleReset() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("hxhdle-")) localStorage.removeItem(key)
  }
  window.location.reload()
}
```

- [ ] **Step 2: Add the reset icon button inside the header**

In `src/App.tsx`, replace the `<header>` block:

```tsx
<header className="app__header">
  <h1 className="app__title">⚔ HxHdle</h1>
  <p className="app__subtitle">Hunter x Hunter Character Guessing Game</p>
  <button
    type="button"
    className="app__reset-btn"
    onClick={() => setShowReset(true)}
    aria-label="Reset all progress"
    title="Reset all progress"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 7A5 5 0 1 1 9.5 2.67"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9.5 0.5 L9.5 3.5 L12.5 2 Z"
        fill="currentColor"
      />
    </svg>
  </button>
</header>
```

- [ ] **Step 3: Render the modal conditionally at the end of the App JSX**

In `src/App.tsx`, inside the outer `<div className="app">`, add just before the closing `</div>`:

```tsx
{showReset && (
  <ResetModal
    onClose={() => setShowReset(false)}
    onConfirm={handleReset}
  />
)}
```

- [ ] **Step 4: Add reset button styles to App.css**

In `src/App.css`, append after the `.app__header::after` block (after line ~33):

```css
/* ── Reset icon button ─────────────────────────────────────────────────────── */

.app__reset-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 4px;
  color: var(--color-text-secondary, #a8a8b8);
  opacity: 0.25;
  cursor: pointer;
  border-radius: var(--border-radius-sm, 2px);
  line-height: 0;
  transition: opacity var(--transition-normal);
}

.app__reset-btn:hover {
  opacity: 0.6;
  background: transparent;
  box-shadow: none;
  transform: none;
}
```

- [ ] **Step 5: Run the full test suite**

```bash
npm run test:run
```

Expected: all tests pass, no regressions.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "feat: add subtle reset button with confirmation modal"
```
