import { useMemo, useState } from "react";
import CompanyCard from "../components/CompanyCard";
import FilterPanel from "../components/FilterPanel";
import { companies } from "../data/companies";

export default function FindDonors() {
  const [filters, setFilters] = useState({ focus: "All", location: "All", minScore: 0 });
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState([]);

  const filtered = useMemo(() => companies.filter((company) => {
    const matchesSearch = `${company.name} ${company.industry}`.toLowerCase().includes(search.toLowerCase());
    const matchesFocus = filters.focus === "All" || company.focusAreas.includes(filters.focus);
    const matchesLocation = filters.location === "All" || company.location === filters.location;
    const matchesScore = company.donorScore >= filters.minScore;
    return matchesSearch && matchesFocus && matchesLocation && matchesScore;
  }), [filters, search]);

  const saveCompany = (id) => setSaved((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);

  return (
    <div>
      <div className="search-hero">
        <div>
          <span className="eyebrow">DONOR DISCOVERY</span>
          <h2>Find your next CSR partner</h2>
          <p>Search a curated set of corporate prospects and discover who best matches your WASH mission.</p>
        </div>
        <div className="search-box">
          <span>⌕</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company or industry..." />
        </div>
      </div>

      <div className="donor-layout">
        <FilterPanel filters={filters} setFilters={setFilters} />
        <section className="results-area">
          <div className="results-header">
            <div><strong>{filtered.length} companies</strong><span> matched your criteria</span></div>
            <select className="sort-select"><option>Sort: Donor score</option><option>Sort: CSR spending</option><option>Sort: Company name</option></select>
          </div>
          {saved.length > 0 && <div className="saved-notice">♡ {saved.length} company{saved.length > 1 ? "ies" : ""} saved as leads</div>}
          <div className="company-grid">
            {filtered.map((company) => <CompanyCard key={company.id} company={company} onSave={saveCompany} />)}
          </div>
          {filtered.length === 0 && <div className="empty-state"><span>⌕</span><h3>No matching donors</h3><p>Try broadening your filters or search.</p></div>}
        </section>
      </div>
    </div>
  );
}