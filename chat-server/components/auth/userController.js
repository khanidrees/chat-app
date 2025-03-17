const { validationResult } = require('express-validator');
const userService = require('./userService');
const { asyncHandler } = require('../../utils/asyncHandler');
const { ApiResponse } = require('../../utils/ApiResponse');

const postUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(new ApiResponse(
      422,
      'Validation Errors',
      { errors: errors.array() },
    ));
  }
  const {
    username, fullname, email, mobileNumber, role, password,
  } = req.body;
  try {
    const response = await userService
      .postUser(username, fullname, email, mobileNumber, password, role);
    return res.json(response);
  } catch (err) {
    next(err);
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(new ApiResponse(
      422,
      'Validation Errors',
      { errors: errors.array() },
    ));
  }
  const {
    email, password,
  } = req.body;
  const response = await userService.loginUser(email, password);
  // const token = response.data.token;
  // delete response.data.token;
  // console.log(response);
  return res
    // .cookie('token', token, {
    //   httpOnly: true,
    //   secure: true, // Set to true in production (HTTPS only)
    //   sameSite: 'strict', // Or 'none' if you need cross-site cookies
    // })
    .json(response);
});

const getUsers = asyncHandler(async (req, res, next) => {
  const {
    query,
  } = req.query;

  const response = await userService.getUsers(query);
  return res.json(response);
});

module.exports = {
  postUser,
  loginUser,
  getUsers,
};
