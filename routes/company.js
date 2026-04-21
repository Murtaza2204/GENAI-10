const express = require("express");
const router = express.Router();
const companies = require("../data/companies.json");

// GET /company/TCS
router.get("/:name", (req, res) => {
  try {
    let name = req.params.name;

    // Normalize input (VERY IMPORTANT)
    name = name.toUpperCase();

    const data = companies[name];

    if (!data) {
      return res.json({
        success: false,
        data: null,
        error: "Company not found"
      });
    }

    return res.json({
      success: true,
      data: data,
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