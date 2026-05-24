export default function KitchenBench({ title, kitchenTitle, subtitle, icon, children }) {
  const stationStrip = `${import.meta.env.BASE_URL}graphics/station-vignettes.png`;
  const positions = { SeqSieve: "0% center", ReadLens: "25% center", SeqCompare: "50% center", ORFScout: "75% center", HMMForge: "100% center" };
  return (
    <section className="bench">
      <header className="bench-header">
        <div>{icon}</div>
        <div>
          <p className="tool-name">{title}</p>
          <h1>{kitchenTitle}</h1>
          <p>{subtitle}</p>
        </div>
        {positions[title] && (
          <figure className="bench-photo" aria-hidden="true">
            <img src={stationStrip} alt="" style={{ objectPosition: positions[title] }} />
          </figure>
        )}
      </header>
      {children}
    </section>
  );
}
