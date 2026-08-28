import './Pagination.css';

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="page-arrow"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
        aria-label="이전 페이지"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="page-dots">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            className={`page-dot ${i === page ? 'active' : ''}`}
            onClick={() => onChange(i)}
            aria-label={`${i + 1}페이지`}
          />
        ))}
      </div>

      <button
        className="page-arrow"
        disabled={page === pageCount - 1}
        onClick={() => onChange(page + 1)}
        aria-label="다음 페이지"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
