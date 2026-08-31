import "./UserTags.css";

export default function UserTags({ companionTags, styleTags }) {
    return (
        <div className="user-tags">
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