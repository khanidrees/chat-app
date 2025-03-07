const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { isHttpError } = require('http-errors');
const cors = require('cors');

const { connectToDatabase } = require('./db/connect');

const userRouter = require('./components/auth/userRouter');
const { ApiError } = require('./utils/ApiError');

const app = express();

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


app.use('/', (req, res) => res.json({ hi: 'from server' }));

app.use((err, req, res, next) => {
  let statusCode = 500;
  let errorMessage = 'Something broke!';
  console.log('err', JSON.stringify(err));
  if (isHttpError(err)) {
    statusCode = err.statusCode;
    errorMessage = err.message;
  }
  return res.status(statusCode).json(new ApiError(
    statusCode,
    errorMessage,
  ));
});

module.exports = app;
