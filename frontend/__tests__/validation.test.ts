import { describe, it, expect } from "vitest";
import { contactSchema, projectSchema, loginSchema } from "../lib/validation/schemas";

describe("Input Validation Schema Tests", () => {
  it("should validate valid contact form input", () => {
    const validData = {
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello Jeffrey, I have a data analytics project for you.",
    };
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid contact form email", () => {
    const invalidData = {
      name: "Jane Doe",
      email: "invalid-email-string",
      message: "Hello Jeffrey, I have a project.",
    };
    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should validate valid project schema", () => {
    const validProject = {
      title: "Sales Analysis & Power BI",
      slug: "sales-analysis-power-bi",
      shortDescription: "Cleaned and modeled sales dataset for executive Power BI dashboard.",
      category: "Data Analysis",
      tags: ["SQL", "PowerBI"],
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      featured: true,
      published: true,
      displayOrder: 1,
    };
    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("should reject project with invalid slug format", () => {
    const invalidProject = {
      title: "Sales Analysis",
      slug: "Invalid Slug With Spaces & Special!",
      shortDescription: "Short description of project.",
      category: "Data Analysis",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    };
    const result = projectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });
});
