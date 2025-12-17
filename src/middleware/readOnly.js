const ROLES = require("../constants/roles");
module.exports = (req, res, next) => {
  if (req.user.role !== ROLES.INVESTOR_VIEW_ONLY) return next();
  if (req.method !== "GET") {
    return res.status(403).json({
      error: "Read-only investor access",
    });
  }
  next();
};
