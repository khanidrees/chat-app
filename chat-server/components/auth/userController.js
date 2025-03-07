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
  try {
    const response = await userService.loginUser(email, password);
    console.log(response);
    return res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  postUser,
  loginUser,
};
