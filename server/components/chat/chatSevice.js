const { Types, Schema } = require('mongoose');
const { ApiError } = require('../../utils/ApiError');
const { ApiResponse } = require('../../utils/ApiResponse');
const User = require('../auth/userModel');
const Chat = require('./chatModel');
const Message = require('./messageModel');

const createChat = async (
  recieverId,
  userId,
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
    // we will create api to get all messages
    // {
    //   $lookup: {
    //     from: 'messages',
    //     localField: '_id',
    //     foreignField: 'chat',
    //     as: 'messages',
    //   },
    // },
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
  const chat = await Chat.findOne(
    {
      $and: [
        {
          _id: chatId,
        },
        {
          participants: {
            $in: [userId],
          },
        },
      ],
    },
  );
  if (!chat) {
    throw new ApiError(404, 'chat not found');
  }
  const message = await Message.create({
    sender: userId,
    content,
    chat: chatId,
  });

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: message._id,
      },
    },
    { new: true },
  );
  if (message) {
    message.chat = chat;
    return new ApiResponse(201, message, 'message created successfully');
  }
  throw new ApiError(500, 'Error While creating message');
};

const getMessages = async (chatId) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, 'reciever not found');
  }
  const messages = await Message.aggregate([
    {
      $match: {
        chat: chat._id,
      },
    },
    // {
    //   $lookup: {
    //     from: 'users',
    //     localField: 'sender',
    //     foreignField: '_id',
    //     as: 'sender',
    //     pipeline: [
    //       {
    //         $project: {
    //           username: 1,
    //           fullname: 1,
    //           email: 1,
    //         },
    //       },
    //     ],
    //   },
    // },
    // {
    //   $sort: {
    //     createdAt: -1,
    //   },
    // },
  ]);
  // console.log('first')
  // console.log(messages)
  if (messages) {
    return new ApiResponse(200, messages, 'message recieved successfully');
  }
  throw new ApiError(500, 'Error While recieving message');
};

const getAllChats = async (userId) => {
  const user = await User.find({ _id: userId });
  if (!user) {
    throw new ApiError(404, 'user not found');
  }
  const chats = await Chat.aggregate([
    {
      $match: {
        isGroupChat: false,
        participants: {
          $elemMatch: {
            $eq: new Types.ObjectId(userId),
          },
        },
      },
    },
    {
      $lookup: {
        from: 'messages',
        localField: 'lastMessage',
        foreignField: '_id',
        as: 'lastMessage',
        pipeline: [
          {
            $project: {
              content: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'reciever',
        pipeline: [
          {
            $match: {
              _id: {
                $ne: new Types.ObjectId(userId),
              },
            },
          },
          {
            $project: {
              fullname: 1,
            },
          },
        ],
      },
    },
  ]);

  if (chats) {
    return new ApiResponse(200, chats, 'chats recieved successfully');
  }
  throw new ApiError(500, 'Error While recieving chats');
};

module.exports = {
  createChat,
  createMessage,
  getMessages,
  getAllChats
};
