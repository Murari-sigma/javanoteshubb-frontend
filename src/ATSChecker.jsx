
import React, { useState } from "react";

function ATSChecker({ onBack }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

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

    console.log("Resume:", resumeFile);
    console.log("Job Description:", jobDescription);

    alert("Resume ready for ATS analysis! 🚀");
  };

  return (
    <div className="ats-page">

      <button className="back-home-btn" onClick={onBack}>← Back</button>

      {/* Header */}
      <div className="ats-header">
        <span className="ats-badge">📄 ATS TOOL</span>

        <h1>ATS Resume Checker</h1>

        <p>
          Check how well your resume matches a job description
          and improve your chances of getting shortlisted.
        </p>
      </div>

      {/* Resume Upload */}
      <div className="ats-card">

        <h2>📎 Upload Your Resume</h2>

        <p className="ats-help-text">
          Upload your resume in PDF or DOCX format.
        </p>

        <label className="resume-upload-box">

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            hidden
          />

          <div className="upload-icon">📄</div>

          {resumeFile ? (
            <>
              <strong>{resumeFile.name}</strong>
              <span>Resume selected successfully ✓</span>
            </>
          ) : (
            <>
              <strong>Click to upload your resume</strong>
              <span>PDF or DOCX only</span>
            </>
          )}

        </label>

      </div>

      {/* Job Description */}
      <div className="ats-card">

        <h2>💼 Job Description</h2>

        <p className="ats-help-text">
          Paste the job description you are applying for.
        </p>

        <textarea
          className="job-description-input"
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <div className="character-count">
          {jobDescription.length} characters
        </div>

      </div>

      {/* Analyze Button */}
      <div className="ats-action">

        <button
          className="analyze-ats-btn"
          onClick={handleAnalyze}
        >
          🔍 Check ATS Score
        </button>

      </div>

    </div>
  );
}

export default ATSChecker;