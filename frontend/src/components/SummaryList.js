export default function SummaryList({ items }) {
  if (!items.length)
    return (
      <p className="placeholder">
        Les fichiers transférés apparaîtront ici avec leur URI S3.
      </p>
    );

  return (
    <div className="summary-grid">
      {items.map((item) => (
        <article key={item.id} className="card">
          <p className="eyebrow">Fichier envoyé</p>
          <h3>{item.title}</h3>
          <p className="body">{item.text}</p>
        </article>
      ))}
    </div>
  );
}
