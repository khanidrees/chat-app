const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./userModel');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');
const { ApiError } = require('../../utils/ApiError');

const postUser = async (username, fullname, email, mobileNumber, password) => {
  // TODO: add error handeling + salt logic before hashing
  const hashedPassword = await bcrypt.hash(password, 12);
  if (hashedPassword) {
    // console.log('User', User);
    // console.log(username, fullname, email, mobileNumber, password);
    const user = await User.create({
      username, fullname, email, mobileNumber, password: hashedPassword,
    });

    const createdUser = await User.findById(user?.id).select('-password');

    if (!createdUser) throw new ApiError(500, 'Something went wrong while registering the user');
    return new ApiResponse(
      201,
      { createdUser },
      'user registered Successfully',
    );
  }

  throw new ApiError(500, 'error while signup');
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('password').lean();
  // console.log(user._id, user.id);
  if (user) {
    const result = await bcrypt.compare(password, user.password);
    if (!result) { throw new ApiError(403, 'Incorrect email or password'); }
    // login
    const token = await jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8),
      id: user._id,
    }, process.env.JWT_PRIVATE_KEY);
    // console.log('token', token);
    const resposne = new ApiResponse(
      201,
      {
        loggedIn: true,
        token,
      },
      'Logged In Successfully',
    );
    return resposne;
  }
  throw new ApiError(402, 'Incorrect email or password');
};

const getUsers = async (query) => {
  if (query === '') return [];
  const users = await User.find({ $text: { $search: query } });

  return new ApiResponse(200, users, 'Users Retrieved');
};
module.exports = {
  postUser,
  loginUser,
  getUsers,
};
