export default function DonorScore({ score, size = "normal" }) {
  const label = score >= 90 ? "Excellent Match" : score >= 80 ? "Strong Match" : "Good Match";

  return (
    <div className={`donor-score ${size}`}>
      <div
        className="score-circle"
        style={{ "--score": `${score * 3.6}deg` }}
      >
        <div>
          <strong>{score}</strong>
          <span>/100</span>
        </div>
      </div>
      <div className="score-info">
        <strong>{label}</strong>
        <span>Donor match score</span>
      </div>
    </div>
  );
}