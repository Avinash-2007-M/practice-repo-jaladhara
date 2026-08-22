export default function FilterPanel({ filters, setFilters }) {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="filter-panel">
      <div className="filter-heading">
        <div>
          <h3>Filter donors</h3>
          <span>Refine your search</span>
        </div>
        <button onClick={() => setFilters({ focus: "All", location: "All", minScore: 0 })}>Reset</button>
      </div>

      <label>
        CSR focus area
        <select value={filters.focus} onChange={(e) => update("focus", e.target.value)}>
          <option>All</option>
          <option>Water</option>
          <option>Sanitation</option>
          <option>Education</option>
          <option>Healthcare</option>
          <option>Environment</option>
          <option>Rural Development</option>
        </select>
      </label>

      <label>
        Location
        <select value={filters.location} onChange={(e) => update("location", e.target.value)}>
          <option>All</option>
          <option>Hyderabad</option>
          <option>Mumbai</option>
          <option>Bengaluru</option>
        </select>
      </label>

      <label>
        Minimum donor score
        <select value={filters.minScore} onChange={(e) => update("minScore", Number(e.target.value))}>
          <option value="0">Any score</option>
          <option value="75">75+</option>
          <option value="80">80+</option>
          <option value="90">90+</option>
        </select>
      </label>

      <div className="filter-tip">
        <span>✦</span>
        <div>
          <strong>Smart matching</strong>
          <p>Companies are ranked using CSR focus, location, spending and donor potential.</p>
        </div>
      </div>
    </aside>
  );
}