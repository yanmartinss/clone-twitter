import z from "zod";

export const addTweetSchema = z.object({
  body: z.string({ message: "Need to type something" }),
  answer: z.string().optional(),
});
