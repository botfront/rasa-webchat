import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { EventEmitter } from 'events';

/*
  This implementation mimics the SocketIO implementation.
*/
export default function (socketUrl, customData, _path, options) {
  const socket = SockJS(socketUrl);
  const stomp = Stomp.over(socket);

  const MESSAGES_CHANNEL = options.messages_channel || '/app/sendMessage';
  const REPLY_TOPIC = options.reply_topic || '/user/queue/reply';
  const SUBSCRIPTION_CHANNEL = options.subscription_channel || '/app/addUser';

  const socketProxy = new EventEmitter();

  const send = (message) => {
    stomp.send(MESSAGES_CHANNEL, {}, JSON.stringify(message));
  };

  const extractSessionId = () => {
    // eslint-disable-next-line no-underscore-dangle
    const urlarray = socket._transport.url.split('/');
    const index = urlarray.length - 2;
    return urlarray[index];
  };

  socketProxy.on('user_uttered', (data) => {
    send({
      type: 'CHAT',
      content: JSON.stringify(data),
      sender: socketProxy.id
    });
  });

  socketProxy.on('session_request', () => {
    socketProxy.emit('session_confirm', socketProxy.id);
  });

  socketProxy.onconnect = () => {
    socketProxy.id = extractSessionId(socket);
    socketProxy.customData = customData;
    stomp.subscribe(REPLY_TOPIC, socketProxy.onIncomingMessage);
    stomp.send(
      SUBSCRIPTION_CHANNEL,
      {},
      JSON.stringify({ type: 'JOIN', sender: socketProxy.id })
    );
  };

  socketProxy.onerror = (error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  };

  socketProxy.onIncomingMessage = (payload) => {
    const message = JSON.parse(payload.body);

    if (message.type === 'JOIN') {
      socketProxy.emit('connect');
    } else if (message.type === 'LEAVE') {
      socket.close();
      socketProxy.emit('disconnect', 'server left');
    } else if (message.type === 'CHAT') {
      const agentMessage = JSON.parse(message.content);
      delete agentMessage.recipient_id;

      socketProxy.emit('bot_uttered', agentMessage);
    } else if (message.type === 'SESSION_CONFIRM') {
      socketProxy.emit('session_confirm', message.content);
    }
  };

  socketProxy.close = () => {
    socket.close();
  };

  stomp.connect({}, socketProxy.onconnect, socketProxy.onerror);

  socket.onclose = () => {
    // eslint-disable-next-line no-console
    console.log('Closed sockjs connection');
    socketProxy.emit('disconnect');
  };

  return socketProxy;
}
