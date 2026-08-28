import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { analyzeQuery, fetchRecommendations } from '../api/spots';
import { normalizeSpots, normalizeUserTags } from '../utils/normalize';
import './LoadingPage.css';

const RING_CIRCUMFERENCE = 326.7;
// 실제 API 응답 시간은 매 번 다르므로, 이 값은 "체감 예상 시간" 표시를 위한 값입니다.
// 응답이 이보다 늦게 와도 진행률은 SOFT_CAP에서 멈춰 기다리다가, 실제 응답이 오면 100%로 마무리됩니다.
const ESTIMATED_MS = 5000;
const SOFT_CAP = 0.92;

const STEP_LABELS = ['취향 분석', '여행지 매칭', '추천 완성'];
const SUB_MESSAGES = [
  '요청하신 문장을 분석하고 있어요',
  '조건에 맞는 여행지를 찾고 있어요',
  '추천 목록을 정리하고 있어요',
];

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = location.state?.query;

  const [progress, setProgress] = useState(0); // 0 ~ 1
  const [errorMsg, setErrorMsg] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  // 검색어 없이 로딩 화면에 직접 들어온 경우 검색 화면으로 되돌림
  useEffect(() => {
    if (!query) {
      navigate('/', { replace: true });
    }
  }, [query, navigate]);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    setErrorMsg(null);
    setProgress(0);
    startTimeRef.current = performance.now();

    // 진행률 애니메이션: ESTIMATED_MS 동안 SOFT_CAP까지 서서히, 이후엔 SOFT_CAP에서 대기
    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const linear = Math.min(elapsed / ESTIMATED_MS, 1);
      const eased = 1 - Math.pow(1 - linear, 2);
      setProgress(Math.min(eased * SOFT_CAP, SOFT_CAP));
      if (!cancelled) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const run = async () => {
      try {
        // 1) 자연어 문장 분석 -> request_id 발급
        const analyzeRes = await analyzeQuery(query);
        const requestId = analyzeRes?.request_id;
        if (!requestId) {
          throw new Error('request_id를 받지 못했습니다.');
        }

        // 2) request_id로 추천 결과(TOP 15 + 상세정보) 조회
        const recRes = await fetchRecommendations(requestId);

        if (cancelled) return;

        const spots = normalizeSpots(recRes?.recommend_spots_info);
        const userTags = normalizeUserTags(recRes?.input_analysis_info?.user_tags);

        cancelAnimationFrame(rafRef.current);
        setProgress(1);

        // 완료 애니메이션이 보이도록 짧게 대기 후 결과 페이지로 이동
        setTimeout(() => {
          if (cancelled) return;
          navigate('/results', {
            replace: true,
            state: {
              query,
              requestId,
              spots,
              userTags,
              region: recRes?.input_analysis_info?.region,
            },
          });
        }, 400);
      } catch (err) {
        if (cancelled) return;
        cancelAnimationFrame(rafRef.current);
        setErrorMsg(err.message || '알 수 없는 오류가 발생했어요.');
      }
    };

    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [query, navigate, retryKey]);

  const percent = Math.round(progress * 100);
  const remainingSec = Math.max(0, Math.ceil(((1 - progress) * ESTIMATED_MS) / 1000));
  const stepIndex = Math.min(2, Math.floor(progress * 3));

  return (
    <div className="app-stage">
      <div className="card-shell">
        <TopBar eyebrow="어디고" sub="취향에 맞는 여행지를 찾는 중이에요" />

        <div className="loading-screen">
          {errorMsg ? (
            <ErrorState message={errorMsg} onRetry={() => setRetryKey((k) => k + 1)} />
          ) : (
            <>
              <div className="compass">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#EAF0F7" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#2F6FE0"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset .2s linear' }}
                  />
                  <g className="needle">
                    <path d="M60 30 L67 60 L60 90 L53 60 Z" fill="#12213D" opacity="0.9" />
                    <path d="M60 30 L67 60 L60 60 Z" fill="#2F6FE0" />
                  </g>
                  <circle cx="60" cy="60" r="5" fill="#F8F6F1" stroke="#12213D" strokeWidth="2" />
                </svg>
              </div>

              <p className="status-text">
                {progress >= 1 ? '여행지를 찾았어요!' : '여행지를 찾고 있어요…'}
              </p>
              <p className="status-sub">
                {progress >= 1 ? '곧 결과 화면으로 이동해요' : SUB_MESSAGES[stepIndex]}
              </p>

              <div className="progress-wrap">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="eta-row">
                  <span>
                    예상 소요 시간 <strong>{remainingSec}초</strong>
                  </span>
                  <span>{percent}%</span>
                </div>
              </div>

              <div className="steps">
                {STEP_LABELS.map((label, i) => (
                  <div key={label} className={`step ${i <= stepIndex ? 'active' : ''}`}>
                    <span className="step-dot" />
                    {label}
                  </div>
                ))}
              </div>

              <p className="footer-note">잠시만 기다려주세요</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-icon">!</div>
      <p className="status-text">여행지를 찾지 못했어요</p>
      <p className="status-sub">{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        다시 시도하기
      </button>
    </div>
  );
}
