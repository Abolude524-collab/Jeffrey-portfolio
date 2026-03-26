import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { User } from "./models/User.js";
import { Message } from "./models/Message.js";
import { Project } from "./models/Project.js";
import { ProjectVersion } from "./models/ProjectVersion.js";
import { toPublicProject, toAdminProject } from "./utils/projectSerializers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.set("trust proxy", 1);

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio_cms";
const JWT_SECRET = process.env.JWT_SECRET || "dev-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "owner").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

const AWS_REGION = process.env.AWS_REGION || "";
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || "";
const AWS_S3_PUBLIC_BASE_URL = process.env.AWS_S3_PUBLIC_BASE_URL || "";

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

const hasAwsCredentials =
  Boolean(process.env.AWS_ACCESS_KEY_ID) &&
  Boolean(process.env.AWS_SECRET_ACCESS_KEY);

const s3Client = AWS_REGION && AWS_S3_BUCKET
  ? new S3Client(
      hasAwsCredentials
        ? {
            region: AWS_REGION,
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }
        : { region: AWS_REGION }
    )
  : null;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, try again later." },
});

function sanitizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  const unique = new Set();
  for (const rawTag of tags) {
    const tag = sanitizeString(rawTag);
    if (!tag) continue;
    unique.add(tag);
  }
  return Array.from(unique);
}

function isValidHttpUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateProjectPayload(body, { allowPartial = false } = {}) {
  const payload = {};

  const title = sanitizeString(body.title);
  if (!allowPartial || body.title !== undefined) {
    if (!title || title.length < 3) {
      return { error: "Title must be at least 3 characters." };
    }
    payload.title = title;
  }

  const shortDescription = sanitizeString(
    body.shortDescription ?? body.description
  );
  if (!allowPartial || body.shortDescription !== undefined || body.description !== undefined) {
    if (!shortDescription || shortDescription.length < 8) {
      return { error: "Short description must be at least 8 characters." };
    }
    payload.shortDescription = shortDescription;
  }

  if (!allowPartial || body.tags !== undefined) {
    const tags = normalizeTags(body.tags);
    if (tags.length === 0) {
      return { error: "At least one tag is required." };
    }
    payload.tags = tags;
  }

  const caseStudyMarkdown = sanitizeString(
    body.caseStudyMarkdown ?? body.caseStudy
  );
  if (!allowPartial || body.caseStudyMarkdown !== undefined || body.caseStudy !== undefined) {
    if (!caseStudyMarkdown) {
      return { error: "Case study markdown is required." };
    }
    payload.caseStudyMarkdown = caseStudyMarkdown;
  }

  if (!allowPartial || body.coverImage !== undefined || body.imageURL !== undefined) {
    const hasCoverObject =
      body.coverImage && typeof body.coverImage === "object" && body.coverImage.url;
    const coverUrl = sanitizeString(body.coverImage?.url || body.imageURL || "");
    if (!coverUrl || !isValidHttpUrl(coverUrl)) {
      return { error: "A valid cover image URL is required." };
    }
    payload.coverImage = {
      url: coverUrl,
      key: sanitizeString(body.coverImage?.key || ""),
      size: Number(body.coverImage?.size || 0),
      mimeType: sanitizeString(body.coverImage?.mimeType || ""),
    };

    if (!hasCoverObject && body.imageURL) {
      payload.coverImage.key = "";
      payload.coverImage.size = 0;
      payload.coverImage.mimeType = "";
    }
  }

  if (!allowPartial || body.projectUrl !== undefined) {
    if (body.projectUrl === null || body.projectUrl === "") {
      payload.projectUrl = null;
    } else {
      const projectUrl = sanitizeString(body.projectUrl);
      if (!isValidHttpUrl(projectUrl)) {
        return { error: "Project URL must be a valid http or https URL." };
      }
      payload.projectUrl = projectUrl;
    }
  }

  if (!allowPartial || body.githubUrl !== undefined) {
    if (body.githubUrl === null || body.githubUrl === "") {
      payload.githubUrl = null;
    } else {
      const githubUrl = sanitizeString(body.githubUrl);
      if (!isValidHttpUrl(githubUrl)) {
        return { error: "GitHub URL must be a valid http or https URL." };
      }
      payload.githubUrl = githubUrl;
    }
  }

  if (!allowPartial || body.displayOrder !== undefined) {
    const displayOrder = Number(body.displayOrder ?? 0);
    if (Number.isNaN(displayOrder)) {
      return { error: "Display order must be a number." };
    }
    payload.displayOrder = displayOrder;
  }

  if (!allowPartial || body.status !== undefined) {
    const status = sanitizeString(body.status || "draft");
    const validStatuses = ["draft", "published", "scheduled", "archived"];
    if (!validStatuses.includes(status)) {
      return { error: "Invalid project status." };
    }
    payload.status = status;
  }

  if (!allowPartial || body.scheduledAt !== undefined) {
    if (!body.scheduledAt) {
      payload.scheduledAt = null;
    } else {
      const scheduledDate = new Date(body.scheduledAt);
      if (Number.isNaN(scheduledDate.getTime())) {
        return { error: "Scheduled date must be a valid ISO datetime." };
      }
      payload.scheduledAt = scheduledDate;
    }
  }

  return { payload };
}

function createProjectSnapshot(project) {
  return {
    title: project.title,
    shortDescription: project.shortDescription,
    tags: [...project.tags],
    coverImage: {
      url: project.coverImage.url,
      key: project.coverImage.key,
      size: project.coverImage.size,
      mimeType: project.coverImage.mimeType,
    },
    caseStudyMarkdown: project.caseStudyMarkdown,
    projectUrl: project.projectUrl || null,
    githubUrl: project.githubUrl || null,
    status: project.status,
    scheduledAt: project.scheduledAt,
    publishedAt: project.publishedAt,
    displayOrder: project.displayOrder,
  };
}

async function saveProjectVersion(project, userId, reason) {
  const latest = await ProjectVersion.findOne({ project: project._id })
    .sort({ versionNumber: -1 })
    .lean();
  const nextVersion = latest ? latest.versionNumber + 1 : 1;

  await ProjectVersion.create({
    project: project._id,
    versionNumber: nextVersion,
    reason,
    snapshot: createProjectSnapshot(project),
    changedBy: userId || null,
  });
}

async function promoteScheduledProjects() {
  const now = new Date();
  await Project.updateMany(
    { status: "scheduled", scheduledAt: { $lte: now } },
    {
      $set: {
        status: "published",
        publishedAt: now,
        updatedAt: now,
      },
      $unset: { scheduledAt: 1 },
    }
  );
}

async function ensureAdminUser() {
  const existingUser = await User.findOne({ username: ADMIN_USERNAME });
  if (existingUser) {
    return existingUser;
  }

  let passwordHash = sanitizeString(ADMIN_PASSWORD_HASH);

  if (!passwordHash) {
    if (!ADMIN_PASSWORD) {
      throw new Error(
        "Admin credentials missing. Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH in backend env."
      );
    }
    passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);
  }

  const admin = await User.create({
    username: ADMIN_USERNAME,
    passwordHash,
    role: "owner",
  });

  return admin;
}

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = {
      userId: decoded.sub,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

function getS3PublicUrl(key) {
  if (AWS_S3_PUBLIC_BASE_URL) {
    return `${AWS_S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }

  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

app.get("/api/health", (req, res) => {
  res.json({ success: true });
});

app.get("/api/projects", async (req, res) => {
  try {
    await promoteScheduledProjects();

    const projects = await Project.find({ status: "published" })
      .sort({ displayOrder: 1, publishedAt: -1, createdAt: -1 })
      .lean();

    res.json(projects.map(toPublicProject));
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const name = sanitizeString(req.body.name);
    const email = sanitizeString(req.body.email).toLowerCase();
    const phone = sanitizeString(req.body.phone);
    const message = sanitizeString(req.body.message);

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    if (phone) {
      const phoneRegex = /^[+()\-\s0-9]{7,20}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Invalid phone number." });
      }
    }

    await Message.create({
      name,
      email,
      phone: phone || null,
      message,
      date: new Date(),
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});

app.post("/api/admin/login", loginLimiter, async (req, res) => {
  try {
    const username = sanitizeString(req.body.username).toLowerCase();
    const password = sanitizeString(req.body.password);

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/admin/me", requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.admin.userId,
      username: req.admin.username,
      role: req.admin.role,
    },
  });
});

app.post("/api/admin/logout", requireAdminAuth, (req, res) => {
  res.json({ success: true });
});

app.get("/api/messages", requireAdminAuth, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ date: -1 }).lean();

    res.json(
      messages.map((messageDoc) => ({
        id: messageDoc._id.toString(),
        name: messageDoc.name,
        email: messageDoc.email,
        phone: messageDoc.phone || undefined,
        message: messageDoc.message,
        date: messageDoc.date,
      }))
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/api/admin/projects", requireAdminAuth, async (req, res) => {
  try {
    await promoteScheduledProjects();
    const projects = await Project.find({})
      .sort({ displayOrder: 1, updatedAt: -1 })
      .lean();

    res.json(projects.map(toAdminProject));
  } catch (error) {
    console.error("Error fetching admin projects:", error);
    res.status(500).json({ error: "Failed to fetch admin projects" });
  }
});

app.get("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(toAdminProject(project));
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

app.post("/api/admin/projects", requireAdminAuth, async (req, res) => {
  try {
    const { payload, error } = validateProjectPayload(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const now = new Date();

    if (payload.status === "scheduled" && !payload.scheduledAt) {
      return res
        .status(400)
        .json({ error: "Scheduled projects require a scheduledAt value." });
    }

    if (payload.status === "published") {
      payload.publishedAt = now;
      payload.scheduledAt = null;
    }

    if (payload.status !== "scheduled") {
      payload.scheduledAt = null;
    }

    const project = await Project.create({
      ...payload,
      createdBy: req.admin.userId,
      updatedBy: req.admin.userId,
    });

    await saveProjectVersion(project, req.admin.userId, "Project created");

    res.status(201).json({ success: true, project: toAdminProject(project) });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

app.put("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { payload, error } = validateProjectPayload(req.body, {
      allowPartial: true,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    await saveProjectVersion(project, req.admin.userId, "Before project update");

    Object.assign(project, payload);
    project.updatedBy = req.admin.userId;

    if (project.status === "published" && !project.publishedAt) {
      project.publishedAt = new Date();
    }

    if (project.status !== "scheduled") {
      project.scheduledAt = null;
    }

    await project.save();

    res.json({ success: true, project: toAdminProject(project) });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

app.delete("/api/admin/projects/:id", requireAdminAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await saveProjectVersion(project, req.admin.userId, "Before project deletion");
    await ProjectVersion.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

app.get(
  "/api/admin/projects/:id/versions",
  requireAdminAuth,
  async (req, res) => {
    try {
      const versions = await ProjectVersion.find({ project: req.params.id })
        .sort({ versionNumber: -1 })
        .lean();

      res.json(
        versions.map((version) => ({
          id: version._id.toString(),
          versionNumber: version.versionNumber,
          reason: version.reason,
          changedBy: version.changedBy,
          createdAt: version.createdAt,
        }))
      );
    } catch (error) {
      console.error("Error fetching project versions:", error);
      res.status(500).json({ error: "Failed to fetch versions" });
    }
  }
);

app.post(
  "/api/admin/projects/:id/publish",
  requireAdminAuth,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      await saveProjectVersion(project, req.admin.userId, "Before publish now");

      project.status = "published";
      project.publishedAt = new Date();
      project.scheduledAt = null;
      project.updatedBy = req.admin.userId;
      await project.save();

      res.json({ success: true, project: toAdminProject(project) });
    } catch (error) {
      console.error("Error publishing project:", error);
      res.status(500).json({ error: "Failed to publish project" });
    }
  }
);

app.post(
  "/api/admin/projects/:id/schedule",
  requireAdminAuth,
  async (req, res) => {
    try {
      const scheduledAt = new Date(req.body.scheduledAt);
      if (Number.isNaN(scheduledAt.getTime())) {
        return res.status(400).json({ error: "Invalid scheduledAt value." });
      }

      if (scheduledAt <= new Date()) {
        return res
          .status(400)
          .json({ error: "scheduledAt must be in the future (UTC)." });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      await saveProjectVersion(project, req.admin.userId, "Before schedule publish");

      project.status = "scheduled";
      project.scheduledAt = scheduledAt;
      project.updatedBy = req.admin.userId;
      await project.save();

      res.json({ success: true, project: toAdminProject(project) });
    } catch (error) {
      console.error("Error scheduling project:", error);
      res.status(500).json({ error: "Failed to schedule project" });
    }
  }
);

app.post(
  "/api/admin/projects/:id/unschedule",
  requireAdminAuth,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      await saveProjectVersion(project, req.admin.userId, "Before unschedule");

      project.status = "draft";
      project.scheduledAt = null;
      project.updatedBy = req.admin.userId;
      await project.save();

      res.json({ success: true, project: toAdminProject(project) });
    } catch (error) {
      console.error("Error unscheduling project:", error);
      res.status(500).json({ error: "Failed to unschedule project" });
    }
  }
);

app.post(
  "/api/admin/projects/:id/archive",
  requireAdminAuth,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      await saveProjectVersion(project, req.admin.userId, "Before archive");

      project.status = "archived";
      project.scheduledAt = null;
      project.updatedBy = req.admin.userId;
      await project.save();

      res.json({ success: true, project: toAdminProject(project) });
    } catch (error) {
      console.error("Error archiving project:", error);
      res.status(500).json({ error: "Failed to archive project" });
    }
  }
);

app.post(
  "/api/admin/projects/:id/rollback/:versionId",
  requireAdminAuth,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      const version = await ProjectVersion.findOne({
        _id: req.params.versionId,
        project: req.params.id,
      });

      if (!version) {
        return res.status(404).json({ error: "Version not found" });
      }

      await saveProjectVersion(project, req.admin.userId, "Before rollback");

      const snapshot = version.snapshot;
      project.title = snapshot.title;
      project.shortDescription = snapshot.shortDescription;
      project.tags = snapshot.tags;
      project.coverImage = snapshot.coverImage;
      project.caseStudyMarkdown = snapshot.caseStudyMarkdown;
      project.projectUrl = snapshot.projectUrl;
      project.githubUrl = snapshot.githubUrl;
      project.status = snapshot.status;
      project.scheduledAt = snapshot.scheduledAt;
      project.publishedAt = snapshot.publishedAt;
      project.displayOrder = snapshot.displayOrder;
      project.updatedBy = req.admin.userId;

      await project.save();

      res.json({ success: true, project: toAdminProject(project) });
    } catch (error) {
      console.error("Error rolling back project:", error);
      res.status(500).json({ error: "Failed to rollback project" });
    }
  }
);

app.post(
  "/api/admin/uploads/cover",
  requireAdminAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!s3Client || !AWS_REGION || !AWS_S3_BUCKET) {
        return res.status(500).json({
          error:
            "S3 is not configured. Set AWS_REGION and AWS_S3_BUCKET (plus credentials).",
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const extension = path.extname(req.file.originalname || "") || ".jpg";
      const key = `portfolio-projects/${Date.now()}-${randomUUID()}${extension}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      const file = {
        url: getS3PublicUrl(key),
        key,
        size: req.file.size,
        mimeType: req.file.mimetype,
      };

      res.status(201).json({ success: true, file });
    } catch (error) {
      console.error("Error uploading cover image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message === "Only image uploads are allowed") {
    return res.status(400).json({ error: error.message });
  }

  if (error.message === "CORS origin not allowed") {
    return res.status(403).json({ error: error.message });
  }

  console.error("Unhandled server error:", error);
  res.status(500).json({ error: "Internal server error" });
  next();
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    await ensureAdminUser();

    app.listen(PORT, () => {
      console.log(`Express API running on port ${PORT}`);
      console.log(`MongoDB connected: ${MONGODB_URI}`);
      console.log(`CORS origins: ${corsOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
