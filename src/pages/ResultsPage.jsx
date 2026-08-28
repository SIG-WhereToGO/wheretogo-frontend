import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SpotCard from '../components/SpotCard';
import Pagination from '../components/Pagination';
import './ResultsPage.css';

const PAGE_SIZE = 5;

// 이 페이지는 카드 컴포넌트를 확인/연동하기 위한 최소한의 컨테이너입니다.
// 상단바, 검색창, 추천 태그 등 나머지 화면 요소는 기존 프로젝트 화면에
// 그대로 두고, 이 카드 그리드 부분만 옮겨서 쓰시면 됩니다.
export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { spots } = location.state || {};

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!spots) {
      navigate('/', { replace: true });
    }
  }, [spots, navigate]);

  const pageCount = useMemo(
    () => (spots ? Math.ceil(spots.length / PAGE_SIZE) : 0),
    [spots]
  );

  const pagedSpots = useMemo(() => {
    if (!spots) return [];
    const start = page * PAGE_SIZE;
    return spots.slice(start, start + PAGE_SIZE);
  }, [spots, page]);

  if (!spots) return null;

  const handleViewDetail = (spot) => {
    // TODO: 상세보기 팝업/페이지를 여기에 연결하세요.
    // spot.raw 에 백엔드 원본 응답(spot_id, info 전체 등)이 그대로 들어있습니다.
    console.log('상세보기 클릭:', spot);
  };

  return (
    <div className="results-stage">
      {spots.length === 0 ? (
        <div className="empty-state">
          <p>조건에 맞는 여행지를 찾지 못했어요.</p>
        </div>
      ) : (
        <>
          <div className="spot-grid">
            {pagedSpots.map((spot, i) => (
              <SpotCard
                key={spot.id ?? `${page}-${i}`}
                rank={page * PAGE_SIZE + i + 1}
                spot={spot}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>

          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </div>
  );
}
