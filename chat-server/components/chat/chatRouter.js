const express = require('express');
const { body, param } = require('express-validator');
const { isAuthorized } = require('../auth/auth');
const { createOrGetChat, sendMessage } = require('./chatController');

const router = express.Router();

router.post(
  '/:recieverId',
  [
    param('recieverId')
      .notEmpty().isMongoId()
      .withMessage('Invalid reciever'),
  ],
  isAuthorized,
  createOrGetChat,
);

router.post(
  '/:chatId/message',
  [
    body('content')
      .isLength({ min: 1, max: 512 })
      .withMessage('Please Enter Valid Name'),
  ],
  isAuthorized,
  sendMessage,
);

module.exports = router;
