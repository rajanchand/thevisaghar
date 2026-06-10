import { z } from "zod";

// ─── Contact Form ────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  visaType: z.string().min(1, "Please select a visa type"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Booking Form ────────────────────────────────────────────────────────────

export const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number").max(20),
  visaType: z.string().min(1, "Please select a visa type"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  message: z.string().max(1000).optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Service ─────────────────────────────────────────────────────────────────

export const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().max(300).optional(),
  icon: z.string().default("briefcase"),
  price: z.string().optional(),
  documentsRequired: z.array(z.string()).default([]),
  processingTime: z.string().optional(),
  eligibility: z.string().optional(),
  faq: z.any().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// ─── Blog Post ───────────────────────────────────────────────────────────────

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(300),
  slug: z.string().min(3).max(300).regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  content: z.any(),
  excerpt: z.string().max(500).optional(),
  featuredImage: z.string().optional(),
  category: z.string().default("General"),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(320).optional(),
  ogImage: z.string().optional(),
  published: z.boolean().default(false),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

// ─── Testimonial ─────────────────────────────────────────────────────────────

export const testimonialSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters").max(100),
  clientPhoto: z.string().optional(),
  visaType: z.string().min(1, "Please specify the visa type"),
  rating: z.number().int().min(1).max(5).default(5),
  content: z.string().min(10, "Content must be at least 10 characters").max(1000),
  isApproved: z.boolean().default(false),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

// ─── Team Member ─────────────────────────────────────────────────────────────

export const teamMemberSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  photo: z.string().optional(),
  bio: z.string().max(1000).optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

// ─── Site Settings ───────────────────────────────────────────────────────────

export const siteSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

export type SiteSettingFormData = z.infer<typeof siteSettingSchema>;

// ─── Chat Message ────────────────────────────────────────────────────────────

export const chatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000),
});

export type ChatMessageData = z.infer<typeof chatMessageSchema>;

// ─── Visa Types ──────────────────────────────────────────────────────────────

export const VISA_TYPES = [
  "Student Visa",
  "Japanese Language Class",
  "IELTS Class",
  "PTE Class",
  "Computer Class",
  "Other",
] as const;
