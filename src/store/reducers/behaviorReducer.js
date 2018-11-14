import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';

export default function (inputFieldTextHint) {
  const initialState = Map({ initialized: false, showWidget: true, showChat: false, disabledInput: false, inputFieldTextHint });

  return function reducer(state = initialState, action) {
    switch (action.type) {
      case actionTypes.SHOW_WIDGET: {
        return state.update('showWidget', showWidget => true);
      }
      case actionTypes.HIDE_WIDGET: {
        return state.update('showWidget', showWidget => false);
      }
      case actionTypes.TOGGLE_CHAT: {
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
        return state.set('initialized', true);
      }
      default:
        return state;
    }
  };
}
