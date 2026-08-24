const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const csrSchema = new Schema({
    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    financialYear: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    psuNonPsu: {
      type: String,
      required: true,
      trim: true,
      enum: ["PSU", "NON-PSU","Non-PSU"]
    },

    csrState: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    csrDevelopmentSector: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    csrSubDevelopmentSector: {
      type: String,
      trim: true,
      default: ""
    },

    projectAmountSpent: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const CSRRecord = mongoose.model('CSRRRecord', csrSchema);

module.exports = CSRRecord;