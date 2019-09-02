import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { SESSION_NAME } from 'constants';
import { getLocalSession, storeParamsTo } from './helper';

export default function (inputFieldTextHint, connectingText, storage, docViewer = false) {
  const initialState = Map({
    connected: false,
    initialized: false,
    isChatVisible: true,
    isChatOpen: false,
    disabledInput: true,
    docViewer,
    inputFieldTextHint,
    connectingText
  });

  return function reducer(state = initialState, action) {
    const storeParams = storeParamsTo(storage);

    const localSession = getLocalSession(storage, SESSION_NAME);
    if (!localSession) state = initialState;

    switch (action.type) {
      // Each change to the redux store's behavior Map gets recorded to storage
      case actionTypes.SHOW_CHAT: {
        return storeParams(state.update('isChatVisible', isChatVisible => true));
      }
      case actionTypes.HIDE_CHAT: {
        return storeParams(state.update('isChatVisible', isChatVisible => false));
      }
      case actionTypes.TOGGLE_CHAT: {
        return storeParams(state.update('isChatOpen', isChatOpen => !isChatOpen));
      }
      case actionTypes.OPEN_CHAT: {
        return storeParams(state.update('isChatOpen', isChatOpen => true));
      }
      case actionTypes.CLOSE_CHAT: {
        return storeParams(state.update('isChatOpen', isChatOpen => false));
      }
      case actionTypes.TOGGLE_FULLSCREEN: {
        return storeParams(state.update('fullScreenMode', fullScreenMode => !fullScreenMode));
      }
      case actionTypes.TOGGLE_INPUT_DISABLED: {
        return storeParams(state.update('disabledInput', disabledInput => !disabledInput));
      }
      case actionTypes.CHANGE_INPUT_FIELD_HINT: {
        return storeParams(state.set('inputFieldTextHint', action.hint));
      }
      case actionTypes.CONNECT: {
        return storeParams(state.set('connected', true).set('disabledInput', false));
      }
      case actionTypes.DISCONNECT: {
        return storeParams(state.set('connected', false).set('disabledInput', true));
      }
      case actionTypes.INITIALIZE: {
        return storeParams(state.set('initialized', true));
      }
      // Pull params from storage to redux store
      case actionTypes.PULL_SESSION: {
        // Do not persist connected state
        const connected = state.get('connected');

        if (localSession && localSession.params) {
          return Map({ ...localSession.params, connected });
        } else {
          return state;
        }
      }
      default:
        return state;
    }
  };
}
