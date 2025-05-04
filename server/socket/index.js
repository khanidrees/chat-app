const emitSocketEvent = (req, room, socketEvent, payload) => {
  // console.log(room+ ' '+socketEvent);
  // console.log(payload);
  const io = req.app.get('io');
  // console.log(io.in(room));
  req.app.get('io').to(room).emit(socketEvent, payload);
};

module.exports = {
  emitSocketEvent,
};
