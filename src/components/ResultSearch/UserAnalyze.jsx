import "./UserAnalyze.css";

export default function UserAnalyze({ region, companionTags, styleTags }) {
    return (
        <div className="user-analyze">
            {region && (
            <div className="region-group">
                <span className="region-group-title">지역 태그</span>
                 <span className="region-name">{region}</span>
            </div>
            )}

            {companionTags?.length > 0 && (
            <div className="tag-group">
                <span className="tag-group-title">동반자 유형 태그</span>

                <div className="tag-list">
                {companionTags.map((tag, index) => (
                    <span className="user-tag" key={index}>
                    {tag}
                    </span>
                ))}
                </div>
            </div>
            )}

            {styleTags?.length > 0 && (
            <div className="tag-group">
                <span className="tag-group-title">여행 스타일 유형 태그</span>

                <div className="tag-list">
                {styleTags.map((tag, index) => (
                    <span className="user-tag" key={index}>
                    {tag}
                    </span>
                ))}
                </div>
            </div>
            )}
        </div>
    );
}