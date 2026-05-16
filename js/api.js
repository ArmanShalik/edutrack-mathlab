/**
 * EduTrack Pro — API Layer
 * Handles all communication with the Google Apps Script backend.
 * Falls back to DEMO_DATA when CONFIG.DEMO_MODE is true.
 */

/**
 * Fetch a student's full data by NIC or Index Number.
 * @param {string} studentId
 * @returns {Promise<object>}
 */
async function fetchStudentData(studentId) {
  if (CONFIG.DEMO_MODE) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = studentId.trim().toUpperCase();
        const demoIds = CONFIG.DEMO_IDS.map((d) => d.toUpperCase());
        if (demoIds.includes(id) || id === CONFIG.DEMO_DATA.student.id.toUpperCase()) {
          resolve(CONFIG.DEMO_DATA);
        } else {
          resolve({ success: false, message: "Student not found." });
        }
      }, 1200);
    });
  }

  // Uses JSONP to avoid CORS issues with Apps Script redirects
  return new Promise((resolve) => {
    const callbackName = "_edutrack_cb_" + Date.now();
    const script = document.createElement("script");
    const timeout = setTimeout(() => {
      cleanup();
      resolve({ success: false, message: "Request timed out. Check your Apps Script URL." });
    }, 12000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = function (data) {
      cleanup();
      resolve(data);
    };

    const url = `${CONFIG.APPS_SCRIPT_URL}?action=getStudent&id=${encodeURIComponent(studentId)}&callback=${callbackName}`;
    script.src = url;
    script.onerror = () => {
      cleanup();
      resolve({ success: false, message: "Could not reach the server. Check your Apps Script URL in config.js." });
    };
    document.head.appendChild(script);
  });
}

/**
 * Retrieve student data stored in sessionStorage.
 * Redirects to login if nothing is found.
 * @returns {object|null}
 */
function getSessionData() {
  try {
    const raw = sessionStorage.getItem("studentData");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear session and redirect to login.
 */
function logout() {
  sessionStorage.removeItem("studentData");
  sessionStorage.removeItem("studentId");
  window.location.href = "index.html";
}
