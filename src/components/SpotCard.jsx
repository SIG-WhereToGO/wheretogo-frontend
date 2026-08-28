import { useState } from 'react';
import './SpotCard.css';

const MAX_VISIBLE_TAGS = 3;

function staticMapUrl(lat, lng) {
  // OpenStreetMap 기반 무료 정적 지도 (API 키 불필요)
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=400x300&maptype=mapnik&markers=${lat},${lng},lightblue1`;
}

export default function SpotCard({ rank, spot, onViewDetail }) {
  const [imgError, setImgError] = useState(false);
  const [mapError, setMapError] = useState(false);
  const visibleTags = spot.tags.slice(0, MAX_VISIBLE_TAGS);
  const extraTagCount = spot.tags.length - visibleTags.length;

  const hasCoords = spot.latitude != null && spot.longitude != null;
  const showImage = !!spot.imageUrl && !imgError;
  const showMap = !showImage && hasCoords && !mapError;

  return (
    <div className="spot-card">
      <div className="spot-rank">{rank}</div>

      <div className="spot-thumb">
        {showImage ? (
          <img
            src={spot.imageUrl}
            alt={spot.name}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : showMap ? (
          // 사진 URL이 없거나 깨진 경우, 주소/좌표 기반 지도로 대체 표시
          <img
            src={staticMapUrl(spot.latitude, spot.longitude)}
            alt={`${spot.name} 위치 지도`}
            onError={() => setMapError(true)}
            loading="lazy"
            className="spot-thumb-map"
          />
        ) : (
          <div className="spot-thumb-placeholder">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-6-5.2-6-10A6 6 0 0 1 18 11c0 4.8-6 10-6 10Z"
                stroke="#B9CEE8"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="10.7" r="2" stroke="#B9CEE8" strokeWidth="1.6" />
            </svg>
          </div>
        )}
      </div>

      <div className="spot-body">
        <h3 className="spot-name" title={spot.name}>
          {spot.name}
        </h3>

        <div className="spot-address">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-6-5.2-6-10A6 6 0 0 1 18 11c0 4.8-6 10-6 10Z"
              stroke="#9FADC2"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="10.7" r="2" stroke="#9FADC2" strokeWidth="1.6" />
          </svg>
          <span title={spot.address}>{spot.region || spot.address || '위치 정보 없음'}</span>
        </div>

        {visibleTags.length > 0 && (
          <div className="spot-tags">
            {visibleTags.map((tag) => (
              <span className="spot-tag" key={tag}>
                {tag}
              </span>
            ))}
            {extraTagCount > 0 && <span className="spot-tag spot-tag-more">+{extraTagCount}</span>}
          </div>
        )}

        <div className="spot-score">
          적합도 <strong>{Math.round(spot.score)}점</strong>
        </div>

        <button
          className="spot-detail-btn"
          onClick={() => onViewDetail?.(spot)}
        >
          상세보기
        </button>
      </div>
    </div>
  );
}
