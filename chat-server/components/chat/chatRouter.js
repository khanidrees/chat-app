const express = require('express');
const { body } = require('express-validator');
const { isAuthorized } = require('../auth/auth');
const { createChat, createMessage } = require('./chatController');

const router = express.Router();

router.post(
  '/',
  [
    body('name')
      .isLength({ min: 2, max: 20 })
      .withMessage('Please Enter Valid Name'),
    body('participants', 'Enter 8 char of alphanumeric type onnly')
      .isArray({ min: 2, max: 100 })
      .withMessage('please provide atleast 2 participants'),
    body('isGroupChat')
      .isBoolean()
      .withMessage('Please provide valid isGroupChat value'),
  ],
  isAuthorized,
  createChat,
);

router.post(
  '/:chatId/message',
  [
    body('content')
      .isLength({ min: 1, max: 512 })
      .withMessage('Please Enter Valid Name'),
  ],
  isAuthorized,
  createMessage,
);

module.exports = router;
