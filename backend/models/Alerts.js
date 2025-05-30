import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
  reason: {
    type: String,
    enum: ["inactividad", "bajo_rendimiento"],
    required: true,
  },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Alert = mongoose.model("Alert", AlertSchema);
export default Alert;
