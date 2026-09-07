import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from './Modal'
import { EmojiPicker } from './EmojiPicker'
import { BarcodeScanner } from './BarcodeScanner'
import { lookupProductByBarcode } from '../api/barcode'
import { useApp } from '../context/AppContext'
import type { Category } from '../types'

type Tab = 'manual' | 'barcode'
type Stage = 'form' | 'scanning' | 'scan-failed'

interface RegisterIngredientModalProps {
  onClose: () => void
}

function todayPlus(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function RegisterIngredientModal({ onClose }: RegisterIngredientModalProps) {
  const { addIngredient } = useApp()
  const [tab, setTab] = useState<Tab>('manual')
  const [stage, setStage] = useState<Stage>('form')

  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🥚')
  const [category, setCategory] = useState<Category>('냉장')
  const [expiryDate, setExpiryDate] = useState(todayPlus(7))
  const [quantity, setQuantity] = useState(1)
  const [memo, setMemo] = useState('')

  async function handleBarcodeDetected(code: string) {
    const product = await lookupProductByBarcode(code)
    if (product) {
      setName(product.name)
      setEmoji(product.emoji)
      setStage('form')
      setTab('manual')
    } else {
      setStage('scan-failed')
    }
  }

  function handleCameraError() {
    setStage('scan-failed')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await addIngredient({ name: name.trim(), emoji, category, expiryDate, quantity, memo: memo.trim() || undefined })
    onClose()
  }

  if (stage === 'scanning' || stage === 'scan-failed') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-center bg-brand-brown px-6">
        {stage === 'scanning' ? (
          <>
            <p className="mb-4 rounded-xl bg-badge-green/90 px-4 py-3 text-center font-bold text-brand-brown">
              아래 네모 칸에 바코드가 들어가도록 해 주세요!
            </p>
            <BarcodeScanner onDetected={handleBarcodeDetected} onCameraError={handleCameraError} />
          </>
        ) : (
          <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-4 rounded-2xl bg-black/40">
            <p className="rounded-xl bg-badge-red/90 px-4 py-3 text-center font-bold text-white">
              인식에 실패했어요!
            </p>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          {stage === 'scan-failed' && (
            <button
              onClick={() => setStage('scanning')}
              className="flex-1 rounded-xl bg-badge-green py-3 font-bold text-brand-brown"
            >
              재시도
            </button>
          )}
          <button
            onClick={() => {
              setStage('form')
              setTab('manual')
            }}
            className="flex-1 rounded-xl bg-white py-3 font-bold text-brand-brown"
          >
            직접 입력하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-4 text-xl font-extrabold text-brand-brown">재료 등록</h2>

      <div className="mb-4 flex gap-2 rounded-full bg-white p-1">
        <button
          type="button"
          onClick={() => setTab('manual')}
          className={`flex-1 rounded-full py-2 text-sm font-bold ${
            tab === 'manual' ? 'bg-brand-orange text-white' : 'text-brand-brown/50'
          }`}
        >
          ✏️ 직접 입력
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('barcode')
            setStage('scanning')
          }}
          className={`flex-1 rounded-full py-2 text-sm font-bold ${
            tab === 'barcode' ? 'bg-brand-orange text-white' : 'text-brand-brown/50'
          }`}
        >
          ⛶ 바코드
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-brand-brown">재료 이름</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-xl border border-brand-brown/10 bg-white px-3 py-2"
          />
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-brand-brown">이모지 선택</span>
          <EmojiPicker value={emoji} onChange={setEmoji} />
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-brand-brown">보관 방법</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="rounded-xl border border-brand-brown/10 bg-white px-3 py-2"
          >
            <option value="냉장">냉장</option>
            <option value="냉동">냉동</option>
            <option value="실온">실온</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-brand-brown">소비기한</span>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="rounded-xl border border-brand-brown/10 bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-brand-brown">수량</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded-xl border border-brand-brown/10 bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-brand-brown">메모</span>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="rounded-xl border border-brand-brown/10 bg-white px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-xl bg-brand-orange py-3 font-extrabold text-white"
        >
          등록하기
        </button>
      </form>
    </Modal>
  )
}
