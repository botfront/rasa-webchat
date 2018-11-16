import { Map, List } from 'immutable';
import { MESSAGES_TYPES, MESSAGE_SENDER } from 'constants';

import {
    createQuickReply,
    createNewMessage,
    createLinkSnippet,
    createVideoSnippet,
    createImageSnippet,
    createComponentMessage,
} from './helper';

import * as actionTypes from '../actions/actionTypes';

import { Video, Image, Message, Snippet, QuickReply } from 'messagesComponents';

const initialState = List([]);

const sessionName = "chat_session";

const createOrGetSession = (key) => {
  console.log("Attempt to create or get session")
  const cachedSession = sessionStorage.getItem(key);
  var session;
  if (cachedSession) {
    let parsedSession = JSON.parse(cachedSession)
    const formattedConversation =
      Object.values(parsedSession.conversation).map(message => Map(message))
    session = {
      ...parsedSession,
      conversation: formattedConversation.slice()
    }
    console.log("Found existing session: \n", session);
  } else {
    session = {
      session_ID: "123",
      conversation: []
    }
    console.log("No existing session, created new session: \n", session);
    sessionStorage.setItem(key, JSON.stringify(session));
  }
  return session;
}

const storeSessionState = (key, state) => {
  const session = createOrGetSession(key);
  const newSession = {
    ...session,
    conversation: [...Array.from(state)].slice()
  }
  console.log("Updated session: \n", newSession);
  sessionStorage.setItem(key, JSON.stringify(newSession));
}

const storeMessageToState = state => message => {
  const newState = state.push(message);
  storeSessionState(sessionName, newState);
  console.log(newState);
  return newState;
}

export default function reducer(state, action) {
  
  state = List(createOrGetSession(sessionName).conversation);
  const storeMessage = storeMessageToState(state)

  switch (action.type) {
    case actionTypes.ADD_NEW_USER_MESSAGE: {
      return storeMessage(createNewMessage(action.text, MESSAGE_SENDER.CLIENT))
    }
    case actionTypes.ADD_NEW_RESPONSE_MESSAGE: {
      return storeMessage(createNewMessage(action.text, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_NEW_LINK_SNIPPET: {
      return storeMessage(createLinkSnippet(action.link, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_NEW_VIDEO_VIDREPLY: {
      return storeMessage(createVideoSnippet(action.video, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_NEW_IMAGE_IMGREPLY: {
      return storeMessage(createImageSnippet(action.image, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_QUICK_REPLY: {
      return storeMessage(createQuickReply(action.quickReply, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_COMPONENT_MESSAGE: {
      return storeMessage(createComponentMessage(action.component, action.props, action.showAvatar));
    }
    case actionTypes.SET_QUICK_REPLY: {
      return state.setIn([action.id, 'chosenReply'], action.title);
    }
    case actionTypes.INSERT_NEW_USER_MESSAGE: {
      return state.insert(action.index, createNewMessage(action.text, MESSAGE_SENDER.CLIENT));
    }
    case actionTypes.DROP_MESSAGES: {
      return initialState;
    }
    default:
      return state;
  }
}
