import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { EventEmitter } from 'events';

/*
  This implementation mimics the SocketIO implementation.
*/
export default function(socketUrl, customData, _path, options) {
    const socket = SockJS(socketUrl + (_path || ''));
    const stomp = Stomp.over(socket);

    const MESSAGES_CHANNEL = options.messagesChannel || '/app/sendMessage';
    const REPLY_TOPIC = options.replyTopic || '/user/queue/reply';
    const SUBSCRIPTION_CHANNEL = options.subscriptionChannel || '/app/addUser';

    const socketProxy = new EventEmitter();

    const send = message => {
        stomp.send(MESSAGES_CHANNEL, {}, JSON.stringify(message));
    };

    const extractSessionId = () => {
        // eslint-disable-next-line no-underscore-dangle
        const urlarray = socket._transport.url.split('/');
        const index = urlarray.length - 2;
        return urlarray[index];
    };

    socketProxy.on('user_uttered', data => {
        send({
            type: 'CHAT',
            content: JSON.stringify(data),
            sender: socketProxy.id,
        });
    });

    socketProxy.on('session_request', () => {
        const authData = options.authData || null;

        send({
            type: 'SESSION_REQUEST',
            content: JSON.stringify({ authData, ...customData }),
            sender: 'client',
        });
    });

    socketProxy.onconnect = () => {
        socketProxy.connected = true;
        socketProxy.id = extractSessionId(socket);
        socketProxy.customData = customData;
        stomp.subscribe(REPLY_TOPIC, socketProxy.onIncomingMessage);
        stomp.send(
            SUBSCRIPTION_CHANNEL,
            {},
            JSON.stringify({ type: 'JOIN', sender: socketProxy.id })
        );
    };

    socketProxy.onerror = error => {
        // eslint-disable-next-line no-console
        console.log(error);
    };

    const emitBotUtteredMessage = message => {
        delete message.recipient_id;
        socketProxy.emit('bot_uttered', message);
    };

    socketProxy.onIncomingMessage = payload => {
        const message = JSON.parse(payload.body);

        if (message.type === 'JOIN') {
            socketProxy.emit('connect');
        } else if (message.type === 'LEAVE') {
            socket.close();
            socketProxy.emit('disconnect', message.content || 'server left');
        } else if (message.type === 'SESSION_CONFIRM') {
            const props = JSON.parse(message.content);
            socketProxy.emit('session_confirm', { session_id: socketProxy.id, ...props });
        } else if (message.type === 'CHAT') {
            const agentMessage = JSON.parse(message.content);
            if (agentMessage instanceof Array) {
                agentMessage.forEach(message => emitBotUtteredMessage(message));
            } else {
                emitBotUtteredMessage(agentMessage);
            }
        }
    };

    socketProxy.close = () => {
        socket.close();
    };

    stomp.connect({}, socketProxy.onconnect, socketProxy.onerror);

    stomp.onWebSocketClose = () => {
        // eslint-disable-next-line no-console
        socketProxy.connected = false;
        // eslint-disable-next-line no-console
        console.log('Closed sockjs connection');
        socketProxy.emit('disconnect');
    };

    return socketProxy;
}
