const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    analyzeCSRFile,
    analyzeCompany,
    getCompanies,
    getCompanyById,
    getLeads,
    getRecommendation,
} = require("../controllers/companyController");


// Upload CSV and perform AI/ML analysis
router.post(
    "/companies/analyze",
    upload.single("file"),
    analyzeCompany
);


// Get all analyzed companies
router.get(
    "/companies",
    getCompanies
);


// Get one company
router.get(
    "/companies/:id",
    getCompanyById
);


// Get potential donor leads
router.get(
    "/leads",
    getLeads
);


// Get AI-generated recommendation
router.get(
    "/companies/:id/recommendation",
    getRecommendation
);

router.post(
    "/analyze",
    upload.single("file"),
    analyzeCSRFile
);


module.exports = router;