import z from "zod";

export const searchSchema = z.object({
  q: z
    .string({ message: "Fill in the search" })
    .min(3, { message: "Minimum of 3 characters" }),
  page: z.coerce.number().min(0).optional(),
});
