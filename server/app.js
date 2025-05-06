const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { isHttpError } = require('http-errors');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { createServer } = require('http');

const { connectToDatabase } = require('./db/connect');

const userRouter = require('./components/auth/userRouter');
const chatRouter = require('./components/chat/chatRouter');
const { ApiError } = require('./utils/ApiError');
const User = require('./components/auth/userModel');
const { default: mongoose } = require('mongoose');
const Message = require('./components/chat/messageModel');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
  },
});
app.set('io', io);
connectToDatabase();

// for security
app.use(helmet());

const whitelist = [process.env.FRONTEND_URL];
// console.log(whitelist);

// TODO : enable CORS in production 
const corsOptions = {
  // origin: function (origin, callback) {
  //   console.log(whitelist[0]==origin);
  //   console.log(whitelist[0]);
  //   console.log(origin);
  //   if (whitelist.includes(origin)) {
  //     callback(null, true)
  //   } else {
  //     console.log('origin:', origin, 'not allowed')
  //     callback(new Error('Not allowed by CORS'))
  //   }
  // }
};

app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api/v1/users', userRouter);

app.use('/api/v1/chat', chatRouter);

// app.use('/', (req, res) => res.json({ hi: 'from server' }));

io.on('connection', async (socket) => {
  try{
    const { token } = socket.handshake.auth;
    if (!token) {
      throw new ApiError(401, 'No Access Token');
    }
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    const user = await User.findById(decodedToken?.id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }
    socket.user = user;

    socket.onAnyOutgoing((eventName, ...args) => {
      console.log(eventName);
      console.log(args);
    });

    console.log('User Connected: ', user.username);

    // create a room and join user to it
    socket.join(user._id.toString());

    socket.on('MESSAGES_READ', async (payload) => {
      const { messageIds, sender } = JSON.parse(payload);
      console.log(' s ' +sender);
      try {
        if (!Array.isArray(messageIds) || messageIds.length === 0) {
          console.log('Invalid messageIds:', messageIds);
          return;
        }
        const updateResult = await Message.updateMany(
          { _id: { $in: messageIds } },
          { $set: { isRead: true } },
        );
        console.log(`Updated ${updateResult.modifiedCount} messages as read`);
        console.log(updateResult);

        //  emit an event to the sender to confirm the update
        io.to(sender).emit('MESSAGES_READ_CONFIRMATION', messageIds);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('disconnect', () => {
      if (socket.user?._id) {
        socket.leave(socket.user._id.toString());
      }
    });
  } catch (e) {
    console.log('Error while connecting to ws' + e);
  }
});

app.use((err, req, res, next) => {
  let error = err;
  console.log(err);
  if (!(err instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }
  console.log('err', JSON.stringify(error));
  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    // ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };
  // Send error response
  return res.status(error.statusCode).json(response);
});

module.exports = httpServer;
