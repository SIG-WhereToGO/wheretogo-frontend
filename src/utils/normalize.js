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

const COMPANION_TAGS = {
  companion_solo: '혼자',
  companion_friend: '친구',
  companion_romantic_partner: '연인',
  companion_family: '가족',
  companion_group: '단체',
  companion_pet: '반려동물',
};

const SPOT_STYLE_TAGS = {
  style_healing: '힐링',
  style_nature: '자연',
  style_activity: '액티비티',
  style_culture: '문화',
  style_history: '역사',
  style_photo_spot: '사진 명소',
  style_outdoor: '야외',
  style_indoor: '실내',
  style_experience: '체험',
  style_food: '음식',
  style_shopping: '쇼핑',
};

const LABEL_NAME_MAP = {
  ...COMPANION_TAGS,
  ...SPOT_STYLE_TAGS,
};

function getLabelName(label) {
  return LABEL_NAME_MAP[label] || label;
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

        companionTags: toArray(info.spot_tags)
                        .map((t) => ({
                          id: t.tag_id,
                          category: t.category,
                          name: getLabelName(t.name),
                        }))
                        .filter((t) => t.category === "companion" && COMPANION_TAGS[t.name]),
        styleTags: toArray(info.spot_tags)
                    .map((t) => ({
                      id: t.tag_id,
                      category: t.category,
                      name: getLabelName(t.name),
                    }))
                    .filter((t) => t.category === "style" && SPOT_STYLE_TAGS[t.name]),
        tags: toArray(info.spot_tags)
              .map((t) => (getLabelName(t.name))),

        usageInfo: toArray(info.usage_info),
        detailInfo: toArray(info.detail_info),
        petInfo: toArray(info.pet_info),
        latitude: info.latitude,
        longitude: info.longitude,
        raw: entry, // 상세보기 연결 시 원본 데이터가 필요할 수 있어 함께 보관
      };
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 15);
}

/**
 * input_analysis_info.user_tags (딕셔너리) -> 배열
 */
/*
export function normalizeUserTags(userTags) {
  return toArray(userTags).map((t) => ({
    id: t.tag_id,
    category: t.category,
    name: getLabelName(t.name),
  }));
}
*/

/**
 * POST /analyze 응답의 tags(배열) 정규화 - 한글이름으로된 태그들이 확률기준으로 정렬된 배열
 */
export function normalizeAnalyzeTags(tags) {
  const tagsArr = toArray(tags).map((t) => ({
    id: t.tag_id,
    category: t.category,
    name: t.name,
    probability: t.probability,
  }));

  const companionTags = tagsArr
    .filter((t) => t.category == "companion")
    .sort((a, b) => b.probability - a.probability)
    .map((t) => COMPANION_TAGS[t.name] || t.name);

  const styleTags = tagsArr
    .filter((t) => t.category == "style")
    .sort((a, b) => b.probability - a.probability)
    .map((t) => SPOT_STYLE_TAGS[t.name] || t.name);

  return {
    companionTags,
    styleTags
  }
}
