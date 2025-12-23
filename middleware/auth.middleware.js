const { verifyJWTToken } = require("../utils/jwtToken");
const { STATUS_CODES, TEXTS } = require("../config/constants");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  const header = req.get("Authorization");
  if (!header || !header.startsWith("Bearer")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: TEXTS.INVALID_AUTH_TOKEN });
  }

  const accessToken = header.split(" ")[1];
  if (accessToken) {
    const result = await verifyJWTToken(accessToken);
    if (result.err) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: TEXTS.INVALID_AUTH_TOKEN });
    } else {

      req.user = result.decoded;

      if (req.user.role === 'customerSupport') {

        const isExistUser = await User.findOne({
          where: { id: req.user.id },
          attribute: ["banned", "role"],
          raw: true,
        });

        if (isExistUser && isExistUser.banned === true) {
          return res.status(STATUS_CODES.UNAUTHORIZED).json({
            statusCode: 401,
            message: "You are banned",
          });
        }
      }
      next();
    }
  } else {
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: TEXTS.NO_AUTH_GIVEN });
  }
};

module.exports = {
  authenticate,
};
