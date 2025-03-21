const { Types } = require("mongoose");
const { ApiError } = require("../../utils/ApiError");
const { ApiResponse } = require('../../utils/ApiResponse');
const User = require("../auth/userModel");
const Chat = require("./chatModel");
const Message = require("./messageModel");

const createChat = async (
  recieverId,
  userId
) => {
  // check if reciever exists
  const reciever = await User.find({ _id: recieverId });
  if (!reciever) {
    throw new ApiError(404, 'reciever not found');
  }

  // logic to check for self chat TODO : Allow it later
  if (recieverId === userId) {
    throw new ApiError(400, 'self chat not allowed');
  }
  // find one-On-one chats that has both reciever and user
  const chats = await Chat.aggregate([
    {
      $match: {
        isGroupChat: false,
        $and: [
          {
            participants: {
              $elemMatch: {
                $eq: new Types.ObjectId(recieverId),
              },
            },
          },
          {
            participants: {
              $elemMatch: {
                $eq: userId,
              },
            },
          },
        ],
      },
    },
  ]);

  if (chats.length) {
    return new ApiResponse(200, chats[0], 'Chat Already Exists.');
  }
  const chat = await Chat.create({
    name: 'One on One',
    participants: [recieverId, userId],
    isGroupChat: false,
    admin: userId,
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
