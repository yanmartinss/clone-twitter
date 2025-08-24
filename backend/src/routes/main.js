import { Router } from "express";
import * as pingController from "../controllers/ping.controller.js";
import * as authController from "../controllers/auth.controller.js";
import * as tweetController from "../controllers/tweet.controller.js";
import * as userController from "../controllers/user.controller.js";
import * as feedController from "../controllers/feed.controller.js";
import * as searchController from "../controllers/search.controller.js";
import * as trendController from "../controllers/trend.controller.js";
import * as suggestionController from "../controllers/suggestion.controller.js";

import { verifyJWT } from "../utils/jwt.js";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyJWT, pingController.privatePing);

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signin);

mainRouter.post("/tweet", verifyJWT, tweetController.addTweet);
mainRouter.get("/tweet/:id", verifyJWT, tweetController.getTweet);
mainRouter.get("/tweet/:id/answers", verifyJWT, tweetController.getAnswers);
mainRouter.post("/tweet/:id/like", verifyJWT, tweetController.likeToggle);

mainRouter.get("/user/:slug", verifyJWT, userController.getUser);
mainRouter.get("/user/:slug/tweets", verifyJWT, userController.getUserTweets);
mainRouter.post("/user/:slug/follow", verifyJWT, userController.followToggle);
mainRouter.put("/user", verifyJWT, userController.updateUser);
// mainRouter.put("/user/avatar");
// mainRouter.put("/user/cover");

mainRouter.get("/feed", verifyJWT, feedController.getFeed);

mainRouter.get("/search", verifyJWT, searchController.searchTweets);

mainRouter.get("/trending", verifyJWT, trendController.getTrends);

mainRouter.get("/suggestions", verifyJWT, suggestionController.getSuggestions);
