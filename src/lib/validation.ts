import { z } from 'zod'

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// User schemas
export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
})

// Team schemas
export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
})

export const updateTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
})

export const addMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['Owner', 'Member']).default('Member'),
})

export const updateMemberRoleSchema = z.object({
  role: z.enum(['Owner', 'Member']),
})

// Item schemas
export const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
})

export const updateItemSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
})

// Stripe schemas
export const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
})

// Activity log schemas
export const activityLogQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  eventType: z.string().optional(),
})

export const listItemsQuerySchema = z.object({
  status: z.enum(['active', 'draft', 'archived']).optional(),
  search: z.string().max(200).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateTeamInput = z.infer<typeof createTeamSchema>
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>
export type ActivityLogQuery = z.infer<typeof activityLogQuerySchema>
export type ListItemsQuery = z.infer<typeof listItemsQuerySchema>
