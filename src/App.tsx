import { useState } from "react"
import type { Mode, GameType } from "./types"
import ClassicMode from "./components/ClassicMode"
import QuoteMode from "./components/QuoteMode"
import AbilityMode from "./components/AbilityMode"
import ImageMode from "./components/ImageMode"
import ResetModal from "./components/ResetModal"
import "./App.css"

const MODE_TABS: { value: Mode; label: string }[] = [
  { value: "classic", label: "Classic" },
  { value: "quote", label: "Quote" },
  { value: "ability", label: "Ability" },
  { value: "image", label: "Image" },
]

export default function App() {
  const [mode, setMode] = useState<Mode>("classic")
  const [type, setType] = useState<GameType>("daily")
  const [showReset, setShowReset] = useState(false)

  function handleReset() {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("hxhdle-")) localStorage.removeItem(key)
    }
    window.location.reload()
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">HxHdle</h1>
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

      <nav className="app__controls" aria-label="Game controls">
        <div className="app__mode-tabs" role="tablist" aria-label="Game mode">
          {MODE_TABS.map(({ value, label }) => (
            <button
              key={value}
              id={`tab-${value}`}
              role="tab"
              aria-selected={mode === value}
              aria-controls="panel-main"
              className={`app__mode-tab${mode === value ? " app__mode-tab--active" : ""}`}
              onClick={() => setMode(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="app__type-toggle" role="group" aria-label="Game type">
          <button
            className={`app__type-btn${type === "daily" ? " app__type-btn--active" : ""}`}
            onClick={() => setType("daily")}
            type="button"
            aria-pressed={type === "daily"}
          >
            Daily
          </button>
          <button
            className={`app__type-btn${type === "freeplay" ? " app__type-btn--active" : ""}`}
            onClick={() => setType("freeplay")}
            type="button"
            aria-pressed={type === "freeplay"}
          >
            Freeplay
          </button>
        </div>
      </nav>

      <main className="app__content" role="tabpanel" id="panel-main" aria-labelledby={`tab-${mode}`}>
        {mode === "classic" && <ClassicMode key={`classic-${type}`} type={type} />}
        {mode === "quote" && <QuoteMode key={`quote-${type}`} type={type} />}
        {mode === "ability" && <AbilityMode key={`ability-${type}`} type={type} />}
        {mode === "image" && <ImageMode key={`image-${type}`} type={type} />}
      </main>

      {showReset && (
        <ResetModal
          onClose={() => setShowReset(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  )
}
