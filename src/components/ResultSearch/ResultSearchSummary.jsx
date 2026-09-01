import "./ResultSearchSummary.css";
import UserAnalyze from "./UserAnalyze";

export default function ResultSearchSummary({
  query,
  region,
  companionTags,
  styleTags,
}) {
  return (
    <div className="result-search-summary">
      <h2 className="results-title">검색 결과</h2>
      {query && (
        <div className="result-query">
          <span className="result-query-label">검색어</span>
          <span className="result-query-text">{query}</span>
        </div>
      )}
      {region && (
        <div className="result-region">
          <span className="result-region-label">지역</span>
          <span className="result-region-text">{region}</span>
        </div>
      )}
      <UserAnalyze
        region={region}
        companionTags={companionTags}
        styleTags={styleTags}
      />

    </div>
  );
}