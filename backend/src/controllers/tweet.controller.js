import { addTweetSchema } from "../schemas/tweet.schema.js";
import { addHashtag } from "../services/trend.service.js";
import {
  checkIfTweetIsLikedByUser,
  createTweet,
  findAnswersFromTweet,
  findTweet,
  likeTweet,
  unlikeTweet,
} from "../services/tweet.service.js";

export const addTweet = async (req, res) => {
  const safeData = addTweetSchema.safeParse(req.body);
  if (!safeData.success)
    return res.json({ error: safeData.error.flatten().fieldErrors });

  if (safeData.data.answer) {
    const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
    if (!hasAnswerTweet)
      return res.json({ error: "Original tweet non-existent" });
  }

  const newTweet = await createTweet(
    req.userSlug,
    safeData.data.body,
    safeData.data.answer ? parseInt(safeData.data.answer) : 0
  );

  const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
  if (hashtags) {
    for (let hashtag of hashtags) {
      if (hashtag.length >= 2) {
        await addHashtag(hashtag);
      }
    }
  }

  res.json({ tweet: newTweet });
};

export const getTweet = async (req, res) => {
  const { id } = req.params;
  const tweet = await findTweet(parseInt(id));
  if (!tweet) return res.json({ error: "Tweet not find" });
  res.json({ tweet });
};

export const getAnswers = async (req, res) => {
  const { id } = req.params;
  const answers = await findAnswersFromTweet(parseInt(id));

  res.json({ answers });
};

export const likeToggle = async (req, res) => {
  const { id } = req.params;
  const liked = await checkIfTweetIsLikedByUser(req.userSlug, parseInt(id));

  liked
    ? unlikeTweet(req.userSlug, parseInt(id))
    : likeTweet(req.userSlug, parseInt(id));

  res.json({});
};
