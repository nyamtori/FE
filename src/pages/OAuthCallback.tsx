import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { setTokens } from '../api/tokens'

export function OAuthCallback() {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken)
      // 컨텍스트가 새 로그인 상태로 다시 초기화되도록 풀 리로드로 이동한다.
      window.location.href = '/fridge'
      return
    }
    setError('로그인 정보를 받지 못했어요.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      {error ? (
        <>
          <p className="font-bold text-brand-brown">{error}</p>
          <a href="/fridge" className="text-sm font-semibold text-brand-orange underline">
            돌아가기
          </a>
        </>
      ) : (
        <p className="font-bold text-brand-brown">로그인 처리 중이에요...</p>
      )}
    </div>
  )
}
