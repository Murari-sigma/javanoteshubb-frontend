import React, { useEffect, useState } from "react";
import "./ATSResult.css";

/* ---------- Big animated ATS score number ---------- */
function BigScore({ score, tone }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.round(score / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        current = score;
        clearInterval(interval);
      }
      setValue(current);
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className={`big-score big-score--${tone}`}>
      <span className="big-score-number">{value}</span>
      <span className="big-score-percent">%</span>
      <p className="big-score-label">ATS SCORE</p>
    </div>
  );
}

/* ---------- Horizontal signal-bar meter ---------- */
function ScanBar({ label, score, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const tone = score >= 80 ? "bar-good" : score >= 55 ? "bar-mid" : "bar-bad";

  return (
    <div className="scan-bar-row">
      <span className="scan-bar-label">{label}</span>
      <div className="scan-bar-track">
        <div
          className={`scan-bar-fill ${tone}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="scan-bar-value">{score}%</span>
    </div>
  );
}

/* ---------- Chip list ---------- */
function ChipGroup({ title, items, variant }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="chip-group">
      <p className={`chip-group-title chip-group-title--${variant}`}>
        {variant === "matched" ? "✓" : "✕"} {title} · {items.length}
      </p>
      <div className="chip-list">
        {items.map((item) => (
          <span key={item} className={`chip chip--${variant}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Result Page ---------- */
function ATSResult({ result, onAnalyzeAgain, onBack }) {
  if (!result) return null;

  const {
    overallScore,
    skillsScore,
    keywordScore,
    matchedSkills,
    missingSkills,
    matchedKeywords,
    missingKeywords,
    suggestions,
  } = result;

  const verdict =
    overallScore >= 80
      ? "PASS — strong compatibility with this job description."
      : overallScore >= 55
      ? "BORDERLINE — a few changes will raise your chances."
      : "LOW MATCH — this resume needs work before applying.";

  const verdictTone =
    overallScore >= 80 ? "good" : overallScore >= 55 ? "mid" : "bad";

  return (
    <div className="scanner-page">
      <button className="scanner-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="scan-report">
        <div className="scan-report-header">
          <span className="scan-report-eyebrow">
            <span className="scan-report-check">✓</span> SCAN COMPLETE
          </span>

          <BigScore score={overallScore} tone={verdictTone} />

          <div className={`scan-verdict scan-verdict--${verdictTone}`}>
            {verdict}
          </div>
        </div>

        <div className="scan-bars-panel">
          <ScanBar label="SKILLS" score={skillsScore} delay={150} />
          <ScanBar label="KEYWORDS" score={keywordScore} delay={300} />
        </div>

        <div className="result-grid">
          <div className="result-panel">
            <div className="panel-label">SKILLS BREAKDOWN</div>
            <ChipGroup title="Matched" items={matchedSkills} variant="matched" />
            <ChipGroup title="Missing" items={missingSkills} variant="missing" />
          </div>

          <div className="result-panel">
            <div className="panel-label">KEYWORD BREAKDOWN</div>
            <ChipGroup title="Matched" items={matchedKeywords} variant="matched" />
            <ChipGroup title="Missing" items={missingKeywords} variant="missing" />
          </div>
        </div>

        {suggestions && suggestions.length > 0 && (
          <div className="result-panel log-panel">
            <div className="panel-label">RECOMMENDATIONS LOG</div>
            <ul className="log-list">
              {suggestions.map((tip, i) => (
                <li key={i}>
                  <span className="log-marker">&gt;</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="scanner-action">
          <button className="run-scan-btn" onClick={onAnalyzeAgain}>
            ▶ RUN NEW SCAN
          </button>
        </div>
      </div>
    </div>
  );
}

export default ATSResult;
