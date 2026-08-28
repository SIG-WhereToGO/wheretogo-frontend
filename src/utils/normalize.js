/**
 * 백엔드가 { additionalProp1: {...}, additionalProp2: {...} } 형태의
 * "딕셔너리"로 내려주는 컬렉션을 배열로 변환합니다.
 * 이미 배열이면 그대로 반환합니다. (POST /analyze 의 tags는 배열로 내려옴)
 */
export function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return Object.values(value);
  return [];
}

/**
 * GET /api/recommendations/{request_id} 응답 중 recommend_spots_info를
 * 카드에서 바로 쓰기 좋은 형태의 배열로 변환하고, 적합도 점수 내림차순으로 정렬합니다.
 *
 * 백엔드 필드 -> 프론트 필드 매핑
 *  spot_id / info.recommend_spot_id -> id
 *  recommendation_score             -> score
 *  info.name                        -> name
 *  info.address                     -> address
 *  info.region                      -> region
 *  info.image_url                   -> imageUrl
 *  info.spot_tags (dict)            -> tags (array)
 *  info.description                 -> description
 *  info.tourism_type                -> tourismType
 *  info.usage_info / detail_info    -> usageInfo / detailInfo (상세보기 연결용, 원본 유지)
 */
export function normalizeSpots(recommendSpotsInfo) {
  return toArray(recommendSpotsInfo)
    .map((entry) => {
      const info = entry?.info || {};
      return {
        id: entry?.spot_id ?? info.recommend_spot_id,
        score: entry?.recommendation_score ?? 0,
        name: info.name || '이름 미상',
        description: info.description || '',
        region: info.region || '',
        address: info.address || '',
        imageUrl: info.image_url || '',
        tourismType: info.tourism_type || '',
        tags: toArray(info.spot_tags).map((t) => t.name).filter(Boolean),
        usageInfo: toArray(info.usage_info),
        detailInfo: toArray(info.detail_info),
        petInfo: toArray(info.pet_info),
        latitude: info.latitude,
        longitude: info.longitude,
        raw: entry, // 상세보기 연결 시 원본 데이터가 필요할 수 있어 함께 보관
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

/**
 * input_analysis_info.user_tags (딕셔너리) -> 배열
 */
export function normalizeUserTags(userTags) {
  return toArray(userTags).map((t) => ({
    id: t.tag_id,
    category: t.category,
    name: t.name,
  }));
}

/**
 * POST /analyze 응답의 tags(배열) 정규화 - 이미 배열이라 형태만 맞춰줌
 */
export function normalizeAnalyzeTags(tags) {
  return toArray(tags).map((t) => ({
    id: t.tag_id,
    category: t.category,
    name: t.name,
    probability: t.probability,
  }));
}
