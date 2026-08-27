const Company = require("../models/Company");
const User = require('../models/User');
const axios = require("axios");
const FormData = require("form-data");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

//Handling Errors
const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = { email: '', password: '' };

  //handle errors from login post request
  if(err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  if(err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }   

  //duplicate error code
  if(err.code === 11000) {
    errors.email = 'That email is already registered';
  }

  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    }

    return errors;
}


//Signup Method
module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password
    });

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    });

    res.status(201).json({
      user: user._id
    });

  } catch (err) {
    const errors = handleErrors(err);

    res.status(400).json({
      errors
    });
  }
};

//LogIn Method
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({
      user: user._id,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};


// ============================================================
// 1. ANALYZE UPLOADED DATASET
// POST /csr/companies/analyze
// ============================================================

const analyzeCompany = async (req, res) => {
    try {

        // -----------------------------------------
        // Check uploaded file
        // -----------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a CSR dataset file",
            });
        }


        // -----------------------------------------
        // Prepare file for Python AI/ML service
        // -----------------------------------------

        const formData = new FormData();

        formData.append(
            "file",
            req.file.buffer,
            {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            }
        );


        // -----------------------------------------
        // Send actual file to Python service
        // -----------------------------------------

        const aiResponse = await axios.post(
            "http://localhost:8000/analyze",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }
        );


        const result = aiResponse.data;


        // -----------------------------------------
        // Validate AI response
        // -----------------------------------------

        if (!result || !result.companies) {
            return res.status(502).json({
                success: false,
                message: "Invalid response from AI service",
            });
        }


        // -----------------------------------------
        // Save AI/ML results to MongoDB
        // -----------------------------------------

        const companies = await Company.insertMany(
            result.companies
        );


        // -----------------------------------------
        // Return result
        // -----------------------------------------

        return res.status(201).json({
            success: true,
            message: "Dataset analyzed successfully",

            count: companies.length,

            companies,
        });

    } catch (error) {

        console.error(
            "Analysis Error:",
            error.message
        );


        // AI service error
        if (error.response) {

            return res.status(502).json({
                success: false,
                message:
                    "AI/ML service failed to analyze the dataset",

                error: error.response.data,
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Failed to analyze CSR dataset",

            error: error.message,
        });
    }
};


// ============================================================
// 2. GET ALL COMPANIES
// GET /csr/companies
// ============================================================

const getCompanies = async (req, res) => {
    try {

        const {
            sector,
            state,
            potential
        } = req.query;


        const filter = {};


        // Filter by development sector
        if (sector) {

            filter.developmentSectors = {
                $regex: sector,
                $options: "i",
            };
        }


        // Filter by state
        if (state) {

            filter.csrStates = {
                $regex: state,
                $options: "i",
            };
        }


        // Filter by donor potential
        if (potential) {

            filter.donorPotential =
                potential.toUpperCase();
        }


        const companies = await Company.find(filter)
            .sort({
                donorScore: -1,
            });


        return res.status(200).json({
            success: true,

            count: companies.length,

            companies,
        });

    } catch (error) {

        console.error(
            "Get Companies Error:",
            error.message
        );

        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch companies",

            error: error.message,
        });
    }
};


// ============================================================
// 3. GET COMPANY BY ID
// GET /csr/companies/:id
// ============================================================

const getCompanyById = async (req, res) => {
    try {

        const company =
            await Company.findById(
                req.params.id
            );


        if (!company) {

            return res.status(404).json({
                success: false,

                message:
                    "Company not found",
            });
        }


        return res.status(200).json({
            success: true,

            company,
        });

    } catch (error) {

        console.error(
            "Get Company Error:",
            error.message
        );


        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch company",

            error: error.message,
        });
    }
};


// ============================================================
// 4. GET DONOR LEADS
// GET /csr/leads
// ============================================================

const getLeads = async (req, res) => {
    try {

        const {
            potential = "HIGH"
        } = req.query;


        const leads = await Company.find({
            donorPotential:
                potential.toUpperCase(),
        })
        .sort({
            donorScore: -1,
        });


        return res.status(200).json({
            success: true,

            count: leads.length,

            leads,
        });

    } catch (error) {

        console.error(
            "Get Leads Error:",
            error.message
        );


        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch donor leads",

            error: error.message,
        });
    }
};


// ============================================================
// 5. GET AI RECOMMENDATION
// GET /csr/companies/:id/recommendation
// ============================================================

const getRecommendation = async (req, res) => {
    try {

        const company =
            await Company.findById(
                req.params.id
            );


        if (!company) {

            return res.status(404).json({
                success: false,

                message:
                    "Company not found",
            });
        }


        if (
            company.donorPotential ===
            "NOT_ANALYZED"
        ) {

            return res.status(400).json({
                success: false,

                message:
                    "Company has not been analyzed yet",
            });
        }


        return res.status(200).json({
            success: true,

            companyName:
                company.companyName,

            donorScore:
                company.donorScore,

            donorPotential:
                company.donorPotential,

            analysisReasons:
                company.analysisReasons,

            recommendedActions:
                company.recommendedActions,

            lastAnalyzedAt:
                company.lastAnalyzedAt,
        });

    } catch (error) {

        console.error(
            "Recommendation Error:",
            error.message
        );


        return res.status(500).json({
            success: false,

            message:
                "Failed to fetch recommendation",

            error: error.message,
        });
    }
};

const analyzeCSRFile = async (req, res) => {
    try {
        console.log("REQ.FILE:", req.file);
        // 1. Check whether a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "CSR dataset file is required"
            });
        }

        console.log("Received file:", req.file.originalname);

        // 2. Create multipart form data
        const formData = new FormData();

        formData.append(
            "file",
            req.file.buffer,
            {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            }
        );

        console.log("Sending file to ML service...");

        // 3. Send file to FastAPI
        const mlResponse = await axios.post(
            "http://127.0.0.1:8000/analyze",
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 120000
            }
        );

        console.log("ML service response received");

        // 4. Get ML result
        const result = mlResponse.data;

        // 5. Validate ML response
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: "ML analysis failed"
            });
        }

        // 6. Get analyzed companies
        const companies = result.topCompanies || [];

        // 7. Return result to frontend
        return res.status(200).json({
            success: true,
            fileName: result.fileName,
            totalCompanies: result.totalCompanies,
            companies: companies
        });

    } catch (error) {

        console.error("CSR Analysis Error:");

        if (error.response) {
            console.error(
                "ML service status:",
                error.response.status
            );

            console.error(
                "ML service response:",
                error.response.data
            );
        } else {
            console.error(error.message);
        }

        return res.status(500).json({
            success: false,
            message: "Failed to analyze CSR dataset",
            error:
                error.response?.data?.detail ||
                error.message
        });
    }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
  });

  res.status(200).json({
    message: "Logout successful",
  });
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    handleErrors,
    analyzeCompany,
    getCompanies,
    getCompanyById,
    getLeads,
    getRecommendation,
    analyzeCSRFile
};