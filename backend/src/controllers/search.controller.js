import { searchSchema } from "../schemas/search.schema.js";
import { findTweetsByBody } from "../services/tweet.service.js";

export const searchTweets = async (req, res) => {
  const safeData = searchSchema.safeParse(req.query);
  if (!safeData.success)
    return res.json({ error: safeData.error.flatten().fieldErrors });

  let perPage = 2;
  let currentPage = safeData.data.page ?? 0;

  const tweets = await findTweetsByBody(safeData.data.q, currentPage, perPage);

  res.json({ tweets, page: currentPage });
};
