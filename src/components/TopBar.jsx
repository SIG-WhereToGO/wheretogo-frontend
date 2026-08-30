import "./TopBar.css"

export default function TopBar({ eyebrow = '어디고', sub = '나에게 딱 맞는 여행지 추천' }) {
  return (
    <div className="topbar">
      <div className="pin">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z"
            stroke="#F8F6F1"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="9.3" r="2.3" stroke="#F8F6F1" strokeWidth="1.8" />
        </svg>
      </div>
      <div className="topbar-text">
        <div className="eyebrow">{eyebrow}</div>
        <div className="sub">{sub}</div>
      </div>
    </div>
  );
}
