import { updateUserSchema, userTweetsSchema } from "../schemas/user.schema.js";
import { findTweetsByUser } from "../services/tweet.service.js";
import {
  checkIfFollows,
  findUserBySlug,
  follow,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
  unfollow,
  updateUserInfo,
} from "../services/user.service.js";

export const getUser = async (req, res) => {
  const { slug } = req.params;

  const user = await findUserBySlug(slug);
  if (!user) return res.json({ error: "User not existent" });

  const followingCount = await getUserFollowingCount(user.slug);
  const followersCount = await getUserFollowersCount(user.slug);
  const tweetCount = await getUserTweetCount(user.slug);

  res.json({ user, followingCount, followersCount, tweetCount });
};

export const getUserTweets = async (req, res) => {
  const { slug } = req.params;
  const safeData = userTweetsSchema.safeParse(req.query);
  if (!safeData.success)
    return res.json({ error: safeData.error.flatten().fieldErrors });

  //   pagination
  let perPage = 2;
  let currentPage = safeData.data.page ?? 0;

  const tweets = await findTweetsByUser(slug, currentPage, perPage);

  res.json({ tweets, page: currentPage });
};

export const followToggle = async (req, res) => {
  const { slug } = req.params;
  const me = req.userSlug;
  const hasUserToBeFollowed = await findUserBySlug(slug);

  if (!hasUserToBeFollowed) return res.json({ error: "User not existent" });

  const follows = await checkIfFollows(me, slug);

  if (!follows) {
    await follow(me, slug);
    res.json({ following: true });
  } else {
    await unfollow(me, slug);
    res.json({ following: false });
  }
};

export const updateUser = async (req, res) => {
  const safeData = updateUserSchema.safeParse(req.body);
  if (!safeData.success)
    return res.json({ error: safeData.error.flatten().fieldErrors });

  await updateUserInfo(req.userSlug, safeData.data);

  res.json({ userUpdated: true });
};
