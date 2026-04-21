const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const companiesFilePath = path.join(__dirname, '../data/companies.json');

// GET /company - Get all companies
router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(companiesFilePath, 'utf-8');
    const companies = JSON.parse(data);

    return res.status(200).json({
      success: true,
      data: companies,
      error: null,
    });
  } catch (error) {
    console.error('Company route error:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch companies',
    });
  }
});

// GET /company/:id - Get specific company
router.get('/:id', (req, res) => {
  try {
    const data = fs.readFileSync(companiesFilePath, 'utf-8');
    const companies = JSON.parse(data);
    const company = companies.find((c) => c.id === parseInt(req.params.id));

    if (!company) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Company not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
      error: null,
    });
  } catch (error) {
    console.error('Company route error:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch company details',
    });
  }
});

module.exports = router;
