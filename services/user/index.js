const bcrypt = require("bcrypt");
const asyncErrorHandler = require("../../utils/asyncErrorHandler");
const { STATUS_CODES, TEXTS } = require("../../config/constants");
const { User } = require("../../models");

// Create user
const createUser = asyncErrorHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(STATUS_CODES.REQUIRED).json({
      statusCode: STATUS_CODES.REQUIRED,
      message: "Name, email, and password are required",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    where: { email },
    raw: true,
  });

  if (existingUser) {
    return res.status(STATUS_CODES.CONFLICT).json({
      statusCode: STATUS_CODES.CONFLICT,
      message: TEXTS.USER_EXIST,
    });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userData } = newUser.dataValues;

  res.status(STATUS_CODES.CREATED).json({
    statusCode: STATUS_CODES.CREATED,
    message: TEXTS.CREATED,
    data: userData,
  });
});

// Get all users
const getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    raw: true,
  });

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: users,
    count: users.length,
  });
});

// Get user by ID
const getUserById = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
    raw: true,
  });

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: TEXTS.USER_NOT_FOUND,
    });
  }

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.FOUND,
    data: user,
  });
});

// Update user
const updateUser = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: TEXTS.USER_NOT_FOUND,
    });
  }

  // Check if email is being updated and if it already exists
  if (email && email !== user.email) {
    const existingUser = await User.findOne({
      where: { email },
      raw: true,
    });

    if (existingUser) {
      return res.status(STATUS_CODES.CONFLICT).json({
        statusCode: STATUS_CODES.CONFLICT,
        message: TEXTS.USER_EXIST,
      });
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) {
    user.password = bcrypt.hashSync(password, 10);
  }

  await user.save();

  const { password: _, ...userData } = user.dataValues;

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.UPDATED,
    data: userData,
  });
});

// Delete user
const deleteUser = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(STATUS_CODES.NOT_FOUND).json({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: TEXTS.USER_NOT_FOUND,
    });
  }

  await user.destroy();

  res.status(STATUS_CODES.SUCCESS).json({
    statusCode: STATUS_CODES.SUCCESS,
    message: TEXTS.DELETED,
  });
});

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

