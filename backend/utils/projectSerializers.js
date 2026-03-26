function toIdString(value) {
  if (!value) return null;
  return typeof value === "string" ? value : value.toString();
}

export function toPublicProject(project) {
  return {
    id: toIdString(project._id),
    title: project.title,
    description: project.shortDescription,
    shortDescription: project.shortDescription,
    tags: project.tags,
    imageURL: project.coverImage.url,
    coverImage: project.coverImage,
    caseStudy: project.caseStudyMarkdown,
    caseStudyMarkdown: project.caseStudyMarkdown,
    projectUrl: project.projectUrl || null,
    githubUrl: project.githubUrl || null,
    publishedAt: project.publishedAt,
    displayOrder: project.displayOrder,
  };
}

export function toAdminProject(project) {
  return {
    id: toIdString(project._id),
    legacyNumericId: project.legacyNumericId,
    title: project.title,
    description: project.shortDescription,
    shortDescription: project.shortDescription,
    tags: project.tags,
    imageURL: project.coverImage.url,
    coverImage: project.coverImage,
    caseStudy: project.caseStudyMarkdown,
    caseStudyMarkdown: project.caseStudyMarkdown,
    projectUrl: project.projectUrl || null,
    githubUrl: project.githubUrl || null,
    status: project.status,
    scheduledAt: project.scheduledAt,
    publishedAt: project.publishedAt,
    displayOrder: project.displayOrder,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}
