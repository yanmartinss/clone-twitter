import slug from "slug";
import { signinSchema, signupSchema } from "../schemas/auth.schema.js";
import {
  createUser,
  findUserByEmail,
  findUserBySlug,
} from "../services/user.service.js";
import { compare, hash } from "bcrypt";
import { createJWT } from "../utils/jwt.js";

export const signup = async (req, res) => {
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success)
    return res.json({ error: safeData.error.flatten().fieldErrors });

  const hasEmail = await findUserByEmail(safeData.data.email);
  if (hasEmail) return res.json({ error: "E-mail already registered" });

  let genSlug = true;
  let userSlug = slug(safeData.data.name);
  while (genSlug) {
    const hasSlug = await findUserBySlug(userSlug);
    if (hasSlug) {
      let slugSuffix = Math.floor(Math.random() * 99999).toString();
      userSlug = slug(safeData.data.name + slugSuffix);
    } else {
      genSlug = false;
    }
  }

  const hashPassword = await hash(safeData.data.password, 10);

  const newUser = await createUser({
    slug: userSlug,
    name: safeData.data.name,
    email: safeData.data.email,
    password: hashPassword,
  });

  const token = createJWT(userSlug);

  res.status(201).json({
    token,
    user: { name: newUser.name, slug: newUser.slug, avatar: newUser.avatar },
  });
};

export const signin = async (req, res) => {
  const safeData = signinSchema.safeParse(req.body);
  if (!safeData.success)
    return res.json({ error: safeData.error.flatten().fieldErrors });

  const user = await findUserByEmail(safeData.data.email);
  if (!user)
    return res.status(401).json({ error: "Invalid email or password" });

  const verifyPass = await compare(safeData.data.password, user.password);
  if (!verifyPass)
    return res.status(401).json({ error: "Invalid email or password" });

  const token = createJWT(user.slug);

  res.json({
    token,
    user: { name: user.name, slug: user.slug, avatar: user.avatar },
  });
};
