import mongoose from "mongoose";

const StudentSnapshotSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const StudentSnapshot = mongoose.model(
  "StudentSnapshot",
  StudentSnapshotSchema
);
export default StudentSnapshot;
