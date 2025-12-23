const bcrypt = require("bcrypt");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { generateToken } = require("../../utils/jwtToken");
const { User } = require('../../models');


const login = asyncErrorHandler(async (req, res) => {

    const response = await User.findOne({
      include: [{
        model: Address
      }],
      where: {
        email: req.body?.email
      },
    });
    if (response) {
      const { password, ...rest } = response?.dataValues;
      const isTrue = bcrypt.compareSync(req.body?.password, password);
      if (isTrue) {
        response.device_token = req.body.device_token;
        await response.save();
        rest.device_token = req.body.device_token;
        const accessToken = generateToken(rest);
        res.status(STATUS_CODES.SUCCESS).json({
          statusCode: STATUS_CODES.SUCCESS,
          message: TEXTS.LOGIN,
          data: rest,
          accessToken: accessToken,
        });
      } else {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: TEXTS.INVALID_CREDENTIALS,
        });
      }
    } else {
      res.status(STATUS_CODES.NOT_FOUND).json({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: TEXTS.USER_NOT_FOUND,
      });
    }

});


module.exports = {
  login,
  
};
