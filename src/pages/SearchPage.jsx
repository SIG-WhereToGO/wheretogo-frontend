import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import HeroBackground from '../components/HeroBackground';
import SearchBar from '../components/SearchBar';
import './SearchPage.css';

export default function SearchPage() {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    // 로딩 페이지로 이동하면서 검색어를 함께 전달
    navigate('/loading', { state: { query } });
  };

  return (
    <div className="app-stage">
      <div className="card-shell">
        <TopBar />

        <div className="hero">
          <HeroBackground />

          <div className="hero-content">
            <h1 className="headline">
              원하시던 여행지를
              <br />
              <span className="accent">콕 찝어</span> 추천해드려요
            </h1>
            <p className="tagline">
              "부산에서 조용한 바다 여행지"처럼 편하게 입력하면,
              <br />
              취향에 맞는 후보를 찾아드려요
            </p>

            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}
