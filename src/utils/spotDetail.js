const TAG_LABELS = {
  companion_solo: '혼자',
  companion_friend: '친구',
  companion_romantic_partner: '연인',
  companion_family: '가족',
  companion_group: '단체',
  companion_pet: '반려동물',

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

const KEY_LABELS = {
  // 공통
  parking: '주차',
  parkingfee: '주차요금',
  usetime: '이용시간',
  opentime: '영업시간',
  restdate: '휴무일',
  infocenter: '문의 및 안내',
  opendate: '개장일',
  openperiod: '운영기간',
  expagerange: '체험 가능 연령',
  expguide: '체험 안내',
  accomcount: '수용인원',
  usefee: '이용요금',
  useseason: '이용시기',
  spendtime: '예상 소요시간',
  scale: '규모',
  discountinfo: '할인정보',
  reservation: '예약 안내',

  chkbabycarriage: '유모차 대여',
  chkcreditcard: '신용카드 사용',
  chkpet: '반려동물 동반',

  heritage1: '문화재 여부',
  heritage2: '문화재 여부',
  heritage3: '문화재 여부',

  // 음식점
  firstmenu: '대표 메뉴',
  treatmenu: '취급 메뉴',
  packing: '포장 가능 여부',
  smoking: '금연/흡연 여부',
  seat: '좌석 수',
  kidsfacility: '어린이 시설',
  lcnsno: '인허가번호',

  // 쇼핑
  saleitem: '판매 품목',
  saleitemcost: '판매 품목 가격',
  shopguide: '매장 안내',
  fairday: '장날',
  restroom: '화장실',
  culturecenter: '문화센터',

  // 숙박
  checkintime: '입실 시간',
  checkouttime: '퇴실 시간',
  chkcooking: '객실 내 취사 여부',
  foodplace: '식음료장',
  pickup: '픽업 서비스',
  roomcount: '객실 수',
  roomtype: '객실 유형',
  reservationurl: '예약 홈페이지',
  subfacility: '부대시설',
  refundregulation: '환불 규정',

  benikia: '베니키아 여부',
  goodstay: '굿스테이 여부',
  hanok: '한옥 여부',

  barbecue: '바비큐장 여부',
  beauty: '뷰티시설 여부',
  beverage: '식음료장 여부',
  bicycle: '자전거 대여 여부',
  campfire: '캠프파이어 여부',
  fitness: '피트니스센터 여부',
  karaoke: '노래방 여부',
  publicbath: '공용 샤워실 여부',
  publicpc: '공용 PC실 여부',
  sauna: '사우나 여부',
  seminar: '세미나실 여부',
  sports: '스포츠시설 여부',

  // 축제 / 행사
  agelimit: '관람 가능 연령',
  bookingplace: '예매처',
  eventstartdate: '행사 시작일',
  eventenddate: '행사 종료일',
  eventhomepage: '행사 홈페이지',
  eventplace: '행사 장소',
  festivalgrade: '축제 등급',
  placeinfo: '행사장 위치 안내',
  playtime: '공연 시간',
  program: '행사 프로그램',
  sponsor1: '주최자',
  sponsor1tel: '주최자 연락처',
  sponsor2: '주관사',
  sponsor2tel: '주관사 연락처',
  subevent: '부대행사',

  // 여행 코스
  distance: '코스 총거리',
  schedule: '코스 일정',
  taketime: '코스 소요시간',
  theme: '코스 테마',

  // 반복 상세 정보
  contentid: '콘텐츠 ID',
  infoname: '항목',
  infotext: '내용',
  serialnum: '순서',

  // 반려동물 관련 정보
  acmpytypecd: '동반 유형',
  relaacdntriskmtr: '사고 대비사항',
  relaposesfclty: '반려동물 관련 시설',
  relafrnshprdlst: '비치 품목',
  relapurcprdlst: '구매 가능 품목',
  relarntlprdlst: '대여 가능 품목',
  etcacmpyinfo: '기타 동반 정보',
  acmpyneedmtr: '동반 시 필요사항',
  acmpypsblcpam: '동반 가능 범위',
};

const TOURISM_KEY_SUFFIXES = [
  'tourcourse',
  'shopping',
  'festival',
  'culture',
  'leports',
  'lodging',
  'food',
];

function getKeyLabel(key) {
  const normalizedKey = String(key).toLowerCase();

  // 1. 정확히 일치하는 키
  if (KEY_LABELS[normalizedKey]) {
    return KEY_LABELS[normalizedKey];
  }

  // 2. 관광지 유형 suffix 제거
  // 예:
  // opentimefood -> opentime
  // restdatefood -> restdate
  // usetimeculture -> usetime
  for (const suffix of TOURISM_KEY_SUFFIXES) {
    if (normalizedKey.endsWith(suffix)) {
      const baseKey = normalizedKey.slice(0, -suffix.length);

      if (KEY_LABELS[baseKey]) {
        return KEY_LABELS[baseKey];
      }
    }
  }

  // 3. 그래도 모르는 키는 보기 좋게 출력
  return humanizeKey(key);
}

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
    tags: toArray(info.spot_tags ?? info.tags)
      .map((tag) => {
        if (typeof tag === 'string') {
          return {
            name: TAG_LABELS[tag] ?? tag,
            category: '',
          };
        }

        if (!tag || typeof tag !== 'object') return null;

        return {
          ...tag,
          name: TAG_LABELS[tag.name] ?? tag.name ?? '',
        };
      })
      .filter((tag) => tag?.name),
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
      label: getKeyLabel(key),
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
        return cleaned ? `${getKeyLabel(key)}: ${cleaned}` : '';
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
