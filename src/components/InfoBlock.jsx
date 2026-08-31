import { formatInfoEntries } from '../utils/spotDetail';

export default function InfoBlock({ title, data }) {
  const entries = formatInfoEntries(data);
  if (entries.length === 0) return null;

  return (
    <section className="spot-detail-section spot-detail-info-section">
      <h3>{title}</h3>
      <dl className="spot-detail-info-grid">
        {entries.map(({ key, label, value }) => (
          <div className="spot-detail-info-item" key={key}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
