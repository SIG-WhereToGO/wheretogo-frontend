import { useState } from 'react';
import './SearchBar.css';

const SUGGESTIONS = ['부산에서 조용한 바다', '대구에서 신나는 체험', '대전에서 가을 단풍', '서울에서 감성 카페 거리'];

export default function SearchBar({
  initialValue = '',
  placeholder = '지역명과 함께 검색어를 입력해주세요 (예: 부산에서 조용한 바다 여행지)',
  onSearch,
  showSuggestions = true,
}) {
  const [value, setValue] = useState(initialValue);

  const submit = (text) => {
    const query = (text ?? value).trim();
    if (!query) return;
    onSearch(query);
  };

  return (
    <div>
      <div className="search-row">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <button className="search-btn" onClick={() => submit()}>
          검색
        </button>
      </div>

      {showSuggestions && (
        <div className="chips">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="chip"
              onClick={() => {
                setValue(s);
                submit(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
