export default function KitchenBench({ title, kitchenTitle, subtitle, icon, children }) {
  const images = { SeqSieve: "seqsieve.png", ReadLens: "readlens.png", SeqCompare: "seqcompare.png", ORFScout: "orfscout.png", HMMForge: "hmmforge.png" };
  return (
    <section className="bench">
      <header className="bench-header">
        <div>{icon}</div>
        <div>
          <p className="tool-name">{title}</p>
          <h1>{kitchenTitle}</h1>
          <p>{subtitle}</p>
        </div>
        {images[title] && (
          <figure className="bench-photo" aria-hidden="true">
            <img src={`${import.meta.env.BASE_URL}graphics/tools/${images[title]}`} alt="" />
          </figure>
        )}
      </header>
      {children}
    </section>
  );
}
