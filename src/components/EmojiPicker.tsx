const EMOJI_OPTIONS = [
  '🥚', '🥕', '🧅', '🥩', '🥔', '🧄', '🥛', '🍅', '🥬', '🍞',
  '🧀', '🍗', '🐟', '🍄', '🌽', '🥦', '🍚', '🧈', '🍋', '🍎',
]

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2 rounded-2xl bg-white p-3">
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors ${
            value === emoji ? 'bg-brand-orange' : 'bg-olive-light'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
