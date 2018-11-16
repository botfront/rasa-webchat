import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { initialize } from '../actions/dispatcher';
import { SESSION_NAME } from 'constants';
import { getLocalSession, getRemoteSession } from './helper';

export default function (inputFieldTextHint, initPayload, customData, socket) {
  const initialState = Map({ initialized: false, showWidget: true, showChat: false, disabledInput: false, inputFieldTextHint });

  return function reducer(state = initialState, action) {

    const tryInitialize = () => {
      if (!state.initialized) {
        socket.emit('user_uttered', { message: initPayload, customData, session_id: (getLocalSession(SESSION_NAME)? getLocalSession(SESSION_NAME).session_id: null) });
        const session = getRemoteSession(SESSION_NAME, socket);
        return state.set('initialized', true);
      }
      return state;
    }

    switch (action.type) {
      case actionTypes.SHOW_WIDGET: {
        return state.update('showWidget', showWidget => true);
      }
      case actionTypes.HIDE_WIDGET: {
        return state.update('showWidget', showWidget => false);
      }
      case actionTypes.TOGGLE_CHAT: {
        tryInitialize();
        return state.update('showChat', showChat => !showChat);
      }
      case actionTypes.OPEN_CHAT: {
        return state.update('showChat', showChat => true);
      }
      case actionTypes.CLOSE_CHAT: {
        return state.update('showChat', showChat => false);
      }
      case actionTypes.TOGGLE_INPUT_DISABLED: {
        return state.update('disabledInput', disabledInput => !disabledInput);
      }
      case actionTypes.CHANGE_INPUT_FIELD_HINT: {
        return state.set('inputFieldTextHint', action.hint);
      }
      case actionTypes.INITIALIZE: {
        tryInitialize();
      }
      default:
        return state;
    }
  };
}
