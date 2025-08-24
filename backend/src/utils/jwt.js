import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserBySlug } from "../services/user.service.js";

dotenv.config();

export const createJWT = (slug) => {
  return jwt.sign({ slug }, process.env.JWT_SECRET);
};

export const verifyJWT = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "Access denied" });

  const authSplit = authorization.split("Bearer ");
  const token = authSplit[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Access denied" });

    const user = await findUserBySlug(decoded.slug);
    if (!user) return res.status(401).json({ error: "Access denied" });

    req.userSlug = user.slug;
    next();
  });
};
