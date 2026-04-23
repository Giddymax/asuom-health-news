type NewsTickerProps = {
  items: string[];
};

export function NewsTicker({ items }: NewsTickerProps) {
  const repeated = [...items, ...items];

  return (
    <div className="ticker-wrap" aria-label="Breaking health updates">
      <span className="ticker-label">Breaking</span>
      <div className="ticker-track">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
