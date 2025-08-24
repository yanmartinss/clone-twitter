import z from "zod";

export const userTweetsSchema = z.object({
  page: z.coerce.number().min(0).optional(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must have 2 or more characters" })
    .optional(),
  bio: z.string().optional(),
  link: z.string().url({ message: "Must be a valid URL" }).optional(),
});
