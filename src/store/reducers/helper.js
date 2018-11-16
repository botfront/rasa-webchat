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
    console.log("test string", { 'session_id': localID })
    socket.emit('session_request', ({ 'session_id': localID }));
    socket.on('session_confirm', (remoteID) => {
      console.log(`session_confirm:${socket.id} session_id:${remoteID}`);
      resolve(remoteID);
    });
  })
}

export function getLocalSession(key) {
  console.log("Attempt to create or get session")
  const cachedSession = sessionStorage.getItem(key);
  var session;
  if (cachedSession) {
    let parsedSession = JSON.parse(cachedSession)
    const formattedConversation =
      Object.values(parsedSession.conversation).map(message => Map(message));
    session = {
      ...parsedSession,
      conversation: formattedConversation.slice()
    }
    console.log("Found existing session: \n", session);
  } else {
    console.log("No existing session");
  }
  return session;
}

export async function getRemoteSession(key, socket) {
  console.log("Attempt to create or get session")
  const cachedSession = sessionStorage.getItem(key);
  var session;
  if (cachedSession) {
    let parsedSession = JSON.parse(cachedSession)
    const formattedConversation =
      Object.values(parsedSession.conversation).map(message => Map(message));
    session = {
      ...parsedSession,
      conversation: formattedConversation.slice()
    }
    await requestSession(socket)(session.session_id);
    console.log("Found existing session: \n", session);
  } else {
    const sid = await requestSession(socket)(null)
    console.log("session_id log: ",sid)
    session = {
      session_id: sid,
      conversation: []
    }
    console.log("No existing session, created new session: \n", session);
    sessionStorage.setItem(key, JSON.stringify(session));
  }
  return session;
}

export function storeSessionState(key, state, session) {
  // const session = getRemoteSession(key, socket);
  const newSession = {
    ...session,
    conversation: [...Array.from(state)].slice()
  }
  console.log("Updated session: \n", newSession);
  sessionStorage.setItem(key, JSON.stringify(newSession));
}

export const storeMessageToState = (state, socket) => message => {
  const session = getLocalSession(SESSION_NAME);
  state = List(session.conversation);
  const newState = state.push(message);
  storeSessionState(SESSION_NAME, newState, session);
  console.log(newState);
  return newState;
}
