import { Map, fromJS } from 'immutable';
import { MESSAGES_TYPES, MESSAGE_SENDER, SESSION_NAME } from 'constants';

import { Video, Image, Message, Carousel, Buttons } from 'messagesComponents';

export function createNewMessage(text, sender, nextMessageIsTooltip, hidden) {
  return Map({
    type: MESSAGES_TYPES.TEXT,
    component: Message,
    text,
    sender,
    showAvatar: sender === MESSAGE_SENDER.RESPONSE,
    timestamp: new Date().getTime(),
    nextMessageIsTooltip,
    hidden
  });
}

export function createCarousel(carousel, sender) {
  return Map({
    type: MESSAGES_TYPES.CAROUSEL,
    component: Carousel,
    sender,
    elements: fromJS(carousel.attachment.payload.elements),
    timestamp: new Date().getTime()
  });
}

export function createVideoSnippet(video, sender) {
  return Map({
    type: MESSAGES_TYPES.VIDREPLY.VIDEO,
    component: Video,
    title: video.title,
    video: video.video,
    sender,
    showAvatar: true,
    timestamp: new Date().getTime()
  });
}

export function createImageSnippet(image, sender) {
  return Map({
    type: MESSAGES_TYPES.IMGREPLY.IMAGE,
    component: Image,
    title: image.title,
    image: image.image,
    sender,
    showAvatar: true,
    timestamp: new Date().getTime()
  });
}

export function createButtons(buttons, sender) {
  return Map({
    type: MESSAGES_TYPES.BUTTONS,
    component: Buttons,
    text: buttons.text,
    hint: buttons.hint || 'Select an option...',
    quick_replies: fromJS(buttons.quick_replies),
    buttons: fromJS(buttons.buttons),
    sender,
    showAvatar: true,
    chosenReply: null,
    timestamp: new Date().getTime()
  });
}

export function createComponentMessage(component, props, showAvatar) {
  return Map({
    type: MESSAGES_TYPES.CUSTOM_COMPONENT,
    component,
    props,
    sender: MESSAGE_SENDER.RESPONSE,
    showAvatar,
    timestamp: new Date().getTime()
  });
}

export function getLocalSession(storage, key) {
  // Attempt to get local session from storage
  const cachedSession = storage.getItem(key);
  let session = null;
  if (cachedSession) {
    // Found existing session in storage
    const parsedSession = JSON.parse(cachedSession);
    // Format conversation from array of object to immutable Map for use by messages components
    const formattedConversation = parsedSession.conversation
      ? parsedSession.conversation
      : [];
    // Check if params is undefined
    const formattedParams = parsedSession.params
      ? parsedSession.params
      : {};
    const formattedMetadata = parsedSession.metadata
      ? parsedSession.metadata
      : {};
    // Create a new session to return
    session = {
      ...parsedSession,
      conversation: formattedConversation,
      params: formattedParams,
      metadata: formattedMetadata
    };
  }
  // Returns a formatted session object if any found, otherwise return undefined
  return session;
}

export function storeLocalSession(storage, key, sid) {
  // Attempt to store session id to local storage
  const cachedSession = storage.getItem(key);
  let session;
  if (cachedSession) {
    // Found exisiting session in storage
    const parsedSession = JSON.parse(cachedSession);
    session = {
      ...parsedSession,
      session_id: sid
    };
  } else {
    // No existing local session, create a new empty session with only session_id
    session = {
      session_id: sid
    };
  }
  // Store updated session to storage
  storage.setItem(key, JSON.stringify(session));
}

export const storeMessageTo = storage => (conversation) => {
  // Store a conversation List to storage
  const localSession = getLocalSession(storage, SESSION_NAME);
  const newSession = {
    // Since immutable List is not a native JS object, store conversation as array
    ...localSession,
    conversation: conversation.toJS(),
    lastUpdate: Date.now()
  };
  storage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return conversation;
};

export const storeParamsTo = storage => (params) => {
  // Store a params List to storage
  const localSession = getLocalSession(storage, SESSION_NAME);
  const newSession = {
    // Since immutable Map is not a native JS object, store conversation as array
    ...localSession,
    params: params.toJS(),
    lastUpdate: Date.now(),
    version: 'PACKAGE_VERSION_TO_BE_REPLACED'
  };
  storage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return params;
};


export const storeMetadataTo = storage => (metadata) => {
  // Store a params List to storage
  const localSession = getLocalSession(storage, SESSION_NAME);
  const newSession = {
    // Since immutable Map is not a native JS object, store conversation as array
    ...localSession,
    metadata: metadata.toJS(),
    lastUpdate: Date.now()
  };
  storage.setItem(SESSION_NAME, JSON.stringify(newSession));
  return metadata;
};
