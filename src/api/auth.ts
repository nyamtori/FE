import { API_BASE_URL } from './config'

export function getKakaoLoginUrl(): string {
  return `${API_BASE_URL}/oauth2/authorization/kakao`
}
