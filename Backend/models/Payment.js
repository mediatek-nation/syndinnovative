const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PaymentSchema = new Schema({
    userEmail:{
        type: String
    },
    AccountHolderName: {
      type: String
    },
    BankName: {
      type: String,
    },
    AccountNo: {
      type: String,
    },
    IfscCode: {
      type: String
    },
    Micr: {
      type: String,
    },
    amount:{
        type:String
    },
    status:{
        type: String  ,
        default:"CREATED"     // UNDER_PROCESSING   COMPLETE_PAYMENT
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

module.exports = Payment = mongoose.model("payment", PaymentSchema);
