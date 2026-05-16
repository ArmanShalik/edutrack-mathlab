/**
 * EduTrack Pro — Main App Controller
 * Bootstraps the dashboard after data is loaded from session / API.
 */

let _studentData = null;

// ────────────────────────────────────────────────────────────
// Boot
// ────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  _studentData = getSessionData();

  if (!_studentData) {
    // No session — redirect to login
    window.location.href = "index.html";
    return;
  }

  _bootstrap(_studentData);
});

function _bootstrap(data) {
  const { student, exams, attendance, classes } = data;

  // ── Student identity strip ──────────────────────────────
  document.getElementById("studentName").textContent   = student.name;
  document.getElementById("studentClass").textContent  = student.class;
  document.getElementById("studentIndex").textContent  = `Index: ${student.indexNo}`;
  document.getElementById("studentNIC").textContent    = `NIC: ${student.nic}`;
  document.getElementById("avatarInitials").textContent = _initials(student.name);

  // ── Top KPI bar ─────────────────────────────────────────
  _renderKPIs(exams, attendance.summary);

  // ── Progress Charts ──────────────────────────────────────
  renderProgressChart("progressChart", exams);
  renderRadarChart("radarChart", exams);

  // ── Exams ────────────────────────────────────────────────
  initExams(exams);

  // ── Attendance ───────────────────────────────────────────
  initAttendance(attendance);

  // ── Classes ──────────────────────────────────────────────
  _renderClasses(classes);

  // ── Download buttons ─────────────────────────────────────
  document
    .querySelectorAll("[data-download]")
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        downloadReport(btn.dataset.download, _studentData)
      );
    });

  // ── Active nav ───────────────────────────────────────────
  _initNav();

  // ── Hide loading skeleton ────────────────────────────────
  document.getElementById("loadingSkeleton")?.classList.add("hidden");
  document.getElementById("mainContent")?.classList.remove("hidden");
}

// ────────────────────────────────────────────────────────────
// KPI Strip
// ────────────────────────────────────────────────────────────
function _renderKPIs(exams, attSummary) {
  const scores  = exams.map((e) => e.studentMarks);
  const avg     = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const latest  = [...exams].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const rank    = _estimateRank(latest, exams);

  _setKPI("kpiAvg",        `${avg}%`,                   `Over ${exams.length} exams`);
  _setKPI("kpiLatest",     `${latest.studentMarks}%`,   latest.name);
  _setKPI("kpiAttendance", `${attSummary.percentage}%`, `${attSummary.attended}/${attSummary.totalClasses} classes`);
  _setKPI("kpiGrade",      latest.grade,                "Latest grade");
}

function _setKPI(id, value, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelector(".kpi-value").textContent = value;
  el.querySelector(".kpi-label").textContent = label;
}

function _estimateRank(exam) {
  // Simple estimate based on score vs class high; real rank from Sheets if needed
  const pct = (exam.studentMarks / exam.highestMark) * 100;
  if (pct >= 95) return "Top 1";
  if (pct >= 88) return "Top 3";
  if (pct >= 75) return "Top 10";
  return "Top Half";
}

// ────────────────────────────────────────────────────────────
// Classes section
// ────────────────────────────────────────────────────────────
function _renderClasses(classes) {
  _fillClassBlock("lastWeekBlock", classes.lastWeek, "Last Week");
  _fillClassBlock("upcomingBlock", classes.upcoming, "Upcoming Week");
}

function _fillClassBlock(elId, block, label) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = `
    <div class="class-block-header">
      <span class="class-week-label">${label}</span>
      <span class="class-week-date">${block.week}</span>
    </div>
    <ul class="class-topic-list">
      ${block.topics.map((t) => `<li><i class="fas fa-book-open"></i>${t}</li>`).join("")}
    </ul>
    <div class="class-note">
      <i class="fas fa-sticky-note"></i>
      <p>${block.notes}</p>
    </div>`;
}

// ────────────────────────────────────────────────────────────
// Nav scroll spy
// ────────────────────────────────────────────────────────────
function _initNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks  = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────
function _initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ────────────────────────────────────────────────────────────
// WhatsApp & Logout (global handlers for inline HTML)
// ────────────────────────────────────────────────────────────
function openWhatsApp() {
  window.open(
    `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)}`,
    "_blank"
  );
}

function doLogout() {
  logout();
}

// Smooth scroll for nav
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
