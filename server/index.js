const httpServer = require('./app');

require('dotenv').config();

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log('server started at ', PORT);
});
