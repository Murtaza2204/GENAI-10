const express = require("express");
const router = express.Router();
const companies = require("../data/companies.json");

router.get("/", (req, res) => {
  return res.json({
    success: true,
    data: companies,
    error: null
  });
});

router.get("/:name", (req, res) => {
  try {
    const name = req.params.name.toLowerCase();

    const company = companies.find(
      (c) => c.name.toLowerCase() === name
    );

    if (!company) {
      return res.json({
        success: false,
        data: null,
        error: "Company not found"
      });
    }

    return res.json({
      success: true,
      data: {
        info: {
          name: company.name,
          industry: company.industry,
          difficulty: company.difficulty,
          focusAreas: company.focusAreas
        },
        aptitudeQuestions: company.aptitudeQuestions || []
      },
      error: null
    });
  } catch (err) {
    return res.json({
      success: false,
      data: null,
      error: "Server error"
    });
  }
});

module.exports = router;