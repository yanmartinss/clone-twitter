import { prisma } from "../utils/prisma.js";
import { getPublicURL } from "../utils/url.js";

export const findUserByEmail = async (email) => {
  const user = prisma.user.findFirst({ where: { email } });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar),
      cover: getPublicURL(user.cover),
    };
  }

  return null;
};

export const findUserBySlug = async (slug) => {
  const user = await prisma.user.findFirst({
    select: {
      avatar: true,
      cover: true,
      slug: true,
      name: true,
      bio: true,
      link: true,
    },
    where: { slug },
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar),
      cover: getPublicURL(user.cover),
    };
  }

  return null;
};

export const createUser = async (data) => {
  const newUser = await prisma.user.create({ data });

  return {
    ...newUser,
    avatar: getPublicURL(newUser.avatar),
    cover: getPublicURL(newUser.cover),
  };
};

export const getUserFollowingCount = async (slug) => {
  const count = await prisma.follow.count({ where: { user1Slug: slug } });
  return count;
};

export const getUserFollowersCount = async (slug) => {
  const count = await prisma.follow.count({ where: { user2Slug: slug } });
  return count;
};

export const getUserTweetCount = async (slug) => {
  const count = await prisma.tweet.count({ where: { userSlug: slug } });
  return count;
};

export const checkIfFollows = async (user1Slug, user2Slug) => {
  const follows = await prisma.follow.findFirst({
    where: { user1Slug: user2Slug },
  });

  return follows ? true : false;
};

export const follow = async (user1Slug, user2Slug) => {
  await prisma.follow.create({ data: { user1Slug, user2Slug } });
};

export const unfollow = async (user1Slug, user2Slug) => {
  await prisma.follow.deleteMany({ where: { user1Slug: user2Slug } });
};

export const updateUserInfo = async (slug, data) => {
  await prisma.user.update({ where: { slug }, data });
};

export const getUserFollowing = async (slug) => {
  const following = [];
  const reqFollow = await prisma.follow.findMany({
    select: { user2Slug: true },
    where: { user1Slug: slug },
  });

  for (let reqItem of reqFollow) {
    following.push(reqItem.user2Slug);
  }

  return following;
};

export const getUserSuggestions = async (slug) => {
  const following = await getUserFollowing(slug);
  const followingPlusMe = [...following, slug];
  const suggestions =
    await prisma.$queryRaw`SELECT name, avatar, slug FROM "User" WHERE slug NOT IN (${followingPlusMe.join(
      ","
    )}) ORDER BY RANDOM() LIMIT 2`;

  for (let sugIndex in suggestions) {
    suggestions[sugIndex].avatar = getPublicURL(suggestions[sugIndex].avatar);
  }

  return suggestions;
};
