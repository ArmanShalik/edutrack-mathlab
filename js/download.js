/**
 * EduTrack Pro — Download Module
 * PDF generation using jsPDF.  Three export modes:
 *  1. filtered   — Current exam filter view
 *  2. latest     — Most recent exam only
 *  3. full       — Everything: all exams + attendance + classes
 */

const DL_COLORS = {
  navyDark : [5,  13,  26],
  navyMid  : [10, 22,  40],
  navyLight: [15, 32,  64],
  gold     : [201,168, 76],
  white    : [240,240,240],
  lightGray: [180,180,200],
  green    : [74, 222,128],
  red      : [248,113,113],
  blue     : [96, 165,250],
};

// ────────────────────────────────────────────────────────────
// Public entry point
// ────────────────────────────────────────────────────────────
function downloadReport(mode, studentData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const student = studentData.student;
  let exams, title;

  switch (mode) {
    case "latest":
      exams = [getLatestExam()];
      title = "Latest Exam Review";
      break;
    case "filtered":
      exams = getFilteredExams();
      title = "Exam Review Report";
      break;
    case "full":
    default:
      exams = studentData.exams;
      title = "Full Progress Report";
      break;
  }

  let y = _coverPage(doc, student, title);
  doc.addPage();
  y = _sectionHeader(doc, 20, "Student Overview");
  y = _studentOverviewBlock(doc, student, studentData.exams, y);

  exams.forEach((exam, idx) => {
    if (idx > 0 || y > 180) { doc.addPage(); y = 20; }
    y = _examBlock(doc, exam, y);
  });

  if (mode === "full") {
    doc.addPage();
    y = _attendanceBlock(doc, studentData.attendance, 20);
    doc.addPage();
    _classesBlock(doc, studentData.classes, 20);
  }

  _addPageNumbers(doc);

  const fname = `EduTrack_${student.name.replace(/\s+/g,"_")}_${title.replace(/\s+/g,"_")}_${_today()}.pdf`;
  doc.save(fname);
}

// ────────────────────────────────────────────────────────────
// Cover Page
// ────────────────────────────────────────────────────────────
function _coverPage(doc, student, title) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(...DL_COLORS.navyDark);
  doc.rect(0, 0, W, H, "F");

  // Gold accent bar
  doc.setFillColor(...DL_COLORS.gold);
  doc.rect(0, 0, 8, H, "F");

  // Title block
  doc.setTextColor(...DL_COLORS.gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(CONFIG.PORTAL_NAME, W / 2, 60, { align: "center" });

  doc.setTextColor(...DL_COLORS.white);
  doc.setFontSize(18);
  doc.text(title, W / 2, 74, { align: "center" });

  // Divider
  doc.setDrawColor(...DL_COLORS.gold);
  doc.setLineWidth(0.5);
  doc.line(30, 82, W - 30, 82);

  // Student info
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  const infoY = 100;
  const col1 = 35, col2 = W / 2 + 10;

  const fields = [
    ["Name",     student.name],
    ["NIC",      student.nic],
    ["Index No", student.indexNo],
    ["Class",    student.class],
  ];

  fields.forEach(([label, value], i) => {
    const x = i % 2 === 0 ? col1 : col2;
    const row = Math.floor(i / 2);
    doc.setTextColor(...DL_COLORS.gold);
    doc.text(`${label}:`, x, infoY + row * 12);
    doc.setTextColor(...DL_COLORS.white);
    doc.text(value || "—", x + 30, infoY + row * 12);
  });

  // Generated date
  doc.setFontSize(9);
  doc.setTextColor(...DL_COLORS.lightGray);
  doc.text(`Generated: ${new Date().toLocaleString("en-GB")}  •  ${CONFIG.INSTITUTE_NAME}`, W / 2, H - 20, { align: "center" });
  doc.text(CONFIG.TUTOR_NAME, W / 2, H - 14, { align: "center" });

  return 0;
}

// ────────────────────────────────────────────────────────────
// Student Overview block
// ────────────────────────────────────────────────────────────
function _studentOverviewBlock(doc, student, exams, y) {
  const W = doc.internal.pageSize.getWidth();
  const scores = exams.map((e) => e.studentMarks);
  const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best   = Math.max(...scores);
  const latest = [...exams].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const stats = [
    ["Total Exams",    exams.length],
    ["Average Score",  `${avg}/100`],
    ["Best Score",     `${best}/100`],
    ["Latest Grade",   latest.grade],
  ];

  const cellW = (W - 30) / 4;
  stats.forEach(([label, value], i) => {
    const x = 15 + i * cellW;
    doc.setFillColor(...DL_COLORS.navyMid);
    doc.roundedRect(x, y, cellW - 4, 22, 2, 2, "F");
    doc.setDrawColor(...DL_COLORS.gold);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, cellW - 4, 22, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...DL_COLORS.gold);
    doc.text(String(value), x + (cellW - 4) / 2, y + 11, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...DL_COLORS.lightGray);
    doc.text(label, x + (cellW - 4) / 2, y + 18, { align: "center" });
  });

  return y + 32;
}

// ────────────────────────────────────────────────────────────
// Single exam block
// ────────────────────────────────────────────────────────────
function _examBlock(doc, exam, y) {
  const W = doc.internal.pageSize.getWidth();

  // Exam header
  doc.setFillColor(...DL_COLORS.navyLight);
  doc.rect(15, y, W - 30, 14, "F");
  doc.setDrawColor(...DL_COLORS.gold);
  doc.setLineWidth(0.4);
  doc.rect(15, y, W - 30, 14, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...DL_COLORS.gold);
  doc.text(exam.name, 20, y + 9);

  const dateTxt = new Date(exam.date).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...DL_COLORS.lightGray);
  doc.text(`${exam.type}  •  ${dateTxt}  •  Score: ${exam.studentMarks}/100  •  Grade: ${exam.grade}`, W - 20, y + 9, { align: "right" });

  y += 18;

  // Compact stat row
  const statLabels = ["Your Score", "Class Avg", "Class High", "Students"];
  const statVals   = [`${exam.studentMarks}`, `${exam.classAverage}`, `${exam.highestMark}`, `${exam.totalStudents}`];
  const cellW2 = (W - 30) / 4;
  statLabels.forEach((label, i) => {
    const x = 15 + i * cellW2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...DL_COLORS.white);
    doc.text(statVals[i], x + 2, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...DL_COLORS.lightGray);
    doc.text(label, x + 2, y + 11);
  });
  y += 18;

  // Questions table
  y = _sectionSubHeading(doc, y, "Question Breakdown");
  const headers = ["Q#", "Topic", "Theory", "Your Marks", "Class%", "Max Scorer", "Result"];
  const colWidths = [10, 24, 52, 20, 16, 26, 18];
  y = _tableHeader(doc, headers, colWidths, y);

  exam.questions.forEach((q) => {
    if (y > 265) { doc.addPage(); y = 20; y = _tableHeader(doc, headers, colWidths, y); }
    const row = [
      `Q${q.questionNo}`,
      q.topic,
      q.theory.length > 35 ? q.theory.substring(0, 33) + "…" : q.theory,
      `${q.marksAwarded}/${q.totalMarksQ}`,
      `${Math.round((q.correctCount / q.totalStudents) * 100)}%`,
      q.maxScorer,
      q.studentCorrect ? "✓ Correct" : "✗ Review",
    ];
    y = _tableRow(doc, row, colWidths, y, q.studentCorrect);
  });
  y += 6;

  // Tutor Review
  if (y > 240) { doc.addPage(); y = 20; }
  y = _sectionSubHeading(doc, y, "Tutor Review");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DL_COLORS.green);
  doc.text("Strengths:", 20, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DL_COLORS.white);
  exam.tutorReview.goodAreas.forEach((a) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(`• ${a}`, 25, y); y += 5;
  });

  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DL_COLORS.red);
  doc.text("Areas to Improve:", 20, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DL_COLORS.white);
  exam.tutorReview.improvableAreas.forEach((a) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(`• ${a}`, 25, y); y += 5;
  });

  y += 3;
  doc.setFillColor(...DL_COLORS.navyMid);
  const W2 = doc.internal.pageSize.getWidth();
  const commentLines = doc.splitTextToSize(`"${exam.tutorReview.overallComment}"`, W2 - 40);
  if (y + commentLines.length * 5 > 270) { doc.addPage(); y = 20; }
  doc.rect(15, y - 2, W2 - 30, commentLines.length * 5 + 8, "F");
  doc.setFontSize(9);
  doc.setTextColor(...DL_COLORS.lightGray);
  doc.text(commentLines, 20, y + 4);
  y += commentLines.length * 5 + 14;

  return y;
}

// ────────────────────────────────────────────────────────────
// Attendance block
// ────────────────────────────────────────────────────────────
function _attendanceBlock(doc, attendance, y) {
  y = _sectionHeader(doc, y, "Attendance Report");
  const s = attendance.summary;

  const stats = [
    ["Total Classes", s.totalClasses],
    ["Attended",      s.attended],
    ["Missed",        s.missed],
    ["Percentage",    `${s.percentage}%`],
  ];

  const W = doc.internal.pageSize.getWidth();
  const cellW = (W - 30) / 4;
  stats.forEach(([label, value], i) => {
    const x = 15 + i * cellW;
    doc.setFillColor(...DL_COLORS.navyMid);
    doc.roundedRect(x, y, cellW - 4, 20, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...DL_COLORS.gold);
    doc.text(String(value), x + (cellW - 4) / 2, y + 10, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...DL_COLORS.lightGray);
    doc.text(label, x + (cellW - 4) / 2, y + 17, { align: "center" });
  });

  y += 28;

  // Impact
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DL_COLORS.gold);
  doc.text("Exam Impact Analysis:", 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DL_COLORS.white);
  const impactLines = doc.splitTextToSize(attendance.missedImpact || "", W - 40);
  doc.text(impactLines, 20, y);
  y += impactLines.length * 5 + 8;

  // Attendance log table
  y = _sectionSubHeading(doc, y, "Attendance Log");
  const headers = ["Date", "Topic Covered", "Status"];
  const colWidths = [30, 100, 26];
  y = _tableHeader(doc, headers, colWidths, y);

  attendance.records.forEach((r) => {
    if (y > 270) { doc.addPage(); y = 20; y = _tableHeader(doc, headers, colWidths, y); }
    const d = new Date(r.date).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
    y = _tableRow(doc, [d, r.topic, r.status === "present" ? "✓ Present" : "✗ Absent"], colWidths, y, r.status === "present");
  });

  return y;
}

// ────────────────────────────────────────────────────────────
// Classes block
// ────────────────────────────────────────────────────────────
function _classesBlock(doc, classes, y) {
  y = _sectionHeader(doc, y, "Class Schedule");
  const W = doc.internal.pageSize.getWidth();

  ["lastWeek", "upcoming"].forEach((key) => {
    const block = classes[key];
    const label = key === "lastWeek" ? "Last Week" : "Upcoming Week";
    y = _sectionSubHeading(doc, y, `${label}: ${block.week}`);

    doc.setFontSize(9);
    doc.setTextColor(...DL_COLORS.white);
    block.topics.forEach((t) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(`• ${t}`, 20, y); y += 5;
    });
    y += 3;
    doc.setTextColor(...DL_COLORS.lightGray);
    const noteLines = doc.splitTextToSize(`Note: ${block.notes}`, W - 40);
    doc.text(noteLines, 20, y);
    y += noteLines.length * 5 + 10;
  });

  return y;
}

// ────────────────────────────────────────────────────────────
// Shared PDF helpers
// ────────────────────────────────────────────────────────────
function _sectionHeader(doc, y, title) {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...DL_COLORS.gold);
  doc.rect(0, y - 4, 6, 16, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...DL_COLORS.gold);
  doc.text(title, 12, y + 7);
  doc.setDrawColor(...DL_COLORS.gold);
  doc.setLineWidth(0.3);
  doc.line(12, y + 11, W - 15, y + 11);
  return y + 20;
}

function _sectionSubHeading(doc, y, title) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...DL_COLORS.gold);
  doc.text(title, 20, y);
  return y + 7;
}

function _tableHeader(doc, headers, widths, y) {
  let x = 15;
  doc.setFillColor(...DL_COLORS.navyLight);
  const totalW = widths.reduce((a, b) => a + b, 0);
  doc.rect(x, y - 4, totalW, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...DL_COLORS.gold);
  headers.forEach((h, i) => {
    doc.text(h, x + 2, y + 1);
    x += widths[i];
  });
  return y + 8;
}

function _tableRow(doc, cells, widths, y, highlight) {
  let x = 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  cells.forEach((cell, i) => {
    if (i === cells.length - 1) {
      doc.setTextColor(
        ...(highlight === true || cell.includes("✓") ? DL_COLORS.green :
            highlight === false || cell.includes("✗") ? DL_COLORS.red : DL_COLORS.white)
      );
    } else {
      doc.setTextColor(...DL_COLORS.white);
    }
    doc.text(String(cell), x + 2, y + 1);
    x += widths[i];
  });

  // Row separator
  doc.setDrawColor(...DL_COLORS.navyLight[0], ...DL_COLORS.navyLight.slice(1));
  doc.setLineWidth(0.1);
  const totalW = widths.reduce((a, b) => a + b, 0);
  doc.line(15, y + 3, 15 + totalW, y + 3);

  return y + 6;
}

function _addPageNumbers(doc) {
  const total = doc.internal.getNumberOfPages();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...DL_COLORS.lightGray);
    doc.text(`${CONFIG.PORTAL_NAME}  •  Page ${i} of ${total}`, W / 2, H - 8, { align: "center" });
  }
}

function _today() {
  return new Date().toISOString().split("T")[0];
}
