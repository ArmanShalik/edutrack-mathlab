/**
 * EduTrack Pro — Configuration
 * ─────────────────────────────────────────────────────────
 * Update these values before deploying.
 */

const CONFIG = {
  // ── Google Apps Script Web App URL ──────────────────────
  // After deploying your Apps Script, paste the URL here.
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyWD8R05HRgLM711CvlMPqAMP2PyvYYFlNPtL_MZNoMsi_ht1EOC5xz0AgwXRev24Dv2A/exec",

  // ── WhatsApp ─────────────────────────────────────────────
  // Include country code without '+' or '00' (e.g. Sri Lanka: 94771234567)
  WHATSAPP_NUMBER: "94779740171",
  WHATSAPP_MESSAGE: "Hi Sir, "Type your inquiry here" ",

  // ── Portal Branding ───────────────────────────────────────
  PORTAL_NAME: "MathLab Perfomance Tracker",
  TUTOR_NAME: "Arman Shalik",
  INSTITUTE_NAME: "Arman Teaches Math",
  TAGLINE: "Your Academic Powerhouse",

  // ── Demo / Offline Mode ───────────────────────────────────
  // Set true to load DEMO_DATA below instead of calling Sheets.
  DEMO_MODE: false,

  // ── Demo student IDs that will load sample data ───────────
  DEMO_IDS: ["STU001", "200012345678", "2024/AL/001"],

  // ═══════════════════════════════════════════════════════════
  // DEMO DATA — mirrors the exact JSON your Apps Script returns
  // ═══════════════════════════════════════════════════════════
  DEMO_DATA: {
    success: true,
    student: {
      id: "STU001",
      nic: "200012345678",
      indexNo: "2024/AL/001",
      name: "Ashan Perera",
      class: "A/L Combined Maths — Batch 2024",
      contact: "+94771234567",
      email: "ashan@example.com",
      enrolledDate: "2024-01-10"
    },

    exams: [
      {
        id: "EXAM001",
        name: "Monthly Test 1",
        type: "Monthly Test",
        date: "2024-02-15",
        totalMarks: 100,
        studentMarks: 72,
        grade: "B",
        classAverage: 61,
        highestMark: 92,
        totalStudents: 38,
        tutorReview: {
          goodAreas: [
            "Strong algebraic manipulation",
            "Neat and structured working",
            "Good attempt on Part A"
          ],
          improvableAreas: [
            "Trigonometric identities need revision",
            "Missed formula for integration by parts",
            "Time management in Section B"
          ],
          overallComment:
            "Overall a solid start to the year. Ashan shows clear understanding of core algebra but needs to strengthen calculus foundations before the term exam. Recommended: revisit Chapters 4–6 this week."
        },
        questions: [
          {
            questionNo: 1, topic: "Algebra", theory: "Quadratic Equations & Discriminant",
            lessons: ["Ch 2 – Quadratics", "Lesson 3: Nature of Roots"],
            totalStudents: 38, correctCount: 33, maxScorer: "Kasun F.",
            studentCorrect: true, marksAwarded: 10, totalMarksQ: 10
          },
          {
            questionNo: 2, topic: "Calculus", theory: "First Principles of Differentiation",
            lessons: ["Ch 5 – Differentiation", "Lesson 1: Limits"],
            totalStudents: 38, correctCount: 14, maxScorer: "Nimali S.",
            studentCorrect: false, marksAwarded: 4, totalMarksQ: 15
          },
          {
            questionNo: 3, topic: "Trigonometry", theory: "Compound Angle Formulae",
            lessons: ["Ch 3 – Trig Identities", "Lesson 6: Compound Angles"],
            totalStudents: 38, correctCount: 20, maxScorer: "Kasun F.",
            studentCorrect: true, marksAwarded: 12, totalMarksQ: 15
          },
          {
            questionNo: 4, topic: "Algebra", theory: "Partial Fractions",
            lessons: ["Ch 2 – Algebra II", "Lesson 8: Partial Fractions"],
            totalStudents: 38, correctCount: 29, maxScorer: "Sanduni A.",
            studentCorrect: true, marksAwarded: 10, totalMarksQ: 10
          },
          {
            questionNo: 5, topic: "Calculus", theory: "Integration by Substitution",
            lessons: ["Ch 6 – Integration", "Lesson 2: Substitution Method"],
            totalStudents: 38, correctCount: 18, maxScorer: "Nimali S.",
            studentCorrect: false, marksAwarded: 6, totalMarksQ: 20
          },
          {
            questionNo: 6, topic: "Statistics", theory: "Normal Distribution",
            lessons: ["Ch 9 – Stats", "Lesson 4: Normal Dist."],
            totalStudents: 38, correctCount: 31, maxScorer: "Ashan P.",
            studentCorrect: true, marksAwarded: 15, totalMarksQ: 15
          },
          {
            questionNo: 7, topic: "Vectors", theory: "Dot & Cross Product",
            lessons: ["Ch 7 – Vectors", "Lesson 5: 3D Vectors"],
            totalStudents: 38, correctCount: 10, maxScorer: "Sanduni A.",
            studentCorrect: false, marksAwarded: 15, totalMarksQ: 15
          }
        ]
      },
      {
        id: "EXAM002",
        name: "Mid Term Examination",
        type: "Mid Term",
        date: "2024-04-10",
        totalMarks: 100,
        studentMarks: 81,
        grade: "A−",
        classAverage: 68,
        highestMark: 97,
        totalStudents: 38,
        tutorReview: {
          goodAreas: [
            "Excellent improvement in calculus",
            "Integration by parts mastered",
            "Clear presentation throughout"
          ],
          improvableAreas: [
            "Vector problems — review cross product",
            "Stats section: normal distribution tables",
            "Proofs need more rigour"
          ],
          overallComment:
            "Significant growth since Monthly Test 1. The targeted revision on calculus has paid off clearly. Keep this momentum for the term exam. Focus for the next month: Vectors and Proof-based questions."
        },
        questions: [
          {
            questionNo: 1, topic: "Calculus", theory: "Integration by Parts",
            lessons: ["Ch 6 – Integration", "Lesson 4: By Parts"],
            totalStudents: 38, correctCount: 22, maxScorer: "Kasun F.",
            studentCorrect: true, marksAwarded: 20, totalMarksQ: 20
          },
          {
            questionNo: 2, topic: "Vectors", theory: "Cross Product Applications",
            lessons: ["Ch 7 – Vectors", "Lesson 6: Cross Product"],
            totalStudents: 38, correctCount: 9, maxScorer: "Nimali S.",
            studentCorrect: false, marksAwarded: 8, totalMarksQ: 20
          },
          {
            questionNo: 3, topic: "Trigonometry", theory: "General Solutions of Trig Equations",
            lessons: ["Ch 3 – Trig", "Lesson 9: General Solution"],
            totalStudents: 38, correctCount: 27, maxScorer: "Ashan P.",
            studentCorrect: true, marksAwarded: 18, totalMarksQ: 20
          },
          {
            questionNo: 4, topic: "Statistics", theory: "Binomial & Normal Distribution",
            lessons: ["Ch 9 – Stats", "Lesson 5–6: Distributions"],
            totalStudents: 38, correctCount: 31, maxScorer: "Sanduni A.",
            studentCorrect: true, marksAwarded: 20, totalMarksQ: 20
          },
          {
            questionNo: 5, topic: "Algebra", theory: "Mathematical Induction",
            lessons: ["Ch 2 – Proofs", "Lesson 10: Induction"],
            totalStudents: 38, correctCount: 15, maxScorer: "Kasun F.",
            studentCorrect: false, marksAwarded: 15, totalMarksQ: 20
          }
        ]
      },
      {
        id: "EXAM003",
        name: "Monthly Test 2",
        type: "Monthly Test",
        date: "2024-05-20",
        totalMarks: 100,
        studentMarks: 88,
        grade: "A",
        classAverage: 70,
        highestMark: 97,
        totalStudents: 38,
        tutorReview: {
          goodAreas: [
            "Outstanding vector performance",
            "Proof section — excellent rigour",
            "Fastest improvement in the batch"
          ],
          improvableAreas: [
            "Minor arithmetic errors in Section B",
            "Double-check working for full marks"
          ],
          overallComment:
            "Exceptional result. Ashan is now among the top 3 in the batch. The consistent practice has brought outstanding results. Main focus before the term exam: eliminate arithmetic slips and polish time allocation."
        },
        questions: [
          {
            questionNo: 1, topic: "Vectors", theory: "Planes in 3D",
            lessons: ["Ch 7 – Vectors", "Lesson 7: Planes"],
            totalStudents: 38, correctCount: 19, maxScorer: "Ashan P.",
            studentCorrect: true, marksAwarded: 25, totalMarksQ: 25
          },
          {
            questionNo: 2, topic: "Calculus", theory: "Differential Equations",
            lessons: ["Ch 6 – Diff Eq", "Lesson 1: 1st Order ODE"],
            totalStudents: 38, correctCount: 21, maxScorer: "Ashan P.",
            studentCorrect: true, marksAwarded: 22, totalMarksQ: 25
          },
          {
            questionNo: 3, topic: "Algebra", theory: "Induction & Sequences",
            lessons: ["Ch 2 – Sequences", "Ch 2 – Induction"],
            totalStudents: 38, correctCount: 28, maxScorer: "Nimali S.",
            studentCorrect: true, marksAwarded: 22, totalMarksQ: 25
          },
          {
            questionNo: 4, topic: "Statistics", theory: "Hypothesis Testing",
            lessons: ["Ch 9 – Stats", "Lesson 8: Hypothesis Testing"],
            totalStudents: 38, correctCount: 14, maxScorer: "Kasun F.",
            studentCorrect: false, marksAwarded: 19, totalMarksQ: 25
          }
        ]
      },
      {
        id: "EXAM004",
        name: "Term End Examination",
        type: "Term Exam",
        date: "2024-07-05",
        totalMarks: 100,
        studentMarks: 91,
        grade: "A+",
        classAverage: 72,
        highestMark: 97,
        totalStudents: 38,
        tutorReview: {
          goodAreas: [
            "Comprehensive coverage across all topics",
            "Excellent proof writing",
            "Top 2 in class — remarkable progress"
          ],
          improvableAreas: [
            "Continue practising past paper timed conditions",
            "Expand to A/L past papers from other provinces"
          ],
          overallComment:
            "An outstanding term for Ashan. From 72 in Monthly Test 1 to 91 in the Term Exam — this trajectory is exactly what A/L success looks like. Keep the pace up for next term."
        },
        questions: [
          {
            questionNo: 1, topic: "Pure Maths", theory: "Comprehensive Algebra + Calculus",
            lessons: ["Ch 1–6 Review", "Past Paper Practice"],
            totalStudents: 38, correctCount: 20, maxScorer: "Ashan P.",
            studentCorrect: true, marksAwarded: 23, totalMarksQ: 25
          },
          {
            questionNo: 2, topic: "Pure Maths", theory: "Trigonometry + Vectors",
            lessons: ["Ch 3 & 7 Review"],
            totalStudents: 38, correctCount: 16, maxScorer: "Kasun F.",
            studentCorrect: true, marksAwarded: 22, totalMarksQ: 25
          },
          {
            questionNo: 3, topic: "Statistics", theory: "Full Stats Module",
            lessons: ["Ch 8–10 Review"],
            totalStudents: 38, correctCount: 25, maxScorer: "Sanduni A.",
            studentCorrect: true, marksAwarded: 24, totalMarksQ: 25
          },
          {
            questionNo: 4, topic: "Applied", theory: "Mechanics — Kinematics",
            lessons: ["Ch 11 – Kinematics", "Lesson 1–4"],
            totalStudents: 38, correctCount: 28, maxScorer: "Nimali S.",
            studentCorrect: true, marksAwarded: 22, totalMarksQ: 25
          }
        ]
      }
    ],

    attendance: {
      summary: {
        totalClasses: 56,
        attended: 49,
        missed: 7,
        percentage: 87.5
      },
      missedImpact: "Medium — 7 missed classes cover key Vectors and Differential Equations topics. Review notes from 24 Mar and 12 Apr to close the gap before the next exam.",
      records: [
        { date: "2024-01-15", status: "present", topic: "Quadratic Equations" },
        { date: "2024-01-17", status: "present", topic: "Nature of Roots" },
        { date: "2024-01-22", status: "present", topic: "Partial Fractions" },
        { date: "2024-01-24", status: "absent",  topic: "Remainder & Factor Theorem" },
        { date: "2024-01-29", status: "present", topic: "Compound Angle Formulae" },
        { date: "2024-01-31", status: "present", topic: "General Solutions" },
        { date: "2024-02-05", status: "present", topic: "Introduction to Calculus" },
        { date: "2024-02-07", status: "present", topic: "Differentiation Rules" },
        { date: "2024-02-12", status: "absent",  topic: "Chain Rule & Product Rule" },
        { date: "2024-02-14", status: "present", topic: "Integration Basics" },
        { date: "2024-02-19", status: "present", topic: "Integration by Substitution" },
        { date: "2024-02-21", status: "present", topic: "Integration by Parts" },
        { date: "2024-02-26", status: "present", topic: "Normal Distribution" },
        { date: "2024-02-28", status: "present", topic: "Binomial Distribution" },
        { date: "2024-03-04", status: "present", topic: "Vectors Introduction" },
        { date: "2024-03-06", status: "present", topic: "Dot Product" },
        { date: "2024-03-11", status: "absent",  topic: "Cross Product" },
        { date: "2024-03-13", status: "present", topic: "3D Geometry" },
        { date: "2024-03-18", status: "present", topic: "Planes in 3D" },
        { date: "2024-03-20", status: "present", topic: "Planes — Equations" },
        { date: "2024-03-25", status: "absent",  topic: "Differential Equations Intro" },
        { date: "2024-03-27", status: "present", topic: "1st Order ODEs" },
        { date: "2024-04-01", status: "present", topic: "Separation of Variables" },
        { date: "2024-04-03", status: "present", topic: "Hypothesis Testing" },
        { date: "2024-04-08", status: "absent",  topic: "Chi-Square Tests" },
        { date: "2024-04-10", status: "present", topic: "Mathematical Induction" },
        { date: "2024-04-15", status: "present", topic: "Sequences & Series" },
        { date: "2024-04-17", status: "present", topic: "Maclaurin Series" },
        { date: "2024-04-22", status: "present", topic: "Mechanics — Kinematics" },
        { date: "2024-04-24", status: "present", topic: "Projectile Motion" },
        { date: "2024-04-29", status: "absent",  topic: "Newton's Laws Applied" },
        { date: "2024-05-01", status: "present", topic: "Momentum & Impulse" },
        { date: "2024-05-06", status: "present", topic: "Circular Motion" },
        { date: "2024-05-08", status: "present", topic: "Complex Numbers Intro" },
        { date: "2024-05-13", status: "present", topic: "Argand Diagram" },
        { date: "2024-05-15", status: "present", topic: "De Moivre's Theorem" },
        { date: "2024-05-20", status: "present", topic: "Complex Loci" },
        { date: "2024-05-22", status: "absent",  topic: "Transformations" }
      ]
    },

    classes: {
      lastWeek: {
        week: "May 6–10, 2024",
        topics: [
          "Complex Numbers — Argand Diagram and modulus-argument form",
          "De Moivre's Theorem — nth roots of complex numbers",
          "Past paper walkthrough: June 2022 Paper 1 Q3, Q5"
        ],
        notes: "Strong session — most students grasped De Moivre after the visual approach on the Argand diagram."
      },
      upcoming: {
        week: "May 13–17, 2024",
        topics: [
          "Complex Loci — circles, half-lines, perpendicular bisectors",
          "Transformations in the complex plane",
          "Timed practice: Past Paper — Term 2 Revision Set"
        ],
        notes: "Please revise Argand Diagrams from this week before the class. Bring your formula booklet."
      }
    }
  }
};
