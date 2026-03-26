import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Project } from "../models/Project.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio_cms";
const PROJECTS_PATH = path.resolve("./data/projects.json");

function loadLegacyProjects() {
  if (!fs.existsSync(PROJECTS_PATH)) {
    throw new Error(`Legacy file not found: ${PROJECTS_PATH}`);
  }

  const raw = fs.readFileSync(PROJECTS_PATH, "utf-8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("projects.json must contain an array");
  }

  return parsed;
}

async function migrate() {
  await mongoose.connect(MONGODB_URI);

  const legacyProjects = loadLegacyProjects();

  let createdCount = 0;
  let skippedCount = 0;

  for (let index = 0; index < legacyProjects.length; index += 1) {
    const legacy = legacyProjects[index];

    const existing = await Project.findOne({
      $or: [
        { legacyNumericId: legacy.id },
        { title: legacy.title, shortDescription: legacy.description },
      ],
    });

    if (existing) {
      skippedCount += 1;
      continue;
    }

    await Project.create({
      legacyNumericId: Number.isFinite(legacy.id) ? legacy.id : null,
      title: legacy.title,
      shortDescription: legacy.description,
      tags: Array.isArray(legacy.tags) ? legacy.tags : [],
      coverImage: {
        url: legacy.imageURL,
        key: "",
        size: 0,
        mimeType: "",
      },
      caseStudyMarkdown: legacy.caseStudy || "",
      status: "published",
      publishedAt: new Date(),
      displayOrder: index + 1,
      projectUrl: null,
      githubUrl: null,
    });

    createdCount += 1;
  }

  console.log(`Migration complete. Created: ${createdCount}, Skipped: ${skippedCount}`);
  await mongoose.disconnect();
}

migrate().catch(async (error) => {
  console.error("Migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
