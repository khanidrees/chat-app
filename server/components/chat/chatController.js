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
  const userId = req.user._id.toString();
  const { chatId } = req.params;
  const resposne = await chatService.createMessage(
    userId,
    content,
    chatId,
  );

  // TODO: emit message event to all participants
  const participants = resposne.data.chat.participants;

  participants.forEach((p) => {
    if (p.toString() === userId) return;
    console.log('message on ws to '+ p +'-' +userId);
    emitSocketEvent(req, p.toString(), 'MESSAGE', JSON.stringify(resposne.data));
  });
  delete resposne?.data?.chat;
  if (resposne) {
    res.status(201).json(resposne);
  }
});

const getMessages = asyncHandler(async (req, res, next) => {
  const { chatId } = req.params;
  const resposne = await chatService.getMessages(
    chatId,
  );

  if (resposne) {
    res.status(201).json(resposne);
  }
});

const getAllChats = asyncHandler(async (req, res, next) => {
  const userId = req.user._id.toString();
  const resposne = await chatService.getAllChats(
    userId,
  );

  if (resposne) {
    res.status(201).json(resposne);
  }
});

module.exports = {
  createOrGetChat,
  sendMessage,
  getMessages,
  getAllChats
};
