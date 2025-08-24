export const ping = (req, res) => {
  res.json({ pong: true });
};

export const privatePing = (req, res) => {
  res.json({ pong: true, slug: req.userSlug });
};
