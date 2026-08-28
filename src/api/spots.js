import { apiFetch } from './client';

/**
 * 사용자의 자연어 검색 문장을 분석 요청합니다.
 * POST /analyze
 * body: { input_text: string }
 * response: { request_id, region, tags: [{ tag_id, category, name, probability }] }
 */
export function analyzeQuery(inputText) {
  return apiFetch('/analyze', {
    method: 'POST',
    body: JSON.stringify({ input_text: inputText }),
  });
}

/**
 * 분석 결과(request_id)를 기반으로 추천 여행지 TOP 15와 상세정보를 조회합니다.
 * GET /api/recommendations/{request_id}
 * response: { input_analysis_info, recommend_spots_info }
 */
export function fetchRecommendations(requestId) {
  return apiFetch(`/api/recommendations/${requestId}`, {
    method: 'GET',
  });
}
