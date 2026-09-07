import type { ReactNode } from 'react'

interface ModalProps {
  onClose: () => void
  children: ReactNode
  headerAccessory?: ReactNode
}

/** Bottom-sheet style modal used for ingredient registration and recipe detail. */
export function Modal({ onClose, children, headerAccessory }: ModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex justify-center bg-black/50">
      <div className="relative flex h-full w-full max-w-[428px] flex-col overflow-y-auto rounded-t-3xl bg-cream pb-24 pt-5 shadow-2xl">
        <div className="absolute right-4 top-4 z-10">
          <button
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-lg font-bold text-brand-brown"
          >
            ×
          </button>
        </div>
        {headerAccessory}
        <div className="px-5">{children}</div>
      </div>
    </div>
  )
}
