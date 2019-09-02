const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema for credit points
const CreditPointSchema = new Schema({
  indianRupees: {
    type: String,
    default:"1"
  }
});
module.exports = CreditPoint = mongoose.model("creditPoint", CreditPointSchema);
