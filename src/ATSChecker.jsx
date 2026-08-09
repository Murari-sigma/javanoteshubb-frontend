import React, { useState } from "react";
import ATSResult from "./ATSResult";
import "./ATSChecker.css";

/* ---------------------------------------------------------
   TEMPORARY MOCK ANALYSIS
   Jab tak Spring Boot backend (PDFBox/POI se resume text
   extract + keyword matching) ready nahi hota, ye function
   fake result generate karta hai taaki UI test ho sake.
   Baad me isko ek fetch("/api/ats/analyze") call se replace
   karna hai — response shape same rakhna:
   { overallScore, skillsScore, keywordScore,
     matchedSkills, missingSkills,
     matchedKeywords, missingKeywords, suggestions }
--------------------------------------------------------- */
const KNOWN_SKILLS = [
  "java", "spring boot", "spring", "hibernate", "jpa", "mysql",
  "rest api", "microservices", "docker", "aws", "git", "maven",
  "junit", "kafka", "redis", "jenkins", "kubernetes", "sql",
];

const STOPWORDS = new Set([
  "the","and","a","to","of","in","for","with","is","on","as",
  "are","we","you","will","your","this","that","be","or","an",
]);

function extractKeywords(text) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .split(/[^a-zA-Z+#]+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    )
  ).slice(0, 24);
}

function mockAnalyze(jobDescription) {
  const jdLower = jobDescription.toLowerCase();
  const keywords = extractKeywords(jobDescription);

  const matchedKeywords = keywords.filter((_, i) => i % 3 !== 0);
  const missingKeywords = keywords.filter((_, i) => i % 3 === 0);

  const skillsInJD = KNOWN_SKILLS.filter((s) => jdLower.includes(s));
  const matchedSkills = skillsInJD.filter((_, i) => i % 2 === 0);
  const missingSkills = skillsInJD.filter((_, i) => i % 2 !== 0);

  const keywordScore = keywords.length
    ? Math.round((matchedKeywords.length / keywords.length) * 100)
    : 50;
  const skillsScore = skillsInJD.length
    ? Math.round((matchedSkills.length / skillsInJD.length) * 100)
    : 50;
  const overallScore = Math.round(keywordScore * 0.5 + skillsScore * 0.5);

  const suggestions = [
    missingSkills.length > 0 &&
      `Add these skills to your resume: ${missingSkills.join(", ")}`,
    missingKeywords.length > 0 &&
      `Mention these keywords from the job description: ${missingKeywords
        .slice(0, 5)
        .join(", ")}`,
    "Quantify your achievements with numbers (e.g. 'Reduced API latency by 30%').",
    "Keep formatting simple — avoid tables/columns so ATS software can parse it correctly.",
  ].filter(Boolean);

  return {
    overallScore,
    skillsScore,
    keywordScore,
    matchedSkills,
    missingSkills,
    matchedKeywords,
    missingKeywords,
    suggestions,
  };
}

function ATSChecker({ onBack }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [view, setView] = useState("form"); // form | scanning | result
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload only PDF or DOCX file.");
      e.target.value = "";
      return;
    }

    setResumeFile(file);
  };

  const handleAnalyze = () => {
    if (!resumeFile) {
      alert("Please upload your resume first.");
      return;
    }
    if (!jobDescription.trim()) {
      alert("Please paste the job description.");
      return;
    }

    setView("scanning");

    // TODO: replace this timeout + mockAnalyze with a real API call:
    // const formData = new FormData();
    // formData.append("resume", resumeFile);
    // formData.append("jobDescription", jobDescription);
    // const res = await fetch("http://localhost:8080/api/ats/analyze", { method: "POST", body: formData });
    // const data = await res.json();
    setTimeout(() => {
      const data = mockAnalyze(jobDescription);
      setResult(data);
      setView("result");
    }, 1400);
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    setView("form");
  };

  /* ---------- SCANNING STATE ---------- */
  if (view === "scanning") {
    return (
      <div className="scanner-page scanner-page--loading">
        <div className="scan-loader">
          <div className="scan-loader-ring" />
          <p className="scan-loader-text">
            ANALYZING RESUME<span className="scan-dots">...</span>
          </p>
          <p className="scan-loader-sub">
            parsing content · matching keywords · scoring skills
          </p>
        </div>
      </div>
    );
  }

  /* ---------- RESULT STATE ---------- */
  if (view === "result") {
    return (
      <ATSResult
        result={result}
        onAnalyzeAgain={handleReset}
        onBack={onBack}
      />
    );
  }

  /* ---------- FORM STATE ---------- */
  return (
    <div className="scanner-page">
      <button className="scanner-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="scanner-header">
        <span className="scanner-eyebrow">
          <span className="scanner-dot" /> ATS SCANNER · READY
        </span>
        <h1>Resume Compatibility Scan</h1>
        <p>
          Upload your resume and paste the job description — the scanner
          checks how well you match before recruiters ever open your file.
        </p>
      </div>

      <div className="scanner-panel">
        <div className="panel-label">TARGET FILE</div>
        <label className="scan-dropzone">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            hidden
          />
          <span className="bracket bracket-tl" />
          <span className="bracket bracket-tr" />
          <span className="bracket bracket-bl" />
          <span className="bracket bracket-br" />

          <div className="dropzone-icon">{resumeFile ? "◈" : "▢"}</div>

          {resumeFile ? (
            <>
              <strong className="dropzone-filename">{resumeFile.name}</strong>
              <span className="dropzone-hint">FILE LOADED — ready to scan</span>
            </>
          ) : (
            <>
              <strong className="dropzone-filename">Drop resume here</strong>
              <span className="dropzone-hint">PDF or DOCX only</span>
            </>
          )}
        </label>
      </div>

      <div className="scanner-panel">
        <div className="panel-label">JOB DESCRIPTION</div>
        <textarea
          className="scan-textarea"
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <div className="scan-char-count">
          {jobDescription.length} characters
        </div>
      </div>

      <div className="scanner-action">
        <button className="run-scan-btn" onClick={handleAnalyze}>
          ▶ RUN SCAN
        </button>
      </div>
    </div>
  );
}

export default ATSChecker;
