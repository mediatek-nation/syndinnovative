const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({

    name: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
    },
    mobile: {
      type: Number
    },
    currentCreditPoint: {
      type: Number,
    },
    labels: {
      type: Number
    },
    isAdmin:{
      type:Boolean,
      default:false
    },
    withdrawMoney: [
      {
        withdrawAmount: {
          type: Number
        },
        withdrawDate: {
          type: String
        }
      }
    ],
    profileImage: {
      type: String
    },
    signInType:{
      type: String
    },
    joiningDate: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

module.exports = User = mongoose.model("users", UserSchema);
