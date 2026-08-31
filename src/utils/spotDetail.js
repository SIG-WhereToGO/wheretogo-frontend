const KEY_LABELS = {
  parking: '주차',
  usetime: '이용시간',
  restdate: '휴무일',
  infocenter: '문의',
  openperiod: '운영기간',
  expagerange: '체험 가능 연령',
  accomcount: '수용인원',
  usefee: '이용요금',
  spendtime: '예상 소요시간',
  chkbabycarriage: '유모차 대여',
  chkcreditcard: '신용카드',
  chkpet: '반려동물 동반',
  heritage1: '문화재 여부',
  heritage2: '문화재 여부',
  heritage3: '문화재 여부',
  contentid: '콘텐츠 ID',
  infoname: '항목',
  infotext: '내용',
  serialnum: '순서',
};

/**
 * 최종 백엔드 RecommendSpotInfo를 상세 모달에서 쓰기 좋은 형태로 변환합니다.
 *
 * 백엔드 최종 구조:
 * {
 *   spot_id,
 *   recommendation_score,
 *   info: {
 *     recommend_spot_id, name, description, usage_info, detail_info,
 *     region, address, latitude, longitude, image_url, pet_info,
 *     tourism_type, spot_tags
 *   }
 * }
 */
export function normalizeRecommendation(recommendation) {
  if (!recommendation) return null;

  const info = recommendation.info ?? recommendation;

  return {
    spotId:
      recommendation.spot_id ??
      info.recommend_spot_id ??
      info.spot_id ??
      null,
    score:
      recommendation.recommendation_score ??
      info.recommendation_score ??
      null,
    name: info.name ?? '이름 정보 없음',
    description: info.description ?? '',
    usageInfo: info.usage_info ?? {},
    // 최종 API에서 detail_info는 object[] | null 입니다.
    detailInfo: info.detail_info ?? [],
    region: info.region ?? '',
    address: info.address ?? '',
    latitude: numberOrNull(info.latitude),
    longitude: numberOrNull(info.longitude),
    imageUrl: info.image_url ?? '',
    petInfo: info.pet_info ?? {},
    tourismType: info.tourism_type ?? '',
    tags: toArray(info.spot_tags ?? info.tags).filter(Boolean),
  };
}

export function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return Object.values(value);
  return [];
}

/**
 * usage_info / pet_info(object)와 detail_info(object[])를 모두 표시 가능한
 * { key, label, value } 배열로 바꿉니다.
 */
export function formatInfoEntries(data) {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.flatMap((item, itemIndex) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return [];

      // 관광공사 반복정보(detail_info)의 흔한 구조를 사람이 읽기 쉽게 묶습니다.
      const name = cleanDisplayValue(item.infoname);
      const text = cleanDisplayValue(item.infotext);
      if (name || text) {
        return [
          {
            key: `detail-${itemIndex}`,
            label: name || `상세 정보 ${itemIndex + 1}`,
            value: text || cleanDisplayValue(item),
          },
        ].filter((entry) => entry.value);
      }

      return objectToEntries(item, `detail-${itemIndex}`);
    });
  }

  if (typeof data === 'object') {
    return objectToEntries(data, 'info');
  }

  return [];
}

/**
 * 지도 링크에는 좌표 숫자를 검색어로 노출하지 않고 여행지명 + 주소를 사용합니다.
 * 동일한 이름의 장소가 있을 때 주소가 검색 정확도를 보완합니다.
 */
export function buildMapUrl({ name, address }) {
  const query = [name, address].filter(Boolean).join(' ').trim();
  if (!query) return null;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function objectToEntries(data, prefix) {
  return Object.entries(data)
    .map(([key, value], index) => ({
      key: `${prefix}-${key}-${index}`,
      label: KEY_LABELS[key] ?? humanizeKey(key),
      value: cleanDisplayValue(value),
    }))
    .filter((item) => item.value);
}

function humanizeKey(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function numberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function cleanDisplayValue(value) {
  if (value === null || value === undefined || value === '') return '';

  if (typeof value === 'boolean') return value ? '가능' : '불가';

  if (Array.isArray(value)) {
    return value.map(cleanDisplayValue).filter(Boolean).join(', ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nested]) => {
        const cleaned = cleanDisplayValue(nested);
        return cleaned ? `${KEY_LABELS[key] ?? humanizeKey(key)}: ${cleaned}` : '';
      })
      .filter(Boolean)
      .join(' · ');
  }

  const text = String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+\n/g, '\n')
    .trim();

  // 관광공사 API에서 '0'은 미제공/해당 없음 플래그로 자주 사용됩니다.
  if (!text || ['0', '없음', 'null', 'undefined'].includes(text.toLowerCase())) {
    return '';
  }

  return text;
}
