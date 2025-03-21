const { validationResult } = require('express-validator');
const { ApiResponse } = require('../../utils/ApiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');
const chatService = require('./chatSevice');
const { emitSocketEvent } = require('../../socket');

const createOrGetChat = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(new ApiResponse(
      422,
      'Validation Errors',
      { errors: errors.array() },
    ));
  }
  const {
    recieverId,
  } = req.params;
  // Handle Self Chat

  // TODO: check if chat exists
  const resposne = await chatService.createChat(
    recieverId,
    req.user._id,
  );
  // TODO: emit a chat created event
  if (resposne) {
    resposne.data.participants.forEach((p) => {
      emitSocketEvent(req, p, 'CHAT_CREATED', resposne.data);
    });
    res.status(201).json(resposne);
  }
});

const sendMessage = asyncHandler(async (req, res, next) => {
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

  // TODO: emit message event to all participants

  if (resposne) {
    res.status(201).json(resposne);
  }
});

module.exports = {
  createOrGetChat,
  sendMessage,
};
