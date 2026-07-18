const highlights = [
  "Leads, contacts, companies, and opportunities",
  "Pipeline stage workflows and dashboard analytics",
  "Activity feeds, tasks, notes, and email logging",
  "Search-heavy internal tooling architecture"
];

export function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Lightweight CRM / Sales Pipeline Platform</p>
        <h1>Enterprise CRUD, pipeline workflows, and analytics in one build.</h1>
        <p className="lede">
          This monorepo is being implemented phase by phase with a React frontend, Express API,
          Prisma data model, and learning-oriented documentation.
        </p>
      </section>

      <section className="panel">
        <h2>Phase 1 Ready</h2>
        <ul>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
