const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    // Company identification
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // Classification
    companyType: {
      type: String,
      enum: ["PSU", "Non-PSU", "Unknown"],
      default: "Unknown",
    },

    // Years in which company appears in CSR data
    financialYears: {
      type: [String],
      default: [],
    },

    // States where company has executed CSR projects
    csrStates: {
      type: [String],
      default: [],
    },

    // Major CSR development sectors
    developmentSectors: {
      type: [String],
      default: [],
    },

    // More specific CSR areas
    subDevelopmentSectors: {
      type: [String],
      default: [],
    },

    // Total historical CSR spending found in dataset
    totalCsrAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Number of CSR projects/records
    totalProjects: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Number of WASH-related projects
    washProjects: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Historical spending specifically related to WASH
    washAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // AI/ML output
    donorScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    donorPotential: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW", "NOT_ANALYZED"],
      default: "NOT_ANALYZED",
    },

    // Explainability
    analysisReasons: {
      type: [String],
      default: [],
    },

    // AI-generated actionable suggestions
    recommendedActions: {
      type: [String],
      default: [],
    },

    // Track when this company was analyzed
    lastAnalyzedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;