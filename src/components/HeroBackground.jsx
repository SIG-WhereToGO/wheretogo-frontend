export default function HeroBackground() {
  return (
    <svg
      className="hero-bg"
      viewBox="0 0 700 340"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F4F7FC" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B9D2ED" />
          <stop offset="100%" stopColor="#EAF2FB" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="700" height="340" fill="url(#skyGrad)" />

      {/* 은은한 구름 */}
      <ellipse cx="115" cy="52" rx="42" ry="13" fill="#EDF3FA" />
      <ellipse cx="150" cy="46" rx="26" ry="10" fill="#EDF3FA" />
      <ellipse cx="575" cy="60" rx="38" ry="12" fill="#EDF3FA" />

      {/* 왼쪽 산 - 뒤 레이어 */}
      <path
        d="M0,340 L0,175 C 55,148 105,142 150,160 C 188,175 200,198 235,196 C 272,194 300,214 320,244 C 330,259 333,272 333,290 L333,340 Z"
        fill="#DCE7F5"
      />
      {/* 왼쪽 산 - 앞 레이어 */}
      <path
        d="M0,340 L0,232 C 45,208 90,202 128,216 C 160,228 172,246 198,250 C 224,254 242,268 250,288 L250,340 Z"
        fill="#B7CEEA"
      />

      {/* 오른쪽 산 - 뒤 레이어 (미러) */}
      <path
        d="M700,340 L700,175 C 645,148 595,142 550,160 C 512,175 500,198 465,196 C 428,194 400,214 380,244 C 370,259 367,272 367,290 L367,340 Z"
        fill="#DCE7F5"
      />
      {/* 오른쪽 산 - 앞 레이어 (미러) */}
      <path
        d="M700,340 L700,232 C 655,208 610,202 572,216 C 540,228 528,246 502,250 C 476,254 458,268 450,288 L450,340 Z"
        fill="#B7CEEA"
      />

      {/* 바다: 중앙이 볼록한 완만한 곡선 */}
      <path d="M0,266 Q350,214 700,266 L700,340 L0,340 Z" fill="url(#waterGrad)" />

      {/* 물결 위 은은한 반사광 (드리프트 애니메이션) */}
      <ellipse cx="350" cy="252" rx="120" ry="10" fill="#FFFFFF" opacity="0.35">
        <animate attributeName="rx" values="120;135;120" dur="6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="230" cy="292" rx="60" ry="6" fill="#FFFFFF" opacity="0.3">
        <animate attributeName="cx" values="230;245;230" dur="7s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="470" cy="298" rx="70" ry="6" fill="#FFFFFF" opacity="0.3">
        <animate attributeName="cx" values="470;455;470" dur="7.5s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}
