export default function KitchenBench({ title, kitchenTitle, subtitle, icon, children }) {
  return (
    <section className="bench">
      <header className="bench-header">
        <div>{icon}</div>
        <div>
          <p className="tool-name">{title}</p>
          <h1>{kitchenTitle}</h1>
          <p>{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}
