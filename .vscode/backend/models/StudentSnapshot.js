const mongoose = require("mongoose");

const StudentSnapshotSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StudentSnapshot", StudentSnapshotSchema);
