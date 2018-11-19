import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { initialize } from '../actions/dispatcher';
import { SESSION_NAME } from 'constants';
import { getLocalSession, storeParams } from './helper';

export default function (inputFieldTextHint, initPayload, customData, socket) {
  const initialState = Map({ showWidget: true, showChat: false, disabledInput: false, inputFieldTextHint });

  return function reducer(state = initialState, action) {

    switch (action.type) {
      // Each change to the redux store's behavior Map gets recorded to sessionStorage
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
      case actionTypes.INITIALIZE: {
        return storeParams(state);
      }
      // Pull params from sessionStorage to redux store
      case actionTypes.PULL_SESSION: {
        const localSession = getLocalSession(SESSION_NAME);
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
