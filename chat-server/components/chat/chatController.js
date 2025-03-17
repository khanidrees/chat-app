const { validationResult } = require('express-validator');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const chatService = require('./chatSevice');

const createChat = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(new ApiResponse(
      422,
      'Validation Errors',
      { errors: errors.array() },
    ));
  }
  const {
    name,
    participants,
    isGroupChat,
    admin,
  } = req.body;
  const resposne = await chatService.createChat(
    name,
    participants,
    isGroupChat,
    admin,
  );

  if (resposne) {
    res.status(201).json(resposne);
  }
});

const createMessage = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(new ApiResponse(
      422,
      'Validation Errors',
      { errors: errors.array() },
    ));
  }
  const {
    content,
  } = req.body;
  const userId = req.user._id;
  const { chatId } = req.params;
  const resposne = await chatService.createMessage(
    userId,
    content,
    chatId,
  );

  if (resposne) {
    res.status(201).json(resposne);
  }
});

module.exports = {
  createChat,
  createMessage,
};
