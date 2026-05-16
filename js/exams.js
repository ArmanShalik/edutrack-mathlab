/**
 * EduTrack Pro — Exams Module
 * Renders exam filter, exam cards, question tables, and tutor reviews.
 */

let _allExams   = [];
let _activeType = "All";

// ────────────────────────────────────────────────────────────
// Initialise exams section
// ────────────────────────────────────────────────────────────
function initExams(exams) {
  _allExams = exams || [];
  _buildExamTypeFilters();
  _renderExams("All");
}

// ────────────────────────────────────────────────────────────
// Build filter pills from unique exam types
// ────────────────────────────────────────────────────────────
function _buildExamTypeFilters() {
  const types = ["All", ...new Set(_allExams.map((e) => e.type))];
  const container = document.getElementById("examTypeFilters");
  container.innerHTML = types
    .map(
      (t) =>
        `<button class="filter-pill ${t === "All" ? "active" : ""}"
                 onclick="filterExams('${t}')"
                 data-type="${t}">${t}</button>`
    )
    .join("");
}

// ────────────────────────────────────────────────────────────
// Filter handler
// ────────────────────────────────────────────────────────────
function filterExams(type) {
  _activeType = type;
  document
    .querySelectorAll(".filter-pill")
    .forEach((p) => p.classList.toggle("active", p.dataset.type === type));
  _renderExams(type);
}

// ────────────────────────────────────────────────────────────
// Render exam cards
// ────────────────────────────────────────────────────────────
function _renderExams(type) {
  const filtered =
    type === "All" ? _allExams : _allExams.filter((e) => e.type === type);
  const container = document.getElementById("examCardsContainer");

  if (!filtered.length) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-search"></i><p>No exams found for this filter.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map((exam) => _buildExamCard(exam)).join("");

  // Render question charts after DOM insertion
  filtered.forEach((exam) => {
    setTimeout(() => {
      renderQuestionBarChart(`qChart_${exam.id}`, exam.questions);
    }, 100);
  });
}

// ────────────────────────────────────────────────────────────
// Build individual exam card HTML
// ────────────────────────────────────────────────────────────
function _buildExamCard(exam) {
  const pct        = exam.studentMarks;
  const above      = pct >= exam.classAverage;
  const gradeClass = _gradeClass(exam.grade);
  const formattedDate = new Date(exam.date).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  return `
  <div class="exam-card" id="examCard_${exam.id}">
    <!-- Card Header -->
    <div class="exam-card-header">
      <div class="exam-header-left">
        <span class="exam-type-badge">${exam.type}</span>
        <h3 class="exam-title">${exam.name}</h3>
        <span class="exam-date"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
      </div>
      <div class="exam-header-right">
        <div class="exam-score-ring" style="--score:${pct}; --color:${_scoreColor(pct)}">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" class="ring-bg"/>
            <circle cx="40" cy="40" r="34" class="ring-fill"
              style="stroke-dasharray:${Math.round(pct * 2.136)} 213.6; stroke:${_scoreColor(pct)}"/>
          </svg>
          <div class="ring-label">
            <span class="ring-marks">${pct}</span>
            <span class="ring-total">/100</span>
          </div>
        </div>
        <span class="grade-badge ${gradeClass}">${exam.grade}</span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="exam-quick-stats">
      <div class="stat-chip ${above ? "stat-positive" : "stat-negative"}">
        <i class="fas fa-${above ? "arrow-up" : "arrow-down"}"></i>
        ${above ? "+" : ""}${pct - exam.classAverage} vs class avg
      </div>
      <div class="stat-chip">
        <i class="fas fa-users"></i> ${exam.totalStudents} students
      </div>
      <div class="stat-chip">
        <i class="fas fa-trophy"></i> Class high: ${exam.highestMark}
      </div>
      <div class="stat-chip">
        <i class="fas fa-chart-bar"></i> Class avg: ${exam.classAverage}
      </div>
    </div>

    <!-- Accordion toggle -->
    <button class="accordion-toggle" onclick="toggleExamDetail('${exam.id}')">
      <span>View Full Details</span>
      <i class="fas fa-chevron-down" id="chevron_${exam.id}"></i>
    </button>

    <!-- Expandable Detail -->
    <div class="exam-detail hidden" id="detail_${exam.id}">

      <!-- Question Breakdown Chart -->
      <div class="section-block">
        <h4 class="section-heading"><i class="fas fa-chart-bar"></i> Question Performance</h4>
        <div class="chart-wrap" style="height:220px">
          <canvas id="qChart_${exam.id}"></canvas>
        </div>
      </div>

      <!-- Questions Table -->
      <div class="section-block">
        <h4 class="section-heading"><i class="fas fa-list-ol"></i> Question Breakdown</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Topic</th>
                <th>Theory / Concept</th>
                <th>Required Lessons</th>
                <th>Class Correct</th>
                <th>Max Scorer</th>
                <th>Your Marks</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              ${exam.questions.map((q) => `
              <tr>
                <td><span class="q-num">Q${q.questionNo}</span></td>
                <td><span class="topic-tag">${q.topic}</span></td>
                <td class="theory-cell">${q.theory}</td>
                <td>
                  ${q.lessons.map((l) => `<span class="lesson-tag">${l}</span>`).join("")}
                </td>
                <td>
                  <div class="mini-bar-wrap">
                    <div class="mini-bar" style="width:${Math.round((q.correctCount/q.totalStudents)*100)}%"></div>
                    <span>${q.correctCount}/${q.totalStudents}</span>
                  </div>
                </td>
                <td><span class="max-scorer">${q.maxScorer}</span></td>
                <td><strong class="${q.marksAwarded === q.totalMarksQ ? "text-gold" : ""}">${q.marksAwarded}/${q.totalMarksQ}</strong></td>
                <td>
                  <span class="result-badge ${q.studentCorrect ? "correct" : "incorrect"}">
                    <i class="fas fa-${q.studentCorrect ? "check" : "times"}"></i>
                    ${q.studentCorrect ? "Correct" : "Review"}
                  </span>
                </td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tutor Review -->
      <div class="section-block">
        <h4 class="section-heading"><i class="fas fa-chalkboard-teacher"></i> Tutor Review</h4>
        <div class="tutor-review-grid">
          <div class="review-col review-good">
            <div class="review-col-header"><i class="fas fa-thumbs-up"></i> Strengths</div>
            <ul>
              ${exam.tutorReview.goodAreas.map((a) => `<li>${a}</li>`).join("")}
            </ul>
          </div>
          <div class="review-col review-improve">
            <div class="review-col-header"><i class="fas fa-tools"></i> Improve</div>
            <ul>
              ${exam.tutorReview.improvableAreas.map((a) => `<li>${a}</li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="tutor-comment">
          <i class="fas fa-quote-left tutor-quote-icon"></i>
          <p>${exam.tutorReview.overallComment}</p>
          <span class="tutor-sig">— ${CONFIG.TUTOR_NAME}</span>
        </div>
      </div>

    </div>
  </div>`;
}

// ────────────────────────────────────────────────────────────
// Toggle exam detail accordion
// ────────────────────────────────────────────────────────────
function toggleExamDetail(examId) {
  const detail  = document.getElementById(`detail_${examId}`);
  const chevron = document.getElementById(`chevron_${examId}`);
  const isOpen  = !detail.classList.contains("hidden");

  detail.classList.toggle("hidden", isOpen);
  chevron.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";

  if (!isOpen) {
    // Render chart now that container is visible
    const exam = _allExams.find((e) => e.id === examId);
    if (exam) setTimeout(() => renderQuestionBarChart(`qChart_${examId}`, exam.questions), 50);
  }
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
function _scoreColor(score) {
  if (score >= 85) return "#4ADE80";
  if (score >= 70) return "#C9A84C";
  if (score >= 50) return "#60A5FA";
  return "#F87171";
}

function _gradeClass(grade) {
  const g = grade.replace(/[^A-Z]/g, "").charAt(0);
  if (g === "A") return "grade-a";
  if (g === "B") return "grade-b";
  if (g === "C") return "grade-c";
  return "grade-d";
}

/** Returns the currently visible exams for download purposes */
function getFilteredExams() {
  return _activeType === "All"
    ? _allExams
    : _allExams.filter((e) => e.type === _activeType);
}

/** Returns just the most recent exam */
function getLatestExam() {
  return [..._allExams].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}
