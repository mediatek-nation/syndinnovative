const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for customer
const CustomerSchema = new Schema({
  name: {
    type: String
  },
  email:{
    type: String
  },
  address: {
    type: String
  },
  mobile: {
    type: Number
  },
  idProof: {
    idProofType: {
      type: String
    },
    idProofNumber: {
      type: String
    }
  },
  loanTitle: {
    type: String
  },
  loanAmount: {
    type: String
  },
  currentStatus: {
    type: String,
    default: "CREATED" // PENDING_FOR_CIBIL_SCORE   CIBIL_SCORE_COMPLETE    LOAN_APPROVED    FINISH
  },
  notificationStatus:{
    type:Boolean,
    default:false
  },
  agentId: {
    type: String
  },
  agentEmailId: {
    type: String
  },
  applyDate: {
    type: String
  }
});
module.exports = Customer = mongoose.model("customer", CustomerSchema);
