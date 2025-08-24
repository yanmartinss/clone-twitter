import { feedSchema } from "../schemas/feed.schema.js";
import { findTweetFeed } from "../services/tweet.service.js";
import { getUserFollowing } from "../services/user.service.js";

export const getFeed = async (req, res) => {
  const safeData = feedSchema.safeParse(req.query);
  if (!safeData.success)
    return res.json({ error: safeData.error.flatten().fieldErrors });

  let perPage = 2;
  let currentPage = safeData.data.page ?? 0;

  const following = await getUserFollowing(req.userSlug);
  const tweets = await findTweetFeed(following, currentPage, perPage);

  res.json({ tweets, page: currentPage });
};
