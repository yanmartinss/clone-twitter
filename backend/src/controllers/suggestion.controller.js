import { getUserSuggestions } from "../services/user.service.js";

export const getSuggestions = async (req, res) => {
  const suggestions = await getUserSuggestions(req.userSlug);

  res.json({ users: suggestions });
};
