import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import type { IScannerControls } from '@zxing/browser'

interface BarcodeScannerProps {
  onDetected: (code: string) => void
  onCameraError: () => void
}

/** Live camera view that decodes a barcode using the device camera. */
export function BarcodeScanner({ onDetected, onCameraError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [starting, setStarting] = useState(true)

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    let controls: IScannerControls | undefined
    let cancelled = false

    reader
      .decodeFromVideoDevice(undefined, videoRef.current ?? undefined, (result, _err, ctrl) => {
        controls = ctrl
        if (cancelled) return
        setStarting(false)
        if (result) {
          controls?.stop()
          onDetected(result.getText())
        }
      })
      .catch(() => {
        if (!cancelled) onCameraError()
      })

    return () => {
      cancelled = true
      controls?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black">
      <video ref={videoRef} className="aspect-[3/4] w-full object-cover" muted playsInline />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-40 w-64 rounded-lg border-2 border-badge-green" />
      </div>
      {starting && (
        <p className="absolute bottom-3 left-0 right-0 text-center text-xs font-semibold text-white">
          카메라를 준비하고 있어요...
        </p>
      )}
    </div>
  )
}
