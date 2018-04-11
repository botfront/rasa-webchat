import io from 'socket.io-client';

export default function (socketUrl) {
  const socket = io(socketUrl);
  socket.on('connect', () => {
    console.log(`connect:${socket.id}`);
  });


  socket.on('connect_error', (error) => {
    console.log(error);
  });

  socket.on('error', (error) => {
    console.log(error);
  });

  socket.on('disconnect', (reason) => {
    console.log(reason);
  });

  return socket;
};
