const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
    },
    fullname: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      select: false, // No select
    },
    mobileNumber: { type: Number },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false, // No select
    },

  },
  {
    timestamps: true,
  },
);
const User = mongoose.model('User', userSchema);

module.exports = User;
