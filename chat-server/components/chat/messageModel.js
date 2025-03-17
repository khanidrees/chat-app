const { Schema, Types, model } = require('mongoose');

const messageSchema = new Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  },
);

const Message = model('Message', messageSchema);

module.exports = Message;
