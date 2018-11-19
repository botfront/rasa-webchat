import { Map, List } from 'immutable';
import { MESSAGES_TYPES, MESSAGE_SENDER, SESSION_NAME } from 'constants';

import { Video, Image, Message, Snippet, QuickReply } from 'messagesComponents';


export function createNewMessage(text, sender) {
  return Map({
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text,
    sender,
    showAvatar: sender === MESSAGE_SENDER.RESPONSE
  });
}

export function createLinkSnippet(link, sender) {
  return Map({
    type: MESSAGES_TYPES.SNIPPET.LINK,
    component: Snippet,
    title: link.title,
    link: link.link,
    content: link.content,
    target: link.target || '_blank',
    sender,
    showAvatar: true
  });
}

export function createVideoSnippet(video, sender) {
  return Map({
    type: MESSAGES_TYPES.VIDREPLY.VIDEO,
    component: Video,
    title: video.title,
    video: video.video,
    sender,
    showAvatar: true
  });
}

export function createImageSnippet(image, sender) {
  return Map({
    type: MESSAGES_TYPES.IMGREPLY.IMAGE,
    component: Image,
    title: image.title,
    image: image.image,
    sender,
    showAvatar: true
  });
}

export function createQuickReply(quickReply, sender) {
  return Map({
    type: MESSAGES_TYPES.QUICK_REPLY,
    component: QuickReply,
    text: quickReply.text,
    hint: quickReply.hint || 'Select an option...',
    quick_replies: List(quickReply.quick_replies),
    sender,
    showAvatar: true,
    chosenReply: null
  });
}

export function createComponentMessage(component, props, showAvatar) {
  return Map({
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    showAvatar
  });
}

export const requestSession = (socket) => async function(localID) {
  return new Promise((resolve, reject) => {
    socket.emit('session_request', ({ 'session_id': localID }));
    socket.on('session_confirm', (remoteID) => {
      console.log(`session_confirm:${socket.id} session_id:${remoteID}`);
      resolve(remoteID);
    });
  })
}

export function getLocalSession(key) {
  // Attempt to get local session from sessionStorage
  const cachedSession = sessionStorage.getItem(key);
  var session = null;
  if (cachedSession) {
    // Found existing session in sessionStorage
    let parsedSession = JSON.parse(cachedSession)
    // Format conversation from array of object to immutable Map for use by messages components
    const formattedConversation = parsedSession.conversation
      ? Object.values(parsedSession.conversation).map(item => Map(item)).slice()
      : [];
    // Check if params is undefined
    const formattedParams = parsedSession.params
      ? parsedSession.params
      : {};
    //Create a new session to return
      session = {
      ...parsedSession,
      conversation: formattedConversation,
      params: formattedParams
    }
  } else {
    console.log("No existing local session");
  }
  // Returns a formatted session object if any found, otherwise return undefined
  return session;
}

export function storeLocalSession(key, sid) {
  // Attempt to store session id to local sessionStorage
  const cachedSession = sessionStorage.getItem(key);
  var session;
  if (cachedSession) {
      // Found exisiting session in sessionStorage
    let parsedSession = JSON.parse(cachedSession)
    session = {
      ...parsedSession,
      session_id: sid
    }
  } else {
    // No existing local session, create a new empty session with only session_id
    session = {
      session_id: sid
    }
  }
  // Store updated session to sessionStorage
  sessionStorage.setItem(key, JSON.stringify(session));
}

export function storeMessage(conversation) {
  // Store a conversation List to sessionStorage
  const localSession = getLocalSession(SESSION_NAME);
  const newSession = {
    // Since immutable List is not a native JS object, store conversation as array
    ...localSession,
    conversation: [...Array.from(conversation)].slice()
  }
  sessionStorage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return conversation
}

export function storeParams(params) {
  // Store a params List to sessionStorage
  const localSession = getLocalSession(SESSION_NAME);
  const newSession = {
    // Since immutable Map is not a native JS object, store conversation as array
    ...localSession,
    params: params.toJS()
  }
  sessionStorage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return params
}