import { useState, useRef, useEffect, useCallback, useId } from "react"
import type { Character } from "../types"
import "./Autocomplete.css"

interface AutocompleteProps {
  characters: Character[]
  excludeIds: string[]
  onSelect: (character: Character) => void
  placeholder?: string
  disabled?: boolean
  hidePortraits?: boolean
}

export default function Autocomplete({
  characters,
  excludeIds,
  onSelect,
  placeholder = "Search for a character…",
  disabled = false,
  hidePortraits = false,
}: AutocompleteProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const id = useId()
  const listboxId = `${id}-listbox`

  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = query.trim()
    ? characters.filter(
        (c) =>
          !excludeIds.includes(c.id) &&
          c.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : []

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
    setHighlightedIndex(-1)
  }, [])

  const handleSelect = useCallback(
    (character: Character) => {
      if (disabled) return
      onSelect(character)
      setQuery("")
      closeDropdown()
      inputRef.current?.focus()
    },
    [disabled, onSelect, closeDropdown]
  )

  // Close on outside click
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [closeDropdown])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return
    const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: "nearest" })
  }, [highlightedIndex])

  // Reset highlightedIndex when filtered list shrinks below current index
  useEffect(() => {
    if (highlightedIndex >= filtered.length) {
      setHighlightedIndex(-1)
    }
  }, [filtered.length, highlightedIndex])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setHighlightedIndex(-1)
    if (val.trim().length >= 2) setIsOpen(true)
    else setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" && query.trim().length >= 2) {
        e.preventDefault()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          filtered.length === 0 ? -1 : (prev + 1) % filtered.length
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) =>
          filtered.length === 0
            ? -1
            : prev <= 0
            ? filtered.length - 1
            : prev - 1
        )
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        closeDropdown()
        break
    }
  }

  const showDropdown = isOpen && query.trim().length >= 2

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        className="autocomplete-input"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length >= 2) setIsOpen(true)
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-label={placeholder ?? 'Search characters'}
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        {...(showDropdown ? { "aria-controls": listboxId } : {})}
        aria-activedescendant={
          highlightedIndex >= 0
            ? `${id}-option-${highlightedIndex}`
            : undefined
        }
      />

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="autocomplete-dropdown"
          ref={listRef}
        >
          {filtered.length === 0 ? (
            <li className="autocomplete-no-results" role="presentation">
              No results
            </li>
          ) : (
            filtered.map((character, index) => (
              <li
                key={character.id}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={
                  "autocomplete-option" +
                  (index === highlightedIndex ? " autocomplete-option--highlighted" : "")
                }
                onPointerDown={(e) => {
                  // Prevent input blur before click fires
                  e.preventDefault()
                }}
                onClick={() => handleSelect(character)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {!hidePortraits && (
                  <img
                    src={character.image}
                    alt={character.name}
                    className="autocomplete-portrait"
                    width={32}
                    height={32}
                  />
                )}
                <span className="autocomplete-name truncate">{character.name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
