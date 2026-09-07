# 냠토리 (Nyamtori) — Frontend

냉장고 재료 관리 + 보유 재료 기반 레시피 추천 앱.

## Stack

React 19 + Vite + TypeScript + Tailwind CSS + react-router-dom + `@zxing/browser` (바코드 스캔)

## Run

```bash
npm install
npm run dev
```

## Architecture

`src/api/`에 백엔드가 아직 없는 상태를 위한 **mock 서비스 레이어**가 있습니다. `getIngredients`, `createIngredient`, `deleteIngredient`, `getRecipes`, `toggleFavoriteRecipe`, `lookupProductByBarcode` 등은 지금은 `localStorage`를 읽고 쓰지만, 실제 백엔드가 준비되면 각 함수 내부만 `fetch` 호출로 바꾸면 됩니다 — 화면 컴포넌트는 이 함수들의 시그니처만 알면 됩니다.

- `src/types` — 도메인 타입 (`Ingredient`, `Recipe`)
- `src/data` — 초기 mock 데이터 (냉장고 재료, 레시피, 바코드 조회 테이블)
- `src/api` — mock API 함수 (나중에 실제 백엔드 연동 지점)
- `src/context/AppContext.tsx` — 재료/레시피/선택 상태를 앱 전역에서 공유
- `src/components` — 카드, 모달, 바코드 스캐너 등 공용 컴포넌트
- `src/pages` — 마이 키친 / 마이 냉장고 / 마이 레시피 3개 탭 화면

## 바코드 스캔 관련 참고

`@zxing/browser`로 실제 카메라를 통해 바코드를 스캔합니다. 스캔에 성공하면 `lookupProductByBarcode`가 바코드 번호로 상품명을 조회하는데, 지금은 `src/data/mockBarcodes.ts`의 샘플 테이블 몇 개만 등록되어 있어 실제 바코드 대부분은 "인식에 실패했어요" 결과가 됩니다 (재시도 또는 직접 입력으로 이어짐). 백엔드에 상품 조회 API가 생기면 `src/api/barcode.ts`의 구현부만 교체하면 됩니다.

카메라 권한이 없는 환경(예: 브라우저 미리보기 샌드박스)에서는 자동으로 인식 실패 화면으로 전환됩니다.
