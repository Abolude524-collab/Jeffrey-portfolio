// Type definitions for the portfolio application

export interface CoverImage {
    url: string;
    key: string;
    size: number;
    mimeType: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    tags: string[];
    imageURL: string;
    coverImage?: CoverImage;
    caseStudy: string;
    caseStudyMarkdown?: string;
    projectUrl?: string | null;
    githubUrl?: string | null;
    status?: "draft" | "published" | "scheduled" | "archived";
    scheduledAt?: string | null;
    publishedAt?: string;
    displayOrder?: number;
    createdAt?: string;
    updatedAt?: string;
    legacyNumericId?: number | null;
}

export interface AdminProject extends Project {
    status: "draft" | "published" | "scheduled" | "archived";
    scheduledAt: string | null;
    publishedAt?: string;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    date: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export interface FileUploadResponse {
    success: boolean;
    file?: CoverImage;
    error?: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        username: string;
        role: string;
    };
    error?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
