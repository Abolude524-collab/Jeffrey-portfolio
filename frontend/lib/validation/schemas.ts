import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(160),
  phone: z.string().max(30).optional().or(z.literal("")),
  subject: z.string().max(150).optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().min(10).max(500),
  description: z.string().optional().or(z.literal("")),
  problem: z.string().optional().or(z.literal("")),
  objective: z.string().optional().or(z.literal("")),
  dataset: z.string().optional().or(z.literal("")),
  methodology: z.string().optional().or(z.literal("")),
  insights: z.string().optional().or(z.literal("")),
  results: z.string().optional().or(z.literal("")),
  challenges: z.string().optional().or(z.literal("")),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().url("Valid cover image URL is required"),
  coverImagePublicId: z.string().optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Invalid Live URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  proficiency: z.number().int().min(1).max(100).optional().nullable(),
  order: z.number().int().default(0),
});

export const experienceSchema = z.object({
  role: z.string().min(2, "Role is required"),
  organization: z.string().min(2, "Organization is required"),
  location: z.string().optional().or(z.literal("")),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().default(false),
  description: z.string().min(5, "Description is required"),
  bulletPoints: z.array(z.string()).default([]),
  order: z.number().int().default(0),
});

export const certificationSchema = z.object({
  title: z.string().min(2, "Title is required"),
  issuer: z.string().min(2, "Issuer is required"),
  issueDate: z.string().min(2, "Issue date is required"),
  credentialUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  imagePublicId: z.string().optional().or(z.literal("")),
  order: z.number().int().default(0),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  bio: z.string().min(10),
  profileImageUrl: z.string().url().optional().or(z.literal("")),
  profileImagePublicId: z.string().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
});
