/**
 * EduTrack Pro — Attendance Module
 * Renders the attendance summary, calendar heatmap, and exam impact.
 */

function initAttendance(attendanceData) {
  _renderAttendanceSummary(attendanceData.summary);
  renderAttendanceDonut("attendanceDonut", attendanceData.summary);
  _renderAttendanceCalendar(attendanceData.records);
  _renderImpactBanner(attendanceData.summary, attendanceData.missedImpact);
}

// ────────────────────────────────────────────────────────────
// Summary stats strip
// ────────────────────────────────────────────────────────────
function _renderAttendanceSummary(summary) {
  const impactLevel = _impactLevel(summary.percentage);
  document.getElementById("attTotal").textContent   = summary.totalClasses;
  document.getElementById("attPresent").textContent = summary.attended;
  document.getElementById("attMissed").textContent  = summary.missed;
  document.getElementById("attPct").textContent     = `${summary.percentage}%`;

  // Colour the percentage based on attendance health
  const pctEl = document.getElementById("attPct");
  pctEl.style.color =
    summary.percentage >= 90 ? "#4ADE80" :
    summary.percentage >= 75 ? "#C9A84C" : "#F87171";

  // Impact pill
  const impactEl = document.getElementById("attImpact");
  if (impactEl) {
    impactEl.textContent  = impactLevel.label;
    impactEl.className    = `impact-pill impact-${impactLevel.cls}`;
  }
}

// ────────────────────────────────────────────────────────────
// Calendar heatmap
// ────────────────────────────────────────────────────────────
function _renderAttendanceCalendar(records) {
  const container = document.getElementById("attendanceCalendar");
  if (!container) return;

  // Group by month
  const months = {};
  records.forEach((r) => {
    const d  = new Date(r.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!months[key]) months[key] = { year: d.getFullYear(), month: d.getMonth(), days: [] };
    months[key].days.push({ day: d.getDate(), status: r.status, topic: r.topic, date: r.date });
  });

  container.innerHTML = Object.values(months)
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
    .map((m) => _buildMonthBlock(m))
    .join("");
}

function _buildMonthBlock({ year, month, days }) {
  const monthName = new Date(year, month, 1).toLocaleString("en-GB", { month: "long", year: "numeric" });

  // Build a map for quick lookup
  const dayMap = {};
  days.forEach((d) => (dayMap[d.day] = d));

  // Day-of-week offset for the 1st
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let cells = "";
  // Empty cells for offset (Mon start)
  const offset = (firstDow + 6) % 7; // shift to Mon=0
  for (let i = 0; i < offset; i++) cells += `<div class="cal-cell empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const record = dayMap[d];
    if (!record) {
      cells += `<div class="cal-cell no-class"><span>${d}</span></div>`;
    } else {
      const tipId = `tip_${year}_${month}_${d}`;
      cells += `
        <div class="cal-cell ${record.status}" 
             onmouseenter="showCalTip('${tipId}',event)" 
             onmouseleave="hideCalTip('${tipId}')">
          <span>${d}</span>
          <div class="cal-tooltip" id="${tipId}">
            <strong>${new Date(record.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</strong><br>
            ${record.topic}<br>
            <span class="cal-status-label ${record.status}">${record.status}</span>
          </div>
        </div>`;
    }
  }

  const dow = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return `
  <div class="month-block">
    <div class="month-title">${monthName}</div>
    <div class="cal-grid">
      ${dow.map((d) => `<div class="cal-dow">${d}</div>`).join("")}
      ${cells}
    </div>
  </div>`;
}

function showCalTip(id, e) {
  const el = document.getElementById(id);
  if (el) el.classList.add("visible");
}
function hideCalTip(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("visible");
}

// ────────────────────────────────────────────────────────────
// Impact banner
// ────────────────────────────────────────────────────────────
function _renderImpactBanner(summary, impactText) {
  const el = document.getElementById("impactBanner");
  if (!el) return;
  const level = _impactLevel(summary.percentage);
  el.className = `impact-banner impact-${level.cls}`;
  el.innerHTML = `
    <div class="impact-icon"><i class="fas fa-${level.icon}"></i></div>
    <div class="impact-text">
      <strong>Exam Impact: ${level.label}</strong>
      <p>${impactText || _defaultImpactText(summary)}</p>
    </div>`;
}

function _defaultImpactText(summary) {
  if (summary.percentage >= 90) return "Excellent attendance. No significant impact on exam performance.";
  if (summary.percentage >= 75) return "Good attendance. Minor gaps — review missed class notes.";
  return "Attendance below recommended threshold. Missing classes may significantly affect exam readiness.";
}

function _impactLevel(pct) {
  if (pct >= 90) return { label: "Low",    cls: "low",    icon: "check-circle" };
  if (pct >= 75) return { label: "Medium", cls: "medium", icon: "exclamation-circle" };
  return              { label: "High",   cls: "high",   icon: "times-circle" };
}
