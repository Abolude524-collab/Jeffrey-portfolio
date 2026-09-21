const TECH_STACK_KEYWORDS = [
  "react",
  "next",
  "node",
  "express",
  "mongodb",
  "mongoose",
  "postgres",
  "mysql",
  "sql",
  "typescript",
  "javascript",
  "python",
  "java",
  "c#",
  "c++",
  "go",
  "rust",
  "tailwind",
  "graphql",
  "rest",
  "api",
  "docker",
  "kubernetes",
  "aws",
  "gcp",
  "azure",
  "power bi",
  "powerbi",
  "pandas",
  "numpy",
  "scikit",
  "tensorflow",
  "pytorch",
];

const TOOL_KEYWORDS = [
  "figma",
  "notion",
  "jira",
  "trello",
  "tableau",
  "excel",
  "looker",
  "looker studio",
  "google analytics",
  "ga4",
  "github",
  "gitlab",
  "bitbucket",
  "postman",
  "insomnia",
  "metabase",
  "airflow",
  "dbt",
  "superset",
  "matplotlib",
  "seaborn",
  "canva",
  "slack",
  "zapier",
];

function matchesKeyword(tag: string, keywords: string[]) {
  const normalized = tag.trim().toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

export function splitProjectTags(tags: string[]) {
  const techStack: string[] = [];
  const tools: string[] = [];
  const other: string[] = [];

  for (const tag of tags) {
    if (!tag || typeof tag !== "string") continue;

    if (matchesKeyword(tag, TECH_STACK_KEYWORDS)) {
      techStack.push(tag);
      continue;
    }

    if (matchesKeyword(tag, TOOL_KEYWORDS)) {
      tools.push(tag);
      continue;
    }

    other.push(tag);
  }

  return {
    techStack,
    tools,
    other,
  };
}
