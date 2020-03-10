const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  img: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: "Hospital",
    required: [true, "Hospital ID is required"]
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);
