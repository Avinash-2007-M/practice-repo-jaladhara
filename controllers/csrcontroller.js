const CSRRecord = require("../models/csr");

// ======================================================
// 1. GET ALL CSR RECORDS
// GET /api/csr
// ======================================================

const getCSRRecords = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            companyName,
            financialYear,
            csrState,
            sector
        } = req.query;

        const filter = {};

        // Company filter
        if (companyName) {
            filter.companyName = {
                $regex: companyName,
                $options: "i"
            };
        }

        // Financial year filter
        if (financialYear) {
            filter.financialYear = financialYear;
        }

        // State filter
        if (csrState) {
            filter.csrState = {
                $regex: csrState,
                $options: "i"
            };
        }

        // CSR sector filter
        if (sector) {
            filter.csrDevelopmentSector = {
                $regex: sector,
                $options: "i"
            };
        }

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

        const skip = (pageNumber - 1) * limitNumber;

        const records = await CSRRecord
            .find(filter)
            .sort({ financialYear: -1 })
            .skip(skip)
            .limit(limitNumber);

        const totalRecords = await CSRRecord.countDocuments(filter);

        res.status(200).json({
            success: true,
            totalRecords,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalRecords / limitNumber),
            limit: limitNumber,
            records
        });

    } catch (error) {
        console.error("getCSRRecords error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch CSR records",
            error: error.message
        });
    }
};


// ======================================================
// 2. GET ONE CSR RECORD
// GET /api/csr/:id
// ======================================================

const getCSRRecordById = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await CSRRecord.findById(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "CSR record not found"
            });
        }

        res.status(200).json({
            success: true,
            record
        });

    } catch (error) {
        console.error("getCSRRecordById error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch CSR record",
            error: error.message
        });
    }
};


// ======================================================
// 3. CREATE CSR RECORD
// POST /api/csr
// POST /api/csr/bulk (for bulk upload)
// ======================================================

const createCSRRecord = async (req, res) => {
    try {
        const {
            companyName,
            financialYear,
            psuNonPsu,
            csrState,
            csrDevelopmentSector,
            csrSubDevelopmentSector,
            projectAmountSpent
        } = req.body;

        // Basic validation
        if (
            !companyName ||
            !financialYear ||
            !psuNonPsu ||
            !csrState ||
            !csrDevelopmentSector
        ) {
            return res.status(400).json({
                success: false,
                message: "Required CSR fields are missing"
            });
        }

        const record = await CSRRecord.create({
            companyName,
            financialYear,
            psuNonPsu,
            csrState,
            csrDevelopmentSector,
            csrSubDevelopmentSector,
            projectAmountSpent
        });

        res.status(201).json({
            success: true,
            message: "CSR record created successfully",
            record
        });

    } catch (error) {
        console.error("createCSRRecord error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to create CSR record",
            error: error.message
        });
    }
};

const bulkCreateCSRRecords = async (req, res) => {
    try {
        const records = req.body;

        if (!Array.isArray(records)) {
            return res.status(400).json({
                success: false,
                message: "Request body must be an array of CSR records"
            });
        }

        if (records.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No records provided"
            });
        }

        const insertedRecords = await CSRRecord.insertMany(records);

        res.status(201).json({
            success: true,
            message: "CSR records inserted successfully",
            count: insertedRecords.length
        });

    } catch (error) {
        console.error("bulkCreateCSRRecords error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to insert CSR records",
            error: error.message
        });
    }
};

// ======================================================
// 4. UPDATE CSR RECORD
// PUT /api/csr/:id
// ======================================================

const updateCSRRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const allowedFields = [
            "companyName",
            "financialYear",
            "psuNonPsu",
            "csrState",
            "csrDevelopmentSector",
            "csrSubDevelopmentSector",
            "projectAmountSpent"
        ];

        const updateData = {};

        // Only update allowed fields
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        const record = await CSRRecord.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "CSR record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "CSR record updated successfully",
            record
        });

    } catch (error) {
        console.error("updateCSRRecord error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to update CSR record",
            error: error.message
        });
    }
};


// ======================================================
// 5. DELETE CSR RECORD
// DELETE /api/csr/:id
// ======================================================

const deleteCSRRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await CSRRecord.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "CSR record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "CSR record deleted successfully"
        });

    } catch (error) {
        console.error("deleteCSRRecord error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete CSR record",
            error: error.message
        });
    }
};


// ======================================================
// 6. GET DASHBOARD STATISTICS
// GET /api/csr/dashboard
// ======================================================

const getDashboardStats = async (req, res) => {
    try {

        // Total CSR records
        const totalRecords = await CSRRecord.countDocuments();

        // Unique companies
        const companies = await CSRRecord.distinct("companyName");

        // Water-related records
        const waterRecords = await CSRRecord.countDocuments({
            $or: [
                {
                    csrDevelopmentSector: {
                        $regex: "water",
                        $options: "i"
                    }
                },
                {
                    csrSubDevelopmentSector: {
                        $regex: "water",
                        $options: "i"
                    }
                }
            ]
        });

        // Sanitation-related records
        const sanitationRecords = await CSRRecord.countDocuments({
            $or: [
                {
                    csrDevelopmentSector: {
                        $regex: "sanitation",
                        $options: "i"
                    }
                },
                {
                    csrSubDevelopmentSector: {
                        $regex: "sanitation",
                        $options: "i"
                    }
                }
            ]
        });

        // Hygiene-related records
        const hygieneRecords = await CSRRecord.countDocuments({
            $or: [
                {
                    csrDevelopmentSector: {
                        $regex: "hygiene",
                        $options: "i"
                    }
                },
                {
                    csrSubDevelopmentSector: {
                        $regex: "hygiene",
                        $options: "i"
                    }
                }
            ]
        });

        // Total CSR amount
        const spendingResult = await CSRRecord.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$projectAmountSpent"
                    }
                }
            }
        ]);

        const totalCSRSpent =
            spendingResult.length > 0
                ? spendingResult[0].totalAmount
                : 0;

        res.status(200).json({
            success: true,

            statistics: {
                totalRecords,
                totalCompanies: companies.length,
                waterRecords,
                sanitationRecords,
                hygieneRecords,
                totalCSRSpent
            }
        });

    } catch (error) {
        console.error("getDashboardStats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message
        });
    }
};


// ======================================================
// 7. COMPANY-WISE CSR ANALYSIS
// GET /api/csr/company/:company
// ======================================================

const getCompanyAnalysis = async (req, res) => {
    try {
        const company = req.params.company;

        const records = await CSRRecord.find({
            companyName: {
                $regex: `^${company}$`,
                $options: "i"
            }
        });

        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        const companyName = records[0].companyName;

        // Total projects
        const totalProjects = records.length;

        // Water records
        const waterRecords = records.filter((record) => {
            const sector =
                `${record.csrDevelopmentSector} ${record.csrSubDevelopmentSector}`
                    .toLowerCase();

            return sector.includes("water");
        });

        // Sanitation records
        const sanitationRecords = records.filter((record) => {
            const sector =
                `${record.csrDevelopmentSector} ${record.csrSubDevelopmentSector}`
                    .toLowerCase();

            return sector.includes("sanitation");
        });

        // Hygiene records
        const hygieneRecords = records.filter((record) => {
            const sector =
                `${record.csrDevelopmentSector} ${record.csrSubDevelopmentSector}`
                    .toLowerCase();

            return sector.includes("hygiene");
        });

        // Total spending
        const totalAmountSpent = records.reduce(
            (sum, record) =>
                sum + (Number(record.projectAmountSpent) || 0),
            0
        );

        // Water spending
        const waterAmountSpent = waterRecords.reduce(
            (sum, record) =>
                sum + (Number(record.projectAmountSpent) || 0),
            0
        );

        // Sanitation spending
        const sanitationAmountSpent = sanitationRecords.reduce(
            (sum, record) =>
                sum + (Number(record.projectAmountSpent) || 0),
            0
        );

        // Get years
        const financialYears = [
            ...new Set(records.map(record => record.financialYear))
        ];

        res.status(200).json({
            success: true,

            company: {
                companyName,

                totalProjects,

                waterProjects: waterRecords.length,

                sanitationProjects:
                    sanitationRecords.length,

                hygieneProjects:
                    hygieneRecords.length,

                totalAmountSpent,

                waterAmountSpent,

                sanitationAmountSpent,

                activeFinancialYears:
                    financialYears.length,

                financialYears
            }
        });

    } catch (error) {
        console.error("getCompanyAnalysis error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to analyze company CSR",
            error: error.message
        });
    }
};


// ======================================================
// 8. GET TOP DONOR PROSPECTS
// GET /api/csr/top-donors
//
// Query:
// ?limit=10
// ======================================================

const getTopDonors = async (req, res) => {
    try {
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        // Group records by company
        const companies = await CSRRecord.aggregate([
            {
                $group: {
                    _id: "$companyName",

                    totalProjects: {
                        $sum: 1
                    },

                    totalAmountSpent: {
                        $sum: "$projectAmountSpent"
                    },

                    records: {
                        $push: {
                            sector: "$csrDevelopmentSector",
                            subSector: "$csrSubDevelopmentSector",
                            year: "$financialYear",
                            amount: "$projectAmountSpent"
                        }
                    }
                }
            }
        ]);

        const donorResults = companies.map((company) => {

            const records = company.records;

            // Find water-related projects
            const waterProjects = records.filter((record) => {

                const text =
                    `${record.sector} ${record.subSector}`
                        .toLowerCase();

                return text.includes("water");
            });

            // Find sanitation-related projects
            const sanitationProjects = records.filter((record) => {

                const text =
                    `${record.sector} ${record.subSector}`
                        .toLowerCase();

                return text.includes("sanitation");
            });

            // Find hygiene-related projects
            const hygieneProjects = records.filter((record) => {

                const text =
                    `${record.sector} ${record.subSector}`
                        .toLowerCase();

                return text.includes("hygiene");
            });

            // -------------------------------
            // CSR SCORE CALCULATION
            // -------------------------------

            // Water relevance: 30
            const waterScore = Math.min(
                (waterProjects.length / 10) * 30,
                30
            );

            // Sanitation relevance: 25
            const sanitationScore = Math.min(
                (sanitationProjects.length / 10) * 25,
                25
            );

            // CSR activity frequency: 15
            const activityScore = Math.min(
                (company.totalProjects / 20) * 15,
                15
            );

            // CSR spending: 15
            const spendingScore = Math.min(
                (company.totalAmountSpent / 100) * 15,
                15
            );

            // Recent activity: 15
            //
            // Simple approach:
            // if FY 2024-25 exists → full score
            // FY 2023-24 → slightly lower
            // etc.

            let recentActivityScore = 0;

            const years = records.map(
                record => record.year
            );

            if (years.includes("FY 2024-25")) {
                recentActivityScore = 15;
            }
            else if (years.includes("FY 2023-24")) {
                recentActivityScore = 12;
            }
            else if (years.includes("FY 2022-23")) {
                recentActivityScore = 9;
            }
            else if (years.includes("FY 2021-22")) {
                recentActivityScore = 6;
            }
            else {
                recentActivityScore = 3;
            }

            const donorScore = Math.round(
                waterScore +
                sanitationScore +
                activityScore +
                spendingScore +
                recentActivityScore
            );

            let priority;

            if (donorScore >= 80) {
                priority = "HIGH";
            }
            else if (donorScore >= 60) {
                priority = "MEDIUM";
            }
            else {
                priority = "LOW";
            }

            return {
                companyName: company._id,

                totalProjects:
                    company.totalProjects,

                waterProjects:
                    waterProjects.length,

                sanitationProjects:
                    sanitationProjects.length,

                hygieneProjects:
                    hygieneProjects.length,

                totalAmountSpent:
                    company.totalAmountSpent,

                donorScore,

                priority
            };
        });

        // Sort highest score first
        donorResults.sort(
            (a, b) => b.donorScore - a.donorScore
        );

        // Return top companies
        const topDonors =
            donorResults.slice(0, limit);

        res.status(200).json({
            success: true,
            count: topDonors.length,
            donors: topDonors
        });

    } catch (error) {
        console.error("getTopDonors error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to calculate top donors",
            error: error.message
        });
    }
};


// ======================================================
// 9. GET CSR LEADS
// GET /api/csr/leads
//
// Query:
// ?limit=10
// ======================================================

const getCSRLeads = async (req, res) => {
    try {
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            100
        );

        // Reuse the donor analysis logic
        const companies = await CSRRecord.aggregate([
            {
                $group: {
                    _id: "$companyName",

                    totalProjects: {
                        $sum: 1
                    },

                    totalAmountSpent: {
                        $sum: "$projectAmountSpent"
                    },

                    records: {
                        $push: {
                            sector: "$csrDevelopmentSector",
                            subSector: "$csrSubDevelopmentSector",
                            year: "$financialYear"
                        }
                    }
                }
            }
        ]);

        const leads = companies.map((company) => {

            const records = company.records;

            const waterProjects = records.filter(record => {

                const text =
                    `${record.sector} ${record.subSector}`
                        .toLowerCase();

                return text.includes("water");
            });

            const sanitationProjects = records.filter(record => {

                const text =
                    `${record.sector} ${record.subSector}`
                        .toLowerCase();

                return text.includes("sanitation");
            });

            const hygieneProjects = records.filter(record => {

                const text =
                    `${record.sector} ${record.subSector}`
                        .toLowerCase();

                return text.includes("hygiene");
            });

            // -------------------------------
            // SCORE
            // -------------------------------

            const waterScore = Math.min(
                (waterProjects.length / 10) * 30,
                30
            );

            const sanitationScore = Math.min(
                (sanitationProjects.length / 10) * 25,
                25
            );

            const activityScore = Math.min(
                (company.totalProjects / 20) * 15,
                15
            );

            const spendingScore = Math.min(
                (company.totalAmountSpent / 100) * 15,
                15
            );

            let recentActivityScore = 0;

            const years = records.map(
                record => record.year
            );

            if (years.includes("FY 2024-25")) {
                recentActivityScore = 15;
            }
            else if (years.includes("FY 2023-24")) {
                recentActivityScore = 12;
            }
            else if (years.includes("FY 2022-23")) {
                recentActivityScore = 9;
            }
            else if (years.includes("FY 2021-22")) {
                recentActivityScore = 6;
            }
            else {
                recentActivityScore = 3;
            }

            const donorScore = Math.round(
                waterScore +
                sanitationScore +
                activityScore +
                spendingScore +
                recentActivityScore
            );

            // Only create leads for meaningful prospects
            if (donorScore < 60) {
                return null;
            }

            let priority;

            if (donorScore >= 80) {
                priority = "HIGH";
            }
            else {
                priority = "MEDIUM";
            }

            // -------------------------------
            // Reasons
            // -------------------------------

            const reasons = [];

            if (waterProjects.length > 0) {
                reasons.push(
                    `Has ${waterProjects.length} water-related CSR projects`
                );
            }

            if (sanitationProjects.length > 0) {
                reasons.push(
                    `Has ${sanitationProjects.length} sanitation-related CSR projects`
                );
            }

            if (hygieneProjects.length > 0) {
                reasons.push(
                    `Has ${hygieneProjects.length} hygiene-related CSR projects`
                );
            }

            if (
                years.includes("FY 2024-25") ||
                years.includes("FY 2023-24")
            ) {
                reasons.push(
                    "Has recent CSR activity"
                );
            }

            // -------------------------------
            // Recommendation
            // -------------------------------

            let recommendedAction;

            if (waterProjects.length > sanitationProjects.length) {

                recommendedAction =
                    "Approach the company with a drinking water project proposal";

            }
            else if (
                sanitationProjects.length > waterProjects.length
            ) {

                recommendedAction =
                    "Approach the company with a sanitation and hygiene project proposal";

            }
            else {

                recommendedAction =
                    "Approach the company with an integrated water and sanitation proposal";
            }

            return {
                companyName: company._id,

                donorScore,

                priority,

                totalProjects:
                    company.totalProjects,

                totalAmountSpent:
                    company.totalAmountSpent,

                waterProjects:
                    waterProjects.length,

                sanitationProjects:
                    sanitationProjects.length,

                hygieneProjects:
                    hygieneProjects.length,

                reasons,

                recommendedAction
            };
        });

        const validLeads = leads
            .filter(lead => lead !== null)
            .sort(
                (a, b) =>
                    b.donorScore - a.donorScore
            )
            .slice(0, limit);

        res.status(200).json({
            success: true,
            count: validLeads.length,
            leads: validLeads
        });

    } catch (error) {
        console.error("getCSRLeads error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate CSR leads",
            error: error.message
        });
    }
};


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
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
};