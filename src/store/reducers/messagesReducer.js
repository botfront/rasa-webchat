import { List } from 'immutable';
import { MESSAGE_SENDER } from 'constants';

import {
    createQuickReply,
    createNewMessage,
    createLinkSnippet,
    createVideoSnippet,
    createImageSnippet,
    createComponentMessage,
} from './helper';

import * as actionTypes from '../actions/actionTypes';

const initialState = List([]);

const sessionName = "chat_session";

const storeSessionMessage = (key, message) => {
  console.log("Attempt to store message to session")
  const cachedSession = sessionStorage.getItem(key);
  var newSession;
  if (cachedSession) {
    let session = JSON.parse(cachedSession);
    newSession = {
      ...session,
      conversation: session.conversation.concat([message])
    }
    console.log("Updated existing session: \n", newSession);
  } else {
    newSession = {
      session_ID: "123",
      conversation: [message]
    }
    console.log("No existing session, created new session: \n", newSession);
  }
  sessionStorage.setItem(key, JSON.stringify(newSession));
}

export default function reducer(state = initialState, action) {
  
  const storeMessage = (message) => {
    storeSessionMessage(sessionName, message);
    return state.push(message);
  }

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
