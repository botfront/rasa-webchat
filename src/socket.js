// import io from 'socket.io-client';
import socketio from './socket-socketio';
import sockjs from './socket-sockjs';

const PROTOCOLS = { socketio, sockjs };
// export default function (socketUrl, customData, path) {
//   const options = path ? { path } : {};
//   const socket = io(socketUrl, options);
//   socket.on('connect', () => {
//     console.log(`connect:${socket.id}`);
//     socket.customData = customData;
//   });
export default function (socketUrl, customData, path, protocol, protocolOptions) {
  protocol = protocol || 'socketio';
  const socketProtocol = PROTOCOLS[protocol];

  if (socketProtocol !== undefined) {
    return socketProtocol(socketUrl, customData, path, protocolOptions);
  }
  throw new Error(`Undefined socket protocol ${protocol}`);
}

//   socket.on('connect_error', (error) => {
//     console.log(error);
//   });

//   socket.on('error', (error) => {
//     console.log(error);
//   });

//   socket.on('disconnect', (reason) => {
//     console.log(reason);
//   });

//   return socket;
// };
