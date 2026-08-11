
import React, { useState } from "react";
import ATSResult from "./ATSResult";
import "./ATSChecker.css";

function ATSChecker({ onBack }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [view, setView] = useState("form"); // form | scanning | result
  const [result, setResult] = useState(null);

  // ================================
  // FILE SELECT
  // ================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();

    const isPDF = fileName.endsWith(".pdf");
    const isDOCX = fileName.endsWith(".docx");

    if (!isPDF && !isDOCX) {
      alert("Please upload only PDF or DOCX file.");
      e.target.value = "";
      return;
    }

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    setResumeFile(file);
  };

  // ================================
  // ANALYZE
  // ================================
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
    formData.append("jobDescription", jobDescription.trim());

    try {
      console.log("==============================");
      console.log("ATS REQUEST STARTED");
      console.log("==============================");

      console.log("File:", resumeFile.name);
      console.log("File type:", resumeFile.type);
      console.log("File size:", resumeFile.size);
      console.log("JD length:", jobDescription.length);

      const API_URL =
        "https://javanoteshubb-backend.onrender.com/api/ats/analyze";

      console.log("API URL:", API_URL);

      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      console.log("HTTP STATUS:", res.status);
      console.log("HTTP OK:", res.ok);

      const text = await res.text();

      console.log("SERVER RESPONSE:", text);

      if (!res.ok) {
        throw new Error(
          `Server error ${res.status}: ${text || "Unknown server error"}`
        );
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("JSON PARSE ERROR:", error);
        throw new Error("Server returned invalid JSON.");
      }

      console.log("FINAL ATS DATA:", data);

      setResult(data);
      setView("result");

    } catch (error) {
      console.error("==============================");
      console.error("ATS ANALYZE ERROR");
      console.error("==============================");
      console.error(error);

      let message = "Something went wrong while analyzing.";

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        message =
          "Unable to connect to the ATS server. Please check your internet connection or try again.";
      } else if (error?.message) {
        message = error.message;
      }

      alert(`Analyze failed: ${message}`);

      setView("form");
    }
  };

  // ================================
  // RESET
  // ================================
  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    setView("form");
  };

  // ================================
  // SCANNING SCREEN
  // ================================
  if (view === "scanning") {
    return (
      <div className="scanner-page scanner-page--loading">
        <div className="scan-loader">
          <div className="scan-loader-ring" />

          <p className="scan-loader-text">
            ANALYZING RESUME
            <span className="scan-dots">...</span>
          </p>

          <p className="scan-loader-sub">
            parsing content · matching keywords · scoring skills
          </p>
        </div>
      </div>
    );
  }

  // ================================
  // RESULT SCREEN
  // ================================
  if (view === "result") {
    return (
      <ATSResult
        result={result}
        onAnalyzeAgain={handleReset}
        onBack={onBack}
      />
    );
  }

  // ================================
  // FORM SCREEN
  // ================================
  return (
    <div className="scanner-page">

      {/* BACK BUTTON */}
      <button
        className="scanner-back-btn"
        onClick={onBack}
        type="button"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="scanner-header">
        <span className="scanner-eyebrow">
          <span className="scanner-dot" /> ATS SCANNER · READY
        </span>

        <h1 className="shine-text">
          Resume Compatibility Scan
        </h1>

        <p>
          Upload your resume and paste the job description — the scanner
          checks how well you match before recruiters ever open your file.
        </p>
      </div>

      {/* RESUME UPLOAD */}
      <div className="scanner-panel">
        <div className="panel-label shine-text">
          TARGET FILE
        </div>

        <label className="scan-dropzone">

          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            hidden
          />

          <span className="bracket bracket-tl" />
          <span className="bracket bracket-tr" />
          <span className="bracket bracket-bl" />
          <span className="bracket bracket-br" />

          <div className="dropzone-icon">
            {resumeFile ? "◈" : "▢"}
          </div>

          {resumeFile ? (
            <>
              <strong className="dropzone-filename shine-text">
                {resumeFile.name}
              </strong>

              <span className="dropzone-hint">
                FILE LOADED — ready to scan
              </span>
            </>
          ) : (
            <>
              <strong className="dropzone-filename shine-text">
                Tap to upload resume
              </strong>

              <span className="dropzone-hint">
                PDF or DOCX only
              </span>
            </>
          )}
        </label>
      </div>

      {/* JOB DESCRIPTION */}
      <div className="scanner-panel">

        <div className="panel-label shine-text">
          JOB DESCRIPTION
        </div>

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

      {/* SCAN BUTTON */}
      <div className="scanner-action">

        <button
          className="run-scan-btn"
          onClick={handleAnalyze}
          type="button"
          disabled={!resumeFile || !jobDescription.trim()}
        >
          ▶ RUN SCAN
        </button>

      </div>

    </div>
  );
}

export default ATSChecker;

