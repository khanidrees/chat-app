const express = require('express');

const router = express.Router();
const { body, validationResult } = require('express-validator');

const User = require('./userModel');
const userController = require('./userController');

router.post(
  '/register',
  [
    // TODO : add username validation for duplication
    body('email')
      .isEmail()
      .withMessage('Please Enter Valid Email')
      .custom((value, { req }) => User.findOne({ email: value })
        .then((user) => {
          if (user) {
            return Promise.reject('Please enter another email');
          }
        }))
      .normalizeEmail(),
    body('password', 'Enter 8 char of alphanumeric type onnly')
      .isLength({ min: 6, max: 8 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password must be same!');
        }
        return true;
      })
      .trim(),
    // body('mobileNumber')
    //   .isMobilePhone()
    //   .withMessage('Please enter a valid mobile Number'),

  ],
  userController.postUser
  ,
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please Enter Valid Email')
      .normalizeEmail(),
    body('password', 'Enter 8 char of alphanumeric type onnly')
      .isLength(8)
      .isAlphanumeric()
      .trim(),
  ],
  userController.loginUser
  ,
);

module.exports = router;
