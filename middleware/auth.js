module.exports = (req, res, next) => {
  req.user = {
    userId: "temp-id",
    role: "INVESTOR_VIEW_ONLY",
  };
  next();
};
