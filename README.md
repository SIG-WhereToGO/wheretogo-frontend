# 어디고 (WhereToGo) - 프론트엔드

여행 취향을 자연어 문장으로 입력하면, 백엔드 분석/추천 API와 연동해 맞춤 여행지 TOP 15를 카드 형태로 보여주는 프론트엔드입니다.

## 실행 방법

```bash
npm install
npm run dev       # 개발 서버 (기본 http://localhost:5173)
npm run build     # 프로덕션 빌드 (dist/ 생성)
npm run preview   # 빌드 결과 로컬 미리보기
```

## 환경 변수

`.env.example`을 복사해 `.env`로 만들고 필요 시 API 주소를 바꿀 수 있습니다. 지정하지 않으면 아래 배포 주소를 기본값으로 사용합니다.

```
VITE_API_BASE_URL=https://wheretogo-backend-23293547159.asia-northeast3.run.app
```

## 폴더 구조

```
src/
  api/
    client.js        # fetch 공통 래퍼 (에러 처리 포함)
    spots.js          # analyzeQuery, fetchRecommendations
  utils/
    normalize.js      # 백엔드 딕셔너리 응답 -> 배열/카드용 데이터로 변환
  components/
    TopBar.jsx         # 상단 "어디고" 로고 바 (검색 화면 전용)
    HeroBackground.jsx # 검색 화면 배경 일러스트(산/바다 SVG)
    SearchBar.jsx       # 검색창 + 추천 검색어 칩 (검색 화면 전용)
    SpotCard.jsx         # 결과 카드 (사진/지도/이름/주소/태그/적합도/상세보기)
    Pagination.jsx        # 카드 페이지네이션
  pages/
    SearchPage.jsx      # 1. 검색(랜딩) 화면
    LoadingPage.jsx      # 2. 로딩 화면 (실제 API 호출 수행)
    ResultsPage.jsx        # 3. 결과 화면 - 카드 그리드 + 페이지네이션만 포함
  App.jsx                # 라우팅 (react-router-dom)
```

> **결과 화면(ResultsPage) 관련 안내**: 상단바/검색창/추천 태그 등은 만들지 않았고, 카드 그리드와 페이지네이션만 최소 컨테이너로 담아뒀습니다. 실제 서비스 화면(스크린샷)에서는 카드 부분만 `SpotCard.jsx`를 가져다 기존 레이아웃에 끼워 넣으시면 됩니다.

## 카드 이미지 폴백 순서

`SpotCard.jsx`는 아래 순서로 썸네일을 표시합니다.

1. `image_url`이 있고 정상 로드되면 → 사진 표시
2. 사진이 없거나 깨졌는데 위도/경도(`latitude`, `longitude`)가 있으면 → 해당 좌표의 지도(OpenStreetMap 정적 지도, API 키 불필요)를 표시
3. 사진도 좌표도 없으면 → 기본 위치 아이콘 표시

## API 연동 플로우

1. **검색 화면**에서 사용자가 입력한 문장을 `/loading` 경로로 이동하며 전달합니다.
2. **로딩 화면**(`LoadingPage.jsx`)에서 실제 API 호출을 처리합니다.
   - `POST /analyze` `{ input_text }` → `{ request_id, region, tags }`
   - `GET /api/recommendations/{request_id}` → `{ input_analysis_info, recommend_spots_info }`
   - 진행 중에는 `ESTIMATED_MS`(기본 5초) 동안 진행률 바가 92%까지 서서히 채워지고, 실제 응답이 오면 100%로 마무리된 뒤 결과 화면으로 이동합니다. 응답이 더 늦어져도 92%에서 자연스럽게 대기합니다.
   - 요청이 실패하면 에러 화면 + "다시 시도하기" 버튼을 보여줍니다.
3. **결과 화면**(`ResultsPage.jsx`)에서 정규화된 여행지 배열을 5개씩 페이지네이션하여 카드로 보여줍니다. (카드 그리드 + 페이지네이션 외의 UI는 포함하지 않았습니다.)

## 상세보기 연결 지점

`ResultsPage.jsx`의 `handleViewDetail(spot)` 함수가 각 카드의 "상세보기" 버튼 클릭 시 호출됩니다.
`spot.raw`에 백엔드 원본 데이터(spot_id, info 전체 등)가 그대로 들어있으니, 이 함수 안에서 모달/새 페이지/외부 링크 등 원하는 방식으로 연결하면 됩니다.

```jsx
const handleViewDetail = (spot) => {
  // 예: 모달 열기, 상세 페이지로 라우팅, 외부 API 호출 등
};
```

## 백엔드 응답 형태 관련 참고

`recommend_spots_info`, `spot_tags`, `user_tags` 등은 스웨거 스키마상 `{ "additionalProp1": {...}, "additionalProp2": {...} }` 형태의 딕셔너리로 정의되어 있습니다.
`src/utils/normalize.js`의 `toArray()`가 키 이름에 상관없이 이를 배열로 변환하므로, 실제 배포 서버가 키를 `spot_id` 값 등으로 내려주더라도 그대로 동작합니다.
