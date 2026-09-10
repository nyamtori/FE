# 냠토리 (Nyamtori) — Frontend

냉장고 재료 관리 + 보유 재료 기반 레시피 추천 앱.

## Stack

React 19 + Vite + TypeScript + Tailwind CSS + react-router-dom + `@zxing/browser` (바코드 스캔)

## Run

```bash
npm install
npm run dev
```

기본적으로 `http://localhost:8081`(백엔드, `nyamtori/BE`)로 요청을 보냅니다. 백엔드 주소를 바꾸려면 `.env`의 `VITE_API_BASE_URL`을 수정하세요. 백엔드는 별도로 (Spring Boot, `./gradlew bootRun`) 실행해야 합니다.

## Architecture

`src/api/`가 백엔드(`nyamtori/BE`, Spring Boot)와 통신하는 계층입니다.

- `src/api/client.ts` — 공통 fetch 래퍼. Authorization 헤더 부착, 401 시 refresh token으로 재시도.
- `src/api/tokens.ts` — access/refresh token localStorage 저장.
- `src/api/auth.ts` — 카카오 로그인 리다이렉트 URL.
- `src/api/ingredients.ts`, `src/api/recipes.ts`, `src/api/likes.ts`, `src/api/barcode.ts` — 도메인별 API 함수.
- `src/types` — 도메인 타입 (`Ingredient`, `Recipe`)
- `src/context/AppContext.tsx` — 재료/레시피/선택/로그인 상태를 앱 전역에서 공유
- `src/components` — 카드, 모달, 바코드 스캐너, 로그인 게이트 등 공용 컴포넌트
- `src/pages` — 마이 키친 / 마이 냉장고 / 마이 레시피 3개 탭 화면 + `/oauth/callback` 콜백 라우트

## 로그인

재료 등록/조회/바코드 조회는 로그인 없이 가능하지만(백엔드 `SecurityConfig`에서 permitAll), **AI 레시피 생성/조회와 찜(좋아요)은 카카오 로그인이 필요**합니다.

로그인 흐름: "카카오로 로그인" 버튼 → `{API_BASE_URL}/oauth2/authorization/kakao`로 전체 페이지 이동 → 카카오 인증 → 백엔드가 `accessToken`/`refreshToken`을 쿼리 파라미터로 실어 `/oauth/callback`(이 프론트)으로 리다이렉트 → 토큰을 저장하고 `/fridge`로 이동.

백엔드를 로컬에서 띄우려면 `KAKAO_REST_API_KEY`, `KAKAO_CLIENT_SECRET`, `JWT_SECRET`, `GEMINI_API_KEY` 등 환경변수와 MySQL이 필요합니다 (`nyamtori/BE/src/main/resources/application.yml` 참고).

## 레시피 생성

재료를 선택하고 "AI 레시피 생성하기"를 누르면 백엔드에 비동기 작업(job)이 생성되고, 완료될 때까지 상태를 polling합니다 (`PENDING → RUNNING → COMPLETE/FAILED`). 완료되면 레시피 목록이 갱신됩니다.

## 바코드 스캔 관련 참고

`@zxing/browser`로 실제 카메라를 통해 바코드를 스캔합니다. 스캔에 성공하면 백엔드의 `GET /api/v1/barcodes/{barcode}`(식약처 바코드연계제품정보 API 프록시)로 상품명을 조회합니다. 조회에 실패하면 "인식에 실패했어요" 결과가 되어 재시도 또는 직접 입력으로 이어집니다.

카메라 권한이 없는 환경(예: 브라우저 미리보기 샌드박스)에서는 자동으로 인식 실패 화면으로 전환됩니다.
