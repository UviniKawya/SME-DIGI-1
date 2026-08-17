import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";
import ScoreRing from "./ScoreRing.jsx";

const TABS = [
  { key: "Readiness", label: "Digital Readiness", ringColor: "#2952e3" },
  { key: "Barrier", label: "Barriers to Adoption", ringColor: "#f59e0b" },
  { key: "Performance", label: "Business Performance", ringColor: "#16a34a" },
];

// Classify a raw 1-5 average into Low / Medium / High (equal thirds of the scale)
function classify(rawScore) {
  if (rawScore === null) return null;
  if (rawScore < 2.34) return "Low";
  if (rawScore < 3.67) return "Medium";
  return "High";
}

const LEVEL_CLASS = { Low: "status-low", Medium: "status-moderate", High: "status-strong" };

export default function Assessment({ activeSme }) {
  const [activeTab, setActiveTab] = useState("Readiness");
  const [questions, setQuestions] = useState({}); // { dimension: [{id, question_text}] }
  const [answers, setAnswers] = useState({}); // { question_id: score }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedTabs, setSubmittedTabs] = useState({});

  const tabConfig = TABS.find((t) => t.key === activeTab);

  useEffect(() => {
    if (!activeSme) return;
    setLoading(true);
    setAnswers({});
    setError("");
    api.getQuestions(activeSme.business_type, activeTab)
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeSme, activeTab]);

  if (!activeSme) {
    return <div className="card"><p>Please register or select an SME first before taking the assessment.</p></div>;
  }

  const allQuestions = Object.values(questions).flat();
  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const selectScore = (questionId, score) =>
    setAnswers((a) => ({ ...a, [questionId]: score }));

  // --- Live summary, computed from whatever has been answered so far ---
  const categoryScores = Object.entries(questions).map(([dimension, qs]) => {
    const scored = qs.map((q) => answers[q.id]).filter((v) => v !== undefined);
    const raw = scored.length > 0 ? scored.reduce((a, b) => a + b, 0) / scored.length : null;
    return { dimension, raw, answered: scored.length, total: qs.length };
  });

  const answeredDimensionScores = categoryScores.filter((c) => c.raw !== null).map((c) => c.raw);
  const overallRaw = answeredDimensionScores.length > 0
    ? answeredDimensionScores.reduce((a, b) => a + b, 0) / answeredDimensionScores.length
    : null;
  const overallLevel = classify(overallRaw);
  const overallRingPercent = overallRaw !== null ? Math.round(((overallRaw - 1) / 4) * 100) : 0;

  const handleSubmit = async () => {
    if (answeredCount < totalQuestions) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = Object.entries(answers).map(([question_id, score]) => ({
        question_id: Number(question_id),
        score,
      }));
      await api.submitAssessment(activeSme.id, payload);
      setSubmittedTabs((s) => ({ ...s, [activeTab]: true }));
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Assessment</h1>
      <p className="page-subtitle">{activeSme.sme_name} &middot; {activeSme.business_type}</p>

      <div className="tab-row">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label} {submittedTabs[t.key] && "✓"}
          </button>
        ))}
      </div>

      <div className="card">
        {loading && <p>Loading questions...</p>}

        {!loading && (
          <>
            <div className="progress-row">
              <span>{answeredCount}/{totalQuestions} answered</span>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>
              <span>{progressPercent}% Complete</span>
            </div>

            {Object.entries(questions).map(([dimension, qs]) => (
              <div className="dimension-block" key={dimension}>
                <div className="dimension-title">{dimension}</div>
                {qs.map((q, idx) => (
                  <div className="question-row" key={q.id}>
                    <div className="question-text">{idx + 1}. {q.question_text}</div>
                    <div className="likert-scale numeric">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div
                          key={score}
                          className={`likert-option numeric ${answers[q.id] === score ? "selected" : ""}`}
                          onClick={() => selectScore(q.id, score)}
                        >
                          {score}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {error && <p style={{ color: "#dc2626" }}>{error}</p>}

            {submittedTabs[activeTab] ? (
              <p style={{ color: "#16a34a", fontWeight: 600 }}>{tabConfig.label} submitted and saved.</p>
            ) : (
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting || totalQuestions === 0}>
                {submitting ? "Submitting..." : "Submit Answers"}
              </button>
            )}
          </>
        )}
      </div>

      {!loading && totalQuestions > 0 && (
        <div className="card summary-card">
          <h2 style={{ marginTop: 0 }}>Assessment Summary</h2>
          <div className="summary-layout">
            <ScoreRing
              percent={overallRingPercent}
              color={tabConfig.ringColor}
              label={overallRaw !== null ? `${overallRaw.toFixed(1)}/5` : "-/5"}
              size={110}
            />
            <div>
              <div className="score-card-title">
                {activeTab === "Barrier" ? "Barrier Level" : "Readiness Level"}
              </div>
              <div className="level-pills">
                {["Low", "Medium", "High"].map((lvl) => (
                  <span
                    key={lvl}
                    className={`status-pill ${overallLevel === lvl ? LEVEL_CLASS[lvl] : "status-inactive"}`}
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="category-score-title">Category Scores</h3>
          {categoryScores.map((c) => (
            <div className="category-score-row" key={c.dimension}>
              <span>{c.dimension}</span>
              <span>
                {c.raw !== null ? `${c.raw.toFixed(1)}/5` : "—"}
                {" "}
                <span className="category-score-count">({c.answered}/{c.total})</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
