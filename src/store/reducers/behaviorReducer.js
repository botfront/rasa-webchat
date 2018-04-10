import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';

export default function (inputFieldTextHint) {
  const initialState = Map({ showChat: false, disabledInput: false, inputFieldTextHint });

  return function reducer(state = initialState, action) {
    switch (action.type) {
      case actionTypes.TOGGLE_CHAT: {
        return state.update('showChat', showChat => !showChat);
      }
      case actionTypes.TOGGLE_INPUT_DISABLED: {
        return state.update('disabledInput', disabledInput => !disabledInput);
      }
      case actionTypes.CHANGE_INPUT_FIELD_HINT: {
        return state.set('inputFieldTextHint', action.hint);
      }
      default:
        return state;
    }
  };
}
