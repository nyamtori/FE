interface LoginGateProps {
  onLogin: () => void
  message?: string
}

export function LoginGate({ onLogin, message = '로그인이 필요한 기능이에요' }: LoginGateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center">
      <span className="text-3xl">🔒</span>
      <p className="font-bold text-brand-brown">{message}</p>
      <button
        onClick={onLogin}
        className="rounded-full bg-[#FEE500] px-5 py-2.5 text-sm font-bold text-[#3C1E1E]"
      >
        카카오로 로그인
      </button>
    </div>
  )
}
