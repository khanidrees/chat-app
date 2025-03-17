const { Schema, model, Types } = require('mongoose');

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    participants: {
      type: [{
        type: Types.ObjectId,
        ref: 'User',
      }],
      required: true,
    },
    isGroupChat: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastMessage: {
      type: Types.ObjectId,
      ref: 'Messsage',
    },
    admin: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const Chat = model('Chat', chatSchema);

module.exports = Chat;
