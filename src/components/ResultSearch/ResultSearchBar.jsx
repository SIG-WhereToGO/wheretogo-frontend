import { useState } from 'react';
import './ResultSearchBar.css';

export default function SearchBar({
  initialValue = '',
  placeholder = '지역명과 함께 검색어를 입력해주세요 (예: 부산에서 조용한 바다 여행지)',
  onSearch,
}) {
  const [value, setValue] = useState(initialValue);

  const submit = (text) => {
    const query = (text ?? value).trim();
    if (!query) return;
    onSearch(query);
  };

  return (
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
    
  );
}
