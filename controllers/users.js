const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    // Sab users ko fetch karein, lakin password ka field exclude kar dein ("-password")
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Unable to fetch users",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all values" });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || "saler",
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, role } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }

  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (email !== undefined) user.email = email;
  if (role !== undefined) user.role = role;
  if (password) user.password = password;

  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }
  res.status(StatusCodes.OK).json({ success: true });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
