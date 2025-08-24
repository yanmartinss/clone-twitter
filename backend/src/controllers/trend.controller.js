import { getTrending } from "../services/trend.service.js";

export const getTrends = async (req, res) => {
  const trends = await getTrending();

  res.json({ trends });
};
