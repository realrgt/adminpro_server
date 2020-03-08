const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var hospitalSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { collection: "hospitals" }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
