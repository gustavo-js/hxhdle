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
          <button type="button" className="reset-modal__cancel" onClick={onClose} autoFocus>
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
