import { Map, List } from 'immutable';
import { MESSAGES_TYPES, MESSAGE_SENDER, SESSION_NAME } from 'constants';

import {
    createQuickReply,
    createNewMessage,
    createLinkSnippet,
    createVideoSnippet,
    createImageSnippet,
    createComponentMessage,
    getRemoteSession,
    storeMessageToState
} from './helper';

import * as actionTypes from '../actions/actionTypes';

import { Video, Image, Message, Snippet, QuickReply } from 'messagesComponents';

export default function (socket) {

  const initialState = List([]);

  return function reducer(state = initialState, action) {
  
    // const session = getRemoteSession(SESSION_NAME, socket);
    // state = List(session.conversation);
    const storeMessage = storeMessageToState(state, socket)
  
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
}

