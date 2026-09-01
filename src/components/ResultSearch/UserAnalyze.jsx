import "./UserAnalyze.css";

export default function UserAnalyze({ region, companionTags, styleTags }) {
    return (
        <div className="user-analyze">
            {region && (
            <div className="tag-group">
                <span 
                    className="tag-group-title"
                    style={{ "--bar-color": "#2f6fe0" }}
                >
                    지역 태그
                </span>
                <span 
                    className="user-tag"
                       style={{
                        "--tag-border": "#c5d8f2",
                        "--tag-bg": "#edf4fc",
                        "--tag-text": "#365f8f",
                       }}
                >
                    {region}
                </span>
            </div>
            )}

            {companionTags?.length > 0 && (
            <div className="tag-group">
                <span 
                    className="tag-group-title"
                    style={{ "--bar-color": "#4f8f8c" }}
                >
                    동반자 유형 태그
                </span>

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
                <span 
                    className="tag-group-title"
                    style={{ "--bar-color": "#4f8f8c" }}
                >
                    여행 스타일 유형 태그
                </span>

                <div className="tag-list">
                {styleTags.map((tag, index) => (
                    <span 
                        className="user-tag" 
                        key={index}
                        style={{
                            "--tag-border": "#b8d8d3",
                            "--tag-bg": "#e8f4f1",
                            "--tag-text": "#2f625d",
                        }}
                    >
                        {tag}
                    </span>
                ))}
                </div>
            </div>
            )}
        </div>
    );
}