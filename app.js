const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// ================= IMPORT ROUTES =================

// Wrap imports in try-catch so server doesn't crash if teammate code is broken
let dailyRoutes, resumeRoutes, interviewRoutes;

try {
  dailyRoutes = require("./routes/daily");
} catch (e) {
  console.log("daily route missing, using fallback");
}

try {
  resumeRoutes = require("./routes/resume");
} catch (e) {
  console.log("resume route missing, using fallback");
}

try {
  interviewRoutes = require("./routes/interview");
} catch (e) {
  console.log("interview route missing, using fallback");
}

// Your route (must work)
const companyRoutes = require("./routes/company");

// ================= MOUNT ROUTES =================

if (dailyRoutes) app.use("/daily", dailyRoutes);
else {
  app.get("/daily", (req, res) => {
    res.json({
      success: true,
      data: {
        aptitude: { question: "Fallback aptitude Q", answer: "A" },
        coding: { question: "Fallback coding Q", answer: "Use loops" }
      },
      error: null
    });
  });
}

if (resumeRoutes) app.use("/resume", resumeRoutes);
else {
  app.post("/resume", (req, res) => {
    res.json({
      success: true,
      data: {
        feedback: "Resume analysis service not available yet"
      },
      error: null
    });
  });
}

if (interviewRoutes) app.use("/interview", interviewRoutes);
else {
  app.post("/interview", (req, res) => {
    res.json({
      success: true,
      data: {
        feedback: "Interview service not available yet",
        score: 5
      },
      error: null
    });
  });
}

// Your feature
app.use("/company", companyRoutes);

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.send("Placement Prep Bot Backend Running 🚀");
});

// ================= START SERVER =================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});