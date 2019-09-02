const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for bonus
const BonusSchema = new Schema({
  creditPoint: {
    type: Number
  },
  bonusCreditPoint: {
    type: Number
  },
  agentLabel: {
    type: Number
  }
});
module.exports = Bonus = mongoose.model("bonus", BonusSchema);
