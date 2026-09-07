interface ConfirmDialogProps {
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  message,
  confirmLabel = '네',
  cancelLabel = '아니요',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
      <div className="w-full max-w-xs rounded-2xl bg-brand-orange p-5 text-center shadow-xl">
        <p className="mb-4 font-bold text-white">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-white py-2 font-bold text-brand-brown"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-brand-orangeDark py-2 font-bold text-white"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
