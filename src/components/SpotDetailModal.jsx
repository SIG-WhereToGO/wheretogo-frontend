import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { buildMapUrl, normalizeRecommendation } from '../utils/spotDetail';
import './SpotDetailModal.css';
import InfoBlock from './InfoBlock';
import { CloseIcon, ExternalIcon, PinIcon } from './icons';

/**
 * 추천 결과 카드에서 선택된 recommendation 객체를 그대로 받아 표시하는 상세 모달입니다.
 * 별도의 상세 조회 API 호출은 하지 않습니다.
 */
export default function SpotDetailModal({
  open,
  onClose,
  recommendation,
}) {
  const closeButtonRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const spot = useMemo(
    () => normalizeRecommendation(recommendation),
    [recommendation],
  );

  useEffect(() => {
    if (!open) return undefined;

    previousActiveElementRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElementRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open || !spot) return null;

  const mapUrl = buildMapUrl(spot);
  const score = Number(spot.score);
  const hasScore = Number.isFinite(score);

  return createPortal(
    <div
      className="spot-detail-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <article
        className="spot-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="spot-detail-title"
      >
        <header className="spot-detail-toolbar">
          <div>
            <span className="spot-detail-toolbar-eyebrow">어디고</span>
            <strong>여행지 상세</strong>
          </div>
          <button
            ref={closeButtonRef}
            className="spot-detail-icon-button spot-detail-close-button"
            type="button"
            onClick={onClose}
            aria-label="상세 팝업 닫기"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="spot-detail-scroll-area">
          <div className="spot-detail-hero-grid">
            <div className="spot-detail-media-column">
              <div className="spot-detail-media">
                {spot.imageUrl ? (
                  <img
                    src={spot.imageUrl}
                    alt={`${spot.name} 대표 이미지`}
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                      const placeholder = event.currentTarget.nextElementSibling;
                      if (placeholder) placeholder.hidden = false;
                    }}
                  />
                ) : null}
                <div
                  className="spot-detail-media-placeholder"
                  hidden={Boolean(spot.imageUrl)}
                >
                  <PinIcon />
                  <span>여행지 이미지</span>
                </div>
              </div>

              <div className="spot-detail-location-card">
                <div className="spot-detail-location-icon"><PinIcon /></div>
                <div>
                  <span>위치</span>
                  <strong>{spot.address || spot.region || '위치 정보 없음'}</strong>
                </div>
              </div>

              {mapUrl && (
                <a
                  className="spot-detail-map-link"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  지도에서 보기 <ExternalIcon />
                </a>
              )}
            </div>

            <div className="spot-detail-summary-column">
              <div className="spot-detail-title-row">
                <div>
                  <p className="spot-detail-region-text">{spot.region || '지역 정보 없음'}</p>
                  <h2 id="spot-detail-title">{spot.name}</h2>
                </div>
                {hasScore && (
                  <div
                    className="spot-detail-score-badge"
                    aria-label={`추천 적합도 ${Math.round(score)}점`}
                  >
                    <strong>{Math.round(score)}</strong>
                    <span>점</span>
                  </div>
                )}
              </div>

              {spot.tags.length > 0 && (
                <div className="spot-detail-tag-row" aria-label="여행지 태그">
                  {spot.tags.map((tag, index) => (
                    <span
                      className="spot-detail-tag-chip"
                      key={tag.tag_id ?? `${tag.name}-${index}`}
                      title={tag.category || undefined}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              <section className="spot-detail-summary-section">
                <h3>관광지 설명</h3>
                <p>{spot.description || '등록된 설명이 없습니다.'}</p>
              </section>

              {spot.tourismType && (
                <div className="spot-detail-tourism-type-row">
                  <span>관광지 유형</span>
                  <strong>{spot.tourismType}</strong>
                </div>
              )}
            </div>
          </div>

          <div className="spot-detail-information-grid">
            <InfoBlock title="이용 안내" data={spot.usageInfo} />
            <InfoBlock title="상세 정보" data={spot.detailInfo} />
            <InfoBlock title="반려동물 동반 정보" data={spot.petInfo} />
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
}
