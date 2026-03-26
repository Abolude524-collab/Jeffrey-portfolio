import "dotenv/config";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error("Missing ADMIN_USERNAME or ADMIN_PASSWORD in backend .env");
  process.exit(1);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const pair = arg.slice(2);
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) {
      const nextArg = argv[i + 1];
      if (nextArg && !nextArg.startsWith("--")) {
        parsed[pair] = nextArg;
        i += 1;
      } else {
        parsed[pair] = true;
      }
      continue;
    }
    const key = pair.slice(0, eqIndex);
    const value = pair.slice(eqIndex + 1);
    parsed[key] = value;
  }
  return parsed;
}

function parsePositional(argv) {
  const values = argv.filter((arg) => !arg.startsWith("--"));
  if (values.length === 0) {
    return {};
  }

  const [
    title,
    short,
    tags,
    projectUrl,
    githubUrl,
    imageUrl,
    caseStudy,
    displayOrder,
  ] = values;

  return {
    title,
    short,
    tags,
    projectUrl,
    githubUrl,
    imageUrl,
    caseStudy,
    displayOrder,
  };
}

function printHelp() {
  console.log("Usage: node scripts/publishProjectFromArgs.mjs --title=... [options]");
  console.log("   or: node scripts/publishProjectFromArgs.mjs <title> <short> <tagsCsv> <projectUrl> <githubUrl> <imageUrl> <caseStudy> <displayOrder>");
  console.log("\nOptions:");
  console.log("  --title=STRING             Project title (required)");
  console.log("  --short=STRING             Short description");
  console.log("  --tags=CSV                 Comma-separated tags, e.g. \"Next.js,S3,Data\"");
  console.log("  --projectUrl=URL           Live project URL");
  console.log("  --githubUrl=URL            GitHub repo URL");
  console.log("  --imageUrl=URL             Online image URL to fetch then upload to S3");
  console.log("  --caseStudy=STRING         Markdown case study text");
  console.log("  --displayOrder=NUMBER      Display order (default 1)");
  console.log("  --status=draft|published   Initial status before forced publish (default draft)");
  console.log("  --help                     Print this help");
}

async function parseJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

async function loginAdmin() {
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
    throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
  }

  return loginData.token;
}

async function uploadImageFromUrl(token, imageUrl) {
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to fetch image URL (${imageRes.status})`);
  }

  const imageBytes = await imageRes.arrayBuffer();
  const imageType = imageRes.headers.get("content-type") || "image/jpeg";
  const extension = imageType.includes("png") ? "png" : "jpg";

  const form = new FormData();
  form.append(
    "file",
    new Blob([imageBytes], { type: imageType }),
    `cover.${extension}`
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
    throw new Error(`S3 upload failed: ${JSON.stringify(uploadData)}`);
  }

  return uploadData.file;
}

async function createProject(token, payload) {
  const createRes = await fetch(`${API_BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const createData = await parseJson(createRes);
  if (!createRes.ok || !createData?.project?.id) {
    throw new Error(`Project creation failed: ${JSON.stringify(createData)}`);
  }

  return createData.project;
}

async function publishProject(token, projectId) {
  const publishRes = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}/publish`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const publishData = await parseJson(publishRes);
  if (!publishRes.ok || !publishData?.project?.id) {
    throw new Error(`Project publish failed: ${JSON.stringify(publishData)}`);
  }

  return publishData.project;
}

async function run() {
  const argv = process.argv.slice(2);
  const namedArgs = parseArgs(argv);
  const positionalArgs = parsePositional(argv);
  const args = {
    ...positionalArgs,
    ...namedArgs,
  };

  if (args.help) {
    printHelp();
    return;
  }

  if (!args.title || typeof args.title !== "string") {
    printHelp();
    throw new Error("Missing required --title argument");
  }

  const title = args.title.trim();
  const shortDescription = (args.short || "Client-facing preview project generated from CLI.").trim();
  const tags = typeof args.tags === "string"
    ? args.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : ["Preview", "Client", "Portfolio"];
  const projectUrl = args.projectUrl || "https://example.com";
  const githubUrl = args.githubUrl || "https://github.com/example/repo";
  const imageUrl = args.imageUrl || "https://picsum.photos/1400/900";
  const caseStudyMarkdown = (args.caseStudy || "## Preview Content\nThis project was created with the CLI custom publish script for frontend preview.").trim();
  const displayOrder = Number(args.displayOrder || 1);
  const status = args.status === "published" ? "published" : "draft";

  const token = await loginAdmin();
  const uploadedFile = await uploadImageFromUrl(token, imageUrl);

  const created = await createProject(token, {
    title,
    shortDescription,
    tags,
    coverImage: uploadedFile,
    caseStudyMarkdown,
    projectUrl,
    githubUrl,
    displayOrder,
    status,
  });

  const published = await publishProject(token, created.id);

  console.log("SUCCESS");
  console.log(`Project ID: ${published.id}`);
  console.log(`Title: ${published.title}`);
  console.log(`Status: ${published.status}`);
  console.log(`Tags: ${(published.tags || []).join(", ")}`);
  console.log(`Cover URL: ${published.coverImage?.url || "n/a"}`);
}

run().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
