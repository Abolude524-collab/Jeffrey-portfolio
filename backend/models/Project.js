import mongoose from "mongoose";

const coverImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      default: "",
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
      min: 0,
    },
    mimeType: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    legacyNumericId: {
      type: Number,
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 300,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: coverImageSchema,
      required: true,
    },
    caseStudyMarkdown: {
      type: String,
      required: true,
      default: "",
    },
    projectUrl: {
      type: String,
      trim: true,
      default: null,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "draft",
      index: true,
    },
    scheduledAt: {
      type: Date,
      default: null,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
