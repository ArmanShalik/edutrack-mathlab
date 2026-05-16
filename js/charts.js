/**
 * EduTrack Pro — Charts Module
 * All Chart.js chart creation and update helpers.
 */

const CHART_COLORS = {
  gold:       "#C9A84C",
  goldLight:  "#F0D060",
  goldGlow:   "rgba(201,168,76,0.25)",
  navy:       "#0A1628",
  navyMid:    "#0F2040",
  white:      "rgba(255,255,255,0.85)",
  whiteDim:   "rgba(255,255,255,0.35)",
  success:    "#4ADE80",
  danger:     "#F87171",
  info:       "#60A5FA",
  gridLine:   "rgba(255,255,255,0.07)",
  tooltipBg:  "rgba(5,13,26,0.95)",
};

// Shared Chart.js defaults
Chart.defaults.color = CHART_COLORS.whiteDim;
Chart.defaults.font.family = "'Inter', sans-serif";

const _chartInstances = {};

function _destroyChart(id) {
  if (_chartInstances[id]) {
    _chartInstances[id].destroy();
    delete _chartInstances[id];
  }
}

// ────────────────────────────────────────────────────────────
// Progress Line Chart  (marks over exams)
// ────────────────────────────────────────────────────────────
function renderProgressChart(canvasId, exams) {
  _destroyChart(canvasId);
  const ctx = document.getElementById(canvasId).getContext("2d");

  const labels   = exams.map((e) => e.name);
  const marks    = exams.map((e) => e.studentMarks);
  const averages = exams.map((e) => e.classAverage);
  const highest  = exams.map((e) => e.highestMark);

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(201,168,76,0.4)");
  gradient.addColorStop(1, "rgba(201,168,76,0)");

  _chartInstances[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Your Score",
          data: marks,
          borderColor: CHART_COLORS.gold,
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: CHART_COLORS.gold,
          pointRadius: 6,
          pointHoverRadius: 9,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Class Average",
          data: averages,
          borderColor: CHART_COLORS.info,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [6, 4],
          pointBackgroundColor: CHART_COLORS.info,
          pointRadius: 4,
          pointHoverRadius: 7,
          fill: false,
          tension: 0.4,
        },
        {
          label: "Class Highest",
          data: highest,
          borderColor: CHART_COLORS.success,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderDash: [3, 3],
          pointBackgroundColor: CHART_COLORS.success,
          pointRadius: 4,
          pointHoverRadius: 7,
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          labels: { color: CHART_COLORS.whiteDim, padding: 20, usePointStyle: true },
        },
        tooltip: {
          backgroundColor: CHART_COLORS.tooltipBg,
          titleColor: CHART_COLORS.gold,
          bodyColor: CHART_COLORS.white,
          borderColor: CHART_COLORS.gold,
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}/100`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: CHART_COLORS.gridLine },
          ticks: { color: CHART_COLORS.whiteDim },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: CHART_COLORS.gridLine },
          ticks: {
            color: CHART_COLORS.whiteDim,
            callback: (v) => `${v}%`,
          },
        },
      },
    },
  });
}

// ────────────────────────────────────────────────────────────
// Radar Chart (topic performance)
// ────────────────────────────────────────────────────────────
function renderRadarChart(canvasId, exams) {
  _destroyChart(canvasId);
  const ctx = document.getElementById(canvasId).getContext("2d");

  // Aggregate score % per topic across all exams
  const topicMap = {};
  exams.forEach((exam) => {
    exam.questions.forEach((q) => {
      if (!topicMap[q.topic]) topicMap[q.topic] = { earned: 0, total: 0 };
      topicMap[q.topic].earned += q.marksAwarded;
      topicMap[q.topic].total  += q.totalMarksQ;
    });
  });

  const topics = Object.keys(topicMap);
  const scores = topics.map((t) =>
    Math.round((topicMap[t].earned / topicMap[t].total) * 100)
  );

  _chartInstances[canvasId] = new Chart(ctx, {
    type: "radar",
    data: {
      labels: topics,
      datasets: [
        {
          label: "Your Performance %",
          data: scores,
          borderColor: CHART_COLORS.gold,
          backgroundColor: CHART_COLORS.goldGlow,
          pointBackgroundColor: CHART_COLORS.gold,
          borderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: CHART_COLORS.whiteDim } },
        tooltip: {
          backgroundColor: CHART_COLORS.tooltipBg,
          titleColor: CHART_COLORS.gold,
          bodyColor: CHART_COLORS.white,
          callbacks: {
            label: (ctx) => ` ${ctx.raw}% performance`,
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          grid: { color: CHART_COLORS.gridLine },
          angleLines: { color: CHART_COLORS.gridLine },
          pointLabels: { color: CHART_COLORS.whiteDim, font: { size: 12 } },
          ticks: { display: false, stepSize: 25 },
        },
      },
    },
  });
}

// ────────────────────────────────────────────────────────────
// Attendance Doughnut
// ────────────────────────────────────────────────────────────
function renderAttendanceDonut(canvasId, summary) {
  _destroyChart(canvasId);
  const ctx = document.getElementById(canvasId).getContext("2d");

  _chartInstances[canvasId] = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Attended", "Missed"],
      datasets: [
        {
          data: [summary.attended, summary.missed],
          backgroundColor: [CHART_COLORS.gold, "rgba(248,113,113,0.6)"],
          borderColor: ["#0A1628"],
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: CHART_COLORS.whiteDim, padding: 16, usePointStyle: true },
        },
        tooltip: {
          backgroundColor: CHART_COLORS.tooltipBg,
          titleColor: CHART_COLORS.gold,
          bodyColor: CHART_COLORS.white,
        },
      },
    },
  });
}

// ────────────────────────────────────────────────────────────
// Question bar chart (% correct per question)
// ────────────────────────────────────────────────────────────
function renderQuestionBarChart(canvasId, questions) {
  _destroyChart(canvasId);
  const ctx = document.getElementById(canvasId).getContext("2d");

  const labels  = questions.map((q) => `Q${q.questionNo}`);
  const classPC = questions.map((q) =>
    Math.round((q.correctCount / q.totalStudents) * 100)
  );
  const student = questions.map((q) =>
    Math.round((q.marksAwarded / q.totalMarksQ) * 100)
  );

  _chartInstances[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Your Score %",
          data: student,
          backgroundColor: CHART_COLORS.goldGlow,
          borderColor: CHART_COLORS.gold,
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: "Class Correct %",
          data: classPC,
          backgroundColor: "rgba(96,165,250,0.25)",
          borderColor: CHART_COLORS.info,
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: CHART_COLORS.whiteDim, usePointStyle: true } },
        tooltip: {
          backgroundColor: CHART_COLORS.tooltipBg,
          titleColor: CHART_COLORS.gold,
          bodyColor: CHART_COLORS.white,
          callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: CHART_COLORS.whiteDim } },
        y: {
          min: 0,
          max: 100,
          grid: { color: CHART_COLORS.gridLine },
          ticks: {
            color: CHART_COLORS.whiteDim,
            callback: (v) => `${v}%`,
          },
        },
      },
    },
  });
}
