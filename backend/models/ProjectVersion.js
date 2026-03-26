import mongoose from "mongoose";

const projectVersionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

projectVersionSchema.index({ project: 1, versionNumber: -1 });

export const ProjectVersion =
  mongoose.models.ProjectVersion ||
  mongoose.model("ProjectVersion", projectVersionSchema);
