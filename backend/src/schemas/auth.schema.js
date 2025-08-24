import z from "zod";

export const signupSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, { message: "Name must have 2 or more characters" }),
  email: z
    .string({ message: "E-mail is required" })
    .email({ message: "Invalid e-mail" }),
  password: z
    .string({ message: "Password is required" })
    .min(4, { message: "Password must have 4 or more characters" }),
});

export const signinSchema = z.object({
  email: z.string().email({ message: "Invalid e-mail" }),
  password: z.string(),
});
