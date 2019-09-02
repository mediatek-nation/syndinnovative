const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for Product
const ProductSchema = new Schema({
  productTitle: {
    type: String
  },
  productDescription: {
    overview: {
      type: String
    },
    purposeOfLoan: {
      type: String
    },
    keyFeatures: [
      {
        type: String
      }
    ],
    processingFee: {
      type: String
    },
    preClosureCharges: {
      type: String
    },
    partPaymentCharges: {
      type: String
    },
    otherCharges: {
      type: String
    },
    specialSchemes: [
      {
        type: String
      }
    ],
    DocumentRequired: [
      {
        type: String
      }
    ]
  },
  productCreditPoint: {
    type: Number
  },
  date:{
    type:Date,
    default:Date.now
  }
});
module.exports = Product = mongoose.model("Product", ProductSchema);
