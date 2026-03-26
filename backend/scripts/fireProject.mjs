import "dotenv/config";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error("Missing ADMIN_USERNAME or ADMIN_PASSWORD in backend .env");
  process.exit(1);
}

async function parseJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

async function run() {
  const loginRes = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    }),
  });

  const loginData = await parseJson(loginRes);
  if (!loginRes.ok || !loginData?.token) {
    console.error("Admin login failed:", loginData);
    process.exit(1);
  }

  const token = loginData.token;

  const imageRes = await fetch("https://picsum.photos/1400/900");
  if (!imageRes.ok) {
    console.error("Failed to fetch online image:", imageRes.status);
    process.exit(1);
  }

  const imageBytes = await imageRes.arrayBuffer();
  const imageType = imageRes.headers.get("content-type") || "image/jpeg";

  const form = new FormData();
  form.append(
    "file",
    new Blob([imageBytes], { type: imageType }),
    "cover.jpg"
  );

  const uploadRes = await fetch(`${API_BASE_URL}/api/admin/uploads/cover`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const uploadData = await parseJson(uploadRes);
  if (!uploadRes.ok || !uploadData?.file?.url) {
    console.error("S3 upload failed:", uploadData);
    process.exit(1);
  }

  const now = new Date();
  const projectTitle = `Client Launch ${now.toISOString().slice(0, 16).replace("T", " ")}`;

  const createRes = await fetch(`${API_BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: projectTitle,
      shortDescription: "Production-ready project published via admin automation.",
      tags: ["Next.js", "Node.js", "S3"],
      caseStudyMarkdown:
        "## Launch Notes\nThis project was created from an automated admin flow and published immediately.",
      coverImage: uploadData.file,
      projectUrl: "https://example.com",
      githubUrl: "https://github.com/example/repo",
      displayOrder: 1,
      status: "draft",
    }),
  });

  const createData = await parseJson(createRes);
  if (!createRes.ok || !createData?.project?.id) {
    console.error("Project creation failed:", createData);
    process.exit(1);
  }

  const projectId = createData.project.id;

  const publishRes = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}/publish`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const publishData = await parseJson(publishRes);
  if (!publishRes.ok || !publishData?.project?.id) {
    console.error("Project publish failed:", publishData);
    process.exit(1);
  }

  console.log("SUCCESS");
  console.log(`Project ID: ${publishData.project.id}`);
  console.log(`Title: ${publishData.project.title}`);
  console.log(`Status: ${publishData.project.status}`);
  console.log(`Cover URL: ${publishData.project.coverImage?.url || "n/a"}`);
}

run().catch((error) => {
  console.error("Unexpected error:", error?.message || error);
  process.exit(1);
});
