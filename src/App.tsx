import { useState } from "react"
import type { Mode, GameType } from "./types"
import ClassicMode from "./components/ClassicMode"
import QuoteMode from "./components/QuoteMode"
import AbilityMode from "./components/AbilityMode"
import ImageMode from "./components/ImageMode"
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

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">⚔ HxHdle</h1>
        <p className="app__subtitle">Hunter x Hunter Character Guessing Game</p>
      </header>

      <nav className="app__controls" aria-label="Game controls">
        <div className="app__mode-tabs" role="tablist" aria-label="Game mode">
          {MODE_TABS.map(({ value, label }) => (
            <button
              key={value}
              role="tab"
              aria-selected={mode === value}
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

      <main className="app__content">
        {mode === "classic" && <ClassicMode type={type} />}
        {mode === "quote" && <QuoteMode type={type} />}
        {mode === "ability" && <AbilityMode type={type} />}
        {mode === "image" && <ImageMode type={type} />}
      </main>
    </div>
  )
}
