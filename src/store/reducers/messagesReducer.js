import { List } from 'immutable';
import { MESSAGE_SENDER } from 'constants';

import {
    createNewMessage,
    createLinkSnippet,
    createComponentMessage,
    createQuickReply
} from './helper';
import * as actionTypes from '../actions/actionTypes';

const initialState = List([]);

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_NEW_USER_MESSAGE: {
      return state.push(createNewMessage(action.text, MESSAGE_SENDER.CLIENT));
    }
    case actionTypes.ADD_NEW_RESPONSE_MESSAGE: {
      return state.push(createNewMessage(action.text, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_NEW_LINK_SNIPPET: {
      return state.push(createLinkSnippet(action.link, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_QUICK_REPLY: {
      return state.push(createQuickReply(action.quickReply, MESSAGE_SENDER.RESPONSE));
    }
    case actionTypes.ADD_COMPONENT_MESSAGE: {
      return state.push(createComponentMessage(action.component, action.props, action.showAvatar));
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
