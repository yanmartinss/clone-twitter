import dotenv from "dotenv";

dotenv.config();

export const getPublicURL = (url) => {
  return `${process.env.BASE_URL}/${url}`;
};
