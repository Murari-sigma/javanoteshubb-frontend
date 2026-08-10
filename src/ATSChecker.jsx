import React, { useState } from "react";
import ATSResult from "./ATSResult";
import "./ATSChecker.css";


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

 const handleAnalyze = async () => {
   if (!resumeFile) {
     alert("Please upload your resume first.");
     return;
   }

   if (!jobDescription.trim()) {
     alert("Please paste the job description.");
     return;
   }

   setView("scanning");

   const formData = new FormData();
   formData.append("resume", resumeFile);
   formData.append("jobDescription", jobDescription);

   try {
     const res = await fetch(
       "https://javanoteshubb-backend.onrender.com/api/ats/analyze",
       {
         method: "POST",
         body: formData,
       }
     );

     // First check HTTP status
     if (!res.ok) {
       const errorText = await res.text();
       console.error("API Error:", res.status, errorText);
       throw new Error(`API failed: ${res.status}`);
     }

     const data = await res.json();

     console.log("API Response:", data);

     setResult(data);
     setView("result");
   } catch (err) {
     console.error("Analyze Error:", err);
     alert("Something went wrong while analyzing.");
     setView("form");
   }
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
        <h1 className="shine-text">Resume Compatibility Scan</h1>
        <p>
          Upload your resume and paste the job description — the scanner
          checks how well you match before recruiters ever open your file.
        </p>
      </div>

      <div className="scanner-panel">
        <div className="panel-label shine-text">TARGET FILE</div>
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
              <strong className="dropzone-filename shine-text">{resumeFile.name}</strong>
              <span className="dropzone-hint">FILE LOADED — ready to scan</span>
            </>
          ) : (
            <>
              <strong className="dropzone-filename shine-text">Drop resume here</strong>
              <span className="dropzone-hint">PDF or DOCX only</span>
            </>
          )}
        </label>
      </div>

      <div className="scanner-panel">
        <div className="panel-label shine-text">JOB DESCRIPTION</div>
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
