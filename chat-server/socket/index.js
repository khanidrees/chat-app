const emitSocketEvent = (req, room, socketEvent, payload) => {
  req.app.get('io').in(room).emit(socketEvent, payload);
};

module.exports = {
  emitSocketEvent,
};
