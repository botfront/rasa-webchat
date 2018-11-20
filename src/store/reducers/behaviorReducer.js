import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { SESSION_NAME } from 'constants';
import { getLocalSession, storeParamsTo } from './helper';

export default function (inputFieldTextHint, storage) {
  const initialState = Map({ connected: false, showWidget: true, showChat: false, disabledInput: true, inputFieldTextHint });

  return function reducer(state = initialState, action) {
    const storeParams = storeParamsTo(storage);
    switch (action.type) {
      // Each change to the redux store's behavior Map gets recorded to storage
      case actionTypes.SHOW_WIDGET: {
        return storeParams(state.update('showWidget', showWidget => true));
      }
      case actionTypes.HIDE_WIDGET: {
        return storeParams(state.update('showWidget', showWidget => false));
      }
      case actionTypes.TOGGLE_CHAT: {
        return storeParams(state.update('showChat', showChat => !showChat));
      }
      case actionTypes.OPEN_CHAT: {
        return storeParams(state.update('showChat', showChat => true));
      }
      case actionTypes.CLOSE_CHAT: {
        return storeParams(state.update('showChat', showChat => false));
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
      // Pull params from storage to redux store
      case actionTypes.PULL_SESSION: {
        const localSession = getLocalSession(storage, SESSION_NAME);
        if (localSession) {
          return Map(localSession.params);
        } else {
          return state
        }
      }
      default:
        return state;
    }
  };
}
