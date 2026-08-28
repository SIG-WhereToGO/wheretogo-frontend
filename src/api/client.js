// API 기본 설정
// 배포 환경에서는 .env 파일의 VITE_API_BASE_URL로 덮어쓸 수 있습니다.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://wheretogo-backend-23293547159.asia-northeast3.run.app';

/**
 * fetch 공통 래퍼
 * - JSON 요청/응답을 기본으로 처리
 * - 실패 시 에러 메시지를 포함한 Error를 throw
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let detail = '';
    try {
      const errBody = await res.json();
      detail = errBody?.message || errBody?.detail || JSON.stringify(errBody);
    } catch {
      detail = res.statusText;
    }
    throw new Error(`API 요청 실패 (${res.status}): ${detail}`);
  }

  // 204 No Content 등 바디가 없는 경우 대비
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
