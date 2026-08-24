const express = require("express");

const {
    getCSRRecords,
    getCSRRecordById,
    createCSRRecord,
    bulkCreateCSRRecords,
    updateCSRRecord,
    deleteCSRRecord,
    getDashboardStats,
    getCompanyAnalysis,
    getTopDonors,
    getCSRLeads
} = require("../controllers/csrController");

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.get("/top-donors", getTopDonors);
router.get("/leads", getCSRLeads);
router.get("/company/:company", getCompanyAnalysis);

router.get("/", getCSRRecords);
router.get("/:id", getCSRRecordById);

router.post("/", createCSRRecord);
router.post("/bulk", bulkCreateCSRRecords);
router.put("/:id", updateCSRRecord);
router.delete("/:id", deleteCSRRecord);

module.exports = router;