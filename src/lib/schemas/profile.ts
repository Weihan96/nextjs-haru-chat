import * as z from "zod"

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores")
    .optional()
    .or(z.literal("")),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .optional()
    .or(z.literal(""))
})

export type ProfileFormData = z.infer<typeof profileFormSchema> 