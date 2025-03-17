const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require('../../utils/ApiResponse');
const Chat = require("./chatModel");
const Message = require("./messageModel");

const createChat = async (
  name,
  participants,
  isGroupChat,
  admin,
) => {
  const chat = await Chat.create({
    name,
    participants,
    isGroupChat,
    admin,
  });
  if (chat) {
    return new ApiResponse(201, chat, 'chat created successfully');
  }
  throw new ApiError(500, 'Error While creating chat');
};

const createMessage = async (
  userId,
  content,
  chatId,
) => {
  const message = await Message.create({
    sender: userId,
    content,
    chatId,
  });
  if (message) {
    return new ApiResponse(201, message, 'message created successfully');
  }
  throw new ApiError(500, 'Error While creating message');
};

module.exports = {
  createChat,
  createMessage,
};
